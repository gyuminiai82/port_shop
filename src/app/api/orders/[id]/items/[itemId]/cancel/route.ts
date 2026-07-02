import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";

async function getUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;
  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;
  return JSON.parse(sessionData as string);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string, itemId: string }> }) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, itemId } = await params;

    const order = await prisma.mIN_SHOP_ORDER.findUnique({
      where: { id },
      include: { items: true, payment: true, delivery: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.delivery && (order.delivery.status === "SHIPPING" || order.delivery.status === "DELIVERED")) {
      return NextResponse.json({ error: "상품이 이미 배송 중이거나 완료되어 취소할 수 없습니다." }, { status: 400 });
    }

    const item = order.items.find(i => i.id === itemId);
    
    if (!item) {
      return NextResponse.json({ error: "Item not found in order" }, { status: 404 });
    }

    // @ts-ignore: dynamic schema update
    if (item.status === "CANCELLED") {
      return NextResponse.json({ error: "이미 취소된 상품입니다." }, { status: 400 });
    }

    const cancelAmount = item.price * item.quantity;

    // 현재 주문의 모든 활성 아이템이 1개 이하라면(즉 이번 취소로 모든 아이템이 취소된다면)
    // @ts-ignore
    const activeItems = order.items.filter(i => i.status !== "CANCELLED");
    const isLastActiveItem = activeItems.length <= 1;

    // 1. 토스페이먼츠 취소 API 호출
    if (order.payment?.transactionId) {
      const secretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
      const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");
      
      const tossRes = await fetch(`https://api.tosspayments.com/v1/payments/${order.payment.transactionId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancelReason: "고객 부분 취소",
          cancelAmount: cancelAmount
        })
      });

      if (!tossRes.ok) {
        const errData = await tossRes.json();
        console.error("토스 부분 취소 에러:", errData);
        return NextResponse.json({ error: "PG사 결제 취소 요청에 실패했습니다." }, { status: 400 });
      }
    }

    await prisma.$transaction(async (tx) => {
      // 2. 아이템 상태 업데이트
      await tx.$executeRawUnsafe(`UPDATE "MIN_SHOP_ORDER_ITEM" SET status = 'CANCELLED' WHERE id = $1`, itemId);

      // 3. 환불 금액 및 상태 업데이트
      const newRefundAmount = (order.refundAmount || 0) + cancelAmount;
      const newOrderStatus = isLastActiveItem ? "CANCELLED" : order.status;

      await tx.$executeRawUnsafe(
        `UPDATE "MIN_SHOP_ORDER" SET "refundAmount" = $1, status = $2 WHERE id = $3`, 
        newRefundAmount, newOrderStatus, id
      );

      // 4. 포인트 부분 복구/회수 로직
      if (order.usedPoints > 0 || order.earnedPoints > 0) {
        // 전체 주문 금액 대비 취소하는 아이템 금액의 비율을 계산
        const ratio = cancelAmount / order.totalAmount;
        
        let pointDelta = 0;
        
        // 부분 취소 환불될 포인트 (비례)
        if (order.usedPoints > 0) {
          const refundPoints = isLastActiveItem ? (order.usedPoints - Math.floor(order.usedPoints * (1 - ratio))) : Math.floor(order.usedPoints * ratio);
          if (refundPoints > 0) {
            pointDelta += refundPoints;
            await tx.mIN_SHOP_POINT_LOG.create({
              data: {
                userId: user.id,
                amount: refundPoints,
                reason: `상품 부분 취소로 인한 사용 포인트 환불 (주문번호: ${id})`
              }
            });
          }
        }
        
        // 부분 취소 회수될 포인트 (비례)
        if (order.earnedPoints > 0) {
          const retrievePoints = isLastActiveItem ? (order.earnedPoints - Math.floor(order.earnedPoints * (1 - ratio))) : Math.floor(order.earnedPoints * ratio);
          if (retrievePoints > 0) {
            pointDelta -= retrievePoints;
            await tx.mIN_SHOP_POINT_LOG.create({
              data: {
                userId: user.id,
                amount: -retrievePoints,
                reason: `상품 부분 취소로 인한 적립 포인트 회수 (주문번호: ${id})`
              }
            });
          }
        }

        if (pointDelta !== 0) {
          const currentUser = await tx.mIN_SHOP_USER.findUnique({ where: { id: user.id } });
          if (currentUser) {
            await tx.mIN_SHOP_USER.update({
              where: { id: user.id },
              data: { points: Math.max(0, currentUser.points + pointDelta) }
            });
          }
        }
      }

      // 5. (선택적) 결제 테이블이 있다면 전체 취소일 경우 REFUNDED로
      if (isLastActiveItem && order.payment) {
        await tx.mIN_SHOP_PAYMENT.update({
          where: { orderId: id },
          data: { status: "REFUNDED" }
        });
      }
    });

    return NextResponse.json({ success: true, isFullyCancelled: isLastActiveItem });
  } catch (error) {
    console.error("부분 취소 에러:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

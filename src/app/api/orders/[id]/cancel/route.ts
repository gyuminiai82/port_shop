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

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.mIN_SHOP_ORDER.findUnique({
      where: { id },
      include: { payment: true, delivery: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.status !== "PAID" && order.status !== "PENDING") {
      return NextResponse.json({ error: "주문을 취소할 수 없는 상태입니다." }, { status: 400 });
    }

    if (order.delivery && (order.delivery.status === "SHIPPING" || order.delivery.status === "DELIVERED")) {
      return NextResponse.json({ error: "상품이 이미 배송 중이거나 완료되어 취소할 수 없습니다." }, { status: 400 });
    }

    // 토스페이먼츠 전체 취소 API 호출
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
          cancelReason: "고객 요청 취소"
        })
      });

      if (!tossRes.ok) {
        const errData = await tossRes.json();
        console.error("토스 전체 취소 에러:", errData);
        return NextResponse.json({ error: "PG사 결제 취소 요청에 실패했습니다." }, { status: 400 });
      }
    }

    // 주문 및 결제 상태 업데이트 (Transaction)
    await prisma.$transaction(async (tx) => {
      await tx.mIN_SHOP_ORDER.update({
        where: { id },
        data: { status: "CANCELLED" }
      });

      if (order.payment) {
        await tx.mIN_SHOP_PAYMENT.update({
          where: { orderId: id },
          data: { status: "REFUNDED" }
        });
      }

      // 포인트 원상복구 및 회수
      if (order.usedPoints > 0 || order.earnedPoints > 0) {
        let pointDelta = 0;
        
        // 사용한 포인트는 다시 더해줌
        if (order.usedPoints > 0) {
          pointDelta += order.usedPoints;
          await tx.mIN_SHOP_POINT_LOG.create({
            data: {
              userId: user.id,
              amount: order.usedPoints,
              reason: `주문 취소로 인한 사용 포인트 환불 (주문번호: ${id})`
            }
          });
        }
        
        // 적립된 포인트는 차감
        if (order.earnedPoints > 0) {
          pointDelta -= order.earnedPoints;
          await tx.mIN_SHOP_POINT_LOG.create({
            data: {
              userId: user.id,
              amount: -order.earnedPoints,
              reason: `주문 취소로 인한 적립 포인트 회수 (주문번호: ${id})`
            }
          });
        }

        const currentUser = await tx.mIN_SHOP_USER.findUnique({ where: { id: user.id } });
        if (currentUser) {
          await tx.mIN_SHOP_USER.update({
            where: { id: user.id },
            data: { points: Math.max(0, currentUser.points + pointDelta) }
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("주문 취소 에러:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

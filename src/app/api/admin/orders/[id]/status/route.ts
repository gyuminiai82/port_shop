import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";

async function getAdminUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) return null;
  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;
  
  const user = JSON.parse(sessionData as string);
  if (user.type !== "ADMIN") return null;
  
  return user;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { orderStatus, deliveryStatus, trackingNo } = body;

    const existingOrder = await prisma.mIN_SHOP_ORDER.findUnique({
      where: { id },
      include: { delivery: true }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      // 1. 주문 상태 변경
      if (orderStatus && existingOrder.status !== orderStatus) {
        await tx.$executeRawUnsafe(
          `UPDATE "MIN_SHOP_ORDER" SET status = $1, "updatedAt" = NOW() WHERE id = $2`,
          orderStatus, id
        );
      }

      // 2. 배송 상태 및 송장 번호 변경
      if (existingOrder.delivery) {
        const dId = existingOrder.delivery.id;
        let updateQuery = `UPDATE "MIN_SHOP_DELIVERY" SET status = $1`;
        let queryParams: any[] = [deliveryStatus || existingOrder.delivery.status];
        
        let paramIndex = 2;
        if (trackingNo !== undefined) {
          updateQuery += `, "trackingNo" = $${paramIndex}`;
          queryParams.push(trackingNo);
          paramIndex++;
        }
        
        if (deliveryStatus === "SHIPPING" && existingOrder.delivery.status !== "SHIPPING") {
           updateQuery += `, "shippedAt" = NOW()`;
        } else if (deliveryStatus === "DELIVERED" && existingOrder.delivery.status !== "DELIVERED") {
           updateQuery += `, "deliveredAt" = NOW()`;
        }

        updateQuery += `, "updatedAt" = NOW() WHERE id = $${paramIndex}`;
        queryParams.push(dId);

        await tx.$executeRawUnsafe(updateQuery, ...queryParams);
        
        // 3. (신규 로직) 배송완료 시 포인트 지급 및 등급 계산
        if (deliveryStatus === "DELIVERED" && existingOrder.delivery.status !== "DELIVERED") {
          const user = await tx.mIN_SHOP_USER.findUnique({ where: { id: existingOrder.userId } });
          
          if (user) {
            // 실 결제금액: 주문총액(할인전) - 포인트 사용액 - 환불금액
            // 단순화를 위해 기존 success 페이지 로직처럼 (주문총액 - 포인트사용액)을 기준 결제금으로 봅니다.
            const paidAmount = existingOrder.totalAmount - existingOrder.usedPoints;
            const newTotalSpent = user.totalSpent + paidAmount;
            const newPoints = user.points + existingOrder.earnedPoints;

            let newTier = "BRONZE";
            if (newTotalSpent >= 1000000) newTier = "VIP";
            else if (newTotalSpent >= 500000) newTier = "GOLD";
            else if (newTotalSpent >= 100000) newTier = "SILVER";

            await tx.mIN_SHOP_USER.update({
              where: { id: user.id },
              data: {
                points: Math.max(0, newPoints),
                totalSpent: newTotalSpent,
                tier: newTier
              }
            });
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("관리자 주문 상태 변경 에러 (상세):", error);
    return NextResponse.json({ error: error.message || "Internal server error", stack: error.stack }, { status: 500 });
  }
}

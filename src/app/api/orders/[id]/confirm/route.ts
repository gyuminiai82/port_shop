import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";

async function getUserSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;
  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;
  return JSON.parse(sessionData as string);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionUser = await getUserSession();
    if (!sessionUser) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { id } = await params;

    const existingOrder = await prisma.mIN_SHOP_ORDER.findUnique({
      where: { id },
      include: { delivery: true }
    });

    if (!existingOrder || existingOrder.userId !== sessionUser.id) {
      return NextResponse.json({ error: "주문을 찾을 수 없거나 권한이 없습니다." }, { status: 404 });
    }

    if (!existingOrder.delivery || existingOrder.delivery.status !== "SHIPPING") {
      return NextResponse.json({ error: "배송 중인 상품만 구매 확정(수취 확인)할 수 있습니다." }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // 1. 배송 상태 변경 (수취 확인)
      await tx.$executeRawUnsafe(
        `UPDATE "MIN_SHOP_DELIVERY" SET status = $1, "deliveredAt" = NOW(), "updatedAt" = NOW() WHERE id = $2`,
        "DELIVERED", existingOrder.delivery!.id
      );

      // 2. 포인트 지급 및 등급 계산
      const user = await tx.mIN_SHOP_USER.findUnique({ where: { id: sessionUser.id } });
      
      if (user) {
        // 실 결제금액 기준 (할인 전 총액 - 사용포인트 - 환불금은 없다고 가정)
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
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("구매 확정(수취 확인) 에러:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

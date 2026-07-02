import Link from "next/link";
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

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ paymentKey: string, orderId: string, amount: string, usedPoints?: string }> }) {
  const { paymentKey, orderId, amount, usedPoints } = await searchParams;
  const user = await getUser();

  if (user) {
    try {
      const existingOrder = await prisma.mIN_SHOP_ORDER.findUnique({ where: { id: orderId } });
      
      if (!existingOrder) {
        const parsedAmount = parseInt(amount || "0", 10);

        // 1. 토스페이먼츠 승인(Confirm) API 호출 (결제 금액이 0보다 클 때만)
        if (parsedAmount > 0) {
          const secretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
          const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");
          
          const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
            method: "POST",
            headers: {
              Authorization: `Basic ${basicToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentKey,
              orderId,
              amount: parsedAmount,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("결제 승인 실패:", errorData);
            throw new Error("결제 승인에 실패했습니다.");
          }
        }

        // 2. 장바구니 및 아이템 정보 조회
        const cart = await prisma.mIN_SHOP_CART.findUnique({
          where: { userId: user.id },
          include: {
            items: {
              include: { product: true }
            }
          }
        });
        
        const orderItemsData = cart?.items.map(item => ({
          productId: item.productId,
          optionId: item.optionId,
          quantity: item.quantity,
          price: item.product.price
        })) || [];

        if (cart) {
          // 장바구니 비우기
          await prisma.mIN_SHOP_CART_ITEM.deleteMany({
            where: { cartId: cart.id }
          });
        }

        const parsedUsedPoints = parseInt(usedPoints || "0", 10);
        const orderTotal = parsedAmount + parsedUsedPoints; // 상품 본래 총액

        // 등급별 적립률 (BRONZE: 1%, SILVER: 2%, GOLD: 3%, VIP: 5%)
        let earnRate = 0.01;
        if (user.tier === "SILVER") earnRate = 0.02;
        else if (user.tier === "GOLD") earnRate = 0.03;
        else if (user.tier === "VIP") earnRate = 0.05;

        const earnedPoints = Math.floor(parsedAmount * earnRate);

        // 3. 주문 정보 생성
        await prisma.mIN_SHOP_ORDER.create({
          data: {
            id: orderId,
            userId: user.id,
            totalAmount: orderTotal,
            usedPoints: parsedUsedPoints,
            earnedPoints: earnedPoints,
            status: "PAID",
            items: {
              create: orderItemsData
            },
            payment: {
              create: {
                method: "TOSS",
                amount: parsedAmount,
                transactionId: paymentKey,
                status: "COMPLETED",
                paidAt: new Date()
              }
            },
            delivery: {
              create: {
                recipient: user.name || "주문자",
                address: user.address || "등록된 주소 없음",
                status: "PREPARING"
              }
            }
          }
        });

        // 4. 유저 상태 업데이트 (사용한 포인트만 즉시 차감)
        const currentUser = await prisma.mIN_SHOP_USER.findUnique({ where: { id: user.id } });
        if (currentUser && parsedUsedPoints > 0) {
          const newPoints = currentUser.points - parsedUsedPoints;
          await prisma.mIN_SHOP_USER.update({
            where: { id: user.id },
            data: {
              points: Math.max(0, newPoints)
            }
          });
          
          // 포인트 사용 로그 생성
          await prisma.mIN_SHOP_POINT_LOG.create({
            data: {
              userId: user.id,
              amount: -parsedUsedPoints,
              reason: `주문 결제 시 포인트 사용 (주문번호: ${orderId})`
            }
          });
        }
        
        // 결제 완료 적립금 로그 생성
        if (earnedPoints > 0) {
          // 회원 포인트 증가
          await prisma.mIN_SHOP_USER.update({
            where: { id: user.id },
            data: {
              points: { increment: earnedPoints },
              totalSpent: { increment: parsedAmount }
            }
          });
          
          // 적립 로그 생성
          await prisma.mIN_SHOP_POINT_LOG.create({
            data: {
              userId: user.id,
              amount: earnedPoints,
              reason: `주문 결제 리워드 적립 (주문번호: ${orderId})`
            }
          });
        }
      }
    } catch (e) {
      console.error("결제 후처리 중 오류 발생:", e);
      return (
        <main className="main-content" style={{ padding: "8rem 2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", color: "#ef4444" }}>결제 승인 실패</h1>
          <p>오류가 발생하여 결제가 완료되지 않았습니다.</p>
          <Link href="/checkout" className="btn btn-primary" style={{ marginTop: "2rem" }}>결제 다시 시도하기</Link>
        </main>
      );
    }
  }

  return (
    <main className="main-content" style={{ padding: "8rem 2rem", maxWidth: "600px", margin: "0 auto", marginTop: "var(--nav-height)", textAlign: "center" }}>
      <div className="glass" style={{ padding: "4rem 2rem", borderRadius: "32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#10b981", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", marginBottom: "2rem", boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)" }}>
          ✓
        </div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>결제가 완료되었습니다</h1>
        <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", marginBottom: "3rem", lineHeight: 1.6 }}>
          주문번호: <strong>{orderId}</strong><br/>
          결제금액: <strong style={{ color: "var(--accent-color)" }}>₩{parseInt(amount || "0", 10).toLocaleString()}</strong>
        </p>
        
        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
          <Link href="/profile" className="btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "1.25rem", borderRadius: "12px", fontSize: "1.125rem", fontWeight: 600, background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", textDecoration: "none" }}>
            주문 내역 보기
          </Link>
          <Link href="/" className="btn btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "1.25rem", borderRadius: "12px", fontSize: "1.125rem", fontWeight: 600, textDecoration: "none" }}>
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </main>
  );
}

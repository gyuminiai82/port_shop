import { prisma } from "@/lib/prisma";
import OrderListClient from "./OrderListClient";
import { requireAdmin } from "@/lib/requireAdmin";

// 이 페이지는 항상 최신 데이터를 불러와야 합니다.
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await prisma.mIN_SHOP_ORDER.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: { name: true }
          }
        }
      },
      payment: true,
      delivery: true,
    }
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>주문 관리</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>전체 주문의 결제 및 배송 상태를 관리합니다.</p>
      </div>

      <OrderListClient orders={orders} />
    </div>
  );
}

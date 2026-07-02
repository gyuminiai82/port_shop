import { prisma } from "@/lib/prisma";
import OrderListClient from "./OrderListClient";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ page?: string, q?: string }> }) {
  await requireAdmin("ORDERS");

  const { page, q } = await searchParams;
  const currentPage = Number(page) || 1;
  const take = 10;
  const skip = (currentPage - 1) * take;

  const whereCondition: any = {};
  if (q && q.trim() !== "") {
    whereCondition.OR = [
      { id: { contains: q, mode: 'insensitive' } },
      { delivery: { recipient: { contains: q, mode: 'insensitive' } } },
      { delivery: { trackingNo: { contains: q, mode: 'insensitive' } } }
    ];
  }

  const [orders, totalCount] = await Promise.all([
    prisma.mIN_SHOP_ORDER.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      skip,
      take,
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
    }),
    prisma.mIN_SHOP_ORDER.count({ where: whereCondition })
  ]);

  const totalPages = Math.ceil(totalCount / take);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>주문 관리</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>전체 주문의 결제 및 배송 상태를 관리합니다.</p>
        </div>
      </header>

      <OrderListClient 
        orders={orders} 
        currentPage={currentPage}
        totalPages={totalPages}
        searchQuery={q || ""}
      />
    </div>
  );
}

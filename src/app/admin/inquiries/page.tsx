import { requireAdmin } from "@/lib/requireAdmin";
import InquiryListClient from "./InquiryListClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage({ searchParams }: { searchParams: Promise<{ page?: string, q?: string }> }) {
  await requireAdmin("INQUIRIES");

  const { page, q } = await searchParams;
  const currentPage = Number(page) || 1;
  const take = 10;
  const skip = (currentPage - 1) * take;

  const whereCondition: any = {};
  if (q && q.trim() !== "") {
    whereCondition.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { content: { contains: q, mode: 'insensitive' } },
      { user: { name: { contains: q, mode: 'insensitive' } } },
      { user: { email: { contains: q, mode: 'insensitive' } } }
    ];
  }

  const [inquiries, totalCount] = await Promise.all([
    prisma.mIN_SHOP_INQUIRY.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }),
    prisma.mIN_SHOP_INQUIRY.count({ where: whereCondition })
  ]);

  const totalPages = Math.ceil(totalCount / take);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>문의 관리</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            고객의 1:1 문의 내역을 확인하고 답변을 등록할 수 있습니다.
          </p>
        </div>
      </header>

      <InquiryListClient 
        inquiries={inquiries} 
        currentPage={currentPage} 
        totalPages={totalPages} 
        searchQuery={q || ""}
      />
    </div>
  );
}

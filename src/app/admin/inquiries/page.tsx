import { requireAdmin } from "@/lib/requireAdmin";
import InquiryListClient from "./InquiryListClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin("INQUIRIES");

  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const take = 10;
  const skip = (currentPage - 1) * take;

  const [inquiries, totalCount] = await Promise.all([
    prisma.mIN_SHOP_INQUIRY.findMany({
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
    prisma.mIN_SHOP_INQUIRY.count()
  ]);

  const totalPages = Math.ceil(totalCount / take);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>문의 관리</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          고객의 1:1 문의 내역을 확인하고 답변을 등록할 수 있습니다.
        </p>
      </header>

      <InquiryListClient 
        inquiries={inquiries} 
        currentPage={currentPage} 
        totalPages={totalPages} 
      />
    </div>
  );
}

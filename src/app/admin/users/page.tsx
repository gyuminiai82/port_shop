import { prisma } from "@/lib/prisma";
import UserListClient from "./UserListClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const take = 10;
  const skip = (currentPage - 1) * take;

  const whereCondition = {
    NOT: {
      email: { endsWith: '@minstudio.app' }
    }
  };

  const [users, totalCount] = await Promise.all([
    prisma.mIN_SHOP_USER.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      skip,
      take
    }),
    prisma.mIN_SHOP_USER.count({ where: whereCondition })
  ]);

  const totalPages = Math.ceil(totalCount / take);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>회원 관리</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>전체 회원의 목록을 조회하고 관리할 수 있습니다.</p>
        </div>
      </header>

      <UserListClient users={users} currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

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
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1f2937" }}>회원 관리</h1>
      </div>

      <UserListClient users={users} currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

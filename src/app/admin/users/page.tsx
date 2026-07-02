import { prisma } from "@/lib/prisma";
import UserListClient from "./UserListClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.mIN_SHOP_USER.findMany({
    where: {
      NOT: {
        email: { endsWith: '@minstudio.app' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1f2937" }}>회원 관리</h1>
      </div>

      <UserListClient users={users} />
    </div>
  );
}

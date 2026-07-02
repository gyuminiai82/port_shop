import RoleListClient from "./RoleListClient";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function RolesPage() {
  // 최고 관리자 권한 필수
  await requireAdmin("MANAGERS");

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>역할(Role) 관리</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          운영진에게 부여할 수 있는 역할들을 관리합니다. 역할마다 구체적인 메뉴 접근 권한을 설정할 수 있습니다.
        </p>
      </header>

      <RoleListClient />
    </div>
  );
}

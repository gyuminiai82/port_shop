import ManagersTabClient from "./ManagersTabClient";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function ManagersPage() {
  // 최고 관리자 권한 필수
  await requireAdmin("MANAGERS");

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>운영진 및 역할 관리</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          쇼핑몰을 관리할 운영진 계정과 권한 역할(Role)을 관리할 수 있습니다.
        </p>
      </header>

      <ManagersTabClient />
    </div>
  );
}

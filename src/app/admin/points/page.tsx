import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminPointsPage() {
  await requireAdmin();

  // 최신 포인트 내역 100건 조회
  const pointLogs = await prisma.mIN_SHOP_POINT_LOG.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true, points: true }
      }
    }
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>포인트 지급/차감 내역</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>고객들의 포인트 변동 내역을 조회합니다.</p>
        </div>
      </header>

      <div className="glass" style={{ background: "white", padding: "2rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: "800px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9", color: "#64748b", textAlign: "left" }}>
              <th style={{ width: "20%", padding: "1rem", fontWeight: 600 }}>일시</th>
              <th style={{ width: "20%", padding: "1rem", fontWeight: 600 }}>고객명</th>
              <th style={{ width: "25%", padding: "1rem", fontWeight: 600 }}>고객 계정</th>
              <th style={{ width: "15%", padding: "1rem", fontWeight: 600 }}>변동액</th>
              <th style={{ width: "20%", padding: "1rem", fontWeight: 600 }}>사유</th>
            </tr>
          </thead>
          <tbody>
            {pointLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: "1px solid var(--glass-border)", transition: "background 0.2s" }} className="hover-row">
                <td style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  {new Date(log.createdAt).toLocaleString('ko-KR')}
                </td>
                <td style={{ padding: "1rem", fontWeight: 500 }}>
                  {log.user.name || "이름 없음"}
                </td>
                <td style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  {log.user.email}
                </td>
                <td style={{ padding: "1rem", fontWeight: 700, color: log.amount > 0 ? "var(--accent-color)" : "#ef4444" }}>
                  {log.amount > 0 ? "+" : ""}
                  {log.amount.toLocaleString()} P
                </td>
                <td style={{ padding: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  {log.reason}
                </td>
              </tr>
            ))}
            {pointLogs.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "4rem 1rem", textAlign: "center", color: "var(--text-secondary)" }}>
                  포인트 변동 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .hover-row:hover {
          background: rgba(0, 0, 0, 0.02);
        }
      `}</style>
    </div>
  );
}

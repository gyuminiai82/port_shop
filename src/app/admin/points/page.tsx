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
    <div style={{ padding: "2rem", width: "100%", maxWidth: "1200px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "2rem", color: "var(--text-primary)" }}>
        💰 포인트 지급/차감 내역
      </h1>

      <div className="glass" style={{ borderRadius: "24px", padding: "2rem", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--glass-border)", color: "var(--text-secondary)", textAlign: "left" }}>
              <th style={{ padding: "1rem", fontWeight: 600 }}>일시</th>
              <th style={{ padding: "1rem", fontWeight: 600 }}>고객명</th>
              <th style={{ padding: "1rem", fontWeight: 600 }}>고객 계정</th>
              <th style={{ padding: "1rem", fontWeight: 600 }}>변동액</th>
              <th style={{ padding: "1rem", fontWeight: 600 }}>사유</th>
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

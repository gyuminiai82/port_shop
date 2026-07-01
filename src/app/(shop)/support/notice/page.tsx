import { prisma } from "@/lib/prisma";

export default async function NoticePage() {
  const notices = await prisma.mIN_SHOP_NOTICE.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="glass" style={{ padding: "3rem", borderRadius: "24px" }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>공지사항</h2>
      
      {notices.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" }}>
          {notices.map((notice) => (
            <li key={notice.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
              <details style={{ cursor: "pointer" }} className="notice-details">
                <summary style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", outline: "none", padding: "1.5rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{notice.title}</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 400 }}>
                    {notice.createdAt.toLocaleDateString()}
                  </span>
                </summary>
                <div style={{ padding: "2rem", background: "rgba(0,0,0,0.02)", borderRadius: "16px", marginBottom: "1.5rem", color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {notice.content}
                </div>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem", opacity: 0.5 }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p style={{ fontSize: "1.125rem" }}>등록된 공지사항이 없습니다.</p>
        </div>
      )}

      <style>{`
        .notice-details > summary {
          list-style: none;
        }
        .notice-details > summary::-webkit-details-marker {
          display: none;
        }
      `}</style>
    </div>
  );
}

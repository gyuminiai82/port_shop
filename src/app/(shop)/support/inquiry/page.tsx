import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import InquiryFormClient from "./InquiryFormClient";
import { redirect } from "next/navigation";

async function getUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;
  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;
  return JSON.parse(sessionData as string);
}

export default async function InquiryPage() {
  const user = await getUser();
  
  if (!user) {
    redirect(`https://auth.minstudio.app/login?redirect=http://localhost:3001/support/inquiry`);
  }

  const inquiries = await prisma.mIN_INQUIRY.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="glass" style={{ padding: "3rem", borderRadius: "24px" }}>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>1:1 문의</h2>
      
      <InquiryFormClient />

      <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>나의 문의 내역</h3>
      
      {inquiries.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" }}>
          {inquiries.map((inq) => (
            <li key={inq.id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
              <details style={{ cursor: "pointer" }} className="inquiry-details">
                <summary style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)", outline: "none", padding: "1.5rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "0.875rem", padding: "0.25rem 0.5rem", background: inq.status === 'ANSWERED' ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)", color: inq.status === 'ANSWERED' ? "#10b981" : "#f59e0b", borderRadius: "6px" }}>
                      {inq.status === 'ANSWERED' ? "답변완료" : "답변대기"}
                    </span>
                    <span>[{inq.type}] {inq.title}</span>
                  </div>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 400 }}>
                    {inq.createdAt.toLocaleDateString()}
                  </span>
                </summary>
                <div style={{ padding: "2rem", background: "rgba(0,0,0,0.02)", borderRadius: "16px", marginBottom: "1.5rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <div style={{ whiteSpace: "pre-wrap", marginBottom: inq.answer ? "2rem" : 0 }}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>Q. 문의 내용</div>
                    {inq.content}
                  </div>
                  {inq.answer && (
                    <div style={{ whiteSpace: "pre-wrap", padding: "1.5rem", background: "rgba(59, 130, 246, 0.05)", borderRadius: "12px", borderLeft: "4px solid var(--accent-color)" }}>
                      <div style={{ fontWeight: 600, color: "var(--accent-color)", marginBottom: "0.5rem" }}>A. 관리자 답변</div>
                      {inq.answer}
                    </div>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
          <p style={{ fontSize: "1.125rem" }}>문의 내역이 없습니다.</p>
        </div>
      )}

      <style>{`
        .inquiry-details > summary {
          list-style: none;
        }
        .inquiry-details > summary::-webkit-details-marker {
          display: none;
        }
      `}</style>
    </div>
  );
}

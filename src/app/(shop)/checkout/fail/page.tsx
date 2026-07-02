import Link from "next/link";

export default async function CheckoutFailPage({ searchParams }: { searchParams: Promise<{ code: string, message: string, orderId: string }> }) {
  const { code, message, orderId } = await searchParams;

  return (
    <main className="main-content" style={{ padding: "8rem 2rem", maxWidth: "600px", margin: "0 auto", marginTop: "var(--nav-height)", textAlign: "center" }}>
      <div className="glass" style={{ padding: "4rem 2rem", borderRadius: "32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#ef4444", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", marginBottom: "2rem", boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)" }}>
          ✕
        </div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>결제에 실패했습니다</h1>
        <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", marginBottom: "3rem", lineHeight: 1.6 }}>
          사유: <strong style={{ color: "#ef4444" }}>{message || "알 수 없는 오류"}</strong><br/>
          <span style={{ fontSize: "0.875rem" }}>(에러코드: {code})</span>
        </p>
        
        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
          <Link href="/checkout" className="btn btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "1.25rem", borderRadius: "12px", fontSize: "1.125rem", fontWeight: 600, textDecoration: "none" }}>
            다시 시도하기
          </Link>
          <Link href="/cart" className="btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "1.25rem", borderRadius: "12px", fontSize: "1.125rem", fontWeight: 600, background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", textDecoration: "none" }}>
            장바구니로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}

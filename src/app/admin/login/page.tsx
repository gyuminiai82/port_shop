"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@shop.com");
  const [password, setPassword] = useState("password123");
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        // 로그인 성공: 현재 페이지 새로고침(또는 강제 리다이렉트)하여 미들웨어/레이아웃 검사 통과
        window.location.href = "/admin/orders";
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "이메일 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      alert("로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div className="glass" style={{ width: "100%", maxWidth: "400px", padding: "3rem", borderRadius: "24px", background: "white", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>관리자 로그인</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>포트폴리오 샵 관리자 센터입니다.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-secondary)" }}>이메일</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@shop.com"
              required
              style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "#f8f9fc", outline: "none", fontSize: "1rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-secondary)" }}>비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "#f8f9fc", outline: "none", fontSize: "1rem" }}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isPending}
            style={{ width: "100%", padding: "1.25rem", marginTop: "1rem", background: "var(--accent-color)", color: "white", border: "none", borderRadius: "12px", fontSize: "1.125rem", fontWeight: 700, cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1, transition: "all 0.2s" }}
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";

async function getUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;

  return JSON.parse(sessionData as string);
}

export default async function Header() {
  const user = await getUser();

  return (
    <nav className="glass" style={{ position: "fixed", top: 0, width: "100%", zIndex: 50 }}>
      <div className="nav-container" style={{ maxWidth: "1200px", margin: "0 auto", height: "var(--nav-height)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2rem" }}>
        <Link href="/" className="logo" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.5rem" }}>
            <defs>
              <linearGradient id="brand-grad" x1="0" y1="0" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--text-primary)" />
                <stop offset="100%" stopColor="var(--accent-color)" />
              </linearGradient>
            </defs>
            <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="url(#brand-grad)" strokeWidth="2" strokeLinejoin="round" />
            <path d="M7 12L12 7L17 12" stroke="url(#brand-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-0.05em", background: "linear-gradient(135deg, var(--text-primary) 30%, var(--accent-color) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            MINSTUDIO
          </span>
          <span style={{ fontSize: "1.5rem", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--text-primary)", marginLeft: "0.25rem" }}>
            SHOP
          </span>
        </Link>
        <div className="nav-links" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user.name}님</span>
              <Link href="/cart" className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                장바구니
              </Link>
              <Link href="https://auth.minstudio.app/logout?redirect=http://localhost:3001" className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                로그아웃
              </Link>
            </>
          ) : (
            <>
              <Link href="https://auth.minstudio.app/login?redirect=http://localhost:3001" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                로그인
              </Link>
              <Link href="https://auth.minstudio.app/register?redirect=http://localhost:3001" className="btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", color: "var(--text-primary)" }}>
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

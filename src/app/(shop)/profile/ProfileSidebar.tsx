"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileSidebar({ userName, userTier, userPoints }: { userName: string, userTier: string, userPoints: number }) {
  const pathname = usePathname();

  const navItems = [
    { name: "결제 및 주문 내역", path: "/profile" },
    { name: "내 정보 수정", path: "/profile/edit" },
    { name: "포인트 혜택 안내", path: "/profile/benefits" }
  ];

  return (
    <aside className="glass" style={{ padding: "2rem", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ textAlign: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1.5rem" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--accent-color)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700, margin: "0 auto 1rem", boxShadow: "0 10px 25px rgba(0, 112, 243, 0.3)" }}>
          {userName.substring(0, 1)}
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>{userName}님</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>{userTier} 등급</p>
        
        <div style={{ background: "rgba(0, 0, 0, 0.03)", padding: "1rem", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>보유 포인트</span>
          <span style={{ fontWeight: 800, color: "var(--accent-color)", fontSize: "1.125rem" }}>{userPoints.toLocaleString()}P</span>
        </div>
      </div>

      <div role="navigation" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {navItems.map(item => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                padding: "1rem 1.25rem",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--accent-color)" : "var(--text-secondary)",
                background: isActive ? "var(--bg-color)" : "transparent",
                border: isActive ? "1px solid var(--glass-border)" : "1px solid transparent",
                transition: "all 0.2s ease",
                boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.03)" : "none",
                boxSizing: "border-box"
              }}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

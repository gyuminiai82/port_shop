"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If login page, don't show sidebar
  if (pathname === "/admin/login") {
    return <div style={{ minHeight: "100vh", background: "#f8f9fc" }}>{children}</div>;
  }

  const navItems = [
    { name: "대시보드", href: "/admin" },
    { name: "카테고리 관리", href: "/admin/categories" },
    { name: "상품 관리", href: "/admin/products" },
    { name: "주문 관리", href: "/admin/orders" },
    { name: "회원 관리", href: "/admin/users" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fc" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", background: "#1f2937", color: "white", padding: "2rem 0", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 2rem", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.05em" }}>
            MINSTUDIO
            <span style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#9ca3af", marginTop: "0.25rem" }}>Admin Center</span>
          </h1>
        </div>

        <div role="navigation" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0 1rem" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                style={{
                  padding: "1rem 1.5rem",
                  borderRadius: "12px",
                  color: isActive ? "white" : "#9ca3af",
                  background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div style={{ padding: "0 2rem" }}>
          <Link href="/" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>←</span> 쇼핑몰로 돌아가기
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "3rem 4rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}

import Link from "next/link";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "공지사항", href: "/support/notice" },
    { label: "1:1 문의", href: "/support/inquiry" },
    { label: "배송 안내", href: "/support/shipping" },
    { label: "교환/반품 안내", href: "/support/returns" },
  ];

  return (
    <main className="main-content" style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto", marginTop: "var(--nav-height)" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "3rem", letterSpacing: "-0.04em" }}>고객 서비스</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "4rem" }} className="support-grid">
        {/* Sidebar Nav */}
        <aside>
          <div className="glass" style={{ padding: "2rem", borderRadius: "24px" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    style={{ 
                      display: "block", 
                      padding: "0.75rem 1rem", 
                      borderRadius: "12px",
                      textDecoration: "none",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      transition: "all 0.2s"
                    }}
                    className="support-nav-link"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <div style={{ minHeight: "500px" }}>
          {children}
        </div>
      </div>

      <style>{`
        .support-nav-link:hover {
          background: rgba(59, 130, 246, 0.05);
          color: var(--accent-color) !important;
        }
        @media (max-width: 768px) {
          .support-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </main>
  );
}

import SupportNav from "./SupportNav";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="main-content" style={{ width: "100%", padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto", marginTop: "var(--nav-height)" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "3rem", letterSpacing: "-0.04em" }}>고객 서비스</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "4rem" }} className="support-grid">
        {/* Sidebar Nav */}
        <SupportNav />

        {/* Content */}
        <div style={{ minWidth: 0 }}>
          {children}
        </div>
      </div>

      <style>{`
        .support-nav-link:hover {
          background: rgba(59, 130, 246, 0.05) !important;
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

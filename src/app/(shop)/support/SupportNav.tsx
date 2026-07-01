"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SupportNav() {
  const pathname = usePathname();
  
  const navItems = [
    { label: "공지사항", href: "/support/notice" },
    { label: "1:1 문의", href: "/support/inquiry" },
    { label: "배송 안내", href: "/support/shipping" },
    { label: "교환/반품 안내", href: "/support/returns" },
  ];

  return (
    <aside>
      <div className="glass" style={{ padding: "2rem", borderRadius: "24px", position: "sticky", top: "calc(var(--nav-height) + 2rem)" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  style={{ 
                    display: "block", 
                    padding: "1rem 1.25rem", 
                    borderRadius: "12px",
                    textDecoration: "none",
                    color: isActive ? "white" : "var(--text-primary)",
                    background: isActive ? "var(--accent-color)" : "transparent",
                    fontWeight: isActive ? 700 : 600,
                    boxShadow: isActive ? "0 4px 12px rgba(59, 130, 246, 0.3)" : "none",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                  className={isActive ? "" : "support-nav-link"}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

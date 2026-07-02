"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return null;
  }

  const [adminAuth, setAdminAuth] = useState<{ isSuperAdmin: boolean, permissions: string[] } | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setAdminAuth(data);
        }
      });
  }, []);

  const navItems = [
    { name: "대시보드", href: "/admin", permission: null },
    { name: "카테고리 관리", href: "/admin/categories", permission: "PRODUCTS" },
    { name: "상품 관리", href: "/admin/products", permission: "PRODUCTS" },
    { name: "주문 관리", href: "/admin/orders", permission: "ORDERS" },
    { name: "포인트 내역", href: "/admin/points", permission: "POINTS" },
    { name: "문의 관리", href: "/admin/inquiries", permission: "INQUIRIES" },
    { name: "회원 관리", href: "/admin/users", permission: "USERS" },
    { name: "운영진 관리", href: "/admin/managers", permission: "MANAGERS", isSuperAdminOnly: true }
  ];

  // 권한에 따른 메뉴 필터링
  const filteredNavItems = navItems.filter(item => {
    if (!adminAuth) return false; // 정보 로드 전까지 안 보임 (또는 스켈레톤 처리 가능)
    if (item.isSuperAdminOnly && !adminAuth.isSuperAdmin) return false;
    if (adminAuth.isSuperAdmin) return true;
    if (!item.permission) return true; // 권한 무관(대시보드 등)
    return adminAuth.permissions.includes(item.permission);
  });

  return (
    <aside style={{ width: "260px", background: "#1f2937", color: "white", padding: "2rem 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "0 2rem", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.05em" }}>
          MINSTUDIO
          <span style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#9ca3af", marginTop: "0.25rem" }}>Admin Center</span>
        </h1>
      </div>

      <div role="navigation" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0 1rem" }}>
          {filteredNavItems.map((item) => {
            const isActive = item.href === "/admin" 
              ? pathname === "/admin" 
              : pathname.startsWith(item.href);
              
            return (
              <Link 
                key={item.href}
                href={item.href} 
                style={{ 
                  display: "block", 
                  padding: "1rem", 
                  borderRadius: "12px", 
                  background: isActive ? "rgba(255,255,255,0.2)" : "transparent", 
                  color: "white", 
                  textDecoration: "none", 
                  fontWeight: isActive ? 700 : 500, 
                  marginBottom: "0.5rem", 
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
  );
}

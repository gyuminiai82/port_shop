"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 로그인 페이지는 사이드바 제거
  if (pathname === "/admin/login") {
    return <div style={{ minHeight: "100vh", background: "#f8f9fc" }}>{children}</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fc" }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: "3rem 4rem", overflowY: "auto", overflowX: "hidden" }}>
        {children}
      </main>
    </div>
  );
}

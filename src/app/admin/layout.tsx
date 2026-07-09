"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import "./admin.css";

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
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

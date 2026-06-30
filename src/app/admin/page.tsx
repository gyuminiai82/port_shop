import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [productCount, userCount, orderCount] = await Promise.all([
    prisma.mIN_PRODUCT.count(),
    prisma.mIN_SHOP_USER.count(),
    prisma.mIN_ORDER.count()
  ]);

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "2rem", color: "#1f2937" }}>대시보드 요약</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
        
        <div style={{ background: "white", padding: "2rem", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" }}>
          <div style={{ color: "#64748b", fontWeight: 600, marginBottom: "0.5rem" }}>총 등록 상품</div>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#1f2937" }}>{productCount}</div>
        </div>

        <div style={{ background: "white", padding: "2rem", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" }}>
          <div style={{ color: "#64748b", fontWeight: 600, marginBottom: "0.5rem" }}>총 가입 회원</div>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#1f2937" }}>{userCount}</div>
        </div>

        <div style={{ background: "white", padding: "2rem", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" }}>
          <div style={{ color: "#64748b", fontWeight: 600, marginBottom: "0.5rem" }}>전체 주문 수</div>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#1f2937" }}>{orderCount}</div>
        </div>
      </div>
    </div>
  );
}

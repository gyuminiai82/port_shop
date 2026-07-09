import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    productCount, 
    userCount, 
    orderCount, 
    revenueResult
  ] = await Promise.all([
    prisma.mIN_SHOP_PRODUCT.count(),
    prisma.mIN_SHOP_USER.count(),
    prisma.mIN_SHOP_ORDER.count(),
    prisma.mIN_SHOP_ORDER.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } }
    })
  ]);
  const recentOrdersData = await prisma.mIN_SHOP_ORDER.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  const recentInquiries = await prisma.mIN_SHOP_INQUIRY.findMany({
    where: { status: 'PENDING' },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  // 주문한 유저 정보 수동 조회 (MIN_SHOP_ORDER에 relation 설정이 없으므로)
  const userIds = [...new Set(recentOrdersData.map(o => o.userId))];
  const orderUsers = await prisma.mIN_SHOP_USER.findMany({
    where: { id: { in: userIds } }
  });
  const userMap = new Map(orderUsers.map(u => [u.id, u]));

  const recentOrders = recentOrdersData.map(order => ({
    ...order,
    user: userMap.get(order.userId)
  }));

  const totalRevenue = revenueResult._sum.totalAmount || 0;

  // 상태 번역 맵
  const orderStatusMap: Record<string, { label: string, color: string, bg: string }> = {
    PENDING: { label: "입금대기", color: "#d97706", bg: "#fef3c7" },
    PAID: { label: "결제완료", color: "#059669", bg: "#d1fae5" },
    SHIPPING: { label: "배송중", color: "#2563eb", bg: "#dbeafe" },
    SHIPPED: { label: "배송완료", color: "#4f46e5", bg: "#e0e7ff" },
    DELIVERED: { label: "배송완료", color: "#4f46e5", bg: "#e0e7ff" },
    CANCELLED: { label: "주문취소", color: "#dc2626", bg: "#fee2e2" },
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      <header className="dashboard-header">
        <h1>대시보드</h1>
        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>쇼핑몰의 핵심 지표와 최근 주요 현황을 한눈에 파악하세요.</p>
      </header>
      
      {/* 1. 요약 카드 섹션 */}
      <div className="dashboard-grid">
        
        {/* 매출 카드 (강조형) */}
        <div style={{ background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)", padding: "2rem", borderRadius: "24px", boxShadow: "0 10px 25px rgba(59,130,246,0.3)", color: "white", position: "relative", overflow: "hidden" }}>
          <div style={{ opacity: 0.8, fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.1rem" }}>총 누적 매출</div>
          <div style={{ fontSize: "2.5rem", fontWeight: 800 }}>₩{totalRevenue.toLocaleString()}</div>
          <div style={{ position: "absolute", right: "-10px", bottom: "-20px", opacity: 0.1, fontSize: "8rem" }}>💰</div>
        </div>

        {/* 일반 카드들 */}
        {[
          { label: "전체 주문", count: orderCount, icon: "📦", suffix: "건" },
          { label: "가입 회원", count: userCount, icon: "👥", suffix: "명" },
          { label: "등록 상품", count: productCount, icon: "🛍️", suffix: "개" }
        ].map((card, idx) => (
          <div key={idx} style={{ background: "white", padding: "2rem", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#64748b", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.1rem" }}>{card.label}</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#1f2937" }}>{card.count.toLocaleString()}<span style={{ fontSize: "1.25rem", color: "#9ca3af", marginLeft: "0.25rem" }}>{card.suffix}</span></div>
            </div>
            <div style={{ fontSize: "3rem", opacity: 0.8 }}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* 2. 최근 데이터 섹션 (2단 그리드) */}
      <div className="dashboard-recent">
        
        {/* 최근 주문 내역 */}
        <div style={{ background: "white", padding: "2rem", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1f2937" }}>최근 주문 내역</h2>
            <Link href="/admin/orders" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--accent-color)", textDecoration: "none" }}>전체보기 &rarr;</Link>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f1f5f9", color: "#64748b", fontSize: "0.875rem" }}>
                  <th style={{ padding: "1rem 0.5rem", fontWeight: 600 }}>주문일시</th>
                  <th style={{ padding: "1rem 0.5rem", fontWeight: 600 }}>주문자</th>
                  <th style={{ padding: "1rem 0.5rem", fontWeight: 600 }}>결제금액</th>
                  <th style={{ padding: "1rem 0.5rem", fontWeight: 600 }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#9ca3af" }}>최근 주문이 없습니다.</td>
                  </tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td style={{ padding: "1rem 0.5rem", color: "#64748b", fontSize: "0.875rem" }}>
                        {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td style={{ padding: "1rem 0.5rem", fontWeight: 600, color: "#374151" }}>
                        {order.user?.name || "비회원"}
                      </td>
                      <td style={{ padding: "1rem 0.5rem", fontWeight: 700, color: "#1f2937" }}>
                        ₩{order.totalAmount.toLocaleString()}
                      </td>
                      <td style={{ padding: "1rem 0.5rem" }}>
                        <span style={{ 
                          padding: "0.25rem 0.75rem", 
                          borderRadius: "99px", 
                          background: orderStatusMap[order.status]?.bg || "#f1f5f9", 
                          color: orderStatusMap[order.status]?.color || "#64748b", 
                          fontWeight: 700, 
                          fontSize: "0.75rem" 
                        }}>
                          {orderStatusMap[order.status]?.label || order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 미답변 문의 (To-Do 느낌) */}
        <div style={{ background: "white", padding: "2rem", borderRadius: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1f2937", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              답변 대기 문의
              {recentInquiries.length > 0 && (
                <span style={{ background: "#ef4444", color: "white", padding: "2px 8px", borderRadius: "99px", fontSize: "0.75rem" }}>{recentInquiries.length}</span>
              )}
            </h2>
            <Link href="/admin/inquiries" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--accent-color)", textDecoration: "none" }}>전체보기 &rarr;</Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {recentInquiries.length === 0 ? (
              <div style={{ padding: "2rem 0", textAlign: "center", color: "#9ca3af", fontSize: "0.875rem" }}>
                밀린 답변이 없습니다! 🎉
              </div>
            ) : (
              recentInquiries.map(inq => (
                <div key={inq.id} style={{ padding: "1rem", borderRadius: "12px", border: "1px solid #f1f5f9", background: "#f8fafc", position: "relative" }}>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem" }}>
                    {new Date(inq.createdAt).toLocaleDateString('ko-KR')} · {inq.user?.name || "비회원"}
                  </div>
                  <div style={{ fontWeight: 600, color: "#1f2937", marginBottom: "0.5rem" }}>{inq.title}</div>
                  <Link href="/admin/inquiries" style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", padding: "0.4rem 0.8rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, color: "#374151", textDecoration: "none" }}>
                    답변하기
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

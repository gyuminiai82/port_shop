"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 서버에서 넘겨받는 데이터의 타입
type Order = {
  id: string;
  createdAt: Date;
  totalAmount: number;
  refundAmount: number;
  status: string;
  items: {
    product: { name: string };
    quantity: number;
  }[];
  payment: {
    method: string;
    transactionId: string | null;
  } | null;
  delivery: {
    id: string;
    recipient: string;
    address: string;
    status: string;
    trackingNo: string | null;
  } | null;
};

export default function OrderListClient({ 
  orders, 
  currentPage, 
  totalPages, 
  searchQuery 
}: { 
  orders: Order[],
  currentPage: number,
  totalPages: number,
  searchQuery: string
}) {
  const router = useRouter();
  
  // 모달 상태 관리
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // 폼 상태
  const [editOrderStatus, setEditOrderStatus] = useState("");
  const [editDeliveryStatus, setEditDeliveryStatus] = useState("PREPARING");
  const [editTrackingNo, setEditTrackingNo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/orders?page=1&q=${encodeURIComponent(searchInput)}`);
  };

  // 모달 열기
  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setEditOrderStatus(order.status);
    setEditDeliveryStatus(order.delivery?.status || "PREPARING");
    setEditTrackingNo(order.delivery?.trackingNo || "");
    setErrorMessage("");
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedOrder(null);
  };

  // 상태 변경 저장 (API 호출)
  const handleSave = async () => {
    if (!selectedOrder) return;
    
    setIsUpdating(true);
    setErrorMessage("");
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: editOrderStatus,
          deliveryStatus: editDeliveryStatus,
          trackingNo: editTrackingNo || null
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || "저장에 실패했습니다.");
      }
      
      closeModal();
      router.refresh(); // 데이터 새로고침
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "오류가 발생했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "PAID": return <span style={{ padding: "0.25rem 0.5rem", borderRadius: "9999px", background: "#dcfce7", color: "#166534", fontSize: "0.75rem", fontWeight: 700 }}>결제완료</span>;
      case "PENDING": return <span style={{ padding: "0.25rem 0.5rem", borderRadius: "9999px", background: "#fef9c3", color: "#854d0e", fontSize: "0.75rem", fontWeight: 700 }}>대기중</span>;
      case "CANCELLED": return <span style={{ padding: "0.25rem 0.5rem", borderRadius: "9999px", background: "#fee2e2", color: "#991b1b", fontSize: "0.75rem", fontWeight: 700 }}>취소됨</span>;
      default: return <span>{status}</span>;
    }
  };

  const getDeliveryBadge = (status: string | undefined) => {
    if (!status) return <span style={{ color: "#9ca3af" }}>정보없음</span>;
    switch(status) {
      case "PREPARING": return <span style={{ padding: "0.25rem 0.5rem", borderRadius: "9999px", background: "#f3f4f6", color: "#4b5563", fontSize: "0.75rem", fontWeight: 700 }}>배송준비중</span>;
      case "SHIPPING": return <span style={{ padding: "0.25rem 0.5rem", borderRadius: "9999px", background: "#dbeafe", color: "#1e40af", fontSize: "0.75rem", fontWeight: 700 }}>배송중</span>;
      case "DELIVERED": return <span style={{ padding: "0.25rem 0.5rem", borderRadius: "9999px", background: "#e0e7ff", color: "#3730a3", fontSize: "0.75rem", fontWeight: 700 }}>배송완료</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div>
      <div className="glass" style={{ background: "white", padding: "2rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", overflowX: "auto" }}>
        
        {/* 검색창 */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="주문번호, 수령인, 송장번호"
              style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", width: "250px" }}
            />
            <button 
              type="submit"
              style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "#f3f4f6", border: "1px solid #e2e8f0", fontWeight: 600, cursor: "pointer", color: "var(--text-primary)" }}
            >
              검색
            </button>
          </form>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", tableLayout: "fixed", minWidth: "1000px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9", color: "#64748b" }}>
              <th style={{ width: "20%", padding: "1rem 1.5rem", fontWeight: 600, color: "#4b5563", fontSize: "0.875rem" }}>주문일시/주문번호</th>
              <th style={{ width: "30%", padding: "1rem 1.5rem", fontWeight: 600, color: "#4b5563", fontSize: "0.875rem" }}>주문 상품</th>
              <th style={{ width: "15%", padding: "1rem 1.5rem", fontWeight: 600, color: "#4b5563", fontSize: "0.875rem" }}>총 결제금액</th>
              <th style={{ width: "10%", padding: "1rem 1.5rem", fontWeight: 600, color: "#4b5563", fontSize: "0.875rem" }}>결제 상태</th>
              <th style={{ width: "15%", padding: "1rem 1.5rem", fontWeight: 600, color: "#4b5563", fontSize: "0.875rem" }}>배송 상태</th>
              <th style={{ width: "10%", padding: "1rem 1.5rem", fontWeight: 600, color: "#4b5563", fontSize: "0.875rem" }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const itemSummary = order.items.length > 0 
                ? `${order.items[0].product.name} ${order.items.length > 1 ? `외 ${order.items.length - 1}건` : ''}`
                : '상품 없음';

              return (
                <tr key={order.id} style={{ borderBottom: "1px solid #e5e7eb", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>{order.id.split("_").pop()}</div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 500 }}>
                    {itemSummary}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontSize: "0.875rem", fontWeight: 600 }}>
                    ₩{order.totalAmount.toLocaleString()}
                    {order.refundAmount > 0 && (
                      <span style={{ display: "block", color: "#ef4444", fontSize: "0.75rem", fontWeight: 400 }}>(-₩{order.refundAmount.toLocaleString()})</span>
                    )}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    {getStatusBadge(order.status)}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <div>{getDeliveryBadge(order.delivery?.status)}</div>
                      {order.delivery?.trackingNo && (
                        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{order.delivery.trackingNo}</div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <button 
                      onClick={() => openModal(order)}
                      style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", fontWeight: 500, borderRadius: "6px", border: "1px solid #d1d5db", background: "white", cursor: "pointer", color: "#374151" }}
                    >
                      상태 변경
                    </button>
                  </td>
                </tr>
              )
            })}
            
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
                  주문 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이징 컨트롤 */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "2rem" }}>
          <button 
            onClick={() => router.push(`/admin/orders?page=${Math.max(1, currentPage - 1)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`)}
            disabled={currentPage === 1}
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            이전
          </button>
          
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => router.push(`/admin/orders?page=${pageNum}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`)}
                style={{
                  width: "2.5rem", height: "2.5rem",
                  borderRadius: "8px",
                  border: pageNum === currentPage ? "none" : "1px solid #e2e8f0",
                  background: pageNum === currentPage ? "var(--accent-color)" : "white",
                  color: pageNum === currentPage ? "white" : "#374151",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button 
            onClick={() => router.push(`/admin/orders?page=${Math.min(totalPages, currentPage + 1)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`)}
            disabled={currentPage === totalPages}
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            다음
          </button>
        </div>
      )}

      {/* 상태 변경 모달 */}
      {selectedOrder && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "16px", width: "100%", maxWidth: "480px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>주문 상태 관리</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* 결제 상태 */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>결제 상태</label>
                <select 
                  value={editOrderStatus} 
                  onChange={(e) => setEditOrderStatus(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.875rem" }}
                >
                  <option value="PENDING">결제 대기중 (PENDING)</option>
                  <option value="PAID">결제 완료 (PAID)</option>
                  <option value="CANCELLED">결제 취소 (CANCELLED)</option>
                </select>
              </div>

              {/* 배송 상태 */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>배송 상태</label>
                <select 
                  value={editDeliveryStatus} 
                  onChange={(e) => setEditDeliveryStatus(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.875rem" }}
                >
                  <option value="PREPARING">배송 준비중</option>
                  <option value="SHIPPING">배송 중</option>
                  <option value="DELIVERED">배송 완료</option>
                </select>
              </div>

              {/* 송장 번호 */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>송장 번호</label>
                <input 
                  type="text" 
                  value={editTrackingNo} 
                  onChange={(e) => setEditTrackingNo(e.target.value)}
                  placeholder="예: 1234-5678-9012"
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.875rem" }}
                />
              </div>
            </div>

            {errorMessage && (
              <div style={{ marginTop: "1rem", color: "#ef4444", fontSize: "0.875rem", background: "rgba(239, 68, 68, 0.1)", padding: "0.75rem", borderRadius: "8px" }}>
                {errorMessage}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", justifyContent: "flex-end" }}>
              <button 
                onClick={closeModal}
                disabled={isUpdating}
                style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "white", fontWeight: 600, cursor: "pointer", color: "#4b5563" }}
              >
                취소
              </button>
              <button 
                onClick={handleSave}
                disabled={isUpdating}
                style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", border: "none", background: "var(--accent-color)", color: "white", fontWeight: 600, cursor: "pointer" }}
              >
                {isUpdating ? "저장 중..." : "저장하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

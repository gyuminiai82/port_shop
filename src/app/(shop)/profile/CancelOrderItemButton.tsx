"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelOrderItemButton({ orderId, itemId, itemName }: { orderId: string, itemId: string, itemName: string }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const router = useRouter();

  const executeCancel = async () => {
    setShowConfirm(false);
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/items/${itemId}/cancel`, {
        method: "POST",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setAlertMessage(data.error || "상품 취소에 실패했습니다.");
      } else {
        setAlertMessage("상품이 성공적으로 취소되었습니다.");
        router.refresh();
      }
    } catch (e) {
      setAlertMessage("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        disabled={isCancelling}
        style={{
          padding: "0.4rem 0.75rem",
          borderRadius: "6px",
          background: "white",
          border: "1px solid #94a3b8",
          color: "#475569",
          fontSize: "0.75rem",
          fontWeight: 600,
          cursor: isCancelling ? "not-allowed" : "pointer",
          opacity: isCancelling ? 0.5 : 1,
          transition: "all 0.2s"
        }}
      >
        {isCancelling ? "처리 중..." : "상품 취소"}
      </button>

      {/* Confirm Modal */}
      {showConfirm && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "16px", maxWidth: "400px", width: "90%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1rem", color: "#1f2937" }}>상품 취소 확인</h3>
            <p style={{ color: "#4b5563", marginBottom: "2rem", lineHeight: 1.5 }}>
              <strong>{itemName}</strong> 상품을 정말로 취소하시겠습니까?
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setShowConfirm(false)}
                style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: "#f3f4f6", color: "#4b5563", border: "none", fontWeight: 600, cursor: "pointer" }}
              >
                닫기
              </button>
              <button 
                onClick={executeCancel}
                style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: "#ef4444", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}
              >
                예, 취소합니다
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertMessage && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "16px", maxWidth: "400px", width: "90%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1rem", color: "#1f2937" }}>알림</h3>
            <p style={{ color: "#4b5563", marginBottom: "2rem", lineHeight: 1.5 }}>{alertMessage}</p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setAlertMessage(null)}
                style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: "var(--accent-color, #3b82f6)", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

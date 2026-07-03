"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmDeliveryButton({ orderId }: { orderId: string }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const router = useRouter();

  const executeConfirm = async () => {
    setShowConfirm(false);
    setIsConfirming(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/confirm`, {
        method: "POST",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setAlertMessage(data.error || "수취 확인에 실패했습니다.");
      } else {
        setAlertMessage("수취 확인 및 구매 확정이 완료되었습니다! (포인트가 적립되었습니다.)");
        router.refresh();
      }
    } catch (e) {
      setAlertMessage("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        disabled={isConfirming}
        style={{
          padding: "0.6rem 1.25rem",
          borderRadius: "8px",
          background: "var(--accent-color, #3b82f6)",
          color: "white",
          border: "none",
          fontSize: "0.875rem",
          fontWeight: 700,
          cursor: isConfirming ? "not-allowed" : "pointer",
          opacity: isConfirming ? 0.7 : 1,
          transition: "all 0.2s",
          boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)"
        }}
      >
        {isConfirming ? "처리 중..." : "수취 확인 (구매 확정)"}
      </button>

      {/* Confirm Modal */}
      {showConfirm && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "16px", maxWidth: "400px", width: "90%", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1rem", color: "#1f2937" }}>수취 확인 (구매 확정)</h3>
            <p style={{ color: "#4b5563", marginBottom: "2rem", lineHeight: 1.5 }}>
              상품을 잘 받으셨나요?<br/>수취 확인 시 <strong>배송 완료</strong> 처리되며, 포인트가 적립됩니다.<br/>(확정 후에는 취소/반품이 어려울 수 있습니다.)
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setShowConfirm(false)}
                style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: "#f3f4f6", color: "#4b5563", border: "none", fontWeight: 600, cursor: "pointer" }}
              >
                닫기
              </button>
              <button 
                onClick={executeConfirm}
                style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", background: "var(--accent-color, #3b82f6)", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}
              >
                예, 구매 확정합니다
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

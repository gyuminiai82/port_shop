"use client";

import { useState } from "react";

type Option = {
  id: string;
  name: string;
  value: string;
  addPrice: number;
  stock: number;
};

type ProductActionsProps = {
  product: {
    id: string;
    price: number;
    options: Option[];
  };
};

export default function ProductActions({ product }: ProductActionsProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const selectedOption = product.options.find((opt) => opt.id === selectedOptionId);
  const totalPrice = product.price + (selectedOption ? selectedOption.addPrice : 0);

  return (
    <>
      <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "3rem" }}>
        ₩{totalPrice.toLocaleString()}
      </div>



      <div className="options" style={{ marginBottom: "4rem" }}>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", fontWeight: 600 }}>옵션 선택</h3>
        {product.options.length > 0 ? (
          <div style={{ position: "relative" }}>
            <select 
              className="glass" 
              style={{ width: "100%", padding: "1.25rem", paddingRight: "3rem", borderRadius: "16px", border: "1px solid var(--glass-border)", color: "var(--text-primary)", fontSize: "1.125rem", appearance: "none", cursor: "pointer", fontWeight: 500 }}
              value={selectedOptionId}
              onChange={(e) => setSelectedOptionId(e.target.value)}
            >
              <option value="">원하시는 옵션을 선택해주세요</option>
              {product.options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}: {opt.value} {opt.addPrice > 0 ? `(+₩${opt.addPrice.toLocaleString()})` : ''}
                </option>
              ))}
            </select>
            <div style={{ position: "absolute", right: "1.25rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>
        ) : (
          <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>단일 옵션 상품입니다.</p>
        )}
      </div>

      <div style={{ display: "flex", gap: "1.5rem", marginTop: "auto" }}>
        <button 
          className="btn" 
          style={{ flex: 1, padding: "1.25rem", fontSize: "1.125rem", borderRadius: "12px", fontWeight: 600, background: "#1f2937", color: "white", border: "none" }}
          onClick={() => setPopupMessage("장바구니 로직 연동 대기중!")}
        >
          장바구니 담기
        </button>
        <button 
          className="btn btn-primary" 
          style={{ flex: 1, padding: "1.25rem", fontSize: "1.125rem", borderRadius: "12px", fontWeight: 600 }}
          onClick={() => setPopupMessage("구매 로직 연동 대기중!")}
        >
          바로 구매하기
        </button>
      </div>

      {popupMessage && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div className="glass" style={{
            padding: "2rem",
            borderRadius: "20px",
            minWidth: "320px",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            animation: "fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>알림</h3>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
              {popupMessage}
            </p>
            <button 
              className="btn btn-primary" 
              style={{ width: "100%", padding: "0.75rem", borderRadius: "12px" }}
              onClick={() => setPopupMessage(null)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/app/actions/cart";
import { useRouter } from "next/navigation";

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

type PopupState = {
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  showCancel?: boolean;
} | null;

export default function ProductActions({ product }: ProductActionsProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");
  const [popup, setPopup] = useState<PopupState>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const selectedOption = product.options.find((opt) => opt.id === selectedOptionId);
  const totalPrice = product.price + (selectedOption ? selectedOption.addPrice : 0);

  const handleAddToCart = () => {
    if (product.options.length > 0 && !selectedOptionId) {
      setPopup({ message: "옵션을 먼저 선택해주세요." });
      return;
    }

    startTransition(async () => {
      const res = await addToCart(product.id, selectedOptionId || null, 1);
      if (res.success) {
        setPopup({
          message: "장바구니에 상품이 담겼습니다.\n장바구니로 이동하시겠습니까?",
          showCancel: true,
          confirmText: "장바구니 이동",
          onConfirm: () => {
            setPopup(null);
            router.push("/cart");
          }
        });
      } else {
        if (res.error === "로그인이 필요합니다.") {
          setPopup({
            message: "로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?",
            showCancel: true,
            confirmText: "로그인 이동",
            onConfirm: () => {
              window.location.href = `https://auth.minstudio.app/login?redirect=${encodeURIComponent(window.location.href)}`;
            }
          });
        } else {
          setPopup({ message: res.error || "오류가 발생했습니다." });
        }
      }
    });
  };

  const handleBuyNow = () => {
    if (product.options.length > 0 && !selectedOptionId) {
      setPopup({ message: "옵션을 먼저 선택해주세요." });
      return;
    }

    startTransition(async () => {
      const res = await addToCart(product.id, selectedOptionId || null, 1);
      if (res.success) {
        // 바로 결제 페이지로 이동
        router.push("/checkout");
      } else {
        if (res.error === "로그인이 필요합니다.") {
          setPopup({
            message: "로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?",
            showCancel: true,
            confirmText: "로그인 이동",
            onConfirm: () => {
              window.location.href = `https://auth.minstudio.app/login?redirect=${encodeURIComponent(window.location.href)}`;
            }
          });
        } else {
          setPopup({ message: res.error || "오류가 발생했습니다." });
        }
      }
    });
  };

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
          disabled={isPending}
          style={{ flex: 1, padding: "1.25rem", fontSize: "1.125rem", borderRadius: "12px", fontWeight: 600, background: isPending ? "#4b5563" : "#1f2937", color: "white", border: "none", cursor: isPending ? "not-allowed" : "pointer" }}
          onClick={handleAddToCart}
        >
          {isPending ? "처리중..." : "장바구니 담기"}
        </button>
        <button 
          className="btn btn-primary" 
          disabled={isPending}
          style={{ flex: 1, padding: "1.25rem", fontSize: "1.125rem", borderRadius: "12px", fontWeight: 600, background: isPending ? "#4b5563" : "var(--accent-color)", opacity: isPending ? 0.8 : 1, cursor: isPending ? "not-allowed" : "pointer", border: "none" }}
          onClick={handleBuyNow}
        >
          {isPending ? "처리중..." : "바로 구매하기"}
        </button>
      </div>

      {popup && (
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
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            animation: "fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>알림</h3>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "2rem", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
              {popup.message}
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              {popup.showCancel && (
                <button 
                  className="btn" 
                  style={{ flex: 1, padding: "0.75rem", borderRadius: "12px", background: "var(--bg-color)", color: "var(--text-primary)", border: "1px solid var(--glass-border)" }}
                  onClick={() => setPopup(null)}
                >
                  취소
                </button>
              )}
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: "0.75rem", borderRadius: "12px" }}
                onClick={() => {
                  if (popup.onConfirm) popup.onConfirm();
                  else setPopup(null);
                }}
              >
                {popup.confirmText || "확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

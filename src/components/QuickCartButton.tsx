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

type Props = {
  product: {
    id: string;
    options: Option[];
  };
};

type PopupState = {
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  showCancel?: boolean;
} | null;

export default function QuickCartButton({ product }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [popup, setPopup] = useState<PopupState>(null);
  const router = useRouter();

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(false);
    setSelectedOptionId("");
    setPopup(null);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.options.length > 0 && !selectedOptionId) {
      setPopup({ message: "옵션을 선택해주세요." });
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

  return (
    <>
      <button className="btn-icon" aria-label="장바구니 담기" onClick={handleOpen}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }} onClick={handleClose}>
          <div className="glass" style={{
            padding: "2rem", borderRadius: "20px", minWidth: "320px", maxWidth: "400px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            animation: "fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>옵션 선택</h3>
            
            {product.options.length > 0 ? (
              <select 
                className="glass" 
                style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--glass-border)", color: "var(--text-primary)", marginBottom: "1.5rem" }}
                value={selectedOptionId}
                onChange={(e) => setSelectedOptionId(e.target.value)}
              >
                <option value="">옵션을 선택해주세요</option>
                {product.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}: {opt.value} {opt.addPrice > 0 ? `(+₩${opt.addPrice.toLocaleString()})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>단일 옵션 상품입니다.</p>
            )}

            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn" style={{ flex: 1, padding: "0.75rem", borderRadius: "12px", background: "var(--bg-color)", color: "var(--text-primary)", border: "1px solid var(--glass-border)" }} onClick={handleClose}>
                취소
              </button>
              <button className="btn btn-primary" style={{ flex: 1, padding: "0.75rem", borderRadius: "12px" }} onClick={handleAddToCart} disabled={isPending}>
                {isPending ? "담는 중..." : "장바구니 담기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {popup && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1001
        }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <div className="glass" style={{
            padding: "2rem", borderRadius: "20px", minWidth: "320px", maxWidth: "400px", textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            animation: "fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>알림</h3>
            <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "2rem", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
              {popup.message}
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              {popup.showCancel && (
                <button 
                  className="btn" 
                  style={{ flex: 1, padding: "0.75rem", borderRadius: "12px", background: "var(--bg-color)", color: "var(--text-primary)", border: "1px solid var(--glass-border)" }}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPopup(null); }}
                >
                  취소
                </button>
              )}
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: "0.75rem", borderRadius: "12px" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (popup.onConfirm) popup.onConfirm();
                  else {
                    setPopup(null);
                    setIsOpen(false);
                  }
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

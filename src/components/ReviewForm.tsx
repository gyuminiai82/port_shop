"use client";

import { useState, useTransition } from "react";
import { createReview } from "@/app/(shop)/product/[id]/actions";

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [popup, setPopup] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setPopup({ message: "리뷰 내용을 입력해주세요.", type: "error" });
      return;
    }

    startTransition(async () => {
      const res = await createReview(productId, rating, content);
      if (res.success) {
        setContent("");
        setRating(5);
        setPopup({ message: "리뷰가 등록되었습니다!", type: "success" });
      } else {
        setPopup({ message: res.error || "오류가 발생했습니다.", type: "error" });
      }
    });
  };

  return (
    <>
      <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid var(--glass-border)", padding: "2rem", borderRadius: "24px", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>리뷰 작성하기</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* 별점 선택 */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>별점: </span>
            <div style={{ display: "flex", cursor: "pointer", fontSize: "1.5rem", color: "#fbbf24" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  onClick={() => setRating(star)}
                  style={{ color: star <= rating ? "#fbbf24" : "#e5e7eb" }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* 리뷰 내용 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="상품에 대한 솔직한 리뷰를 남겨주세요!"
            rows={4}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid var(--glass-border)",
              background: "white",
              fontSize: "1rem",
              resize: "vertical",
              fontFamily: "inherit"
            }}
            disabled={isPending}
          />

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isPending || !content.trim()}
            style={{
              alignSelf: "flex-end",
              background: "var(--accent-color)",
              color: "white",
              border: "none",
              padding: "0.75rem 2rem",
              borderRadius: "99px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: (isPending || !content.trim()) ? "not-allowed" : "pointer",
              opacity: (isPending || !content.trim()) ? 0.6 : 1,
              transition: "all 0.2s"
            }}
          >
            {isPending ? "등록 중..." : "리뷰 등록"}
          </button>
        </form>
      </div>

      {/* 디자인 커스텀 팝업 (모달) */}
      {popup && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          animation: "fadeIn 0.2s ease-out"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "2.5rem 2rem",
            borderRadius: "24px",
            minWidth: "320px",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.5)",
            transform: "translateY(0)",
            animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <div style={{ 
              fontSize: "3rem", 
              marginBottom: "1rem",
              animation: "bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)" 
            }}>
              {popup.type === 'success' ? '✨' : '⚠️'}
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              {popup.type === 'success' ? '성공' : '알림'}
            </h3>
            <p style={{ marginBottom: "2rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {popup.message}
            </p>
            <button 
              onClick={() => setPopup(null)}
              style={{
                width: "100%",
                background: "var(--accent-color)",
                color: "white",
                border: "none",
                padding: "1rem",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.filter = "brightness(1.1)"}
              onMouseOut={(e) => e.currentTarget.style.filter = "brightness(1)"}
            >
              확인
            </button>
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes bounceIn { 
              0% { transform: scale(0.5); opacity: 0; }
              50% { transform: scale(1.2); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

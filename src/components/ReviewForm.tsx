"use client";

import { useState, useTransition } from "react";
import { createReview } from "@/app/(shop)/product/[id]/actions";

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    startTransition(async () => {
      const res = await createReview(productId, rating, content);
      if (res.success) {
        setContent("");
        setRating(5);
        alert("리뷰가 등록되었습니다!");
      } else {
        alert(res.error || "오류가 발생했습니다.");
      }
    });
  };

  return (
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
  );
}

"use client";

import { useRef, useState, useTransition } from "react";
import { createInquiry } from "@/app/actions/inquiry";

export default function InquiryFormClient() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await createInquiry(formData);
      if (res.success) {
        setPopupMessage("문의가 등록되었습니다.");
        formRef.current?.reset();
      } else {
        setPopupMessage(res.error || "오류가 발생했습니다.");
      }
    });
  };

  return (
    <div style={{ background: "rgba(0,0,0,0.02)", padding: "2rem", borderRadius: "16px", marginBottom: "3rem", border: "1px solid var(--glass-border)" }}>
      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>새 문의 작성</h3>
      
      <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>문의 유형</label>
          <select name="type" required className="glass" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--glass-border)", color: "var(--text-primary)", appearance: "none" }}>
            <option value="">선택해주세요</option>
            <option value="배송">배송</option>
            <option value="교환/반품">교환/반품</option>
            <option value="상품">상품</option>
            <option value="기타">기타</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>제목</label>
          <input type="text" name="title" required className="glass" placeholder="제목을 입력해주세요" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>내용</label>
          <textarea name="content" required className="glass" placeholder="문의 내용을 자세히 적어주세요" rows={5} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--glass-border)", color: "var(--text-primary)", resize: "vertical" }}></textarea>
        </div>
        
        <button type="submit" disabled={isPending} className="btn btn-primary" style={{ padding: "1rem", borderRadius: "12px", fontWeight: 600, marginTop: "0.5rem", opacity: isPending ? 0.7 : 1 }}>
          {isPending ? "등록 중..." : "문의 등록하기"}
        </button>
      </form>

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
    </div>
  );
}

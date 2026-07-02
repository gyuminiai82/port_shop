"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type InquiryUser = {
  name: string | null;
  email: string;
};

type Inquiry = {
  id: string;
  userId: string;
  user: InquiryUser | null;
  type: string;
  title: string;
  content: string;
  status: string;
  answer: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function InquiryListClient({ inquiries, currentPage, totalPages, searchQuery }: { inquiries: Inquiry[], currentPage: number, totalPages: number, searchQuery: string }) {
  const router = useRouter();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/inquiries?page=1&q=${encodeURIComponent(searchInput)}`);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "DELIVERY": return "배송";
      case "RETURN": return "교환/반품";
      case "PRODUCT": return "상품 문의";
      case "OTHER": return "기타";
      default: return type;
    }
  };

  const openModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setAnswerInput(inquiry.answer || "");
  };

  const closeModal = () => {
    setSelectedInquiry(null);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedInquiry) return;
    if (!answerInput.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answerInput })
      });

      if (!res.ok) {
        throw new Error("저장에 실패했습니다.");
      }

      closeModal();
      router.refresh(); // 최신 데이터 다시 불러오기
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="glass" style={{ background: "white", padding: "1.5rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
        
        {/* 검색창 */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="제목, 이름, 이메일 검색"
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

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px", textAlign: "left", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f3f4f6", color: "var(--text-secondary)" }}>
                <th style={{ width: "10%", padding: "1rem", fontWeight: 600, whiteSpace: "nowrap" }}>상태</th>
                <th style={{ width: "10%", padding: "1rem", fontWeight: 600, whiteSpace: "nowrap" }}>문의 유형</th>
                <th style={{ width: "35%", padding: "1rem", fontWeight: 600, whiteSpace: "nowrap" }}>제목</th>
                <th style={{ width: "10%", padding: "1rem", fontWeight: 600, whiteSpace: "nowrap" }}>이름</th>
                <th style={{ width: "15%", padding: "1rem", fontWeight: 600, whiteSpace: "nowrap" }}>이메일</th>
                <th style={{ width: "10%", padding: "1rem", fontWeight: 600, whiteSpace: "nowrap" }}>작성일</th>
                <th style={{ width: "10%", padding: "1rem", fontWeight: 600, textAlign: "right", whiteSpace: "nowrap" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>등록된 문의가 없습니다.</td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "1rem", whiteSpace: "nowrap" }}>
                      {inquiry.status === "ANSWERED" ? (
                        <span style={{ fontSize: "0.875rem", background: "#dcfce7", color: "#166534", padding: "0.25rem 0.5rem", borderRadius: "4px", fontWeight: 600 }}>답변완료</span>
                      ) : (
                        <span style={{ fontSize: "0.875rem", background: "#fef3c7", color: "#92400e", padding: "0.25rem 0.5rem", borderRadius: "4px", fontWeight: 600 }}>답변대기</span>
                      )}
                    </td>
                    <td style={{ padding: "1rem", whiteSpace: "nowrap", color: "var(--text-secondary)" }}>
                      {getTypeLabel(inquiry.type)}
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 500 }}>
                      <div style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {inquiry.title}
                      </div>
                    </td>
                    <td style={{ padding: "1rem", whiteSpace: "nowrap", fontWeight: 600 }}>
                      {inquiry.user?.name || "이름 없음"}
                    </td>
                    <td style={{ padding: "1rem", whiteSpace: "nowrap", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                      {inquiry.user?.email || "-"}
                    </td>
                    <td style={{ padding: "1rem", whiteSpace: "nowrap", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right", whiteSpace: "nowrap" }}>
                      <button 
                        onClick={() => openModal(inquiry)}
                        style={{ padding: "0.5rem 1rem", background: "white", border: "1px solid var(--glass-border)", borderRadius: "8px", cursor: "pointer", fontWeight: 600, color: "var(--text-primary)" }}
                      >
                        상세 / 답변
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 컨트롤 */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "2rem" }}>
            <button 
              onClick={() => router.push(`/admin/inquiries?page=${Math.max(1, currentPage - 1)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`)}
              disabled={currentPage === 1}
              style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              이전
            </button>
            
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => router.push(`/admin/inquiries?page=${pageNum}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`)}
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
              onClick={() => router.push(`/admin/inquiries?page=${Math.min(totalPages, currentPage + 1)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`)}
              disabled={currentPage === totalPages}
              style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              다음
            </button>
          </div>
        )}
      </div>

      {/* 답변 모달 */}
      {selectedInquiry && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div className="glass" style={{
            background: "white",
            padding: "2rem",
            borderRadius: "16px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            animation: "slideIn 0.2s ease-out"
          }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>
              문의 내용 및 답변 작성
            </h2>

            <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", background: "#e5e7eb", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 600 }}>{getTypeLabel(selectedInquiry.type)}</span>
                <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>{selectedInquiry.title}</h3>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: "#374151", whiteSpace: "pre-wrap" }}>
                {selectedInquiry.content}
              </p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>관리자 답변</label>
              <textarea 
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="답변 내용을 상세히 입력해주세요."
                style={{ width: "100%", height: "150px", padding: "1rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fdfdfd", outline: "none", resize: "vertical", fontFamily: "inherit", fontSize: "0.9375rem" }}
                onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button 
                onClick={closeModal}
                disabled={isSubmitting}
                style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "#f3f4f6", fontWeight: 600, cursor: "pointer" }}
              >
                닫기
              </button>
              <button 
                onClick={handleSubmitAnswer}
                disabled={isSubmitting}
                style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none", background: "var(--accent-color)", color: "white", fontWeight: 600, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? "저장 중..." : "답변 저장 (완료처리)"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

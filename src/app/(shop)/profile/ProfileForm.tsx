"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/profile";
import { useRouter } from "next/navigation";

type UserData = {
  name: string | null;
  email: string;
  phone: string | null;
  zipcode: string | null;
  address: string | null;
  detailAddress: string | null;
};

export default function ProfileForm({ initialData }: { initialData: UserData }) {
  const [formData, setFormData] = useState({
    phone: initialData.phone || "",
    zipcode: initialData.zipcode || "",
    address: initialData.address || "",
    detailAddress: initialData.detailAddress || ""
  });
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    startTransition(async () => {
      const res = await updateProfile(formData);
      if (res.success) {
        setMessage({ type: "success", text: "개인정보가 성공적으로 수정되었습니다." });
        router.refresh();
      } else {
        setMessage({ type: "error", text: res.error || "수정 중 오류가 발생했습니다." });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem" }}>이름 (수정 불가)</label>
          <input 
            type="text" 
            value={initialData.name || ""} 
            disabled 
            style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.02)", color: "var(--text-secondary)" }} 
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem" }}>이메일 (수정 불가)</label>
          <input 
            type="email" 
            value={initialData.email} 
            disabled 
            style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.02)", color: "var(--text-secondary)" }} 
          />
        </div>
      </div>

      <div style={{ width: "100%", height: "1px", background: "var(--glass-border)", margin: "1rem 0" }}></div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="phone" style={{ fontWeight: 600 }}>연락처</label>
        <input 
          id="phone"
          name="phone"
          type="text" 
          placeholder="010-0000-0000"
          value={formData.phone}
          onChange={handleChange}
          style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)", color: "var(--text-primary)" }} 
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="zipcode" style={{ fontWeight: 600 }}>우편번호</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input 
            id="zipcode"
            name="zipcode"
            type="text" 
            placeholder="우편번호"
            value={formData.zipcode}
            onChange={handleChange}
            style={{ width: "150px", padding: "1rem", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)", color: "var(--text-primary)" }} 
          />
          {/* 주소 검색 API 등 연동을 위한 빈 버튼 영역 */}
          <button type="button" className="btn btn-secondary" style={{ padding: "0 1.5rem", borderRadius: "12px" }}>우편번호 검색</button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="address" style={{ fontWeight: 600 }}>기본 주소</label>
        <input 
          id="address"
          name="address"
          type="text" 
          placeholder="도로명/지번 주소"
          value={formData.address}
          onChange={handleChange}
          style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)", color: "var(--text-primary)" }} 
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="detailAddress" style={{ fontWeight: 600 }}>상세 주소</label>
        <input 
          id="detailAddress"
          name="detailAddress"
          type="text" 
          placeholder="상세 주소를 입력해주세요"
          value={formData.detailAddress}
          onChange={handleChange}
          style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--glass-border)", background: "var(--glass-bg)", color: "var(--text-primary)" }} 
        />
      </div>

      {message.text && (
        <div style={{ 
          padding: "1rem", 
          borderRadius: "12px", 
          marginTop: "1rem",
          background: message.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
          color: message.type === "success" ? "#059669" : "#dc2626",
          fontWeight: 500,
          textAlign: "center"
        }}>
          {message.text}
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={isPending}
        style={{ padding: "1.25rem", borderRadius: "12px", fontSize: "1.125rem", fontWeight: 700, marginTop: "2rem", border: "none", cursor: isPending ? "not-allowed" : "pointer" }}
      >
        {isPending ? "저장 중..." : "변경사항 저장"}
      </button>

    </form>
  );
}

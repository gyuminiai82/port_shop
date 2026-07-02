"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/profile";
import { useRouter } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    daum: any;
  }
}

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
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const router = useRouter();

  const handleCompletePostcode = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }

    setFormData(prev => ({
      ...prev,
      zipcode: data.zonecode,
      address: fullAddress,
    }));
    
    setIsPostcodeOpen(false);
  };

  const openPostcode = () => {
    setIsPostcodeOpen(true);
    // 상태 변경 후 DOM 렌더링을 기다린 후 embed 실행
    setTimeout(() => {
      const container = document.getElementById('daum-postcode-container');
      if (container && window.daum && window.daum.Postcode) {
        new window.daum.Postcode({
          oncomplete: handleCompletePostcode,
          width: '100%',
          height: '100%'
        }).embed(container);
      }
    }, 100);
  };

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
    <>
    <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem" }}>이름 (수정 불가)</label>
          <input 
            type="text" 
            value={initialData.name || ""} 
            disabled 
            style={{ padding: "1rem", borderRadius: "12px", border: "1px solid #e5e7eb", background: "#f9fafb", color: "var(--text-secondary)" }} 
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.875rem" }}>이메일 (수정 불가)</label>
          <input 
            type="email" 
            value={initialData.email} 
            disabled 
            style={{ padding: "1rem", borderRadius: "12px", border: "1px solid #e5e7eb", background: "#f9fafb", color: "var(--text-secondary)" }} 
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
          style={{ padding: "1rem", borderRadius: "12px", border: "1px solid #d1d5db", background: "white", color: "var(--text-primary)", boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)" }} 
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
            style={{ width: "150px", padding: "1rem", borderRadius: "12px", border: "1px solid #d1d5db", background: "white", color: "var(--text-primary)", boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)" }} 
          />
          <button type="button" onClick={openPostcode} className="btn btn-secondary" style={{ padding: "0 1.5rem", borderRadius: "12px", background: "white", border: "1px solid #d1d5db", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-color)"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#d1d5db"}>우편번호 검색</button>
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
          style={{ padding: "1rem", borderRadius: "12px", border: "1px solid #d1d5db", background: "white", color: "var(--text-primary)", boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)" }} 
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
          style={{ padding: "1rem", borderRadius: "12px", border: "1px solid #d1d5db", background: "white", color: "var(--text-primary)", boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.05)" }} 
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

    {/* 우편번호 디자인 모달 */}
    {isPostcodeOpen && (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "16px", width: "100%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1f2937" }}>우편번호 검색</h2>
            <button onClick={() => setIsPostcodeOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#6b7280" }}>&times;</button>
          </div>
          {/* Daum Postcode가 임베드될 컨테이너 */}
          <div id="daum-postcode-container" style={{ width: "100%", height: "400px", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}></div>
        </div>
      </div>
    )}
    </>
  );
}

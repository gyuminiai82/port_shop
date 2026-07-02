"use client";

import React, { useState, useEffect } from "react";

export interface RoleData {
  id?: string;
  name: string;
  permissions: string[];
}

interface RoleFormModalProps {
  isOpen: boolean;
  initialData?: RoleData | null;
  onClose: () => void;
  onSave: (data: RoleData) => Promise<void>;
}

export const AVAILABLE_PERMISSIONS = [
  { id: "PRODUCTS", label: "상품 및 카테고리 관리" },
  { id: "ORDERS", label: "주문 관리" },
  { id: "POINTS", label: "포인트 내역 관리" },
  { id: "INQUIRIES", label: "문의 관리" },
  { id: "USERS", label: "회원 관리" },
  { id: "MANAGERS", label: "운영진 관리" },
];

export default function RoleFormModal({ isOpen, initialData, onClose, onSave }: RoleFormModalProps) {
  const [formData, setFormData] = useState<RoleData>({
    name: "",
    permissions: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        permissions: initialData.permissions || []
      });
    } else {
      setFormData({
        name: "",
        permissions: []
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionToggle = (permId: string) => {
    setFormData(prev => {
      const perms = prev.permissions;
      if (perms.includes(permId)) {
        return { ...prev, permissions: perms.filter(p => p !== permId) };
      } else {
        return { ...prev, permissions: [...perms, permId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!initialData?.id;

  return (
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
        maxWidth: "500px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        animation: "slideIn 0.2s ease-out"
      }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          {isEditMode ? "역할 수정" : "새 역할 등록"}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>역할명 (Role Name)</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="예: 상품 관리자"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fdfdfd", outline: "none" }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>해당 역할의 메뉴 접근 권한</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {AVAILABLE_PERMISSIONS.map(perm => (
                <label key={perm.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem" }}>
                  <input 
                    type="checkbox"
                    checked={formData.permissions.includes(perm.id)}
                    onChange={() => handlePermissionToggle(perm.id)}
                    style={{ cursor: "pointer", width: "1.125rem", height: "1.125rem" }}
                  />
                  {perm.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#f3f4f6", fontWeight: 600, cursor: "pointer" }}
            >
              취소
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none", background: "var(--accent-color)", color: "white", fontWeight: 600, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

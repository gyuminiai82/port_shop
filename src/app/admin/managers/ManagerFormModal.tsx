"use client";

import React, { useState, useEffect } from "react";

export interface ManagerData {
  id?: string;
  email: string;
  password?: string;
  name: string;
  roleId: string | null;
}

interface ManagerFormModalProps {
  isOpen: boolean;
  initialData?: ManagerData | null;
  roles: any[];
  onClose: () => void;
  onSave: (data: ManagerData) => Promise<void>;
}

export default function ManagerFormModal({ isOpen, initialData, roles, onClose, onSave }: ManagerFormModalProps) {
  const [formData, setFormData] = useState<ManagerData>({
    email: "",
    password: "",
    name: "",
    roleId: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        email: initialData.email,
        password: "", // 수정 시 비밀번호는 비워둠
        name: initialData.name,
        roleId: initialData.roleId || null
      });
    } else {
      setFormData({
        email: "",
        password: "",
        name: "",
        roleId: null
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        maxWidth: "400px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        animation: "slideIn 0.2s ease-out"
      }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>
          {isEditMode ? "운영진 수정" : "새 운영진 등록"}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>이메일 (ID)</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isEditMode}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", background: isEditMode ? "#f3f4f6" : "#fdfdfd", outline: "none" }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>이름</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fdfdfd", outline: "none" }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              {isEditMode ? "비밀번호 (변경시에만 입력)" : "비밀번호"}
            </label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditMode}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fdfdfd", outline: "none" }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>부여할 역할 (Role)</label>
            <select 
              name="roleId"
              value={formData.roleId || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", background: "#fdfdfd" }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent-color)"}
              onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
            >
              <option value="">역할을 선택하세요</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
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

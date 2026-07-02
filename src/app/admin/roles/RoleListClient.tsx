"use client";

import React, { useState, useEffect } from "react";
import RoleFormModal, { RoleData } from "./RoleFormModal";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function RoleListClient() {
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/roles");
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreate = () => {
    setEditingRole(null);
    setIsFormOpen(true);
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleSave = async (data: RoleData) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/roles/${data.id}` : "/api/admin/roles";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "저장에 실패했습니다.");
    }

    await fetchRoles();
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/roles/${deletingId}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "삭제에 실패했습니다.");
      } else {
        await fetchRoles();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="glass" style={{ padding: "2rem", borderRadius: "24px", background: "white", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>역할 목록</h2>
        <button 
          onClick={handleCreate}
          style={{ padding: "0.75rem 1.5rem", background: "var(--accent-color)", color: "white", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
        >
          새 역할 생성
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>로딩 중...</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left" }}>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>역할명</th>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>부여된 권한</th>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>소속 운영진 수</th>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600, textAlign: "right" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "1rem", fontWeight: 700 }}>{role.name}</td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                      {role.permissions.map((p: string) => (
                        <span key={p} style={{ fontSize: "0.75rem", background: "#f3f4f6", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                          {p}
                        </span>
                      ))}
                      {role.permissions.length === 0 && <span style={{ fontSize: "0.875rem", color: "#ef4444" }}>권한 없음</span>}
                    </div>
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                    {role._count?.admins || 0}명
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <button 
                      onClick={() => handleEdit(role)}
                      style={{ padding: "0.5rem 1rem", background: "#f3f4f6", border: "1px solid var(--glass-border)", borderRadius: "8px", cursor: "pointer", marginRight: "0.5rem", fontWeight: 500 }}
                    >
                      수정
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(role.id)}
                      style={{ padding: "0.5rem 1rem", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>등록된 역할이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <RoleFormModal 
        isOpen={isFormOpen} 
        initialData={editingRole} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSave} 
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="역할 삭제"
        message="정말로 이 역할을 삭제하시겠습니까? 이 역할이 부여된 운영자가 있을 경우 삭제가 불가능합니다."
        confirmText="삭제"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}

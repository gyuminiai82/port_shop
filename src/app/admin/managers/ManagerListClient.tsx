"use client";

import React, { useState, useEffect } from "react";
import ManagerFormModal, { ManagerData } from "./ManagerFormModal";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function ManagerListClient() {
  const [managers, setManagers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<ManagerData | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [mgrRes, rolesRes] = await Promise.all([
        fetch("/api/admin/managers"),
        fetch("/api/admin/roles")
      ]);
      
      if (mgrRes.ok) {
        const mgrData = await mgrRes.json();
        setManagers(mgrData);
      }
      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(rolesData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setEditingManager(null);
    setIsFormOpen(true);
  };

  const handleEdit = (manager: any) => {
    setEditingManager(manager);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleSave = async (data: ManagerData) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/managers/${data.id}` : "/api/admin/managers";
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

    await fetchData();
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/managers/${deletingId}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "삭제에 실패했습니다.");
      } else {
        await fetchData();
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
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>운영진 목록</h2>
        <button 
          onClick={handleCreate}
          style={{ padding: "0.75rem 1.5rem", background: "var(--accent-color)", color: "white", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
        >
          새 운영진 등록
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>로딩 중...</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9", textAlign: "left" }}>
                <th style={{ width: "20%", padding: "1rem", color: "var(--text-secondary)", fontWeight: 600, whiteSpace: "nowrap" }}>이름</th>
                <th style={{ width: "25%", padding: "1rem", color: "var(--text-secondary)", fontWeight: 600, whiteSpace: "nowrap" }}>이메일(ID)</th>
                <th style={{ width: "20%", padding: "1rem", color: "var(--text-secondary)", fontWeight: 600, whiteSpace: "nowrap" }}>부여된 역할(Role)</th>
                <th style={{ width: "15%", padding: "1rem", color: "var(--text-secondary)", fontWeight: 600, whiteSpace: "nowrap" }}>가입일</th>
                <th style={{ width: "20%", padding: "1rem", color: "var(--text-secondary)", fontWeight: 600, textAlign: "right", whiteSpace: "nowrap" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {managers.map(manager => (
                <tr key={manager.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "1rem", fontWeight: 500, whiteSpace: "nowrap" }}>
                    {manager.name}
                    {manager.isSuperAdmin && <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", background: "#fef08a", color: "#854d0e", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 700 }}>최고관리자</span>}
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{manager.email}</td>
                  <td style={{ padding: "1rem", whiteSpace: "nowrap" }}>
                    {manager.adminRole ? (
                      <span style={{ fontSize: "0.875rem", background: "#f3f4f6", padding: "0.4rem 0.75rem", borderRadius: "8px", fontWeight: 600 }}>
                        {manager.adminRole.name}
                      </span>
                    ) : manager.isSuperAdmin ? (
                      <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 700 }}>모든 권한</span>
                    ) : (
                      <span style={{ fontSize: "0.875rem", color: "#ef4444" }}>역할 없음</span>
                    )}
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                    {new Date(manager.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right", whiteSpace: "nowrap" }}>
                    <button 
                      onClick={() => handleEdit(manager)}
                      style={{ padding: "0.5rem 1rem", background: "#f3f4f6", border: "1px solid var(--glass-border)", borderRadius: "8px", cursor: "pointer", marginRight: "0.5rem", fontWeight: 500 }}
                    >
                      수정
                    </button>
                    {!manager.isSuperAdmin && (
                      <button 
                        onClick={() => handleDeleteClick(manager.id)}
                        style={{ padding: "0.5rem 1rem", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}
                      >
                        삭제
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {managers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>등록된 운영진이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ManagerFormModal 
        isOpen={isFormOpen} 
        initialData={editingManager} 
        roles={roles}
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSave} 
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="운영진 삭제"
        message="정말로 이 관리자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}

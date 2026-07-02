"use client";

import React, { useState, useEffect } from "react";
import ManagerFormModal, { ManagerData } from "./ManagerFormModal";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function ManagerListClient() {
  const [managers, setManagers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<ManagerData | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchManagers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/managers");
      if (res.ok) {
        const data = await res.json();
        setManagers(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
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

    await fetchManagers();
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/managers/${deletingId}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "삭제에 실패했습니다.");
      } else {
        await fetchManagers();
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
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left" }}>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>이름</th>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>이메일(ID)</th>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>권한</th>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>가입일</th>
                <th style={{ padding: "1rem", color: "var(--text-secondary)", fontWeight: 600, textAlign: "right" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {managers.map(manager => (
                <tr key={manager.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "1rem", fontWeight: 500 }}>
                    {manager.name}
                    {manager.isSuperAdmin && <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", background: "#fef08a", color: "#854d0e", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 700 }}>최고관리자</span>}
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{manager.email}</td>
                  <td style={{ padding: "1rem" }}>
                    {manager.isSuperAdmin ? (
                      <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>모든 권한</span>
                    ) : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                        {manager.permissions.map((p: string) => (
                          <span key={p} style={{ fontSize: "0.75rem", background: "#f3f4f6", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                            {p}
                          </span>
                        ))}
                        {manager.permissions.length === 0 && <span style={{ fontSize: "0.875rem", color: "#ef4444" }}>권한 없음</span>}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>
                    {new Date(manager.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
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

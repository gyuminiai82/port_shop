"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
};

export default function CategoryListClient({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  
  // 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // 폼 상태
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 새 카테고리 모달 열기
  const openAddModal = () => {
    setCategoryName("");
    setIsAddModalOpen(true);
  };

  // 수정 모달 열기
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsAddModalOpen(false);
    setSelectedCategory(null);
    setCategoryName("");
  };

  // 카테고리 추가 저장
  const handleAddSubmit = async () => {
    if (!categoryName.trim()) {
      alert("카테고리명을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName })
      });

      if (!res.ok) throw new Error("저장에 실패했습니다.");

      closeModal();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 카테고리 수정 저장
  const handleEditSubmit = async () => {
    if (!selectedCategory) return;
    if (!categoryName.trim()) {
      alert("카테고리명을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName })
      });

      if (!res.ok) throw new Error("저장에 실패했습니다.");

      closeModal();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 카테고리 삭제
  const handleDelete = async () => {
    if (!selectedCategory) return;
    if (!confirm(`정말로 '${selectedCategory.name}' 카테고리를 삭제하시겠습니까?\n해당 카테고리의 상품들은 카테고리 미지정 상태로 변경됩니다.`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("삭제에 실패했습니다.");

      closeModal();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>카테고리 관리</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>상품의 카테고리 계층 구조를 관리합니다.</p>
        </div>
        <button 
          onClick={openAddModal}
          style={{ padding: "0.75rem 1.5rem", background: "var(--accent-color)", color: "white", borderRadius: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}
        >
          + 새 카테고리 추가
        </button>
      </header>

      <div className="glass" style={{ background: "white", padding: "2rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", tableLayout: "fixed", minWidth: "800px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9", color: "#64748b" }}>
              <th style={{ width: "35%", padding: "1.5rem 1rem", fontWeight: 600, whiteSpace: "nowrap" }}>ID</th>
              <th style={{ width: "30%", padding: "1.5rem 1rem", fontWeight: 600 }}>카테고리명</th>
              <th style={{ width: "15%", padding: "1.5rem 1rem", fontWeight: 600, whiteSpace: "nowrap" }}>등록된 상품 수</th>
              <th style={{ width: "20%", padding: "1.5rem 1rem", fontWeight: 600, whiteSpace: "nowrap", textAlign: "right" }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {initialCategories.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>등록된 카테고리가 없습니다.</td>
              </tr>
            ) : (
              initialCategories.map((category) => (
                <tr key={category.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem", color: "#64748b", whiteSpace: "nowrap" }}>
                    <span title={category.id}>{category.id}</span>
                  </td>
                  <td style={{ padding: "1rem", fontWeight: 700, color: "#1f2937" }}>{category.name}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ padding: "0.25rem 0.75rem", borderRadius: "99px", background: "#f8f9fc", color: "#64748b", fontWeight: 600, fontSize: "0.875rem" }}>
                      {category._count?.products || 0}개
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <button 
                      onClick={() => openEditModal(category)}
                      style={{ padding: "0.5rem 1rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: 600, color: "#64748b", cursor: "pointer" }}
                    >
                      수정
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 새 카테고리 추가 모달 */}
      {isAddModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "16px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>새 카테고리 추가</h2>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>카테고리명</label>
              <input 
                type="text" 
                value={categoryName} 
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="카테고리 이름을 입력하세요"
                autoFocus
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.875rem" }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button 
                onClick={closeModal}
                disabled={isSubmitting}
                style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "white", fontWeight: 600, cursor: "pointer", color: "#4b5563" }}
              >
                취소
              </button>
              <button 
                onClick={handleAddSubmit}
                disabled={isSubmitting}
                style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", border: "none", background: "var(--accent-color)", color: "white", fontWeight: 600, cursor: "pointer" }}
              >
                {isSubmitting ? "저장 중..." : "저장하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 수정/삭제 모달 */}
      {selectedCategory && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "16px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem" }}>카테고리 수정</h2>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>카테고리명</label>
              <input 
                type="text" 
                value={categoryName} 
                onChange={(e) => setCategoryName(e.target.value)}
                autoFocus
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", fontSize: "0.875rem" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button 
                onClick={handleDelete}
                disabled={isSubmitting}
                style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", border: "none", background: "#fee2e2", color: "#b91c1c", fontWeight: 600, cursor: "pointer" }}
              >
                삭제
              </button>
              
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button 
                  onClick={closeModal}
                  disabled={isSubmitting}
                  style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "white", fontWeight: 600, cursor: "pointer", color: "#4b5563" }}
                >
                  취소
                </button>
                <button 
                  onClick={handleEditSubmit}
                  disabled={isSubmitting}
                  style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", border: "none", background: "var(--accent-color)", color: "white", fontWeight: 600, cursor: "pointer" }}
                >
                  {isSubmitting ? "저장 중..." : "수정하기"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

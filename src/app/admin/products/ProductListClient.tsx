"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductListClient({ 
  products, 
  categories, 
  currentPage, 
  totalPages, 
  currentCategoryId 
}: { 
  products: any[], 
  categories: any[], 
  currentPage: number, 
  totalPages: number, 
  currentCategoryId: string 
}) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(currentCategoryId);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    router.push(`/admin/products?page=1${categoryId ? `&categoryId=${categoryId}` : ''}`);
  };

  return (
    <div className="glass" style={{ background: "white", padding: "1.5rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
      {/* 카테고리 필터 */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
        <select 
          value={selectedCategory} 
          onChange={handleCategoryChange}
          style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", width: "200px" }}
        >
          <option value="">전체 카테고리</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", tableLayout: "fixed", minWidth: "800px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9", color: "#64748b" }}>
              <th style={{ width: "40%", padding: "1.5rem 1rem", fontWeight: 600 }}>상품 정보</th>
              <th style={{ width: "20%", padding: "1.5rem 1rem", fontWeight: 600 }}>카테고리</th>
              <th style={{ width: "15%", padding: "1.5rem 1rem", fontWeight: 600 }}>가격</th>
              <th style={{ width: "15%", padding: "1.5rem 1rem", fontWeight: 600 }}>재고</th>
              <th style={{ width: "10%", padding: "1.5rem 1rem", fontWeight: 600 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>등록된 상품이 없습니다.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: "64px", height: "64px", borderRadius: "12px", background: "#f8f9fc", position: "relative", overflow: "hidden" }}>
                        {product.images[0] ? (
                          <Image src={product.images[0].url} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="64px" />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "0.75rem" }}>No Img</div>
                        )}
                      </div>
                      <Link href={`/product/${product.id}`} style={{ fontWeight: 700, color: "#1f2937", textDecoration: "none" }}>
                        {product.name}
                      </Link>
                    </div>
                  </td>
                  <td style={{ padding: "1rem", color: "#64748b" }}>{product.category?.name || "미지정"}</td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#1f2937" }}>₩{product.price.toLocaleString()}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ padding: "0.25rem 0.75rem", borderRadius: "99px", background: product.stock > 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", color: product.stock > 0 ? "#16a34a" : "#dc2626", fontWeight: 600, fontSize: "0.875rem" }}>
                      {product.stock > 0 ? `${product.stock}개` : "품절"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <button style={{ padding: "0.5rem 1rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: 600, color: "#64748b", cursor: "pointer" }}>수정</button>
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
            onClick={() => router.push(`/admin/products?page=${Math.max(1, currentPage - 1)}${selectedCategory ? `&categoryId=${selectedCategory}` : ''}`)}
            disabled={currentPage === 1}
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            이전
          </button>
          
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => router.push(`/admin/products?page=${pageNum}${selectedCategory ? `&categoryId=${selectedCategory}` : ''}`)}
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
            onClick={() => router.push(`/admin/products?page=${Math.min(totalPages, currentPage + 1)}${selectedCategory ? `&categoryId=${selectedCategory}` : ''}`)}
            disabled={currentPage === totalPages}
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

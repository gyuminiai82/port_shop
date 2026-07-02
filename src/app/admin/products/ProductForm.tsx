"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type ProductFormProps = {
  initialData?: any;
  categories: any[];
};

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    categoryId: initialData?.categoryId || "",
    description: initialData?.description || "",
  });

  const [images, setImages] = useState<string[]>(
    initialData?.images?.length > 0 
      ? initialData.images.map((img: any) => img.url) 
      : []
  );

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("files", e.target.files[i]);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("업로드 실패");
      const data = await res.json();
      
      setImages(prev => {
        const filtered = prev.filter(url => url.trim() !== "");
        return [...filtered, ...data.urls];
      });
    } catch (error) {
      console.error(error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImageField = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' || name === 'stock' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || formData.price < 0 || formData.stock < 0) {
      alert("필수 항목을 올바르게 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = isEditing ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, images: images.filter(url => url.trim() !== "") })
      });

      if (!res.ok) throw new Error("저장에 실패했습니다.");

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass" style={{ background: "white", padding: "2rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#374151" }}>상품명 *</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#374151" }}>카테고리 *</label>
            <select 
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" }}
            >
              <option value="">카테고리 선택</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#374151" }}>가격 (원) *</label>
            <input 
              type="number" 
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#374151" }}>기본 재고 *</label>
            <input 
              type="number" 
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#374151" }}>상품 이미지 (첫 번째는 대표 이미지, 나머지는 하단 상세 이미지)</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
            {images.filter(url => url.trim() !== "").map((img, index) => (
              <div key={index} style={{ position: "relative", width: "120px", height: "120px", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`preview ${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button 
                  type="button" 
                  onClick={() => removeImageField(index)}
                  style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold" }}
                >
                  X
                </button>
                {index === 0 && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "var(--accent-color)", color: "white", fontSize: "0.7rem", fontWeight: "bold", textAlign: "center", padding: "2px 0" }}>대표 이미지</div>
                )}
              </div>
            ))}
            
            {/* 업로드 버튼 */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{ width: "120px", height: "120px", borderRadius: "12px", border: "2px dashed #d1d5db", background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: isUploading ? "not-allowed" : "pointer", opacity: isUploading ? 0.5 : 1 }}
            >
              <div style={{ fontSize: "1.5rem", color: "#9ca3af", marginBottom: "0.25rem" }}>{isUploading ? "⏳" : "📸"}</div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 600 }}>{isUploading ? "업로드 중..." : "이미지 추가"}</div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#374151" }}>상품 설명</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ width: "100%", height: "150px", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <button 
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "1px solid #d1d5db", background: "white", fontWeight: 600, cursor: "pointer", color: "#4b5563" }}
          >
            취소
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            style={{ padding: "0.75rem 2rem", borderRadius: "8px", border: "none", background: "var(--accent-color)", color: "white", fontWeight: 600, cursor: "pointer" }}
          >
            {isSubmitting ? "저장 중..." : "상품 저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

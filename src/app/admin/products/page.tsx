import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await prisma.mIN_PRODUCT.findMany({
    include: {
      category: true,
      images: {
        where: { isMain: true },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1f2937" }}>상품 관리</h1>
        <button style={{ padding: "0.75rem 1.5rem", background: "var(--accent-color)", color: "white", borderRadius: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}>
          + 새 상품 등록
        </button>
      </div>

      <div style={{ background: "white", borderRadius: "24px", padding: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9", color: "#64748b" }}>
              <th style={{ padding: "1.5rem 1rem", fontWeight: 600 }}>상품 정보</th>
              <th style={{ padding: "1.5rem 1rem", fontWeight: 600 }}>카테고리</th>
              <th style={{ padding: "1.5rem 1rem", fontWeight: 600 }}>가격</th>
              <th style={{ padding: "1.5rem 1rem", fontWeight: 600 }}>재고</th>
              <th style={{ padding: "1.5rem 1rem", fontWeight: 600 }}>관리</th>
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
    </div>
  );
}

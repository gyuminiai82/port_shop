import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.mIN_CATEGORY.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { id: 'asc' }
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1f2937" }}>카테고리 관리</h1>
        <button style={{ padding: "0.75rem 1.5rem", background: "var(--accent-color)", color: "white", borderRadius: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}>
          + 새 카테고리 추가
        </button>
      </div>

      <div style={{ background: "white", borderRadius: "24px", padding: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9", color: "#64748b" }}>
              <th style={{ padding: "1.5rem 1rem", fontWeight: 600 }}>ID</th>
              <th style={{ padding: "1.5rem 1rem", fontWeight: 600 }}>카테고리명</th>
              <th style={{ padding: "1.5rem 1rem", fontWeight: 600 }}>등록된 상품 수</th>
              <th style={{ padding: "1.5rem 1rem", fontWeight: 600 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>등록된 카테고리가 없습니다.</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem", color: "#64748b" }}>{category.id}</td>
                  <td style={{ padding: "1rem", fontWeight: 700, color: "#1f2937" }}>{category.name}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ padding: "0.25rem 0.75rem", borderRadius: "99px", background: "#f8f9fc", color: "#64748b", fontWeight: 600, fontSize: "0.875rem" }}>
                      {category._count.products}개
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

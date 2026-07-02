import { prisma } from "@/lib/prisma";
import ProductListClient from "./ProductListClient";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ page?: string, categoryId?: string }> }) {
  await requireAdmin("PRODUCTS");

  const { page, categoryId } = await searchParams;
  const currentPage = Number(page) || 1;
  const take = 10;
  const skip = (currentPage - 1) * take;

  const whereCondition: any = {};
  if (categoryId && categoryId.trim() !== "") {
    whereCondition.categoryId = categoryId;
  }
  const [products, totalCount, categories] = await Promise.all([
    prisma.mIN_SHOP_PRODUCT.findMany({
      where: whereCondition,
      include: {
        category: true,
        images: {
          where: { isMain: true },
          take: 1
        },
        options: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    }),
    prisma.mIN_SHOP_PRODUCT.count({ where: whereCondition }),
    prisma.mIN_SHOP_CATEGORY.findMany({ orderBy: { name: 'asc' } })
  ]);

  const totalPages = Math.ceil(totalCount / take);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>상품 관리</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>쇼핑몰에 등록된 모든 상품을 조회하고 등록/수정할 수 있습니다.</p>
        </div>
        <button style={{ padding: "0.75rem 1.5rem", background: "var(--accent-color)", color: "white", borderRadius: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}>
          + 새 상품 등록
        </button>
      </header>

      <ProductListClient 
        products={products} 
        categories={categories} 
        currentPage={currentPage} 
        totalPages={totalPages} 
        currentCategoryId={categoryId || ""} 
      />
    </div>
  );
}

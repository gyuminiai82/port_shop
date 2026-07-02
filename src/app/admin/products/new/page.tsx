import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function NewProductPage() {
  await requireAdmin("PRODUCTS");

  const categories = await prisma.mIN_SHOP_CATEGORY.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>새 상품 등록</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>새로운 상품의 정보를 입력해주세요.</p>
      </header>

      <ProductForm categories={categories} />
    </div>
  );
}

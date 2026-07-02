import { prisma } from "@/lib/prisma";
import ProductForm from "../../ProductForm";
import { requireAdmin } from "@/lib/requireAdmin";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("PRODUCTS");

  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.mIN_SHOP_PRODUCT.findUnique({
      where: { id },
      include: {
        images: true
      }
    }),
    prisma.mIN_SHOP_CATEGORY.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>상품 수정</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>기존 상품의 정보를 수정합니다.</p>
      </header>

      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}

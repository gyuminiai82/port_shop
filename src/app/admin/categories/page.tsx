import { prisma } from "@/lib/prisma";
import CategoryListClient from "./CategoryListClient";

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.mIN_SHOP_CATEGORY.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { id: 'asc' }
  });

  return <CategoryListClient initialCategories={categories} />;
}

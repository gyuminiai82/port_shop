import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const { name, parentId } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const updatedCategory = await prisma.mIN_SHOP_CATEGORY.update({
      where: { id },
      data: {
        name: name.trim(),
        parentId: parentId || null,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    console.error("Failed to update category:", error);
    return NextResponse.json(
      { error: "Failed to update category", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;

    // 카테고리에 속한 상품이 있는지 확인
    const productsCount = await prisma.mIN_SHOP_PRODUCT.count({
      where: { categoryId: id }
    });

    if (productsCount > 0) {
      // 해당 카테고리에 속한 상품들의 카테고리를 null로 업데이트 (또는 에러 반환)
      // 여기서는 null로 업데이트하는 방식을 사용
      await prisma.mIN_SHOP_PRODUCT.updateMany({
        where: { categoryId: id },
        data: { categoryId: null }
      });
    }

    // 카테고리 삭제
    await prisma.mIN_SHOP_CATEGORY.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete category:", error);
    return NextResponse.json(
      { error: "Failed to delete category", details: error.message },
      { status: 500 }
    );
  }
}

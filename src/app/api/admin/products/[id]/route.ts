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
    const body = await request.json();
    const { name, categoryId, price, stock, description, images } = body;

    if (!name || !categoryId || price === undefined || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 트랜잭션을 사용하여 상품 정보와 이미지를 함께 업데이트
    const updatedProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.mIN_SHOP_PRODUCT.update({
        where: { id },
        data: {
          name: name.trim(),
          categoryId,
          price,
          stock,
          description: description?.trim() || null,
        },
      });

      if (images && Array.isArray(images)) {
        await tx.mIN_SHOP_PRODUCT_IMAGE.deleteMany({
          where: { productId: id }
        });

        if (images.length > 0) {
          await tx.mIN_SHOP_PRODUCT_IMAGE.createMany({
            data: images.map((url: string, index: number) => ({
              productId: id,
              url: url.trim(),
              isMain: index === 0
            }))
          });
        }
      }

      return product;
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
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

    await prisma.mIN_SHOP_PRODUCT.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import requireAdmin from "@/lib/requireAdmin";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, categoryId, price, stock, description, images } = body;

    if (!name || !categoryId || price === undefined || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = await prisma.mIN_SHOP_PRODUCT.create({
      data: {
        name: name.trim(),
        categoryId,
        price,
        stock,
        description: description?.trim() || null,
        images: images && images.length > 0 ? {
          create: images.map((url: string, index: number) => ({
            url: url.trim(),
            isMain: index === 0
          }))
        } : undefined
      },
      include: {
        images: true
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    );
  }
}

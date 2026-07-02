import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import requireAdmin from "@/lib/requireAdmin";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, parentId } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const newCategory = await prisma.mIN_SHOP_CATEGORY.create({
      data: {
        name: name.trim(),
        parentId: parentId || null,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Failed to create category", details: error.message },
      { status: 500 }
    );
  }
}

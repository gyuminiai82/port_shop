import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    if (!admin.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { name, password, roleId } = body;

    const target = await prisma.mIN_SHOP_ADMIN.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "Manager not found" }, { status: 404 });
    }

    const updateData: any = { name, roleId: roleId || null };
    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    const updated = await prisma.mIN_SHOP_ADMIN.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        adminRole: { select: { id: true, name: true, permissions: true } },
        isSuperAdmin: true,
        createdAt: true,
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/admin/managers/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    if (!admin.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;

    if (id === admin.id) {
      return NextResponse.json({ error: "자기 자신을 삭제할 수 없습니다." }, { status: 400 });
    }

    // 최고관리자 삭제 방지 (안전 장치)
    const target = await prisma.mIN_SHOP_ADMIN.findUnique({ where: { id } });
    if (target?.isSuperAdmin) {
      return NextResponse.json({ error: "최고 관리자는 삭제할 수 없습니다." }, { status: 400 });
    }

    await prisma.mIN_SHOP_ADMIN.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/managers/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

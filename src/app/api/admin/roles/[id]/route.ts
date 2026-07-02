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
    const { name, permissions } = body;

    const target = await prisma.mIN_SHOP_ROLE.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // 이름 중복 검사 (다른 역할이 같은 이름을 쓰는지)
    if (name !== target.name) {
      const existing = await prisma.mIN_SHOP_ROLE.findUnique({ where: { name } });
      if (existing) {
        return NextResponse.json({ error: "이미 존재하는 역할명입니다." }, { status: 400 });
      }
    }

    const updated = await prisma.mIN_SHOP_ROLE.update({
      where: { id },
      data: { name, permissions }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/admin/roles/[id] error:", error);
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

    // 해당 역할을 사용 중인 관리자가 있는지 확인
    const usersWithRole = await prisma.mIN_SHOP_ADMIN.count({ where: { roleId: id } });
    if (usersWithRole > 0) {
      return NextResponse.json({ error: `해당 역할을 사용 중인 관리자가 ${usersWithRole}명 있습니다. 먼저 관리자의 역할을 변경해주세요.` }, { status: 400 });
    }

    await prisma.mIN_SHOP_ROLE.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/roles/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

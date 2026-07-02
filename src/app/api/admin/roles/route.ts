import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const roles = await prisma.mIN_SHOP_ROLE.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { admins: true }
        }
      }
    });

    return NextResponse.json(roles);
  } catch (error) {
    console.error("GET /api/admin/roles error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, permissions } = body;

    const existing = await prisma.mIN_SHOP_ROLE.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: "이미 존재하는 역할명입니다." }, { status: 400 });
    }

    const newRole = await prisma.mIN_SHOP_ROLE.create({
      data: {
        name,
        permissions: permissions || [],
      }
    });

    return NextResponse.json(newRole);
  } catch (error) {
    console.error("POST /api/admin/roles error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

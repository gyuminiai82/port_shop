import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const managers = await prisma.mIN_SHOP_ADMIN.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isSuperAdmin: true,
        permissions: true,
        createdAt: true,
      }
    });

    return NextResponse.json(managers);
  } catch (error) {
    console.error("GET /api/admin/managers error:", error);
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
    const { email, password, name, permissions } = body;

    // 이메일 중복 체크
    const existing = await prisma.mIN_SHOP_ADMIN.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "이미 존재하는 이메일입니다." }, { status: 400 });
    }

    const newManager = await prisma.mIN_SHOP_ADMIN.create({
      data: {
        email,
        password, // 실무에서는 반드시 해싱해야 합니다
        name,
        role: "ADMIN",
        isSuperAdmin: false,
        permissions: permissions || [],
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isSuperAdmin: true,
        permissions: true,
        createdAt: true,
      }
    });

    return NextResponse.json(newManager);
  } catch (error) {
    console.error("POST /api/admin/managers error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";

async function getAdminUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) return null;
  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;
  
  const user = JSON.parse(sessionData as string);
  if (user.email !== "admin@minstudio.app") return null;
  
  return user;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, phone, points } = body;

    const existingUser = await prisma.mIN_SHOP_USER.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.mIN_SHOP_USER.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingUser.name,
        phone: phone !== undefined ? phone : existingUser.phone,
        points: points !== undefined ? parseInt(points, 10) : existingUser.points,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("관리자 유저 정보 업데이트 에러:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

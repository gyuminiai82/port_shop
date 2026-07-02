import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request: Request) {
  try {
    // 권한 체크 (INQUIRIES)
    await requireAdmin("INQUIRIES");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const take = 10;
    const skip = (page - 1) * take;

    const [inquiries, totalCount] = await Promise.all([
      prisma.mIN_SHOP_INQUIRY.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.mIN_SHOP_INQUIRY.count()
    ]);

    return NextResponse.json({
      data: inquiries,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / take)
    });
  } catch (error) {
    console.error("GET /api/admin/inquiries error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

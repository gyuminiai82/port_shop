import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // 권한 체크 (INQUIRIES)
    await requireAdmin("INQUIRIES");

    const { id } = await context.params;
    const body = await request.json();
    const { answer } = body;

    if (!answer || answer.trim() === "") {
      return NextResponse.json({ error: "답변 내용을 입력해주세요." }, { status: 400 });
    }

    const inquiry = await prisma.mIN_SHOP_INQUIRY.findUnique({
      where: { id }
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const updated = await prisma.mIN_SHOP_INQUIRY.update({
      where: { id },
      data: {
        answer,
        status: "ANSWERED"
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/admin/inquiries/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

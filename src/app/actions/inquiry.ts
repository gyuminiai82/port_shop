"use server"

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { revalidatePath } from "next/cache";

async function getUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;
  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;
  return JSON.parse(sessionData as string);
}

export async function createInquiry(formData: FormData) {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!type || !title || !content) {
      return { success: false, error: "모든 필드를 입력해주세요." };
    }

    await prisma.mIN_INQUIRY.create({
      data: {
        userId: user.id,
        type,
        title,
        content
      }
    });

    revalidatePath("/support/inquiry");
    return { success: true };
  } catch (error) {
    console.error("createInquiry error:", error);
    return { success: false, error: "문의 등록 중 오류가 발생했습니다." };
  }
}

"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { phone: string; zipcode: string; address: string; detailAddress: string }) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    const sessionData = await redis.get(`session:${sessionToken}`);
    if (!sessionData) {
      return { success: false, error: "유효하지 않은 세션입니다." };
    }

    const user = JSON.parse(sessionData as string);

    await prisma.mIN_SHOP_USER.update({
      where: { id: user.id },
      data: {
        phone: data.phone,
        zipcode: data.zipcode,
        address: data.address,
        detailAddress: data.detailAddress,
      }
    });

    revalidatePath("/profile");

    return { success: true };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return { success: false, error: "프로필 수정 중 오류가 발생했습니다." };
  }
}

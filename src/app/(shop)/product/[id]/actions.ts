"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";

async function getUserSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;
  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;
  return JSON.parse(sessionData as string);
}

export async function createReview(productId: string, rating: number, content: string) {
  try {
    const sessionUser = await getUserSession();
    if (!sessionUser) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    // 구매(배송완료) 여부 검증
    const hasPurchased = await prisma.mIN_SHOP_ORDER_ITEM.findFirst({
      where: {
        productId,
        order: {
          userId: sessionUser.id,
          delivery: {
            status: "DELIVERED"
          }
        }
      }
    });

    if (!hasPurchased) {
      return { success: false, error: "이 상품을 구매하고 배송이 완료된 고객만 리뷰를 작성할 수 있습니다." };
    }

    await prisma.mIN_SHOP_REVIEW.create({
      data: {
        productId,
        userId: sessionUser.id,
        rating,
        content,
      }
    });

    revalidatePath(`/product/${productId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create review:", error);
    return { success: false, error: "리뷰 작성에 실패했습니다." };
  }
}

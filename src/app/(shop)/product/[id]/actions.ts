"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReview(productId: string, rating: number, content: string) {
  try {
    // 임시로 데이터베이스에 있는 첫 번째 유저를 작성자로 사용합니다.
    let user = await prisma.mIN_SHOP_USER.findFirst();

    if (!user) {
      // 유저가 하나도 없다면 임시 유저를 생성합니다.
      user = await prisma.mIN_SHOP_USER.create({
        data: {
          email: `temp_${Date.now()}@test.com`,
          name: "게스트 유저",
        }
      });
    }

    await prisma.mIN_SHOP_REVIEW.create({
      data: {
        productId,
        userId: user.id,
        rating,
        content,
      }
    });

    // 해당 페이지 데이터를 다시 가져오도록 캐시 무효화
    revalidatePath(`/product/${productId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to create review:", error);
    return { success: false, error: "리뷰 작성에 실패했습니다." };
  }
}

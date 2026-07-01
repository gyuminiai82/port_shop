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

export async function addToCart(productId: string, optionId: string | null, quantity: number = 1) {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    let cart = await prisma.mIN_SHOP_CART.findUnique({
      where: { userId: user.id }
    });

    if (!cart) {
      cart = await prisma.mIN_SHOP_CART.create({
        data: { userId: user.id }
      });
    }

    const existingItem = await prisma.mIN_SHOP_CART_ITEM.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
        optionId: optionId
      }
    });

    if (existingItem) {
      await prisma.mIN_SHOP_CART_ITEM.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.mIN_SHOP_CART_ITEM.create({
        data: {
          cartId: cart.id,
          productId,
          optionId,
          quantity
        }
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("addToCart error:", error);
    return { success: false, error: "장바구니 추가 중 오류가 발생했습니다." };
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "로그인이 필요합니다." };

    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    await prisma.mIN_SHOP_CART_ITEM.update({
      where: { id: itemId },
      data: { quantity }
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("updateCartItemQuantity error:", error);
    return { success: false, error: "수량 변경 중 오류가 발생했습니다." };
  }
}

export async function removeFromCart(itemId: string) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "로그인이 필요합니다." };

    await prisma.mIN_SHOP_CART_ITEM.delete({
      where: { id: itemId }
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("removeFromCart error:", error);
    return { success: false, error: "삭제 중 오류가 발생했습니다." };
  }
}

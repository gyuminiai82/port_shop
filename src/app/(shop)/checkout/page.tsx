import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

async function getUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;
  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;
  return JSON.parse(sessionData as string);
}

export default async function CheckoutPage() {
  const user = await getUser();
  
  if (!user) {
    redirect(`https://auth.minstudio.app/login?redirect=http://localhost:3001/checkout`);
  }

  const dbUser = await prisma.mIN_SHOP_USER.findUnique({
    where: { id: user.id }
  });

  if (!dbUser) {
    redirect(`https://auth.minstudio.app/login`);
  }

  const cart = await prisma.mIN_SHOP_CART.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isMain: true },
                take: 1
              }
            }
          },
          option: true
        }
      }
    }
  });

  const items = cart?.items || [];
  
  if (items.length === 0) {
    redirect("/cart");
  }

  // Calculate total
  const totalAmount = items.reduce((total, item) => {
    const itemPrice = item.product.price + (item.option?.addPrice || 0);
    return total + itemPrice * item.quantity;
  }, 0);

  // Generate unique order ID
  const orderId = `order_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`;

  return (
    <main className="main-content" style={{ padding: "4rem 2rem", width: "100%", maxWidth: "1440px", margin: "0 auto", marginTop: "var(--nav-height)", boxSizing: "border-box" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "3rem", letterSpacing: "-0.04em" }}>결제하기</h1>
      <CheckoutClient 
        user={dbUser} 
        items={items} 
        totalAmount={totalAmount} 
        orderId={orderId} 
      />
    </main>
  );
}

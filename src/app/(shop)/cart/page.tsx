import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import CartClient from "./CartClient";
import { redirect } from "next/navigation";

async function getUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;
  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;
  return JSON.parse(sessionData as string);
}

export default async function CartPage() {
  const user = await getUser();
  
  if (!user) {
    redirect(`https://auth.minstudio.app/login?redirect=http://localhost:3001/cart`);
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
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const items = cart?.items || [];

  return (
    <main className="main-content" style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto", marginTop: "var(--nav-height)" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "3rem", letterSpacing: "-0.04em" }}>장바구니</h1>
      <CartClient items={items} />
    </main>
  );
}

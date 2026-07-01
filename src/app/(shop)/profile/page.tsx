import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

async function getUserSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;

  return JSON.parse(sessionData as string);
}

export default async function ProfilePage() {
  const sessionUser = await getUserSession();
  
  if (!sessionUser) {
    redirect("https://auth.minstudio.app/login?redirect=http://localhost:3001/profile");
  }

  const user = await prisma.mIN_SHOP_USER.findUnique({
    where: { id: sessionUser.id }
  });

  if (!user) {
    redirect("https://auth.minstudio.app/login?redirect=http://localhost:3001/profile");
  }

  return (
    <main className="main-content" style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto", marginTop: "var(--nav-height)" }}>
      <div className="glass" style={{ padding: "3rem", borderRadius: "32px", background: "var(--glass-bg)" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-0.04em" }}>내 정보 수정</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
            쇼핑 배송에 필요한 개인정보를 안전하게 관리하세요.
          </p>
        </div>

        <ProfileForm initialData={{
          name: user.name,
          email: user.email,
          phone: user.phone,
          zipcode: user.zipcode,
          address: user.address,
          detailAddress: user.detailAddress,
        }} />
      </div>
    </main>
  );
}

import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import ProfileForm from "../ProfileForm";

async function getUserSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;
  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;
  return JSON.parse(sessionData as string);
}

export default async function ProfileEditPage() {
  const sessionUser = await getUserSession();
  if (!sessionUser) return null;

  const user = await prisma.mIN_SHOP_USER.findUnique({
    where: { id: sessionUser.id }
  });

  if (!user) return null;

  return (
    <div className="glass" style={{ padding: "3rem", borderRadius: "32px", background: "var(--glass-bg)" }}>
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-0.04em" }}>내 정보 수정</h1>
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
  );
}

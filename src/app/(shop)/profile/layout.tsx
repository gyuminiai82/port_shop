import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileSidebar from "./ProfileSidebar";

async function getUserSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  const sessionData = await redis.get(`session:${sessionToken}`);
  if (!sessionData) return null;

  return JSON.parse(sessionData as string);
}

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const sessionUser = await getUserSession();
  
  if (!sessionUser) {
    redirect("https://auth.minstudio.app/login?redirect=http://localhost:3001/profile");
  }

  let user = await prisma.mIN_SHOP_USER.findUnique({
    where: { id: sessionUser.id }
  });

  if (!user) {
    // SSO에서 로그인했으나 로컬 DB에 없는 경우 자동 가입 처리
    user = await prisma.mIN_SHOP_USER.create({
      data: {
        id: sessionUser.id,
        email: sessionUser.email || `user_${sessionUser.id.substring(0, 8)}@test.com`,
        name: sessionUser.name || "테스트 유저",
        points: 3000,
        tier: "BRONZE"
      }
    });
  }

  return (
    <main className="main-content" style={{ padding: "4rem 2rem", width: "1200px", margin: "0 auto", marginTop: "var(--nav-height)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem", alignItems: "start" }}>
        <ProfileSidebar userName={user.name || "고객"} userTier={user.tier} userPoints={user.points} />
        <div className="profile-content-area" style={{ width: "100%", minWidth: 0 }}>
          {children}
        </div>
      </div>
      
      {/* 반응형을 위한 글로벌 스타일 추가 */}
      <style key="profile-layout-style">{`
        @media (max-width: 768px) {
          main > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

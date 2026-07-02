import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireAdmin(requiredPermission?: string) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  
  if (!sessionToken) {
    redirect("/admin/login");
  }
  
  const sessionData = await redis.get(`session:${sessionToken}`);
  
  if (!sessionData) {
    redirect("/admin/login");
  }
  
  const sessionPayload = JSON.parse(sessionData as string);
  
  // 일반 쇼핑몰 고객(MIN_SHOP_USER) 세션인 경우 접근 차단
  if (sessionPayload.type !== "ADMIN") {
    redirect("/"); 
  }
  
  // 실제 DB에 존재하는 관리자인지 다시 한 번 검증
  const admin = await prisma.mIN_SHOP_ADMIN.findUnique({
    where: { id: sessionPayload.id }
  });

  if (!admin) {
    redirect("/admin/login");
  }

  // RBAC: 필요한 메뉴 접근 권한 체크 (requiredPermission이 있을 때만 동작)
  if (requiredPermission && !admin.isSuperAdmin) {
    if (!admin.permissions.includes(requiredPermission)) {
      redirect("/admin/orders"); // 대시보드 역할인 첫 화면으로 튕겨냄
    }
  }
  
  return admin;
}

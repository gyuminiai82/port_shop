import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 실제 DB에서 관리자 조회
    const admin = await prisma.mIN_SHOP_ADMIN.findUnique({
      where: { email },
      include: { adminRole: true }
    });

    // 주의: 테스트 환경을 위해 임시로 평문 비교를 허용할 수 있으나, 
    // 실무에서는 bcrypt.compare(password, admin.password) 를 사용해야 함
    if (admin && admin.password === password) {
      // 1. 세션 토큰 생성
      const sessionToken = crypto.randomUUID();
      
      // 2. 관리자 세션 데이터 (type을 명시하여 일반 유저 세션과 구분)
      const sessionData = {
        type: "ADMIN",
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isSuperAdmin: admin.isSuperAdmin,
        permissions: admin.adminRole?.permissions || admin.permissions || []
      };

      // 3. Redis에 세션 저장 (예: 24시간)
      await redis.set(`session:${sessionToken}`, JSON.stringify(sessionData), "EX", 86400);

      // 4. 쿠키 설정
      const cookieStore = await cookies();
      cookieStore.set("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 86400 // 1일
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "이메일 또는 비밀번호가 일치하지 않습니다." }, { status: 401 });
  } catch (error) {
    console.error("관리자 로그인 에러:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 어드민 페이지 접근 시 로그인 확인
  if (pathname.startsWith('/admin')) {
    // 로그인 페이지는 패스
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    const adminSession = request.cookies.get('admin_session')
    if (!adminSession) {
      // 쿠키가 없으면 무조건 로그인 페이지로 튕겨냄
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

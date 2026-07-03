import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/mypage', '/checkout'];

export function proxy(request: NextRequest) {
  let session = request.cookies.get('session')?.value;
  const urlToken = request.nextUrl.searchParams.get('token');
  
  // 1. URL에 token 파라미터가 있다면 (크로스 도메인 SSO로 넘어온 경우)
  if (urlToken) {
    // 파라미터를 제거한 원래 URL로 리다이렉트
    const url = new URL(request.url);
    url.searchParams.delete('token');
    const response = NextResponse.redirect(url);
    
    // 로컬 도메인에 쿠키 저장
    response.cookies.set('session', urlToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    
    return response;
  }

  // 1-1. 로그아웃 리다이렉트로 넘어온 경우
  if (request.nextUrl.searchParams.get('action') === 'logout') {
    const url = new URL(request.url);
    url.searchParams.delete('action');
    const response = NextResponse.redirect(url);
    response.cookies.delete('session');
    return response;
  }
  
  // 2. 보호된 라우트 접근 시 쿠키가 없으면 로그인으로 리다이렉트
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  
  if (isProtectedRoute && !session) {
    const redirectUrl = `https://auth.minstudio.app/login?redirect=${request.nextUrl.origin}${request.nextUrl.pathname}`;
    return NextResponse.redirect(redirectUrl);
  }

  // 3. 어드민 페이지 라우트 보호
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // 모든 경로에서 proxy가 동작하여 token을 캡처할 수 있도록 설정 (api, static 제외)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};

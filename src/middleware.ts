import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/signUp', '/signIn', '/recoverPassword'];

export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get('accessToken')?.value;
  const { pathname, search } = req.nextUrl;

  if (pathname === '/signUp' && search && !search.includes('socialMedia')) {
    const url = req.nextUrl.clone();
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/verify/') || pathname.startsWith('/resetPassword/')) {
    return NextResponse.next();
  }

  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/signIn', req.url));
  }

  if (isAuthenticated && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|favicon.svg|assets|icons).*)',
  ],
};

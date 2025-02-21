import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/signUp', '/signIn'];

export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  if (/\.[^/]+$/.test(pathname)) {
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
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/signUp', '/signIn'];

export function middleware(req: NextRequest) {
  const isAuthenticated = req.cookies.get('token')?.value;

  if (!isAuthenticated && !publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/signIn', req.url));
  }

  if (isAuthenticated && publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};

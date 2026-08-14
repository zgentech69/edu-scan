import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin';
  
  if (isAdminRoute) {
    const authCookie = request.cookies.get('admin_session');
    const expectedToken = process.env.ADMIN_SESSION_SECRET;
    
    // Strict Fail-Closed: If server secret is missing, or cookie is missing or mismatch, reject immediately.
    if (!expectedToken || !authCookie?.value || authCookie.value !== expectedToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};


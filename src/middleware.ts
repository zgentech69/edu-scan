import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin';
  
  if (isAdminRoute) {
    const authCookie = request.cookies.get('admin_session');
    
    // In a real app, verify the JWT or session token.
    // For this simple strict password approach, we just check if the cookie exists and matches our expected secret.
    // We will set this cookie upon successful login.
    const expectedToken = process.env.ADMIN_SESSION_SECRET || 'fallback_secret_token';
    
    if (!authCookie || authCookie.value !== expectedToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};

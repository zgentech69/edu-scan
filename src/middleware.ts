import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/supabasemaster') && request.nextUrl.pathname !== '/supabasemaster';
  
  if (isAdminRoute) {
    const authCookie = request.cookies.get('admin_session');
    const expectedToken = process.env.ADMIN_SESSION_SECRET;
    
    // Strict Fail-Closed: If server secret is missing, or cookie is missing or mismatch, reject immediately.
    if (!expectedToken || !authCookie?.value || authCookie.value !== expectedToken) {
      return NextResponse.redirect(new URL('/supabasemaster', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/supabasemaster/:path*',
};


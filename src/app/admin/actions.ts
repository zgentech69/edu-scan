'use server';

import { cookies } from 'next/headers';

export async function loginAction(password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'; // Default for setup/dev
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'fallback_secret_token';
  
  if (password === expectedPassword) {
    cookies().set('admin_session', sessionSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return { success: true };
  }
  
  return { success: false };
}

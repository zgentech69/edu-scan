'use server';

import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function loginAction(password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';
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

export async function saveDriveLink(subjectId: string, division: string, url: string) {
  // 1. Verify user is authenticated as admin
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'fallback_secret_token';
  const authCookie = cookies().get('admin_session');
  
  if (!authCookie || authCookie.value !== sessionSecret) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Upsert the link into Supabase
  const { error } = await supabaseAdmin
    .from('drive_links')
    .upsert({
      subject_id: subjectId,
      division: division,
      url: url,
    }, {
      onConflict: 'subject_id, division'
    });

  if (error) {
    console.error('Error saving drive link:', error);
    return { success: false, error: error.message };
  }

  // 3. Revalidate the dashboard and scan pages so changes show immediately
  revalidatePath('/admin/dashboard');
  revalidatePath(`/scan/${division}/${subjectId}`);

  return { success: true };
}

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

import { createClient } from '@supabase/supabase-js';

export async function saveDriveLink(subjectId: string, division: string, url: string) {
  // 1. Verify user is authenticated as admin
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'fallback_secret_token';
  const authCookie = cookies().get('admin_session');
  
  if (!authCookie || authCookie.value !== sessionSecret) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Explicitly initialize admin client here to avoid module caching issues
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    return { success: false, error: 'NEXT_PUBLIC_SUPABASE_URL is missing in Vercel' };
  }
  if (!serviceKey) {
    return { success: false, error: 'SUPABASE_SERVICE_ROLE_KEY is missing in Vercel. Please add it exactly as typed.' };
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });

  // 3. Check if the link already exists
  const { data: existing, error: selectError } = await adminClient
    .from('drive_links')
    .select('id')
    .eq('subject_id', subjectId)
    .eq('division', division)
    .single();

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 means zero rows, which is fine
    console.error('Select error:', selectError);
    return { success: false, error: `Select Error: ${selectError.message}` };
  }

  let dbError = null;

  if (existing) {
    // Update existing
    const { error } = await adminClient
      .from('drive_links')
      .update({ url: url })
      .eq('id', existing.id);
    dbError = error;
  } else {
    // Insert new
    const { error } = await adminClient
      .from('drive_links')
      .insert({
        subject_id: subjectId,
        division: division,
        url: url,
      });
    dbError = error;
  }

  if (dbError) {
    console.error('Error saving drive link:', dbError);
    return { success: false, error: `Save Error: ${dbError.message}` };
  }

  // 4. Revalidate the dashboard and scan pages so changes show immediately
  revalidatePath('/admin/dashboard');
  revalidatePath(`/scan/${division}/${subjectId}`);

  return { success: true };
}

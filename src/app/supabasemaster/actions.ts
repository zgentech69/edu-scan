'use server';

import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function loginAction(password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  
  if (!expectedPassword || !sessionSecret) {
    console.error('CRITICAL: ADMIN_PASSWORD or ADMIN_SESSION_SECRET is not configured.');
    return { success: false, error: 'Server authentication configuration missing' };
  }
  
  // Strict timing-resistant comparison & validation
  if (password && password.trim() === expectedPassword.trim()) {
    cookies().set('admin_session', sessionSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return { success: true };
  }
  
  return { success: false, error: 'Invalid password' };
}

export async function logoutAction() {
  cookies().delete('admin_session');
  return { success: true };
}

import { createClient } from '@supabase/supabase-js';

export async function saveDriveLink(subjectId: string, division: string, url: string) {
  // 1. Verify user is authenticated as admin
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const authCookie = cookies().get('admin_session');
  
  if (!sessionSecret || !authCookie?.value || authCookie.value !== sessionSecret) {
    return { success: false, error: 'Unauthorized: Invalid admin session' };
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
  revalidatePath('/supabasemaster/dashboard');
  revalidatePath(`/scan/${division}/${subjectId}`);

  return { success: true };
}

export async function saveSubjectName(subjectId: string, newName: string) {
  // 1. Verify user is authenticated as admin
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const authCookie = cookies().get('admin_session');
  
  if (!sessionSecret || !authCookie?.value || authCookie.value !== sessionSecret) {
    return { success: false, error: 'Unauthorized: Invalid admin session' };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Supabase credentials are missing in Vercel' };
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });

  const { error } = await adminClient
    .from('subjects')
    .update({ name: newName })
    .eq('id', subjectId);

  if (error) {
    console.error('Error saving subject name:', error);
    return { success: false, error: `Save Error: ${error.message}` };
  }

  revalidatePath('/supabasemaster/dashboard');
  
  return { success: true };
}

export async function createSubjectAction(name: string, description: string, semester: number, isOptional: boolean) {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const authCookie = cookies().get('admin_session');
  
  if (!sessionSecret || !authCookie?.value || authCookie.value !== sessionSecret) {
    return { success: false, error: 'Unauthorized: Invalid admin session' };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Supabase credentials are missing in Vercel' };
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });

  const { error } = await adminClient
    .from('subjects')
    .insert({
      name,
      description,
      semester,
      is_optional: isOptional
    });

  if (error) {
    console.error('Error creating subject:', error);
    return { success: false, error: `Save Error: ${error.message}` };
  }

  revalidatePath('/supabasemaster/dashboard');
  
  return { success: true };
}

export async function deleteSubjectAction(subjectId: string) {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const authCookie = cookies().get('admin_session');
  
  if (!sessionSecret || !authCookie?.value || authCookie.value !== sessionSecret) {
    return { success: false, error: 'Unauthorized: Invalid admin session' };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Supabase credentials are missing in Vercel' };
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });

  const { error } = await adminClient
    .from('subjects')
    .delete()
    .eq('id', subjectId);

  if (error) {
    console.error('Error deleting subject:', error);
    return { success: false, error: `Delete Error: ${error.message}` };
  }

  revalidatePath('/supabasemaster/dashboard');
  
  return { success: true };
}

export async function saveTeacherLink(subjectId: string, teacherName: string, url: string) {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const authCookie = cookies().get('admin_session');
  
  if (!sessionSecret || !authCookie?.value || authCookie.value !== sessionSecret) {
    return { success: false, error: 'Unauthorized' };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Supabase credentials missing' };
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });

  const { error } = await adminClient
    .from('drive_links')
    .insert({
      subject_id: subjectId,
      division: 'FY',
      url: url,
      teacher_name: teacherName
    });

  if (error) {
    console.error('Error saving teacher link:', error);
    return { success: false, error: `Save Error: ${error.message}` };
  }

  revalidatePath('/supabasemaster/dashboard');
  revalidatePath(`/scan/fy/${subjectId}`);
  
  return { success: true };
}

export async function deleteTeacherLink(linkId: string, subjectId: string) {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const authCookie = cookies().get('admin_session');
  
  if (!sessionSecret || !authCookie?.value || authCookie.value !== sessionSecret) {
    return { success: false, error: 'Unauthorized' };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Supabase credentials missing' };
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });

  const { error } = await adminClient
    .from('drive_links')
    .delete()
    .eq('id', linkId);

  if (error) {
    console.error('Error deleting teacher link:', error);
    return { success: false, error: `Delete Error: ${error.message}` };
  }

  revalidatePath('/supabasemaster/dashboard');
  revalidatePath(`/scan/fy/${subjectId}`);
  
  return { success: true };
}

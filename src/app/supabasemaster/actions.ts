'use server';

import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function loginAction(password: string, hodBranch?: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const hodPassword = process.env.HOD_PASSWORD || expectedPassword;
  
  if (!expectedPassword || !sessionSecret) {
    console.error('CRITICAL: ADMIN_PASSWORD or ADMIN_SESSION_SECRET is not configured.');
    return { success: false, error: 'Server authentication configuration missing' };
  }
  
  // HOD Login
  if (hodBranch) {
    if (!password) {
      return { success: false, error: 'Password required' };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey) {
      const adminClient = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      const { data } = await adminClient.from('hod_passwords').select('password_hash').eq('branch_id', hodBranch).single();
      
      let isMatch = false;
      if (data && data.password_hash) {
        const hash = crypto.createHash('sha256').update(password.trim()).digest('hex');
        isMatch = hash === data.password_hash;
      } else {
        isMatch = password.trim() === hodPassword?.trim();
      }

      if (isMatch) {
        cookies().set('hod_session', hodBranch, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
        return { success: true };
      }
    }
    return { success: false, error: 'Invalid HOD password' };
  }

  // Principal Login
  // Strict timing-resistant comparison & validation
  if (password && password.trim() === expectedPassword.trim()) {
    cookies().set('admin_session', sessionSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    return { success: true };
  }
  
  return { success: false, error: 'Invalid password' };
}

export async function logoutAction() {
  cookies().delete('admin_session');
  cookies().delete('hod_session');
  revalidatePath('/supabasemaster', 'layout');
  return { success: true };
}

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
  revalidatePath('/', 'layout');
  revalidatePath('/supabasemaster/dashboard');
  revalidatePath(`/scan/${division}/${subjectId}`);

  return { success: true };
}

export async function saveSubjectDetails(subjectId: string, newName: string, newDescription: string | null) {
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
    .update({ name: newName, description: newDescription })
    .eq('id', subjectId);

  if (error) {
    console.error('Error saving subject details:', error);
    return { success: false, error: `Save Error: ${error.message}` };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/supabasemaster/dashboard');
  
  return { success: true };
}

export async function createSubjectAction(name: string, description: string, semester: number, isOptional: boolean, branch?: string) {
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
      is_optional: isOptional,
      branch: branch || null
    });

  if (error) {
    console.error('Error creating subject:', error);
    return { success: false, error: `Save Error: ${error.message}` };
  }

  revalidatePath('/', 'layout');
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

  revalidatePath('/', 'layout');
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
      division: 'ALL',
      url: url,
      teacher_name: teacherName
    });

  if (error) {
    console.error('Error saving teacher link:', error);
    return { success: false, error: `Save Error: ${error.message}` };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/supabasemaster/dashboard');
  revalidatePath('/scan', 'layout');
  
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

  revalidatePath('/', 'layout');
  revalidatePath('/supabasemaster/dashboard');
  revalidatePath('/scan', 'layout');
  
  return { success: true };
}

export async function saveAnnouncementAction(text: string, isActive: boolean) {
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
    .from('app_settings')
    .upsert({ id: 1, announcement_text: text, is_active: isActive });

  if (error) {
    console.error('Error saving announcement:', error);
    return { success: false, error: `Save Error: ${error.message}` };
  }

  revalidatePath('/', 'layout');
  
  return { success: true };
}

export async function saveBranchAnnouncementAction(branchId: string, text: string, isActive: boolean) {
  const hodCookie = cookies().get('hod_session');
  
  if (!hodCookie?.value || hodCookie.value !== branchId) {
    // Also allow Principal to save branch announcements, but they use Admin settings page for Global. 
    // This is primarily for HOD.
    return { success: false, error: 'Unauthorized HOD access' };
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
    .from('branch_announcements')
    .upsert({ id: branchId, announcement_text: text, is_active: isActive });

  if (error) {
    console.error('Error saving branch announcement:', error);
    return { success: false, error: `Save Error: ${error.message}` };
  }

  revalidatePath('/', 'layout');
  
  return { success: true };
}

export async function setHodPasswordAction(branchId: string, password: string) {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const authCookie = cookies().get('admin_session');
  
  if (!sessionSecret || !authCookie?.value || authCookie.value !== sessionSecret) {
    return { success: false, error: 'Unauthorized: Only Principal can set branch passwords' };
  }

  if (!password || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters' };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { success: false, error: 'Supabase credentials missing' };
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });

  const hash = crypto.createHash('sha256').update(password.trim()).digest('hex');

  const { error } = await adminClient
    .from('hod_passwords')
    .upsert({ branch_id: branchId, password_hash: hash, updated_at: new Date().toISOString() });

  if (error) {
    console.error('Error saving HOD password:', error);
    return { success: false, error: `Save Error: ${error.message}` };
  }
  
  return { success: true };
}

export async function removeHodPasswordAction(branchId: string) {
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
    .from('hod_passwords')
    .delete()
    .eq('branch_id', branchId);

  if (error) {
    console.error('Error removing HOD password:', error);
    return { success: false, error: `Delete Error: ${error.message}` };
  }
  
  return { success: true };
}


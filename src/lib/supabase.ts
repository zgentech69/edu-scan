import { createClient } from '@supabase/supabase-js';

// We will use environment variables for this in a real setup.
// For now, these are placeholder values until the user provisions a Supabase project.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Use service key for admin operations to bypass RLS. Falls back to anon key if not provided.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export type Subject = {
  id: string;
  name: string;
  description: string | null;
  semester: number;
  is_optional: boolean;
  created_at?: string;
};

export type DriveLink = {
  id: string;
  subject_id: string;
  division: string;
  url: string;
};

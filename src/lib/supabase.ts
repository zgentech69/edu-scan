import { createClient } from '@supabase/supabase-js';

// We will use environment variables for this in a real setup.
// For now, these are placeholder values until the user provisions a Supabase project.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Subject = {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
};

export type DriveLink = {
  id: string;
  subject_id: string;
  division: string;
  url: string;
};

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';

if (supabaseUrl.includes('placeholder')) {
  console.log('Using placeholder URL. No actual data to fetch.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('subjects').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Subjects found:', data.length);
    console.log('Semester 1 count:', data.filter(s => s.semester === 1).length);
    console.log('Semester 2 count:', data.filter(s => s.semester === 2).length);
    console.log('No semester count:', data.filter(s => !s.semester).length);
    console.log('Raw data for Semester 2 (or ID 666...):', data.filter(s => s.semester === 2 || s.id.startsWith('666')));
  }
}

test();

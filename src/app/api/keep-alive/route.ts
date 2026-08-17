import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Ensure this route is never cached so the database is actually pinged every time
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { status: 'error', message: 'Supabase credentials missing.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Perform a very lightweight query to register activity on the database
    // This tells Supabase "Hey, I'm still using this database, don't pause it!"
    const { data, error } = await supabase
      .from('subjects')
      .select('id')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({
      status: 'success',
      message: 'Database pinged successfully. Supabase activity registered.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error pinging database:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to ping database.' },
      { status: 500 }
    );
  }
}

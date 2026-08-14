import { supabase } from '@/lib/supabase';
import { SubjectEditor } from '@/components/supabasemaster/SubjectEditor';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*, drive_links(*)')
    .order('name');

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-100/50 rounded-xl shadow-neu-pressed">
        <h3 className="font-bold text-lg mb-2">Error loading data from Supabase</h3>
        <p className="mb-2">Make sure your NEXT_PUBLIC_SUPABASE_URL and KEY are set correctly in Vercel.</p>
        <div className="bg-white/50 p-4 rounded-lg text-sm font-mono mt-4 break-all">
          <strong>Supabase Error Details:</strong><br/>
          Code: {error.code}<br/>
          Message: {error.message}<br/>
          Hint: {error.hint || 'None'}<br/>
          Details: {error.details || 'None'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-sand-900">Manage Subjects</h2>
        {/* New Subject button disabled for now since subjects are pre-loaded */}
      </div>

      <div className="grid gap-6">
        {subjects?.map((subject) => (
          <SubjectEditor key={subject.id} subject={subject} />
        ))}
        {subjects?.length === 0 && (
          <div className="text-center p-10 text-sand-900/50 italic">
            No subjects created yet.
          </div>
        )}
      </div>
    </div>
  );
}

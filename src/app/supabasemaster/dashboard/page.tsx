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

  // Handle cases where database might return strings instead of ints/booleans
  const sem1Subjects = subjects?.filter(s => String(s.semester) !== '2' && String(s.is_optional) !== 'true') || [];
  const sem2Subjects = subjects?.filter(s => String(s.semester) === '2' && String(s.is_optional) !== 'true') || [];
  const optionalSubjects = subjects?.filter(s => String(s.is_optional) === 'true') || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-sand-900">Manage Subjects</h2>
        {/* New Subject button disabled for now since subjects are pre-loaded */}
      </div>

      {subjects?.length === 0 && (
        <div className="text-center p-10 text-sand-900/50 italic">
          No subjects created yet.
        </div>
      )}

      {sem1Subjects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-display font-semibold text-sand-800 border-b border-sand-200 pb-2">Semester 1</h3>
          <div className="grid gap-6">
            {sem1Subjects.map((subject) => (
              <SubjectEditor key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      )}

      {sem2Subjects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-display font-semibold text-sand-800 border-b border-sand-200 pb-2 mt-8">Semester 2</h3>
          <div className="grid gap-6">
            {sem2Subjects.map((subject) => (
              <SubjectEditor key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      )}

        {optionalSubjects.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-display font-semibold text-sand-800 border-b border-sand-200 pb-2 mt-8">Optional Subjects</h3>
            <p className="text-sm text-sand-900/60 mb-4">These subjects will only appear to students if a drive link is provided for their division.</p>
            <div className="grid gap-6">
              {optionalSubjects.map((subject) => (
                <SubjectEditor key={subject.id} subject={subject} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 p-4 bg-sand-200 rounded text-xs overflow-auto">
          <h4 className="font-bold mb-2">Debug Data Dump (Delete me later)</h4>
          <pre>{JSON.stringify(subjects, null, 2)}</pre>
        </div>
    </div>
  );
}

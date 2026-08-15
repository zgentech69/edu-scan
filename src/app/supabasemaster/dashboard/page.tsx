import { supabase } from '@/lib/supabase';
import { SubjectEditor } from '@/components/supabasemaster/SubjectEditor';
import { AddSubjectModal } from '@/components/supabasemaster/AddSubjectModal';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { sem?: string };
}) {
  const sem = searchParams.sem;

  if (!sem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <h2 className="text-3xl font-display font-bold text-sand-900">Select Semester</h2>
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
          <Link 
            href="/supabasemaster/dashboard?sem=1" 
            className="flex-1 bg-sand-100 rounded-2xl transition-all duration-200 ease-in-out border border-white/60 shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed active:scale-[0.98] text-center p-8 focus:outline-none focus:ring-2 focus:ring-sand-400"
          >
            <span className="text-2xl font-bold text-sand-900">Semester 1</span>
          </Link>
          <Link 
            href="/supabasemaster/dashboard?sem=2" 
            className="flex-1 bg-sand-100 rounded-2xl transition-all duration-200 ease-in-out border border-white/60 shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed active:scale-[0.98] text-center p-8 focus:outline-none focus:ring-2 focus:ring-sand-400"
          >
            <span className="text-2xl font-bold text-sand-900">Semester 2</span>
          </Link>
        </div>
      </div>
    );
  }

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
  const semSubjects = subjects?.filter(s => String(s.semester) === sem && String(s.is_optional) !== 'true') || [];
  const optionalSubjects = subjects?.filter(s => String(s.is_optional) === 'true') || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/supabasemaster/dashboard"
            className="p-3 bg-sand-100 rounded-xl shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed transition-all text-sand-900"
          >
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-display font-bold text-sand-900">Manage Semester {sem} Subjects</h2>
        </div>
        <AddSubjectModal semester={parseInt(sem, 10)} />
      </div>

      {subjects?.length === 0 && (
        <div className="text-center p-10 text-sand-900/50 italic">
          No subjects created yet.
        </div>
      )}

      {semSubjects.length > 0 && (
        <div className="space-y-4">
          <div className="grid gap-6">
            {semSubjects.map((subject) => (
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
    </div>
  );
}

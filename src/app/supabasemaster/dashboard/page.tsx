import { supabase } from '@/lib/supabase';
import { SubjectEditor } from '@/components/supabasemaster/SubjectEditor';
import { AddSubjectModal } from '@/components/supabasemaster/AddSubjectModal';
import { FilterableSubjects } from '@/components/supabasemaster/FilterableSubjects';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ShareHodLink } from '@/components/supabasemaster/ShareHodLink';

export const dynamic = 'force-dynamic';

const BRANCHES = [
  { id: 'CIVIL', label: 'CIVIL' },
  { id: 'CHEM', label: 'CHEMICAL' },
  { id: 'MECHANICAL', label: 'MECHANICAL' },
  { id: 'AIML', label: 'AIML' },
  { id: 'COMP', label: 'COMP' },
  { id: 'EXTC', label: 'EXTC' },
];

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { year?: string; sem?: string; branch?: string };
}) {
  let { year, sem, branch } = searchParams;

  const cookieStore = cookies();
  const hodCookie = cookieStore.get('hod_session');
  const adminCookie = cookieStore.get('admin_session');
  const isHod = !!hodCookie?.value;
  const isAdmin = !!(process.env.ADMIN_SESSION_SECRET && adminCookie?.value === process.env.ADMIN_SESSION_SECRET);

  if (isHod && hodCookie.value) {
    const parts = hodCookie.value.split('-');
    if (parts.length >= 2) {
      year = parts[0];
      sem = parts[1];
      branch = parts[2] || undefined;
    }
  }

  // STEP 1: Select Year
  if (!year) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <h2 className="text-3xl font-display font-bold text-sand-900">Select Year</h2>
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-4xl flex-wrap justify-center">
          <Link 
            href="/supabasemaster/dashboard?year=FE" 
            className="flex-1 min-w-[250px] bg-sand-100 rounded-2xl transition-all duration-200 ease-in-out border border-white/60 shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed active:scale-[0.98] text-center p-8 focus:outline-none focus:ring-2 focus:ring-sand-400"
          >
            <span className="text-2xl font-bold text-sand-900">First Year (FE)</span>
          </Link>
          <Link 
            href="/supabasemaster/dashboard?year=SE" 
            className="flex-1 min-w-[250px] bg-sand-100 rounded-2xl transition-all duration-200 ease-in-out border border-white/60 shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed active:scale-[0.98] text-center p-8 focus:outline-none focus:ring-2 focus:ring-sand-400"
          >
            <span className="text-2xl font-bold text-sand-900">Second Year (SE)</span>
          </Link>
          <Link 
            href="/supabasemaster/dashboard?year=TE" 
            className="flex-1 min-w-[250px] bg-sand-100 rounded-2xl transition-all duration-200 ease-in-out border border-white/60 shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed active:scale-[0.98] text-center p-8 focus:outline-none focus:ring-2 focus:ring-sand-400"
          >
            <span className="text-2xl font-bold text-sand-900">Third Year (TE)</span>
          </Link>
          <Link 
            href="/supabasemaster/dashboard?year=BE" 
            className="flex-1 min-w-[250px] bg-sand-100 rounded-2xl transition-all duration-200 ease-in-out border border-white/60 shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed active:scale-[0.98] text-center p-8 focus:outline-none focus:ring-2 focus:ring-sand-400"
          >
            <span className="text-2xl font-bold text-sand-900">Fourth Year (BE)</span>
          </Link>
        </div>
      </div>
    );
  }

  // STEP 2: Select Semester
  if (!sem) {
    const semOptions = year === 'FE' ? [1, 2] : year === 'SE' ? [3, 4] : year === 'TE' ? [5, 6] : [7, 8];
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 relative">
        <div className="absolute top-0 left-0">
          <Link 
            href="/supabasemaster/dashboard"
            className="p-3 bg-sand-100 rounded-xl shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed transition-all text-sand-900 flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back
          </Link>
        </div>
        <h2 className="text-3xl font-display font-bold text-sand-900">Select Semester</h2>
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
          {semOptions.map(s => (
            <Link 
              key={s}
              href={`/supabasemaster/dashboard?year=${year}&sem=${s}`} 
              className="flex-1 bg-sand-100 rounded-2xl transition-all duration-200 ease-in-out border border-white/60 shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed active:scale-[0.98] text-center p-8 focus:outline-none focus:ring-2 focus:ring-sand-400"
            >
              <span className="text-2xl font-bold text-sand-900">Semester {s}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // STEP 3: Select Branch (Only for SE, TE, and BE)
  if ((year === 'SE' || year === 'TE' || year === 'BE') && !branch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 relative">
        <div className="absolute top-0 left-0">
          <Link 
            href={`/supabasemaster/dashboard?year=${year}`}
            className="p-3 bg-sand-100 rounded-xl shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed transition-all text-sand-900 flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back
          </Link>
        </div>
        <h2 className="text-3xl font-display font-bold text-sand-900">Select Branch</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {BRANCHES.map(b => (
            <Link 
              key={b.id}
              href={`/supabasemaster/dashboard?year=${year}&sem=${sem}&branch=${b.id}`} 
              className="bg-sand-100 rounded-2xl transition-all duration-200 ease-in-out border border-white/60 shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed active:scale-[0.98] text-center p-6 focus:outline-none focus:ring-2 focus:ring-sand-400"
            >
              <span className="text-xl font-bold text-sand-900">{b.label}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // STEP 4: Manage Subjects
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*, drive_links(*)')
    .order('created_at', { ascending: true });

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

  // Filter subjects based on Year, Sem, Branch
  const filteredSubjects = subjects?.filter(s => {
    if (String(s.semester) !== sem) return false;
    
    if (year === 'FE') {
      // FE subjects usually have branch as null
      return !s.branch;
    } else {
      // SE, TE, & BE subjects must match the branch
      return s.branch === branch;
    }
  }) || [];

  const semSubjects = filteredSubjects.filter(s => String(s.is_optional) !== 'true');
  const optionalSubjects = filteredSubjects.filter(s => String(s.is_optional) === 'true');

  const backLink = year === 'FE' 
    ? `/supabasemaster/dashboard?year=FE` 
    : `/supabasemaster/dashboard?year=${year}&sem=${sem}`;

  const pageTitle = year === 'FE' 
    ? `Manage FE Sem ${sem} Subjects` 
    : `Manage ${year} Sem ${sem} ${branch} Subjects`;

  const branchId = `${year}-${sem}-${branch || ''}`;

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {!isHod && (
            <Link 
              href={backLink}
              className="p-3 bg-sand-100 rounded-xl shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed transition-all text-sand-900 shrink-0"
            >
              <ArrowLeft size={20} />
            </Link>
          )}
          <h2 className="text-2xl font-display font-bold text-sand-900">{pageTitle}</h2>
        </div>
        <div className="flex items-center gap-4">
          {!isHod && <ShareHodLink branchId={branchId} isAdmin={isAdmin} />}
          <AddSubjectModal semester={parseInt(sem, 10)} branch={branch} />
        </div>
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center p-10 text-sand-900/50 italic">
          No subjects created yet.
        </div>
      )}

      {semSubjects.length > 0 && (
        <FilterableSubjects subjects={semSubjects} />
      )}

      {optionalSubjects.length > 0 && (
        <FilterableSubjects subjects={optionalSubjects} title="Optional Subjects" emptyMessage="These subjects will only appear to students if a drive link is provided for their division." />
      )}
    </div>
  );
}

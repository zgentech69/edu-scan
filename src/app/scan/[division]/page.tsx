import { supabase } from '@/lib/supabase';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { DIVISION_SECRETS } from '@/lib/tokens';

export const dynamic = 'force-dynamic';

const VALID_DIVISIONS = ['A', 'B', 'C', 'D'];

export default async function DivisionPage({ params, searchParams }: { params: { division: string }, searchParams: { sem?: string, t?: string } }) {
  const division = params.division.toUpperCase();

  if (!VALID_DIVISIONS.includes(division)) {
    notFound();
  }

  if (searchParams.t !== DIVISION_SECRETS[division]) {
    return (
      <main className="flex-1 w-full p-6 max-w-md mx-auto relative overflow-hidden flex flex-col items-center justify-center">
        <h1 className="text-2xl font-display font-bold text-sand-900 mb-4 text-center">Unauthorized</h1>
        <p className="text-sand-900/60 font-medium text-center">Invalid access token. Please scan the QR code for this division again.</p>
      </main>
    );
  }

  const selectedSem = searchParams.sem ? parseInt(searchParams.sem) : null;

  if (!selectedSem) {
    return (
      <main className="flex-1 w-full p-6 max-w-md mx-auto relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[20%] bg-sand-300/20 blur-3xl rounded-full" />

        <div className="w-20 h-20 mb-8 rounded-2xl overflow-hidden shadow-neu-pressed border-4 border-sand-100 relative">
          <Image
            src="/logo.jpeg"
            alt="Campus Logo"
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <h1 className="text-3xl font-display font-bold text-sand-900 mb-2">Division {division}</h1>
        <p className="text-sand-900/60 mb-10 font-medium text-center">Please select your semester to continue</p>

        <div className="w-full space-y-5">
          <Link href={`/scan/${division}?sem=1&t=${searchParams.t}`} className="block">
            <NeumorphicCard className="w-full p-6 text-center hover:scale-[1.02] transition-transform group">
              <h2 className="text-2xl font-display font-bold text-sand-900 group-hover:text-sand-800">Semester 1</h2>
            </NeumorphicCard>
          </Link>
          <Link href={`/scan/${division}?sem=2&t=${searchParams.t}`} className="block">
            <NeumorphicCard className="w-full p-6 text-center hover:scale-[1.02] transition-transform group">
              <h2 className="text-2xl font-display font-bold text-sand-900 group-hover:text-sand-800">Semester 2</h2>
            </NeumorphicCard>
          </Link>
        </div>
      </main>
    );
  }

  // Fetch subjects from Supabase
  let subjectsQuery = supabase
    .from('subjects')
    .select('*')
    .order('created_at', { ascending: true });

  if (selectedSem === 1) {
    subjectsQuery = subjectsQuery.or('semester.eq.1,semester.is.null');
  } else {
    subjectsQuery = subjectsQuery.eq('semester', selectedSem);
  }

  const { data: subjects, error: subjectsError } = await subjectsQuery;

  // Fetch drive links for this division to know which optional subjects to show
  const { data: driveLinks, error: linksError } = await supabase
    .from('drive_links')
    .select('subject_id')
    .eq('division', division);

  const error = subjectsError || linksError;
  const linkSubjectIds = new Set(driveLinks?.map(link => link.subject_id) || []);

  const filteredSubjects = subjects?.filter(subject => {
    if (String(subject.is_optional) === 'true') {
      return linkSubjectIds.has(subject.id);
    }
    return true;
  });

  return (
    <main className="flex-1 w-full p-6 max-w-md mx-auto relative overflow-hidden flex flex-col">
      {/* Background Decorative element */}
      <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[20%] bg-sand-300/20 blur-3xl rounded-full" />

      <header className="pt-8 pb-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 mb-4 rounded-2xl overflow-hidden shadow-neu-pressed border-4 border-sand-100 relative">
          <Image
            src="/logo.jpeg"
            alt="Campus Logo"
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <h2 className="text-sand-900/60 font-semibold tracking-wider text-sm uppercase mb-3">
          Semester {selectedSem}
        </h2>
        <div className="bg-sand-100 shadow-neu-flat rounded-2xl p-6 border border-white/40 w-full relative">
          <Link href={`/scan/${division}?t=${searchParams.t}`} className="absolute top-4 right-4 w-8 h-8 rounded-full shadow-neu-pressed flex items-center justify-center text-sand-900/50 hover:text-sand-900 transition-colors">
            <span className="text-xl leading-none">&times;</span>
          </Link>
          <h1 className="text-4xl font-display font-bold text-sand-900">
            Div <span className="text-sand-900">{division}</span>
          </h1>
          <p className="text-sand-900/70 mt-2 font-medium">Select a subject to view material</p>
        </div>
      </header>

      <section className="flex-1 pb-10 flex flex-col gap-5">
        {error ? (
          <div className="p-4 text-red-600 bg-red-100/50 rounded-xl">Error loading data. Please check database connection.</div>
        ) : filteredSubjects?.length === 0 ? (
          <div className="p-6 text-center text-sand-900/50">No subjects found for this semester.</div>
        ) : (
          filteredSubjects?.map((subject) => (
            <Link key={subject.id} href={`/scan/${division}/${subject.id}?t=${searchParams.t}&sem=${selectedSem}`} className="block">
              <NeumorphicCard className="w-full p-5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sand-100 shadow-neu-flat flex items-center justify-center text-sand-900">
                    <BookOpen size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display font-semibold text-lg text-sand-900 group-hover:text-sand-900/90 transition-colors">
                      {subject.name}
                    </h3>
                    {subject.description && (
                      <p className="text-sm text-sand-900/60 line-clamp-1">{subject.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-sand-900/40 group-hover:text-sand-900/80 transition-colors">
                  <ChevronRight size={24} />
                </div>
              </NeumorphicCard>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}

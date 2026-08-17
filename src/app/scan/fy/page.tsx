import { supabase } from '@/lib/supabase';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { FY_SECRET } from '@/lib/tokens';

export const dynamic = 'force-dynamic';

export default async function FirstYearPage({ searchParams }: { searchParams: { t?: string } }) {
  if (searchParams.t !== FY_SECRET) {
    return (
      <main className="flex-1 w-full p-6 max-w-md mx-auto relative overflow-hidden flex flex-col items-center justify-center">
        <h1 className="text-2xl font-display font-bold text-sand-900 mb-4 text-center">Unauthorized</h1>
        <p className="text-sand-900/60 font-medium text-center">Invalid access token. Please scan the Universal First Year QR code again.</p>
      </main>
    );
  }

  // Fetch all FY subjects (Semester 1 and 2)
  const { data: subjects, error: subjectsError } = await supabase
    .from('subjects')
    .select('*')
    .in('semester', [1, 2])
    .order('name');

  // Fetch drive links for FY to know which optional subjects to show
  const { data: driveLinks, error: linksError } = await supabase
    .from('drive_links')
    .select('subject_id')
    .eq('division', 'FY');

  const error = subjectsError || linksError;
  const linkSubjectIds = new Set(driveLinks?.map(link => link.subject_id) || []);

  const filteredSubjects = subjects?.filter(subject => {
    if (String(subject.is_optional) === 'true') {
      return linkSubjectIds.has(subject.id);
    }
    return true;
  });

  const sem1Subjects = filteredSubjects?.filter(s => s.semester === 1) || [];
  const sem2Subjects = filteredSubjects?.filter(s => s.semester === 2) || [];

  return (
    <main className="flex-1 w-full p-6 max-w-md mx-auto relative overflow-hidden flex flex-col">
      {/* Background Decorative element */}
      <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[20%] bg-sand-300/20 blur-3xl rounded-full" />

      <header className="pt-8 pb-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 mb-4 rounded-2xl overflow-hidden shadow-neu-pressed border-4 border-sand-100 relative">
          <Image
            src="/logo.jpeg"
            alt="Campus Logo"
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="bg-sand-100 shadow-neu-flat rounded-2xl p-6 border border-white/40 w-full">
          <h1 className="text-3xl font-display font-bold text-sand-900">
            First Year
          </h1>
          <p className="text-sand-900/70 mt-2 font-medium">Select a subject to view material</p>
        </div>
      </header>

      <section className="flex-1 pb-10 flex flex-col gap-8">
        {error ? (
          <div className="p-4 text-red-600 bg-red-100/50 rounded-xl">Error loading data. Please check database connection.</div>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-display font-bold text-sand-900 mb-4 px-2">Semester 1</h2>
              <div className="space-y-4">
                {sem1Subjects.length === 0 ? (
                  <p className="text-sand-900/50 px-2 text-sm">No subjects available yet.</p>
                ) : (
                  sem1Subjects.map((subject) => (
                    <Link key={subject.id} href={`/scan/fy/${subject.id}?t=${searchParams.t}`} className="block">
                      <NeumorphicCard className="w-full p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-sand-100 shadow-neu-flat flex items-center justify-center text-sand-900">
                            <BookOpen size={18} />
                          </div>
                          <div className="text-left">
                            <h3 className="font-display font-semibold text-base text-sand-900 group-hover:text-sand-900/90 transition-colors">
                              {subject.name}
                            </h3>
                          </div>
                        </div>
                        <div className="text-sand-900/40 group-hover:text-sand-900/80 transition-colors">
                          <ChevronRight size={20} />
                        </div>
                      </NeumorphicCard>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-bold text-sand-900 mb-4 px-2">Semester 2</h2>
              <div className="space-y-4">
                {sem2Subjects.length === 0 ? (
                  <p className="text-sand-900/50 px-2 text-sm">No subjects available yet.</p>
                ) : (
                  sem2Subjects.map((subject) => (
                    <Link key={subject.id} href={`/scan/fy/${subject.id}?t=${searchParams.t}`} className="block">
                      <NeumorphicCard className="w-full p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-sand-100 shadow-neu-flat flex items-center justify-center text-sand-900">
                            <BookOpen size={18} />
                          </div>
                          <div className="text-left">
                            <h3 className="font-display font-semibold text-base text-sand-900 group-hover:text-sand-900/90 transition-colors">
                              {subject.name}
                            </h3>
                          </div>
                        </div>
                        <div className="text-sand-900/40 group-hover:text-sand-900/80 transition-colors">
                          <ChevronRight size={20} />
                        </div>
                      </NeumorphicCard>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

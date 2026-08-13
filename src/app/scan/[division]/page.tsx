import { supabase } from '@/lib/supabase';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';

const VALID_DIVISIONS = ['A', 'B', 'C', 'D'];

export default async function DivisionPage({ params }: { params: { division: string } }) {
  const division = params.division.toUpperCase();

  if (!VALID_DIVISIONS.includes(division)) {
    notFound();
  }

  // Fetch subjects from Supabase
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name');

  return (
    <main className="min-h-screen p-6 max-w-md mx-auto relative overflow-hidden flex flex-col">
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
          First Year
        </h2>
        <div className="bg-sand-100 shadow-neu-flat rounded-2xl p-6 border border-white/40 w-full">
          <h1 className="text-4xl font-display font-bold text-sand-900">
            Division <span className="text-sand-900">{division}</span>
          </h1>
          <p className="text-sand-900/70 mt-2 font-medium">Select a subject to view material</p>
        </div>
      </header>

      <section className="flex-1 pb-10 flex flex-col gap-5">
        {error ? (
          <div className="p-4 text-red-600 bg-red-100/50 rounded-xl">Error loading subjects. Please check database connection.</div>
        ) : subjects?.length === 0 ? (
          <div className="p-6 text-center text-sand-900/50">No subjects found.</div>
        ) : (
          subjects?.map((subject) => (
            <Link key={subject.id} href={`/scan/${division}/${subject.id}`} className="block">
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

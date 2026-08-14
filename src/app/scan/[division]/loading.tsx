import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { BookOpen, ChevronRight } from 'lucide-react';

export default function LoadingDivision() {
  // Array of 5 dummy items for the skeleton list
  const skeletons = Array.from({ length: 5 });

  return (
    <main className="min-h-screen p-6 max-w-md mx-auto relative overflow-hidden flex flex-col">
      {/* Background Decorative element */}
      <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[20%] bg-sand-300/20 blur-3xl rounded-full" />

      <header className="pt-8 pb-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 mb-4 rounded-2xl overflow-hidden shadow-neu-pressed border-4 border-sand-100 relative bg-sand-200 animate-pulse">
        </div>
        <div className="h-4 w-24 bg-sand-200 animate-pulse rounded mb-3"></div>
        <div className="bg-sand-100 shadow-neu-flat rounded-2xl p-6 border border-white/40 w-full animate-pulse">
          <div className="h-10 w-3/4 bg-sand-200 rounded mx-auto mb-2"></div>
          <div className="h-4 w-1/2 bg-sand-200 rounded mx-auto mt-2"></div>
        </div>
      </header>

      <section className="flex-1 pb-10 flex flex-col gap-5">
        {skeletons.map((_, i) => (
          <NeumorphicCard key={i} className="w-full p-5 flex items-center justify-between group opacity-70">
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-full bg-sand-200 shadow-neu-flat flex items-center justify-center animate-pulse flex-shrink-0">
                <BookOpen size={20} className="text-sand-300" />
              </div>
              <div className="text-left flex-1 space-y-2">
                <div className="h-5 w-1/2 bg-sand-200 rounded animate-pulse"></div>
                <div className="h-3 w-3/4 bg-sand-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="text-sand-200">
              <ChevronRight size={24} />
            </div>
          </NeumorphicCard>
        ))}
      </section>
    </main>
  );
}

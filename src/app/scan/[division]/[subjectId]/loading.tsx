import { ArrowLeft, FileText } from 'lucide-react';

export default function LoadingSubjectDetail() {
  return (
    <main className="min-h-screen p-6 max-w-md mx-auto flex flex-col">
      <header className="pt-6 pb-8 flex items-center">
        <div className="p-3 rounded-full shadow-neu-flat text-sand-200 bg-sand-200 animate-pulse">
          <ArrowLeft size={24} className="opacity-0" />
        </div>
        <div className="ml-4">
          <div className="h-4 w-24 bg-sand-200 rounded animate-pulse"></div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="bg-sand-100 shadow-neu-flat rounded-3xl p-8 border border-white/50 mb-8 relative overflow-hidden animate-pulse">
          {/* Decorative circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-sand-200/20 rounded-full blur-2xl" />
          
          <div className="w-16 h-16 rounded-2xl bg-sand-200 shadow-neu-pressed flex items-center justify-center text-sand-300 mb-6">
            <FileText size={32} />
          </div>
          <div className="h-8 w-3/4 bg-sand-200 rounded mb-4"></div>
          <div className="h-4 w-full bg-sand-200 rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-sand-200 rounded mb-2"></div>
          <div className="h-4 w-4/6 bg-sand-200 rounded"></div>
        </div>

        <div className="mt-auto pb-8">
          <div className="w-full h-16 rounded-2xl bg-sand-200 shadow-xl border border-white/20 animate-pulse"></div>
        </div>
      </div>
    </main>
  );
}

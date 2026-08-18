import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-300">
      <div className="relative">
        <div className="absolute inset-0 bg-clay/20 blur-xl rounded-full animate-pulse" />
        <div className="w-16 h-16 bg-sand-100 rounded-2xl shadow-neu-pressed flex items-center justify-center relative z-10 border border-white/50">
          <Loader2 size={32} className="animate-spin text-clay" />
        </div>
      </div>
      <p className="text-sand-900/60 font-medium font-display tracking-widest uppercase text-sm animate-pulse">
        Loading Data...
      </p>
    </div>
  );
}

import { QrCode, ScanLine } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-sand-100 selection:bg-sand-900/10">
      
      {/* Decorative ambient background elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-sand-200/40 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-white/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
        
        {/* Signature Element: The Neumorphic Scanner Motif */}
        <div className="relative mb-12 group">
          <div className="w-48 h-48 rounded-[2rem] bg-sand-100 shadow-neu-flat border-2 border-white/50 flex items-center justify-center relative overflow-hidden transition-all duration-700 ease-out group-hover:shadow-neu-pressed">
            
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50" />
            
            <QrCode 
              size={80} 
              strokeWidth={1.5}
              className="text-sand-900/20 transition-transform duration-700 group-hover:scale-95" 
            />

            {/* Scanning Laser Animation */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-[scan_3s_ease-in-out_infinite]" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-400/10 to-transparent animate-[scan_3s_ease-in-out_infinite]" />
          </div>

          {/* Decorative scanner corners */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-sand-900/20 rounded-tl-xl" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-sand-900/20 rounded-tr-xl" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-sand-900/20 rounded-bl-xl" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-sand-900/20 rounded-br-xl" />
        </div>

        {/* Typography Structure */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-100 shadow-neu-pressed text-xs font-bold tracking-widest uppercase text-sand-900/50 mb-4 border border-white/10">
            <ScanLine size={14} />
            EduScan System
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-display font-black text-sand-900 leading-[1.1] tracking-tight">
            Campus QR<br/>Portal
          </h1>
          
          <p className="text-lg text-sand-900/60 font-medium max-w-sm mx-auto leading-relaxed pt-2">
            Please scan a classroom QR code to access your division's subjects.
          </p>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(192px); opacity: 1; }
          90% { opacity: 0; }
        }
      `}} />
    </main>
  );
}

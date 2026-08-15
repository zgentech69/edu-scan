'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { Printer, BookOpen, Book, FileText, GraduationCap, Lightbulb, Sparkles } from 'lucide-react';

const DIVISIONS = ['A', 'B', 'C', 'D'];

export default function QrCodesPage() {
  const [qrs, setQrs] = useState<Record<string, string>>({});
  const [printingDiv, setPrintingDiv] = useState<string | null>(null);

  useEffect(() => {
    // Generate QRs
    const generateQRs = async () => {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com';
      const qrData: Record<string, string> = {};
      
      for (const div of DIVISIONS) {
        const url = `${origin}/scan/${div}`;
        try {
          qrData[div] = await QRCode.toDataURL(url, {
            width: 500,
            margin: 0,
            color: {
              dark: '#1F1A12',
              light: '#ffffff'
            }
          });
        } catch (err) {
          console.error(err);
        }
      }
      setQrs(qrData);
    };

    generateQRs();

    // Listen for print completion to clear state
    const afterPrint = () => setPrintingDiv(null);
    window.addEventListener('afterprint', afterPrint);
    return () => window.removeEventListener('afterprint', afterPrint);
  }, []);

  const handlePrint = (div: string | 'all') => {
    setPrintingDiv(div);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="space-y-8">
      {/* Top Header (Hidden on Print) */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-display font-bold text-sand-900">QR Codes</h2>
          <p className="text-sand-900/60 mt-1">Print these and stick them in the classrooms.</p>
        </div>
        <NeumorphicCard onClick={() => handlePrint('all')} className="px-4 py-2 flex items-center gap-2 font-semibold cursor-pointer">
          <Printer size={18} /> Print All
        </NeumorphicCard>
      </div>

      {/* Screen View (Hidden on Print) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:hidden">
        {DIVISIONS.map(div => (
          <div key={div} className="bg-sand-100 shadow-neu-flat rounded-3xl p-8 flex flex-col items-center border border-white/40 relative">
            <h3 className="text-3xl font-display font-bold text-sand-900 mb-6">Division {div}</h3>
            {qrs[div] ? (
              <img src={qrs[div]} alt={`QR Code for Division ${div}`} className="w-64 h-64 rounded-xl shadow-neu-pressed p-2 bg-white" />
            ) : (
              <div className="w-64 h-64 bg-sand-200 animate-pulse rounded-xl" />
            )}
            <p className="mt-6 text-sand-900/60 font-medium text-center">
              Scan to access First Year<br/>subjects for Division {div}
            </p>
            
            <button 
              onClick={() => handlePrint(div)}
              className="absolute top-4 right-4 p-2.5 text-sand-900/50 hover:text-sand-900 hover:bg-sand-200/80 rounded-full transition-all"
              title={`Print Division ${div} QR`}
            >
              <Printer size={22} />
            </button>
          </div>
        ))}
      </div>

      {/* Print Templates (Only visible during print) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #F6F4EB !important; }
        }
      `}} />
      <div className="hidden print:block w-full bg-[#F6F4EB]">
        {DIVISIONS.map(div => {
          if (printingDiv !== 'all' && printingDiv !== div) return null;
          
          return (
            <div key={`print-${div}`} className="print:flex print:flex-col print:items-center print:justify-between w-[210mm] h-[297mm] break-after-page p-12 bg-[#F6F4EB] mx-auto relative overflow-hidden box-border font-sans text-ink">
              
              {/* Decorative Waves (Top Left) */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-clay rounded-[40%] transform rotate-12 opacity-90" />
              <div className="absolute -top-10 -left-16 w-52 h-52 bg-[#F6F4EB] rounded-[40%] transform rotate-[15deg] border-4 border-brass opacity-90 z-10" />

              {/* Decorative Leaves (Bottom Corners) */}
              <div className="absolute bottom-16 left-6 w-16 h-32 opacity-40">
                <svg viewBox="0 0 100 200" fill="currentColor" className="text-sand-800">
                  <path d="M50 200 Q20 150 10 100 Q40 100 50 150 Z" />
                  <path d="M50 160 Q0 120 10 60 Q40 80 50 140 Z" />
                  <path d="M50 120 Q-10 80 20 20 Q50 60 50 100 Z" />
                  <path d="M50 200 Q50 100 50 0" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="absolute bottom-16 right-6 w-16 h-32 opacity-40 transform scale-x-[-1]">
                <svg viewBox="0 0 100 200" fill="currentColor" className="text-sand-800">
                  <path d="M50 200 Q20 150 10 100 Q40 100 50 150 Z" />
                  <path d="M50 160 Q0 120 10 60 Q40 80 50 140 Z" />
                  <path d="M50 120 Q-10 80 20 20 Q50 60 50 100 Z" />
                  <path d="M50 200 Q50 100 50 0" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>

              {/* Decorative Dot Grid (Top Right) */}
              <div className="absolute top-10 right-10 grid grid-cols-5 gap-3 opacity-40 z-10">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-brass" />
                ))}
              </div>

              {/* Header Section */}
              <div className="flex flex-col items-center mt-6 z-20 w-full relative">
                <div className="relative flex justify-center items-center mb-1">
                  <BookOpen className="w-16 h-16 text-ink" strokeWidth={1.5} />
                  <div className="absolute w-[120%] h-[30%] border-2 border-brass rounded-[50%] -rotate-6 shadow-sm blur-[0.5px]" />
                </div>
                <h1 className="text-2xl font-black text-ink tracking-tight mb-2">EduScan</h1>
                
                <h2 className="text-[4.5rem] font-display font-medium leading-[1.1] text-ink mt-2">
                  Scan to Learn.
                </h2>
                <p className="text-sm font-bold tracking-[0.25em] uppercase text-ink mt-3">
                  Knowledge at your fingertips.
                </p>
                
                <div className="flex items-center gap-3 mt-6 text-brass opacity-60">
                  <Sparkles size={16} fill="currentColor" /> 
                  <div className="w-16 h-px bg-brass" /> 
                  <Sparkles size={16} fill="currentColor" />
                </div>
              </div>

              {/* QR Code Container */}
              <div className="relative mt-8 mb-6 z-20">
                {/* Neumorphic outer box */}
                <div className="bg-[#F6F4EB] p-6 rounded-[2rem] shadow-neu-flat border border-white/60">
                  {/* Dashed inner box */}
                  <div className="border-[1.5px] border-dashed border-ink/30 rounded-2xl p-8 relative flex items-center justify-center bg-white/30">
                    
                    {/* Scan Me Frame */}
                    <div className="absolute w-32 h-32 flex flex-col items-center justify-center pointer-events-none opacity-20">
                       {/* Top left */}
                       <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brass rounded-tl-xl" />
                       {/* Top right */}
                       <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brass rounded-tr-xl" />
                       {/* Bottom left */}
                       <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brass rounded-bl-xl" />
                       {/* Bottom right */}
                       <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brass rounded-br-xl" />
                    </div>

                    {qrs[div] ? (
                      <img src={qrs[div]} alt={`QR Code ${div}`} className="w-[280px] h-[280px] object-contain relative z-10 bg-white p-2 rounded-xl" />
                    ) : (
                      <div className="w-[280px] h-[280px] bg-gray-200 animate-pulse rounded-xl" />
                    )}
                  </div>
                </div>
                
                {/* Ribbon */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-clay text-white px-10 py-3 rounded-full font-bold text-sm tracking-[0.15em] uppercase shadow-lg whitespace-nowrap z-30">
                  DIVISION {div}
                </div>
              </div>

              {/* Descriptive Text */}
              <div className="text-center z-20 px-8 relative mt-4">
                <p className="text-[1.75rem] font-display font-medium text-ink leading-snug">
                  Access study materials, resources,<br/>
                  notes and more – <span className="text-clay italic">instantly!</span>
                </p>
              </div>

              {/* Features Pill */}
              <div className="bg-[#F6F4EB] rounded-3xl shadow-neu-flat border border-white/60 w-full max-w-[90%] mx-auto py-5 px-8 flex justify-between items-center z-20 mt-8">
                {/* Column 1 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-white rounded-full shadow-neu-pressed flex items-center justify-center text-brass mb-3">
                    <Book size={22} strokeWidth={2} />
                  </div>
                  <p className="text-[10px] font-bold text-center leading-snug tracking-wider text-ink/80">STUDY<br/>MATERIALS</p>
                </div>
                <div className="w-px h-12 bg-ink/10" />
                {/* Column 2 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-white rounded-full shadow-neu-pressed flex items-center justify-center text-brass mb-3">
                    <FileText size={22} strokeWidth={2} />
                  </div>
                  <p className="text-[10px] font-bold text-center leading-snug tracking-wider text-ink/80">CLASS NOTES<br/>& RESOURCES</p>
                </div>
                <div className="w-px h-12 bg-ink/10" />
                {/* Column 3 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-white rounded-full shadow-neu-pressed flex items-center justify-center text-brass mb-3">
                    <GraduationCap size={24} strokeWidth={2} />
                  </div>
                  <p className="text-[10px] font-bold text-center leading-snug tracking-wider text-ink/80">LEARN<br/>ANYTIME</p>
                </div>
                <div className="w-px h-12 bg-ink/10" />
                {/* Column 4 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 bg-white rounded-full shadow-neu-pressed flex items-center justify-center text-brass mb-3">
                    <Lightbulb size={24} strokeWidth={2} />
                  </div>
                  <p className="text-[10px] font-bold text-center leading-snug tracking-wider text-ink/80">GROW<br/>EVERYDAY</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-10 flex flex-col items-center z-20 w-full mb-4">
                <div className="flex items-center gap-6 mb-4">
                  <Sparkles className="text-brass w-5 h-5" fill="currentColor" />
                  <div className="w-24 h-px bg-ink/20" />
                  <p className="text-[2.2rem] font-display font-medium text-ink tracking-tight">Scan. Learn. Grow.</p>
                  <div className="w-24 h-px bg-ink/20" />
                  <Sparkles className="text-brass w-5 h-5" fill="currentColor" />
                </div>
                <div className="text-[10px] font-bold text-ink/40 tracking-[0.2em] uppercase">
                  Developed By ZGenTech • zgentech.netlify.app
                </div>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}

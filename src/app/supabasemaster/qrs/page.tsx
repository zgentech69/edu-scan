'use client';

import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { Printer, BookOpen, Book, FileText, GraduationCap, Lightbulb, Sparkles, Search, X } from 'lucide-react';
import logoImg from '../../../../public/2.jpeg';
import { DIVISION_SECRETS, FY_SECRET } from '@/lib/tokens';
import { useAdminSearch } from '@/components/supabasemaster/SearchContext';

const DIVISIONS = ['FY', 'A', 'B', 'C', 'D'];

export default function QrCodesPage() {
  const [qrs, setQrs] = useState<Record<string, string>>({});
  const [printingDiv, setPrintingDiv] = useState<string | null>(null);
  
  const { searchQuery } = useAdminSearch();

  useEffect(() => {
    // Generate QRs
    const generateQRs = async () => {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com';
      const qrData: Record<string, string> = {};
      
      for (const div of DIVISIONS) {
        const url = div === 'FY' 
          ? `${origin}/scan/fy?t=${FY_SECRET}`
          : `${origin}/scan/${div}?t=${DIVISION_SECRETS[div]}`;
          
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

  const filteredDivisions = DIVISIONS.filter(div => 
    div.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (div === 'FY' ? 'first year' : `division ${div}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 print:space-y-0 print:m-0 print:p-0">
      {/* Preload logos for print preview */}
      <div className="fixed -left-[9999px] opacity-0 pointer-events-none">
        <img src={logoImg.src} alt="preload main" />
        <img src="/gitm-logo.png" alt="preload gitm" />
        <img src="/naac-logo.png" alt="preload naac" />
      </div>

      {/* Top Header (Hidden on Print) */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-display font-bold text-sand-900">QR Codes</h2>
          <p className="text-sand-900/60 mt-1">Print these and stick them in the classrooms. Press <kbd className="px-1.5 py-0.5 bg-sand-200 rounded text-xs mx-1">Ctrl+F</kbd> to search.</p>
        </div>
        <NeumorphicCard onClick={() => handlePrint('all')} className="px-4 py-2 flex items-center gap-2 font-semibold cursor-pointer">
          <Printer size={18} /> Print All
        </NeumorphicCard>
      </div>

      {/* Screen View (Hidden on Print) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:hidden">
        {filteredDivisions.map(div => (
          <div key={div} className="bg-sand-100 shadow-neu-flat rounded-3xl p-8 flex flex-col items-center border border-white/40 relative">
            <h3 className="text-3xl font-display font-bold text-sand-900 mb-6">
              {div === 'FY' ? 'First Year' : `Division ${div}`}
            </h3>
            {qrs[div] ? (
              <img src={qrs[div]} alt={`QR Code for ${div === 'FY' ? 'First Year' : `Division ${div}`}`} className="w-64 h-64 rounded-xl shadow-neu-pressed p-2 bg-white" />
            ) : (
              <div className="w-64 h-64 bg-sand-200 animate-pulse rounded-xl" />
            )}
            <p className="mt-6 text-sand-900/60 font-medium text-center">
              Scan to access {div === 'FY' ? 'First Year subjects' : `subjects for Division ${div}`}
            </p>
            
            <button 
              onClick={() => handlePrint(div)}
              className="absolute top-4 right-4 p-2.5 text-sand-900/50 hover:text-sand-900 hover:bg-sand-200/80 rounded-full transition-all"
              title={`Print ${div === 'FY' ? 'First Year' : `Division ${div}`} QR`}
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
      <div className="fixed -left-[9999px] print:static print:block w-full bg-[#F6F4EB]">
        {DIVISIONS.map((div, index) => {
          if (printingDiv !== 'all' && printingDiv !== div) return null;
          
          const isLastToPrint = printingDiv === 'all' ? index === DIVISIONS.length - 1 : true;
          
          return (
            <div key={`print-${div}`} className={`print:flex print:flex-col print:items-center print:justify-between w-[210mm] h-[290mm] p-8 pt-10 bg-[#F6F4EB] mx-auto relative overflow-hidden box-border font-sans text-ink ${!isLastToPrint ? 'break-after-page' : ''}`}>
              
              {/* Top Corner Logos */}
              <div className="absolute top-8 left-8 w-24 h-24 z-30 flex items-center justify-center">
                <img src="/gitm-logo.png" alt="GITM Logo" className="w-full h-full object-contain" />
              </div>
              <div className="absolute top-8 right-8 w-24 h-24 z-30 flex items-center justify-center">
                <img src="/naac-logo.png" alt="NAAC Logo" className="w-full h-full object-contain" />
              </div>

              {/* Vertical Side Text */}
              <div className="absolute top-0 bottom-0 right-2 flex items-center justify-center opacity-60 z-10 pointer-events-none">
                <div className="rotate-90 text-sm font-display font-medium text-ink whitespace-nowrap">
                  EduScan@<span className="text-clay italic">ZGenTech</span> Team
                </div>
              </div>

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
              <div className="flex flex-col items-center mt-2 z-20 w-full relative">
                <div className="relative flex justify-center items-center mb-4">
                  <div className="h-28 w-28 rounded-full overflow-hidden shadow-lg border-4 border-white bg-white flex items-center justify-center">
                    <img src={logoImg.src} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
                
                <h2 className="text-[2.75rem] font-display font-bold leading-[1.1] text-ink mt-2 text-center drop-shadow-sm">
                  GHARDA INSTITUTE<br/>
                  <span className="text-3xl font-semibold opacity-90 tracking-wide">OF TECHNOLOGY & MANAGEMENT</span>
                </h2>
                
                <div className="mt-5 px-6 py-2 bg-ink text-[#F6F4EB] rounded-full shadow-lg border border-brass/30 flex items-center gap-2">
                  <Sparkles size={14} className="text-brass" />
                  <p className="text-xs font-bold tracking-[0.2em] uppercase">
                    Knowledge at your fingertips
                  </p>
                  <Sparkles size={14} className="text-brass" />
                </div>
                
                <div className="flex items-center gap-3 mt-6 text-brass opacity-60">
                  <div className="w-16 h-px bg-brass" /> 
                  <div className="w-2 h-2 rounded-full bg-brass" />
                  <div className="w-16 h-px bg-brass" /> 
                </div>
              </div>

              {/* QR Code Container */}
              <div className="relative mt-6 mb-8 z-20 flex flex-col items-center">
                <div className="relative">
                  {/* Neumorphic outer box */}
                  <div className="bg-[#F6F4EB] p-5 rounded-[2rem] shadow-neu-flat border border-white/60">
                    {/* Dashed inner box */}
                    <div className="border-[1.5px] border-dashed border-ink/30 rounded-2xl p-6 relative flex items-center justify-center bg-white/30">
                      
                      {/* Scan Me Frame */}
                      <div className="absolute w-28 h-28 flex flex-col items-center justify-center pointer-events-none opacity-20">
                         {/* Top left */}
                         <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-brass rounded-tl-xl" />
                         {/* Top right */}
                         <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-brass rounded-tr-xl" />
                         {/* Bottom left */}
                         <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-brass rounded-bl-xl" />
                         {/* Bottom right */}
                         <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-brass rounded-br-xl" />
                      </div>

                      {qrs[div] ? (
                        <img src={qrs[div]} alt={`QR Code ${div}`} className="w-[220px] h-[220px] object-contain relative z-10 bg-white p-2 rounded-xl" />
                      ) : (
                        <div className="w-[220px] h-[220px] bg-gray-200 animate-pulse rounded-xl" />
                      )}
                    </div>
                  </div>
                  
                  {/* Ribbon */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-clay text-white px-8 py-2.5 rounded-full font-bold text-xs tracking-[0.15em] uppercase shadow-lg whitespace-nowrap z-30">
                    {div === 'FY' ? 'FIRST YEAR' : `DIVISION ${div}`}
                  </div>
                </div>

                <div className="mt-8 z-20 text-center font-bold text-sm tracking-wider text-ink bg-white/70 border border-white px-5 py-2 rounded-full shadow-sm">
                  ELRC - E Learning Resource Centre
                </div>
              </div>

              {/* Descriptive Text */}
              <div className="text-center z-20 px-8 relative mt-1">
                <p className="text-2xl font-display font-medium text-ink leading-snug">
                  Access study materials, resources,<br/>
                  notes and more – <span className="text-clay italic">instantly!</span>
                </p>
                <p className="mt-4 text-xs font-bold text-ink/70 uppercase tracking-widest bg-ink/5 inline-block px-4 py-1 rounded-full">
                  EduScan - Initiative By ZGenTech
                </p>
              </div>

              {/* Features Pill */}
              <div className="bg-[#F6F4EB] rounded-2xl shadow-neu-flat border border-white/60 w-full max-w-[95%] mx-auto py-4 px-6 flex justify-between items-center z-20 mt-6 mb-2">
                {/* Column 1 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 bg-white rounded-full shadow-neu-pressed flex items-center justify-center text-brass mb-2">
                    <Book size={18} strokeWidth={2} />
                  </div>
                  <p className="text-[9px] font-bold text-center leading-tight tracking-wider text-ink/80">STUDY<br/>MATERIALS</p>
                </div>
                <div className="w-px h-10 bg-ink/10" />
                {/* Column 2 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 bg-white rounded-full shadow-neu-pressed flex items-center justify-center text-brass mb-2">
                    <FileText size={18} strokeWidth={2} />
                  </div>
                  <p className="text-[9px] font-bold text-center leading-tight tracking-wider text-ink/80">CLASS NOTES<br/>& RESOURCES</p>
                </div>
                <div className="w-px h-10 bg-ink/10" />
                {/* Column 3 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 bg-white rounded-full shadow-neu-pressed flex items-center justify-center text-brass mb-2">
                    <GraduationCap size={20} strokeWidth={2} />
                  </div>
                  <p className="text-[9px] font-bold text-center leading-tight tracking-wider text-ink/80">LEARN<br/>ANYTIME</p>
                </div>
                <div className="w-px h-10 bg-ink/10" />
                {/* Column 4 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 bg-white rounded-full shadow-neu-pressed flex items-center justify-center text-brass mb-2">
                    <Lightbulb size={20} strokeWidth={2} />
                  </div>
                  <p className="text-[9px] font-bold text-center leading-tight tracking-wider text-ink/80">GROW<br/>EVERYDAY</p>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

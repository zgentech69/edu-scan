'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { Printer } from 'lucide-react';

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
            margin: 1,
            color: {
              dark: '#000000',
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
              <img src={qrs[div]} alt={`QR Code for Division ${div}`} className="w-64 h-64 rounded-xl shadow-neu-pressed" />
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
      <div className="hidden print:block w-full">
        {DIVISIONS.map(div => {
          if (printingDiv !== 'all' && printingDiv !== div) return null;
          
          return (
            <div key={`print-${div}`} className="print:flex print:flex-col print:items-center print:justify-between w-full h-screen break-after-page p-12 print:bg-white relative overflow-hidden">
              
              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-full h-6 bg-sand-900" />
              <div className="absolute bottom-0 left-0 w-full h-6 bg-sand-900" />
              
              <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-sand-200/40 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-sand-200/40 rounded-full blur-3xl" />

              {/* Header */}
              <div className="text-center mt-12 relative z-10 w-full">
                <div className="inline-block border-b-4 border-sand-200 pb-6 mb-6 px-16">
                  <h1 className="text-[5.5rem] font-display font-black text-sand-900 tracking-tighter leading-none">EduScan</h1>
                </div>
                <p className="text-3xl text-sand-900/60 font-bold tracking-[0.25em] uppercase">Smart Campus Access</p>
              </div>

              {/* QR Code Area */}
              <div className="flex flex-col items-center my-auto relative z-10 w-full max-w-3xl">
                <div className="bg-sand-900 text-sand-50 px-20 py-6 rounded-full mb-16 shadow-2xl">
                  <h2 className="text-7xl font-display font-black tracking-wider">DIVISION {div}</h2>
                </div>
                
                <div className="p-8 bg-white rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-2 border-sand-100">
                  {qrs[div] && (
                    <img src={qrs[div]} alt={`QR Code ${div}`} className="w-[450px] h-[450px] rounded-2xl" />
                  )}
                </div>

                <div className="mt-20 text-center space-y-4">
                  <p className="text-5xl font-display font-bold text-sand-900 tracking-tight">
                    Scan with your phone
                  </p>
                  <p className="text-3xl font-medium text-sand-900/60">
                    to access study material & resources
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="relative z-10 flex flex-col items-center w-full pb-8">
                <div className="w-24 h-1.5 bg-sand-300 rounded-full mb-8" />
                <p className="text-2xl font-black text-sand-900 mb-2 tracking-wide uppercase">Developed By ZGenTech</p>
                <p className="text-xl text-sand-900/50 font-bold tracking-widest">zgentech.netlify.app</p>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}

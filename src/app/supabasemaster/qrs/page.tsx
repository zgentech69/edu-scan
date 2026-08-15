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
            <div key={`print-${div}`} className="print:flex print:flex-col print:items-center print:justify-between w-full h-screen break-after-page py-16">
              
              {/* Header */}
              <div className="text-center mt-8">
                <h1 className="text-6xl font-black text-black tracking-tighter mb-2">EduScan</h1>
                <p className="text-2xl text-gray-600 font-bold tracking-widest uppercase">Smart Campus Access</p>
              </div>

              {/* QR Code Area */}
              <div className="flex flex-col items-center my-auto">
                <div className="px-10 py-4 border-4 border-black rounded-3xl mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h2 className="text-6xl font-black text-black tracking-tight">Division {div}</h2>
                </div>
                
                <div className="p-4 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                  {qrs[div] && (
                    <img src={qrs[div]} alt={`QR Code ${div}`} className="w-[450px] h-[450px]" />
                  )}
                </div>

                <p className="mt-12 text-3xl font-bold text-center text-black">
                  Scan this QR code to access<br/>study material for your division
                </p>
              </div>

              {/* Footer */}
              <div className="text-center w-full max-w-2xl border-t-4 border-black pt-8 mb-8">
                <p className="text-2xl font-black text-black mb-1 tracking-wide">Developed By ZGenTech</p>
                <p className="text-xl text-gray-600 font-semibold">zgentech.netlify.app</p>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}

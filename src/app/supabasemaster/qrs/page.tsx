'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { Printer } from 'lucide-react';

const DIVISIONS = ['A', 'B', 'C', 'D'];

export default function QrCodesPage() {
  const [qrs, setQrs] = useState<Record<string, string>>({});

  useEffect(() => {
    // We generate the QRs pointing to the current domain
    const generateQRs = async () => {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com';
      const qrData: Record<string, string> = {};
      
      for (const div of DIVISIONS) {
        const url = `${origin}/scan/${div}`;
        try {
          qrData[div] = await QRCode.toDataURL(url, {
            width: 400,
            margin: 2,
            color: {
              dark: '#2D2A26',
              light: '#EBE7E0'
            }
          });
        } catch (err) {
          console.error(err);
        }
      }
      setQrs(qrData);
    };

    generateQRs();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-display font-bold text-sand-900">QR Codes</h2>
          <p className="text-sand-900/60 mt-1">Print these and stick them in the classrooms.</p>
        </div>
        <NeumorphicCard onClick={handlePrint} className="px-4 py-2 flex items-center gap-2 font-semibold">
          <Printer size={18} /> Print All
        </NeumorphicCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-12">
        {DIVISIONS.map(div => (
          <div key={div} className="bg-sand-100 shadow-neu-flat print:shadow-none print:border print:border-sand-300 rounded-3xl p-8 flex flex-col items-center border border-white/40">
            <h3 className="text-3xl font-display font-bold text-sand-900 mb-6">Division {div}</h3>
            {qrs[div] ? (
              <img src={qrs[div]} alt={`QR Code for Division ${div}`} className="w-64 h-64 rounded-xl shadow-neu-pressed print:shadow-none" />
            ) : (
              <div className="w-64 h-64 bg-sand-200 animate-pulse rounded-xl" />
            )}
            <p className="mt-6 text-sand-900/60 font-medium text-center">
              Scan to access First Year<br/>subjects for Division {div}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

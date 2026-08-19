'use client';

import { useState } from 'react';
import { Link as LinkIcon, Check } from 'lucide-react';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';

export function ShareHodLink({ branchId }: { branchId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const link = `${origin}/supabasemaster?hod=${branchId}`;
    
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-2 p-3 bg-sand-100 rounded-xl shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed transition-all text-sand-900 font-medium text-sm"
      title="Copy Share Link for HOD"
    >
      {copied ? <Check size={18} className="text-green-600" /> : <LinkIcon size={18} />}
      <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share HOD Link'}</span>
    </button>
  );
}

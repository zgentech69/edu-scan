'use client';

import { supabase } from '@/lib/supabase';
import { Download, ExternalLink } from 'lucide-react';

interface AccessMaterialButtonProps {
  subjectId: string;
  url: string;
}

export function AccessMaterialButton({ subjectId, url }: AccessMaterialButtonProps) {
  const handleClick = async () => {
    // Fire and forget the RPC to increment view count
    supabase.rpc('increment_subject_view', { subject_id_param: subjectId })
      .then(({ error }) => {
        if (error) console.error('Failed to increment view count:', error);
      });
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full" onClick={handleClick}>
      <div className="w-full p-5 rounded-2xl flex items-center justify-center gap-3 bg-sand-900 text-sand-50 shadow-xl hover:bg-black active:scale-[0.98] transition-all cursor-pointer border border-white/20">
        <Download size={22} className="text-sand-200" />
        <span className="font-semibold text-lg text-sand-50 tracking-wide">Access Material</span>
        <ExternalLink size={18} className="ml-1 text-sand-300 opacity-80" />
      </div>
    </a>
  );
}

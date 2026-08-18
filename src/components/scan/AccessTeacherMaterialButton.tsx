'use client';

import { supabase } from '@/lib/supabase';
import { ExternalLink, User } from 'lucide-react';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';

interface AccessTeacherMaterialButtonProps {
  subjectId: string;
  url: string;
  teacherName: string;
}

export function AccessTeacherMaterialButton({ subjectId, url, teacherName }: AccessTeacherMaterialButtonProps) {
  const handleClick = async () => {
    supabase.rpc('increment_subject_view', { subject_id_param: subjectId })
      .then(({ error }) => {
        if (error) console.error('Failed to increment view count:', error);
      });
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full" onClick={handleClick}>
      <NeumorphicCard className="w-full p-5 flex items-center justify-between group hover:bg-sand-50 transition-all duration-300">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-sand-100 shadow-neu-pressed flex items-center justify-center text-sand-900/60 group-hover:text-sand-900 transition-colors">
            <User size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="font-display font-bold text-xl text-sand-900 group-hover:text-sand-950 transition-colors">
              {teacherName || 'Unknown Teacher'}
            </h4>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-sand-900 text-sand-50 shadow-xl flex items-center justify-center group-hover:bg-sand-950 group-hover:scale-105 active:scale-95 transition-all duration-300">
          <ExternalLink size={20} strokeWidth={2.5} />
        </div>
      </NeumorphicCard>
    </a>
  );
}

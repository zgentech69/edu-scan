import { supabase } from '@/lib/supabase';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { Edit2, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*, drive_links(*)')
    .order('name');

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-100/50 rounded-xl shadow-neu-pressed">
        Error loading data from Supabase. Make sure your NEXT_PUBLIC_SUPABASE_URL and KEY are set.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-sand-900">Manage Subjects</h2>
        <NeumorphicCard className="px-4 py-2 flex items-center gap-2 text-sm font-semibold">
          <Plus size={16} /> Add Subject
        </NeumorphicCard>
      </div>

      <div className="grid gap-6">
        {subjects?.map((subject) => (
          <div key={subject.id} className="bg-sand-100 shadow-neu-flat rounded-2xl p-6 border border-white/40">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-display font-bold text-sand-900">{subject.name}</h3>
                <p className="text-sand-900/60 text-sm mt-1">{subject.description}</p>
              </div>
              <button className="text-sand-900/50 hover:text-sand-900 transition-colors p-2 shadow-neu-flat rounded-full active:shadow-neu-pressed active:scale-95">
                <Edit2 size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {['A', 'B', 'C', 'D'].map(div => {
                const link = subject.drive_links?.find((l: any) => l.division === div);
                return (
                  <div key={div} className="flex flex-col gap-2 p-3 bg-sand-100 shadow-neu-pressed rounded-xl border border-white/10">
                    <span className="text-xs font-bold text-sand-900/50 uppercase">Division {div}</span>
                    {link?.url ? (
                      <a href={link.url} target="_blank" className="text-sm font-medium text-sand-900 truncate hover:underline flex items-center gap-1">
                        {link.url} <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-sm italic text-sand-900/40">No link set</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {subjects?.length === 0 && (
          <div className="text-center p-10 text-sand-900/50 italic">
            No subjects created yet.
          </div>
        )}
      </div>
    </div>
  );
}

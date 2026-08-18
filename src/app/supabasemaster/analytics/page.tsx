import { supabase } from '@/lib/supabase';
import { BarChart3, Eye, TrendingUp } from 'lucide-react';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AnalyticsPage() {
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('name, branch, semester, view_count')
    .order('view_count', { ascending: false });

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-100/50 rounded-xl shadow-neu-pressed">
        Error loading analytics data.
      </div>
    );
  }

  const totalViews = subjects?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0;
  const topSubject = subjects?.[0];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-3xl font-display font-bold text-sand-900">Analytics Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NeumorphicCard className="p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-sand-100 shadow-neu-pressed flex items-center justify-center text-clay">
            <Eye size={28} />
          </div>
          <div>
            <p className="text-sand-900/60 font-medium text-sm uppercase tracking-wider">Total Material Accesses</p>
            <h3 className="text-4xl font-display font-black text-sand-900">{totalViews}</h3>
          </div>
        </NeumorphicCard>

        <NeumorphicCard className="p-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-sand-100 shadow-neu-pressed flex items-center justify-center text-green-600">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sand-900/60 font-medium text-sm uppercase tracking-wider">Most Popular Subject</p>
            <h3 className="text-2xl font-display font-bold text-sand-900 leading-tight">
              {topSubject?.name || 'N/A'}
            </h3>
            {topSubject && (
              <p className="text-sand-900/70 text-sm font-medium">
                {topSubject.view_count} views • {topSubject.branch || 'First Year'}
              </p>
            )}
          </div>
        </NeumorphicCard>
      </div>

      <NeumorphicCard className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-sand-100 shadow-neu-flat flex items-center justify-center text-sand-900">
            <BarChart3 size={20} />
          </div>
          <h3 className="text-2xl font-display font-bold text-sand-900">Subject Leaderboard</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-white/40">
                <th className="pb-4 pt-2 px-4 font-semibold text-sand-900/60 tracking-wider uppercase text-sm">Rank</th>
                <th className="pb-4 pt-2 px-4 font-semibold text-sand-900/60 tracking-wider uppercase text-sm">Subject Name</th>
                <th className="pb-4 pt-2 px-4 font-semibold text-sand-900/60 tracking-wider uppercase text-sm">Context</th>
                <th className="pb-4 pt-2 px-4 font-semibold text-sand-900/60 tracking-wider uppercase text-sm text-right">Access Count</th>
              </tr>
            </thead>
            <tbody>
              {subjects?.map((subject, index) => (
                <tr 
                  key={index} 
                  className="border-b border-white/20 last:border-0 hover:bg-sand-100/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700 shadow-sm' : 
                      index === 1 ? 'bg-gray-200 text-gray-700 shadow-sm' : 
                      index === 2 ? 'bg-amber-100/50 text-amber-700 shadow-sm' : 
                      'text-sand-900/40'
                    }`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-sand-900">
                    {subject.name}
                  </td>
                  <td className="py-4 px-4 text-sand-900/60 text-sm font-medium">
                    {subject.branch ? `${subject.branch} (Sem ${subject.semester})` : `First Year (Sem ${subject.semester})`}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 font-bold text-sand-900 bg-sand-100 px-3 py-1 rounded-full shadow-neu-pressed text-sm border border-sand-200/50">
                      <Eye size={14} className="text-clay" />
                      {subject.view_count || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!subjects || subjects.length === 0) && (
            <div className="text-center py-10 text-sand-900/50 italic">
              No subjects found.
            </div>
          )}
        </div>
      </NeumorphicCard>
    </div>
  );
}

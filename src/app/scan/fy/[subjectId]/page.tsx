import { supabase } from '@/lib/supabase';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { ArrowLeft, ExternalLink, FileText, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FY_SECRET } from '@/lib/tokens';

export const dynamic = 'force-dynamic';

export default async function FYSubjectDetailPage({ params, searchParams }: { params: { subjectId: string }, searchParams: { t?: string } }) {
  if (searchParams.t !== FY_SECRET) {
    return (
      <main className="flex-1 w-full p-6 max-w-md mx-auto relative overflow-hidden flex flex-col items-center justify-center">
        <h1 className="text-2xl font-display font-bold text-sand-900 mb-4 text-center">Unauthorized</h1>
        <p className="text-sand-900/60 font-medium text-center">Invalid access token. Please scan the QR code again.</p>
      </main>
    );
  }

  // Fetch subject
  const { data: subject, error: subjectError } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', params.subjectId)
    .single();

  if (subjectError || !subject) {
    notFound();
  }

  // Fetch teacher links for this FY subject
  const { data: driveLinks, error: linksError } = await supabase
    .from('drive_links')
    .select('*')
    .eq('subject_id', subject.id)
    .eq('division', 'FY')
    .order('teacher_name');

  return (
    <main className="flex-1 w-full p-6 max-w-md mx-auto flex flex-col">
      <header className="pt-6 pb-8 flex items-center">
        <Link href={`/scan/fy?t=${searchParams.t}`} className="p-3 rounded-full shadow-neu-flat text-sand-900 hover:shadow-neu-sm active:shadow-neu-pressed transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div className="ml-4">
          <h2 className="text-sm font-semibold tracking-wider text-sand-900/60 uppercase">
            First Year
          </h2>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="bg-sand-100 shadow-neu-flat rounded-3xl p-8 border border-white/50 mb-8 relative overflow-hidden">
          {/* Decorative circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-sand-200/20 rounded-full blur-2xl" />
          
          <div className="w-16 h-16 rounded-2xl bg-sand-100 shadow-neu-pressed flex items-center justify-center text-sand-900 mb-6">
            <FileText size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-sand-900 leading-tight mb-3">
            {subject.name}
          </h1>
          {subject.description && (
            <p className="text-sand-900/70 text-base leading-relaxed">
              {subject.description}
            </p>
          )}
        </div>

        <div className="mt-2 pb-8 flex flex-col gap-4">
          <h3 className="font-display font-bold text-xl text-sand-900 mb-2 px-2">Select Teacher</h3>
          
          {(!driveLinks || driveLinks.length === 0) ? (
            <div className="text-center p-6 bg-sand-100 shadow-neu-pressed rounded-2xl border border-sand-200/50">
              <p className="text-sand-900/60 font-medium">Material not yet uploaded for this subject.</p>
            </div>
          ) : (
            driveLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                <NeumorphicCard className="w-full p-4 flex items-center justify-between group hover:bg-sand-100/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-sand-200/50 shadow-inner flex items-center justify-center text-sand-900/70">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-lg text-sand-900 group-hover:text-sand-900/90 transition-colors">
                        {link.teacher_name || 'Unknown Teacher'}
                      </h4>
                      <p className="text-xs text-sand-900/50 font-medium mt-0.5">View Notes</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-sand-900 text-sand-50 shadow-xl flex items-center justify-center group-hover:scale-105 active:scale-95 transition-all">
                    <ExternalLink size={18} />
                  </div>
                </NeumorphicCard>
              </a>
            ))
          )}
          
          {driveLinks && driveLinks.length > 0 && (
             <p className="text-center text-sm font-medium text-red-600/90 mt-4">
               * Use GIT official mails only to access
             </p>
          )}
        </div>
      </div>
    </main>
  );
}

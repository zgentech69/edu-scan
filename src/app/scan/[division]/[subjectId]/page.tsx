import { supabase } from '@/lib/supabase';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { ArrowLeft, ChevronDown, FileText } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DIVISION_SECRETS } from '@/lib/tokens';
import { AccessTeacherMaterialButton } from '@/components/scan/AccessTeacherMaterialButton';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';

export default async function SubjectDetailPage({ params, searchParams }: { params: { division: string, subjectId: string }, searchParams: { t?: string, sem?: string } }) {
  const division = params.division.toUpperCase();

  if (searchParams.t !== DIVISION_SECRETS[division]) {
    return (
      <main className="flex-1 w-full p-6 max-w-md mx-auto relative overflow-hidden flex flex-col items-center justify-center">
        <h1 className="text-2xl font-display font-bold text-sand-900 mb-4 text-center">Unauthorized</h1>
        <p className="text-sand-900/60 font-medium text-center">Invalid access token. Please scan the QR code for this division again.</p>
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

  // Fetch teacher links for this subject
  const { data: driveLinks, error: linksError } = await supabase
    .from('drive_links')
    .select('*')
    .eq('subject_id', subject.id)
    .order('teacher_name');

  const hasLinks = driveLinks && driveLinks.length > 0;

  return (
    <main className="flex-1 w-full p-6 max-w-md mx-auto flex flex-col">
      <AnnouncementBanner division={division} sem={searchParams.sem} />
      <header className="pt-6 pb-8 flex items-center">
        <Link href={`/scan/${division}?t=${searchParams.t}${searchParams.sem ? `&sem=${searchParams.sem}` : ''}`} className="p-3 rounded-full shadow-neu-flat text-sand-900 hover:shadow-neu-sm active:shadow-neu-pressed transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div className="ml-4">
          <h2 className="text-sm font-semibold tracking-wider text-sand-900/60 uppercase">
            Division {division}
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
            driveLinks.map((link) => {
              if (!link.teacher_name) return null; // Fallback for any old division links
              return (
                <AccessTeacherMaterialButton 
                  key={link.id} 
                  subjectId={subject.id} 
                  url={link.url} 
                  teacherName={link.teacher_name} 
                />
              );
            })
          )}
          
          {hasLinks && (
             <p className="text-center text-sm font-medium text-red-600/90 mt-4">
               * Use GIT official mails only to access
             </p>
          )}
        </div>
      </div>
    </main>
  );
}

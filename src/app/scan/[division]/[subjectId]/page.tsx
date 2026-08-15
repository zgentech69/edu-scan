import { supabase } from '@/lib/supabase';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DIVISION_SECRETS } from '@/lib/tokens';

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

  // Fetch drive link for this division
  const { data: driveLink, error: linkError } = await supabase
    .from('drive_links')
    .select('*')
    .eq('subject_id', subject.id)
    .eq('division', division)
    .single();

  const hasLink = driveLink && driveLink.url;

  return (
    <main className="flex-1 w-full p-6 max-w-md mx-auto flex flex-col">
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

        <div className="mt-8 pb-8 flex flex-col gap-3">
          {hasLink ? (
            <>
              <a href={driveLink.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                <div className="w-full p-5 rounded-2xl flex items-center justify-center gap-3 bg-sand-900 text-sand-50 shadow-xl hover:bg-black active:scale-[0.98] transition-all cursor-pointer border border-white/20">
                  <Download size={22} className="text-sand-200" />
                  <span className="font-semibold text-lg text-sand-50 tracking-wide">Access Material</span>
                  <ExternalLink size={18} className="ml-1 text-sand-300 opacity-80" />
                </div>
              </a>
              <p className="text-center text-sm font-medium text-red-600/90 mt-1">
                * Use GIT official mails only to access
              </p>
              <div className="bg-sand-100/60 rounded-xl p-4 mt-4 border border-sand-200/60 shadow-neu-flat">
                <p className="text-center text-sm font-medium text-sand-900/80 leading-relaxed">
                  <span className="font-bold text-sand-900 block mb-1">💡 Quick Tip</span> 
                  Once in Drive, tap the menu icon (≡) in the top-left corner to easily browse other subjects and teacher documents!
                </p>
              </div>
            </>
          ) : (
            <div className="text-center p-6 bg-sand-100 shadow-neu-pressed rounded-2xl border border-sand-200/50">
              <p className="text-sand-900/60 font-medium">Material not yet uploaded for Division {division}.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

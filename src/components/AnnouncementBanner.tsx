import { supabase } from '@/lib/supabase';
import { unstable_cache } from 'next/cache';
import { Megaphone } from 'lucide-react';

const getGlobalAnnouncement = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('app_settings')
      .select('announcement_text, is_active')
      .eq('id', 1)
      .single();
    
    return data;
  },
  ['global-announcement'],
  { revalidate: 60 }
);

const getBranchAnnouncement = unstable_cache(
  async (branchId: string) => {
    const { data } = await supabase
      .from('branch_announcements')
      .select('announcement_text, is_active')
      .eq('id', branchId)
      .single();
    
    return data;
  },
  ['branch-announcement'],
  { revalidate: 60 }
);

export async function AnnouncementBanner({ division, sem }: { division?: string, sem?: number | string }) {
  const globalAnn = await getGlobalAnnouncement();
  
  let branchAnn = null;
  if (division && sem) {
    const isSE = division.startsWith('SE-');
    let year = 'FE';
    let branch = '';
    
    if (isSE) {
      year = 'SE';
      branch = division.split('-')[1] || '';
    }
    
    const branchId = `${year}-${sem}-${branch}`;
    try {
      branchAnn = await getBranchAnnouncement(branchId);
    } catch (err) {
      // ignore
    }
  }

  const hasGlobal = globalAnn?.is_active && globalAnn?.announcement_text;
  const hasBranch = branchAnn?.is_active && branchAnn?.announcement_text;

  if (!hasGlobal && !hasBranch) {
    return null;
  }

  return (
    <div className="w-full bg-clay text-sand-50 shadow-md z-50 sticky top-0 flex flex-col">
      {hasGlobal && (
        <div className="py-3 px-4 flex items-center justify-center gap-3">
          <Megaphone size={18} className="animate-pulse shrink-0" />
          <p className="font-medium text-sm text-center max-w-3xl">
            {globalAnn.announcement_text}
          </p>
        </div>
      )}
      {hasBranch && branchAnn && (
        <div className={`py-3 px-4 flex items-center justify-center gap-3 ${hasGlobal ? 'bg-clay/90 border-t border-white/10' : ''}`}>
          <Megaphone size={18} className="animate-pulse shrink-0 text-yellow-300" />
          <p className="font-medium text-sm text-center max-w-3xl text-yellow-50">
            {branchAnn.announcement_text}
          </p>
        </div>
      )}
    </div>
  );
}

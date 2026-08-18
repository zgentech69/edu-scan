import { supabase } from '@/lib/supabase';
import { unstable_cache } from 'next/cache';
import { Megaphone } from 'lucide-react';

const getAnnouncement = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('app_settings')
      .select('announcement_text, is_active')
      .eq('id', 1)
      .single();
    
    return data;
  },
  ['global-announcement'],
  { revalidate: 60 } // Cache for 60 seconds
);

export async function AnnouncementBanner() {
  const announcement = await getAnnouncement();

  if (!announcement || !announcement.is_active || !announcement.announcement_text) {
    return null;
  }

  return (
    <div className="w-full bg-clay text-sand-50 py-3 px-4 shadow-md z-50 sticky top-0 flex items-center justify-center gap-3">
      <Megaphone size={18} className="animate-pulse" />
      <p className="font-medium text-sm text-center max-w-3xl">
        {announcement.announcement_text}
      </p>
    </div>
  );
}

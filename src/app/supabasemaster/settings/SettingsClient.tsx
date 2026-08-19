'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { saveAnnouncementAction, saveBranchAnnouncementAction } from '@/app/supabasemaster/actions';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { Megaphone, Save } from 'lucide-react';

export default function SettingsClient({ branchId }: { branchId?: string }) {
  const [announcement, setAnnouncement] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadSettings() {
      if (branchId) {
        const { data, error } = await supabase
          .from('branch_announcements')
          .select('*')
          .eq('id', branchId)
          .single();
        
        if (data) {
          setAnnouncement(data.announcement_text || '');
          setIsActive(data.is_active || false);
        }
      } else {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', 1)
          .single();
        
        if (data) {
          setAnnouncement(data.announcement_text || '');
          setIsActive(data.is_active || false);
        }
      }
      setIsLoading(false);
    }
    loadSettings();
  }, [branchId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    let res;
    if (branchId) {
      res = await saveBranchAnnouncementAction(branchId, announcement, isActive);
    } else {
      res = await saveAnnouncementAction(announcement, isActive);
    }

    if (res.success) {
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(res.error || 'Failed to save settings.');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="flex justify-center p-10"><div className="animate-pulse w-8 h-8 rounded-full bg-sand-300"></div></div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-display font-bold text-sand-900">App Settings</h2>

      <NeumorphicCard className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sand-100 shadow-neu-flat flex items-center justify-center text-clay">
            <Megaphone size={20} />
          </div>
          <h3 className="text-xl font-display font-bold text-sand-900">
            {branchId ? `Branch Announcement (${branchId})` : 'Global Announcement Banner'}
          </h3>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-sand-900 mb-2">Announcement Message</label>
            <textarea 
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder={branchId ? `e.g. ${branchId} practicals starting next week!` : "e.g. Mid-term timetable updated!"}
              className="w-full bg-sand-100 shadow-neu-pressed rounded-xl px-4 py-3 text-sand-900 outline-none focus:ring-2 focus:ring-clay border border-white/20 min-h-[100px]"
            />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input 
              type="checkbox" 
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded border-sand-300 text-clay focus:ring-clay"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-sand-900 cursor-pointer">
              Banner Active (Displays at the top of the student portal)
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-3 bg-sand-100 shadow-neu-flat rounded-xl font-semibold text-sand-900 hover:shadow-neu-sm active:shadow-neu-pressed disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
            
            {message && (
              <span className={`text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </span>
            )}
          </div>
        </form>
      </NeumorphicCard>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/supabasemaster/actions';
import { LogOut } from 'lucide-react';

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/supabasemaster');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-lg transition-colors border border-red-200/50"
      title="End admin session"
    >
      <LogOut size={13} />
      <span>Logout</span>
    </button>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/supabasemaster/actions';
import { LogOut, X } from 'lucide-react';

export function AdminLogoutButton() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    router.push('/supabasemaster');
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-lg transition-colors border border-red-200/50"
        title="End admin session"
      >
        <LogOut size={13} />
        <span>Logout</span>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
            onClick={() => !isLoggingOut && setShowConfirm(false)}
          />
          <div className="bg-sand-50 w-full max-w-sm rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-white/50 p-6 animate-in zoom-in-95 fade-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shadow-inner mb-4">
                <LogOut size={24} />
              </div>
              <h3 className="text-xl font-display font-bold text-sand-900 mb-2">Ready to leave?</h3>
              <p className="text-sand-900/60 font-medium text-sm mb-6">
                Are you sure you want to log out of the admin dashboard?
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowConfirm(false)}
                  disabled={isLoggingOut}
                  className="flex-1 py-2.5 bg-sand-200/50 hover:bg-sand-200 text-sand-900 font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

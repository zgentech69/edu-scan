'use client';

import { useState, useTransition } from 'react';
import { Link as LinkIcon, Check, Key, X, Loader2 } from 'lucide-react';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { setHodPasswordAction, removeHodPasswordAction } from '@/app/supabasemaster/actions';

export function ShareHodLink({ branchId, isAdmin = true }: { branchId: string, isAdmin?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleCopy = async () => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const link = `${origin}/supabasemaster?hod=${branchId}`;
    
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSetPassword = () => {
    setError('');
    setSuccessMsg('');
    if (!newPassword || newPassword.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    startTransition(async () => {
      const result = await setHodPasswordAction(branchId, newPassword);
      if (result.success) {
        setSuccessMsg('Password set successfully!');
        setNewPassword('');
        setTimeout(() => setShowPasswordModal(false), 2000);
      } else {
        setError(result.error || 'Failed to set password');
      }
    });
  };

  const handleRemovePassword = () => {
    setError('');
    setSuccessMsg('');
    
    startTransition(async () => {
      const result = await removeHodPasswordAction(branchId);
      if (result.success) {
        setSuccessMsg('Custom password removed. Reverted to global.');
        setTimeout(() => setShowPasswordModal(false), 2000);
      } else {
        setError(result.error || 'Failed to remove password');
      }
    });
  };

  return (
    <>
      <div className="flex gap-2">
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 p-3 bg-sand-100 rounded-xl shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed transition-all text-sand-900 font-medium text-sm"
          title="Copy Share Link for HOD"
        >
          {copied ? <Check size={18} className="text-green-600" /> : <LinkIcon size={18} />}
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share HOD Link'}</span>
        </button>

        {isAdmin && (
          <button 
            onClick={() => {
              setShowPasswordModal(true);
              setSuccessMsg('');
              setError('');
              setNewPassword('');
            }}
            className="flex items-center gap-2 p-3 bg-sand-100 rounded-xl shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed transition-all text-sand-900 font-medium text-sm"
            title="Set Custom Password"
          >
            <Key size={18} />
            <span className="hidden sm:inline">Set Password</span>
          </button>
        )}
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-sand-900/40 backdrop-blur-sm" onClick={() => !isPending && setShowPasswordModal(false)}></div>
          <NeumorphicCard className="relative w-full max-w-sm p-6 z-10 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-display font-bold text-xl text-sand-900 flex items-center gap-2">
                <Key size={20} className="text-sand-900/60" />
                HOD Password
              </h3>
              <button 
                onClick={() => !isPending && setShowPasswordModal(false)}
                className="p-2 hover:bg-sand-200/50 rounded-full transition-colors"
                disabled={isPending}
              >
                <X size={20} className="text-sand-900/60" />
              </button>
            </div>
            
            <p className="text-sm text-sand-900/70 font-medium leading-relaxed">
              Set a unique login password specifically for the <strong className="text-sand-900">{branchId}</strong> HOD link.
            </p>

            <div className="flex flex-col gap-2 mt-2">
              <input
                type="text"
                placeholder="New Password (min 4 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="p-3 rounded-xl bg-white/50 border border-sand-200 outline-none focus:border-sand-900 text-sand-900 font-medium w-full"
                disabled={isPending}
              />
              
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
              {successMsg && <p className="text-sm text-green-600 font-medium">{successMsg}</p>}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSetPassword}
                  disabled={isPending}
                  className="flex-1 bg-sand-900 text-white p-3 rounded-xl shadow-neu-flat hover:bg-black transition-colors font-bold flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isPending ? <Loader2 size={18} className="animate-spin" /> : 'Save Password'}
                </button>
                <button
                  onClick={handleRemovePassword}
                  disabled={isPending}
                  className="px-4 py-3 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition-colors disabled:opacity-50"
                  title="Remove custom password and revert to global"
                >
                  Reset
                </button>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      )}
    </>
  );
}

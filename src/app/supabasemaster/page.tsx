'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { Lock } from 'lucide-react';
import { loginAction } from './actions';

function LoginContent() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const hodBranch = searchParams.get('hod');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await loginAction(password, hodBranch || undefined);
    
    if (result.success) {
      router.push('/supabasemaster/dashboard');
    } else {
      setError(hodBranch ? 'Invalid HOD password' : 'Invalid admin password');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-sand-100 shadow-neu-flat rounded-3xl p-8 max-w-sm w-full border border-white/40">
        <div className="flex justify-center mb-6 text-sand-900">
          <div className="w-16 h-16 rounded-full bg-sand-100 shadow-neu-pressed flex items-center justify-center">
            <Lock size={28} />
          </div>
        </div>
        
        <h2 className="text-2xl font-display font-bold text-center text-sand-900 mb-6">
          {hodBranch ? `HOD Access` : 'Admin Access'}
        </h2>
        {hodBranch && (
          <p className="text-sm font-medium text-center text-sand-900/60 mb-4">
            Branch: {hodBranch}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              placeholder={hodBranch ? "Enter HOD password" : "Enter admin password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-sand-100 shadow-neu-pressed rounded-xl px-4 py-3 text-sand-900 outline-none focus:ring-2 focus:ring-sand-300 border border-white/10"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
          
          <NeumorphicCard type="submit" className="w-full flex justify-center py-3 font-semibold text-sand-900 items-center">
            Login
          </NeumorphicCard>
        </form>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="animate-pulse w-8 h-8 rounded-full bg-sand-300"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}


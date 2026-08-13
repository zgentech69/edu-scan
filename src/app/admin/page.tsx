'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { Lock } from 'lucide-react';
import { loginAction } from './actions';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await loginAction(password);
    
    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      setError('Invalid password');
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
          Admin Access
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              placeholder="Enter admin password"
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

import React from 'react';
import Link from 'next/link';
import { AdminLogoutButton } from '@/components/supabasemaster/AdminLogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand-100 flex flex-col">
      <header className="bg-sand-100 shadow-neu-flat border-b border-white/20 p-4 sticky top-0 z-30 print:hidden">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 select-none">
              <div className="w-8 h-8 rounded-xl bg-sand-900 flex items-center justify-center shadow-neu-pressed">
                <span className="text-sand-50 font-black text-lg leading-none">E</span>
              </div>
              <h1 className="text-2xl font-display font-black text-sand-900 tracking-tight">
                EduScan <span className="text-sand-900/40 font-medium tracking-normal">Admin</span>
              </h1>
            </div>
            <nav className="flex gap-4">
              <Link href="/supabasemaster/dashboard" className="text-sm font-medium text-sand-900/70 hover:text-sand-900">
                Dashboard
              </Link>
              <Link href="/supabasemaster/qrs" className="text-sm font-medium text-sand-900/70 hover:text-sand-900">
                QR Codes
              </Link>
            </nav>
          </div>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 print:max-w-none print:p-0 print:m-0">
        {children}
      </main>
    </div>
  );
}

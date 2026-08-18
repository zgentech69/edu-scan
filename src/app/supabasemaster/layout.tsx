import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { AdminLogoutButton } from '@/components/supabasemaster/AdminLogoutButton';
import { AdminSearchProvider } from '@/components/supabasemaster/SearchContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('admin_session');
  const expectedToken = process.env.ADMIN_SESSION_SECRET;
  
  const isAuthenticated = !!(expectedToken && authCookie?.value === expectedToken);

  return (
    <div className="min-h-screen bg-sand-100 flex flex-col">
      <AdminSearchProvider>
        <header className="bg-sand-100 shadow-neu-flat border-b border-white/20 p-4 sticky top-0 z-30 print:hidden">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 select-none">
                <h1 className="text-2xl font-display font-black text-sand-900 tracking-tight">
                  EduScan <span className="text-sand-900/40 font-medium tracking-normal">Admin</span>
                </h1>
              </div>
              {isAuthenticated && (
                <nav className="flex gap-4">
                  <Link href="/supabasemaster/dashboard" className="text-sm font-medium text-sand-900/70 hover:text-sand-900">
                    Dashboard
                  </Link>
                  <Link href="/supabasemaster/analytics" className="text-sm font-medium text-sand-900/70 hover:text-sand-900">
                    Analytics
                  </Link>
                  <Link href="/supabasemaster/qrs" className="text-sm font-medium text-sand-900/70 hover:text-sand-900">
                    QR Codes
                  </Link>
                  <Link href="/supabasemaster/settings" className="text-sm font-medium text-sand-900/70 hover:text-sand-900">
                    Settings
                  </Link>
                </nav>
              )}
            </div>
            {isAuthenticated && <AdminLogoutButton />}
          </div>
        </header>
        <main className="flex-1 max-w-4xl w-full mx-auto p-6 print:max-w-none print:p-0 print:m-0">
          {children}
        </main>
      </AdminSearchProvider>
    </div>
  );
}

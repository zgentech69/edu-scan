import React from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand-100 flex flex-col">
      <header className="bg-sand-100 shadow-neu-flat border-b border-white/20 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-display font-bold text-sand-900">Admin Panel</h1>
          <nav className="flex gap-4">
            <Link href="/admin/dashboard" className="text-sm font-medium text-sand-900/70 hover:text-sand-900">
              Dashboard
            </Link>
            <Link href="/admin/qrs" className="text-sm font-medium text-sand-900/70 hover:text-sand-900">
              QR Codes
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        {children}
      </main>
    </div>
  );
}

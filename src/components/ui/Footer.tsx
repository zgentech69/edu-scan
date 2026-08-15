'use client';

import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // Hide footer on the QR codes page (or anywhere else needed)
  if (pathname?.includes('/supabasemaster/qrs')) {
    return null;
  }

  return (
    <footer className="w-full py-6 mt-auto border-t border-ink/10 print:hidden bg-paper">
      <div className="text-center text-sm text-ink/60 font-medium">
        Made by <a href="https://zgentech.netlify.app" target="_blank" rel="noopener noreferrer" className="text-ink font-bold hover:underline transition-all">ZGenTech Team</a>
      </div>
    </footer>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on the home page or root
  if (!pathname || pathname === '/') return null;

  const paths = pathname.split('/').filter((p) => p !== '');

  // Format the display strings
  const formatText = (text: string, index: number) => {
    if (text === 'scan') return 'Scan';
    if (text === 'supabasemaster') return 'Admin Panel';
    if (text === 'dashboard') return 'Dashboard';
    if (text === 'qrs') return 'QR Codes';
    
    // For division A, B, C, D
    if (index === 1 && paths[0] === 'scan') return `Division ${text.toUpperCase()}`;
    
    // For subject ID, since it's a UUID or generic ID, we show a friendly name
    if (index === 2 && paths[0] === 'scan') return 'Subject Details';

    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <nav className="w-full px-6 py-4 bg-paper sticky top-0 z-50 shadow-sm border-b border-ink/5 print:hidden">
      <ol className="flex items-center space-x-2 text-sm text-ink/60 max-w-2xl mx-auto overflow-x-auto whitespace-nowrap hide-scrollbar">
        <li>
          <Link href="/" className="hover:text-ink transition-colors flex items-center p-1 rounded-md hover:bg-sand-200">
            <Home className="w-4 h-4" />
          </Link>
        </li>
        
        {paths.map((path, index) => {
          // If we are looking at a specific subject, the link shouldn't be to /scan/A/id directly in breadcrumb if we can't fetch it, but it works as is.
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          const isLast = index === paths.length - 1;
          
          return (
            <li key={path} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1 opacity-50 flex-shrink-0" />
              {isLast ? (
                <span className="font-semibold text-ink font-display px-1">{formatText(path, index)}</span>
              ) : (
                <Link href={href} className="hover:text-ink transition-colors px-1 py-0.5 rounded-md hover:bg-sand-200">
                  {formatText(path, index)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

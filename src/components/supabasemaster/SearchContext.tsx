'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Search, X } from 'lucide-react';

interface SearchContextType {
  searchQuery: string;
}

const SearchContext = createContext<SearchContextType>({ searchQuery: '' });

export const useAdminSearch = () => useContext(SearchContext);

export function AdminSearchProvider({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 10);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  return (
    <SearchContext.Provider value={{ searchQuery }}>
      {children}
      
      {isSearchOpen && (
        <div className="fixed top-0 left-0 w-full z-50 p-4 animate-in slide-in-from-top-4 fade-in print:hidden pointer-events-none">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <div className="bg-sand-100 shadow-neu-flat rounded-2xl border border-white/50 p-2 flex items-center gap-3">
              <Search className="text-sand-900/40 ml-3" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search subjects or divisions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sand-900 placeholder:text-sand-900/40 font-medium py-2"
              />
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="p-2 hover:bg-sand-200 rounded-xl text-sand-900/60 hover:text-sand-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </SearchContext.Provider>
  );
}

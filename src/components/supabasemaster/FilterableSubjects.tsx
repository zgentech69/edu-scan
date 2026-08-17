'use client';

import { useAdminSearch } from './SearchContext';
import { SubjectEditor } from './SubjectEditor';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  semester: number;
  drive_links: any[];
};

export function FilterableSubjects({ subjects, title, emptyMessage }: { subjects: Subject[], title?: string, emptyMessage?: string }) {
  const { searchQuery } = useAdminSearch();

  const filtered = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filtered.length === 0 && searchQuery) {
    return null;
  }

  return (
    <div className="space-y-4">
      {title && <h3 className="text-xl font-display font-semibold text-sand-800 border-b border-sand-200 pb-2 mt-8">{title}</h3>}
      {emptyMessage && <p className="text-sm text-sand-900/60 mb-4">{emptyMessage}</p>}
      <div className="grid gap-6">
        {filtered.map(subject => (
          <SubjectEditor key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}

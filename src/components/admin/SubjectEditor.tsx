'use client';

import { useState } from 'react';
import { ExternalLink, Edit2, Check, X, Loader2 } from 'lucide-react';
import { saveDriveLink } from '@/app/admin/actions';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  drive_links: any[];
};

export function SubjectEditor({ subject }: { subject: Subject }) {
  const [editingDiv, setEditingDiv] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleEditClick = (div: string, currentUrl: string) => {
    setEditingDiv(div);
    setEditUrl(currentUrl);
    setError('');
  };

  const handleCancel = () => {
    setEditingDiv(null);
    setEditUrl('');
    setError('');
  };

  const handleSave = async (div: string) => {
    setIsSaving(true);
    setError('');
    
    // Optimistic check
    if (editUrl && !editUrl.startsWith('http')) {
      setError('URL must start with http:// or https://');
      setIsSaving(false);
      return;
    }

    const result = await saveDriveLink(subject.id, div, editUrl);
    
    if (result.success) {
      setEditingDiv(null);
    } else {
      setError(result.error || 'Failed to save');
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-sand-100 shadow-neu-flat rounded-2xl p-6 border border-white/40">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-display font-bold text-sand-900">{subject.name}</h3>
          <p className="text-sand-900/60 text-sm mt-1">{subject.description}</p>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {['A', 'B', 'C', 'D'].map(div => {
          const link = subject.drive_links?.find((l: any) => l.division === div);
          const currentUrl = link?.url || '';
          const isEditingThis = editingDiv === div;

          return (
            <div key={div} className="flex flex-col gap-2 p-3 bg-sand-100 shadow-neu-pressed rounded-xl border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-sand-900/50 uppercase">Division {div}</span>
                {!isEditingThis && (
                  <button onClick={() => handleEditClick(div, currentUrl)} className="text-sand-900/50 hover:text-sand-900 p-1 rounded-full">
                    <Edit2 size={14} />
                  </button>
                )}
              </div>
              
              {isEditingThis ? (
                <div className="flex flex-col gap-2 mt-1">
                  <input 
                    type="url" 
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full text-sm p-2 rounded bg-white/50 border border-sand-200 outline-none focus:border-sand-900 text-sand-900"
                    disabled={isSaving}
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                    <button 
                      onClick={() => handleSave(div)}
                      disabled={isSaving}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded flex items-center justify-center min-w-[28px]"
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {currentUrl ? (
                    <a href={currentUrl} target="_blank" className="text-sm font-medium text-sand-900 truncate hover:underline flex items-center gap-1">
                      {currentUrl} <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-sm italic text-sand-900/40">No link set</span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

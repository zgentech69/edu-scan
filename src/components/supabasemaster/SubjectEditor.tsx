'use client';

import { useState } from 'react';
import { ExternalLink, Edit2, Check, X, Loader2, Trash2, AlertTriangle, User, Plus } from 'lucide-react';
import { saveDriveLink, saveSubjectName, deleteSubjectAction, saveTeacherLink, deleteTeacherLink } from '@/app/supabasemaster/actions';

type Subject = {
  id: string;
  name: string;
  description: string | null;
  semester: number;
  drive_links: any[];
};

export function SubjectEditor({ subject }: { subject: Subject }) {
  const [editingDiv, setEditingDiv] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(subject.name);
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // FY States
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherUrl, setNewTeacherUrl] = useState('');
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);

  const isFirstYear = subject.semester === 1 || subject.semester === 2;

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
    
    const cleanUrl = editUrl.trim();
    
    if (cleanUrl && !cleanUrl.startsWith('http')) {
      setError('URL must start with http:// or https://');
      setIsSaving(false);
      return;
    }

    const result = await saveDriveLink(subject.id, div, cleanUrl);
    
    if (result.success) {
      setEditingDiv(null);
    } else {
      setError(result.error || 'Failed to save');
    }
    setIsSaving(false);
  };

  const handleSaveName = async () => {
    if (!editName.trim()) {
      setError('Subject name cannot be empty');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    const result = await saveSubjectName(subject.id, editName.trim());
    
    if (result.success) {
      setIsEditingName(false);
    } else {
      setError(result.error || 'Failed to save name');
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    
    const result = await deleteSubjectAction(subject.id);
    
    if (result.success) {
      setShowDeleteConfirm(false);
    } else {
      setError(result.error || 'Failed to delete');
    }
    setIsDeleting(false);
  };

  const handleAddTeacher = async () => {
    if (!newTeacherName.trim() || !newTeacherUrl.trim()) {
      setError('Both Teacher Name and URL are required.');
      return;
    }

    if (!newTeacherUrl.trim().startsWith('http')) {
      setError('URL must start with http:// or https://');
      return;
    }

    setIsAddingTeacher(true);
    setError('');

    const result = await saveTeacherLink(subject.id, newTeacherName.trim(), newTeacherUrl.trim());
    
    if (result.success) {
      setNewTeacherName('');
      setNewTeacherUrl('');
    } else {
      setError(result.error || 'Failed to add teacher');
    }
    setIsAddingTeacher(false);
  };

  const handleDeleteTeacher = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this teacher link?')) return;
    setError('');
    const result = await deleteTeacherLink(linkId, subject.id);
    if (!result.success) {
      setError(result.error || 'Failed to delete teacher');
    }
  };

  return (
    <div className="bg-sand-100 shadow-neu-flat rounded-2xl p-6 border border-white/40">
      <div className="flex justify-between items-start mb-4">
        <div className="w-full">
          {isEditingName ? (
            <div className="flex items-center gap-2 mb-1">
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-xl font-display font-bold text-sand-900 bg-white/50 border border-sand-200 rounded px-2 py-1 outline-none focus:border-sand-900 w-full max-w-sm"
                disabled={isSaving}
                autoFocus
              />
              <button 
                onClick={() => { setIsEditingName(false); setEditName(subject.name); setError(''); }}
                disabled={isSaving}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
              >
                <X size={16} />
              </button>
              <button 
                onClick={handleSaveName}
                disabled={isSaving}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded flex items-center justify-center min-w-[28px]"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-display font-bold text-sand-900">{subject.name}</h3>
              <button 
                onClick={() => setIsEditingName(true)} 
                className="text-sand-900/40 hover:text-sand-900 p-1 rounded-full transition-colors"
                title="Edit Name"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="text-red-500/60 hover:text-red-600 p-1 rounded-full transition-colors ml-auto"
                title="Delete Subject"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          <p className="text-sand-900/60 text-sm mt-1">{subject.description}</p>
          <div className="inline-block mt-2 px-2 py-1 bg-sand-200/50 rounded text-xs font-bold text-sand-900/60">
            {isFirstYear ? 'First Year Mode' : 'Division Mode'}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded-md">
          {error}
        </div>
      )}

      {isFirstYear ? (
        <div className="mt-6 border-t border-sand-200/50 pt-4">
          <h4 className="text-sm font-bold text-sand-900/50 uppercase mb-3">Teachers & Notes</h4>
          
          <div className="space-y-3 mb-4">
            {subject.drive_links?.filter(l => l.division === 'FY').map(link => (
              <div key={link.id} className="flex flex-col gap-2 p-3 bg-sand-100 shadow-neu-pressed rounded-xl border border-white/10">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <User size={16} className="text-sand-900/60" />
                       <span className="font-bold text-sand-900">{link.teacher_name}</span>
                    </div>
                    <button onClick={() => handleDeleteTeacher(link.id)} className="text-red-500/60 hover:text-red-600 p-1 rounded-full transition-colors">
                      <Trash2 size={14} />
                    </button>
                 </div>
                 <a href={link.url} target="_blank" className="text-sm font-medium text-sand-900 truncate hover:underline flex items-center gap-1">
                    {link.url} <ExternalLink size={12} />
                 </a>
              </div>
            ))}
            
            {subject.drive_links?.filter(l => l.division === 'FY').length === 0 && (
              <p className="text-sm italic text-sand-900/40">No teachers added yet.</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-2 mt-4">
             <input 
               type="text" 
               placeholder="Teacher Name (e.g., Prof. Sharma)" 
               value={newTeacherName}
               onChange={(e) => setNewTeacherName(e.target.value)}
               className="flex-1 text-sm p-2 rounded bg-white/50 border border-sand-200 outline-none focus:border-sand-900 text-sand-900"
               disabled={isAddingTeacher}
             />
             <input 
               type="url" 
               placeholder="Notes URL (https://...)" 
               value={newTeacherUrl}
               onChange={(e) => setNewTeacherUrl(e.target.value)}
               className="flex-[2] text-sm p-2 rounded bg-white/50 border border-sand-200 outline-none focus:border-sand-900 text-sand-900"
               disabled={isAddingTeacher}
             />
             <button
               onClick={handleAddTeacher}
               disabled={isAddingTeacher}
               className="bg-sand-900 text-white px-4 py-2 rounded shadow-neu-flat hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
             >
                {isAddingTeacher ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Add</>}
             </button>
          </div>
        </div>
      ) : (
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
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          />
          <div className="bg-sand-50 w-full max-w-sm rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-red-500/20 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-display font-bold text-sand-900 mb-2">Delete Subject?</h3>
            <p className="text-sand-900/70 mb-6 text-sm">
              Are you sure you want to delete <strong>{subject.name}</strong>? This action cannot be undone and will remove all associated drive links.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-sand-200 rounded-xl font-medium text-sand-900 hover:bg-sand-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-500 rounded-xl font-medium text-white hover:bg-red-600 shadow-neu-flat transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

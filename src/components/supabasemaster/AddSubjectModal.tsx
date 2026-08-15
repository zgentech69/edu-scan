'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createSubjectAction } from '@/app/supabasemaster/actions';

export function AddSubjectModal({ semester }: { semester: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isOptional, setIsOptional] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    setLoading(true);
    setError('');
    
    const res = await createSubjectAction(name, description, semester, isOptional);
    
    if (res.success) {
      setIsOpen(false);
      setName('');
      setDescription('');
      setIsOptional(false);
    } else {
      setError(res.error || 'Failed to create subject');
    }
    
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-sand-100 rounded-xl shadow-neu-flat hover:shadow-neu-sm active:shadow-neu-pressed transition-all text-sand-900 font-medium"
      >
        <Plus size={18} />
        Add Subject
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="bg-sand-50 w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-white/50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-bold text-sand-900">Add New Subject</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-sand-100 shadow-neu-flat flex items-center justify-center text-sand-600 hover:text-sand-900"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sand-800 mb-1">Subject Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Workshop"
                  className="w-full bg-sand-100 shadow-neu-pressed rounded-xl px-4 py-3 text-sand-900 outline-none focus:ring-2 focus:ring-sand-400 border border-white/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-sand-800 mb-1">Description (Optional)</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. First year workshop"
                  className="w-full bg-sand-100 shadow-neu-pressed rounded-xl px-4 py-3 text-sand-900 outline-none focus:ring-2 focus:ring-sand-400 border border-white/20"
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="isOptional"
                  checked={isOptional}
                  onChange={(e) => setIsOptional(e.target.checked)}
                  className="w-5 h-5 rounded border-sand-300 text-brass focus:ring-brass"
                />
                <label htmlFor="isOptional" className="text-sm font-medium text-sand-800">
                  Is this an optional subject?
                </label>
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-sand-100 shadow-neu-flat rounded-xl font-semibold text-sand-900 hover:shadow-neu-sm active:shadow-neu-pressed disabled:opacity-50 transition-all mt-4"
              >
                {loading ? 'Creating...' : 'Create Subject'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

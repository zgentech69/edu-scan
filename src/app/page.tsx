'use client';

import Image from 'next/image';
import { useState } from 'react';

const subjects = [
  { id: 'maths', name: 'Engineering Mathematics' },
  { id: 'physics', name: 'Engineering Physics' },
  { id: 'chemistry', name: 'Engineering Chemistry' },
  { id: 'bee', name: 'Basic Electrical Engineering' },
];

export default function Home() {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  return (
    <main className="min-h-[100dvh] flex flex-col items-center p-6 relative">
      
      {/* Top Logo Plaque */}
      <div className="w-16 h-16 mt-4 mb-8 rounded-2xl overflow-hidden shadow-plaque-inset border-[6px] border-paper relative">
        <Image 
          src="/logo.jpeg" 
          alt="Campus Logo" 
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      <div className="max-w-md w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
        
        {/* Division Plaque */}
        <div className="relative mb-6">
          <div className="w-48 h-48 rounded-[1.5rem] bg-paper shadow-plaque border-2 border-white/40 flex flex-col items-center justify-center relative">
            <h1 className="font-display font-bold text-9xl text-brass tracking-widest translate-x-3 drop-shadow-sm">
              A
            </h1>
          </div>
          {/* Screw details */}
          <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-ink/20 shadow-inner" />
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-ink/20 shadow-inner" />
          <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-ink/20 shadow-inner" />
          <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-ink/20 shadow-inner" />
        </div>

        {/* Utility Label */}
        <p className="font-mono text-sm text-ink/70 uppercase tracking-widest mb-12">
          First Year · Division A
        </p>

        {/* Subjects Buzzer Grid */}
        <div className="w-full grid grid-cols-2 gap-4">
          {subjects.map((subject) => {
            const isActive = activeSubject === subject.id;
            return (
              <button
                key={subject.id}
                onClick={() => {
                  setActiveSubject(subject.id);
                  // In a real app, this would navigate: router.push(`/scan/A/${subject.id}`)
                }}
                className={`
                  relative flex flex-col items-center justify-center text-center p-4 h-32 rounded-xl transition-all duration-150 ease-out border-2 border-white/30
                  ${isActive 
                    ? 'shadow-buzzer-pressed bg-paper/80 translate-y-1' 
                    : 'shadow-buzzer bg-paper hover:shadow-buzzer-pressed hover:translate-y-1'
                  }
                `}
              >
                <span className={`font-display text-lg leading-snug ${isActive ? 'text-brass font-bold' : 'text-ink font-medium'}`}>
                  {subject.name}
                </span>
                {isActive && (
                  <span className="absolute bottom-3 font-mono text-[10px] text-moss uppercase tracking-wider">
                    Selected
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </main>
  );
}

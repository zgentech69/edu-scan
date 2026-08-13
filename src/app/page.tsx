'use client';

import Image from 'next/image';
import { QrCode, Smartphone, Cloud, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-paper text-ink overflow-x-hidden selection:bg-brass selection:text-paper font-sans">
      {/* Decorative ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brass/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-moss/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center text-center pt-10 pb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
          {/* Logo Plaque */}
          <div className="w-24 h-24 mb-8 rounded-[2rem] overflow-hidden shadow-plaque-inset border-[6px] border-paper relative group">
            <Image 
              src="/logo.jpeg" 
              alt="Campus Logo" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="96px"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-black text-ink mb-6 tracking-tight leading-[1.1]">
            Campus QR <br/>
            <span className="text-brass">Subject Portal</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-ink/70 max-w-2xl font-sans mb-12 leading-relaxed">
            Instant access to First Year study materials. <br className="hidden md:block"/>
            Scan the door. Confirm your division. Download.
          </p>

          <div className="flex gap-4 items-center">
            <button className="bg-ink text-paper px-8 py-4 rounded-xl font-medium shadow-buzzer hover:shadow-buzzer-pressed hover:translate-y-1 transition-all duration-200 flex items-center gap-2 group">
              See Live Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-paper text-ink px-8 py-4 rounded-xl font-medium border-2 border-ink/10 shadow-buzzer hover:shadow-buzzer-pressed hover:translate-y-1 transition-all duration-200">
              Read the Docs
            </button>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-24 border-t border-ink/10">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            <h2 className="text-sm font-mono text-moss uppercase tracking-[0.2em] mb-4">How It Works</h2>
            <h3 className="text-4xl font-display font-bold">From hallway to study material in 10 seconds.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-paper p-8 rounded-[2rem] shadow-plaque border-2 border-white/50 hover:-translate-y-2 transition-transform duration-500 group">
              <div className="w-16 h-16 rounded-2xl bg-paper shadow-plaque-inset flex items-center justify-center mb-6">
                <QrCode className="w-8 h-8 text-brass group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-3">1. Scan the Door</h4>
              <p className="text-ink/70">Each First Year classroom division (A, B, C, D) has a unique QR code on the door. Just point your camera.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-paper p-8 rounded-[2rem] shadow-plaque border-2 border-white/50 hover:-translate-y-2 transition-transform duration-500 delay-100 group">
              <div className="w-16 h-16 rounded-2xl bg-paper shadow-plaque-inset flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8 text-brass group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-3">2. Pick a Subject</h4>
              <p className="text-ink/70">The app instantly confirms your division and shows a clean, tactile directory of all your current subjects.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-paper p-8 rounded-[2rem] shadow-plaque border-2 border-white/50 hover:-translate-y-2 transition-transform duration-500 delay-200 group">
              <div className="w-16 h-16 rounded-2xl bg-paper shadow-plaque-inset flex items-center justify-center mb-6">
                <Cloud className="w-8 h-8 text-brass group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-bold mb-3">3. Download</h4>
              <p className="text-ink/70">Tap a subject to get direct Google Drive links to all notes, syllabus, and study material. No login required.</p>
            </div>
          </div>
        </section>

        {/* FEATURES HIGHLIGHT */}
        <section className="py-24">
          <div className="bg-ink text-paper rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brass/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1">
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
                  Designed for speed. <br/> Built to scale.
                </h2>
                <p className="text-paper/70 text-lg mb-8 max-w-md">
                  A frictionless experience for students, and an effortless management system for admins.
                </p>
                
                <ul className="space-y-4">
                  {[
                    "Zero-login student access",
                    "Config-driven architecture",
                    "Native-feeling UI on the web",
                    "Direct Google Drive integration"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-moss" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decorative Plaque Showcase inside the dark section */}
              <div className="flex-1 w-full max-w-sm">
                <div className="bg-paper text-ink p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="font-mono text-xs uppercase tracking-widest text-ink/50 mb-4">Config Example</div>
                  <pre className="text-xs bg-ink/5 p-4 rounded-xl overflow-x-auto text-ink font-mono">
{`{
  "divisions": ["A", "B", "C", "D"],
  "subjects": [
    {
      "id": "maths",
      "name": "Eng. Mathematics",
      "driveLinks": {
        "A": "https://drive..."
      }
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}} />
    </main>
  );
}

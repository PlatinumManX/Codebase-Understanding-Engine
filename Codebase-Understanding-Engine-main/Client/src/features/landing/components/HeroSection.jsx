import React from 'react';
import Button from '../../../shared/components/Button';
import { NavLink } from 'react-router-dom';

export default function HeroSection({ zipRef }) {
  const scrollToNext = () => {
    const target = document.getElementById('decoding-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="landing" className="relative min-h-screen bg-[#040609] overflow-hidden flex flex-col justify-center items-center px-6 pt-28 pb-12 select-none">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:36px_36px] opacity-20 pointer-events-none" />
      
      {/* Glowing Mesh Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00f0ff]/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Content (Increased scale & width) */}
      <div className="max-w-5xl mx-auto text-center z-10 space-y-8">
        <h1 className="text-[52px] md:text-[80px] lg:text-[96px] font-extrabold tracking-tight text-white leading-[1.05]">
          Understand Any Backend <br className="hidden md:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-cyan-400 to-[#a855f7]">
            Codebase Instantly
          </span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-[21px] text-slate-300 font-sans leading-relaxed">
          AI-powered software architecture visualization, dependency mapping, execution flow tracing, and intelligent code understanding.
        </p>

        {/* Action buttons (Increased size to 16px) */}
        <div className="flex flex-wrap justify-center gap-5 pt-4">
          <NavLink to="/login">
            <Button variant="primary" size="lg" className="font-mono text-[16px] px-6 py-3 cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.2)] border-[#00f0ff]/50">
              Explore Platform
            </Button>
          </NavLink>
          <Button variant="outline" size="lg" onClick={scrollToNext} className="font-mono text-[16px] px-6 py-3 cursor-pointer border-[#3e4651] hover:border-slate-400">
            View Architecture Demo
          </Button>
        </div>
      </div>

      {/* Repository Card (Larger, rounded 2xl, glow hover, size details) */}
      <div 
        ref={zipRef}
        className="w-[360px] bg-[#0d1117]/90 border border-[#3e4651] rounded-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-20 flex items-center justify-between mt-20 relative cursor-pointer hover:border-[#00f0ff]/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all duration-300 group"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-15 h-15 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-9 h-9 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div className="min-w-0 font-mono">
            <p className="text-lg font-semibold text-white truncate font-mono">HospitalManagement.zip</p>
            <span className="text-[14px] text-slate-400">ZIP Source Archive | 14.5 MB</span>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 font-mono text-[11px] select-none cursor-pointer transition-colors" onClick={scrollToNext}>
        <span>Scroll to Decode</span>
        <svg className="w-4 h-4 animate-bounce text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

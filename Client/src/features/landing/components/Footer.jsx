import React from 'react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#020304] border-t border-[#1f2937]/15 py-12 md:py-16 px-6 font-mono select-none">
      {/* Blueprint grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 border border-[#00f0ff]/30 flex items-center justify-center">
                <span className="text-sm font-extrabold text-[#00f0ff]">CM</span>
              </div>
              <span className="text-lg font-bold tracking-wider text-white">CODEMAP<span className="text-[#00f0ff]">AI</span></span>
            </div>
            <p className="text-[17px] text-slate-300 font-sans leading-relaxed max-w-xs">
              Next-generation Software Architecture Visualizer & AST Parser. Building interactive dependency call graphs dynamically.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <h4 className="text-[20px] font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-2 text-[17px] text-slate-300">
              <a href="#landing" className="hover:text-[#00f0ff] transition-colors">Home</a>
              <a href="#decoding-section" className="hover:text-[#00f0ff] transition-colors">Features</a>
              <a href="#flow-section" className="hover:text-[#00f0ff] transition-colors">Workflow</a>
              <a href="#preview-section" className="hover:text-[#00f0ff] transition-colors">Demo</a>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-3.5">
            <h4 className="text-[20px] font-bold text-white uppercase tracking-wider">Resources</h4>
            <div className="flex flex-col gap-2 text-[17px] text-slate-300 font-mono">
              <a href="#docs" className="hover:text-[#00f0ff] transition-colors">Documentation</a>
              <a href="#pricing" className="hover:text-[#00f0ff] transition-colors">Pricing Plans</a>
              <a href="#about" className="hover:text-[#00f0ff] transition-colors">About Team</a>
              <a href="#contact" className="hover:text-[#00f0ff] transition-colors">Contact Us</a>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3.5">
            <h4 className="text-[20px] font-bold text-white uppercase tracking-wider">Tech Stack</h4>
            <p className="text-[17px] text-slate-300 font-sans leading-relaxed">
              React 19, Vite, Tailwind CSS v4, GSAP, Lenis, FastAPI, MongoDB, PyAST.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-slate-500 hover:text-white transition-colors"
                title="GitHub Repository"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright details and back to top button */}
        <div className="border-t border-[#1f2937]/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[15px] text-slate-400 font-sans text-center sm:text-left space-y-1">
            <p>CodeMap AI © 2026. Designed and developed as a Final Year Project.</p>
            <p>Department of Computer Engineering | MPR Project Guide Coordinator</p>
          </div>
          
          <button
            onClick={scrollToTop}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#30363d] hover:border-slate-400 bg-[#0d1117]/50 text-slate-400 hover:text-white text-xs transition-all cursor-pointer font-sans"
          >
            <span>Back to Top</span>
            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7M12 3v18" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

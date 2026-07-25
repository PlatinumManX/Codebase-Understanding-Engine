import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [atmosphereDots, setAtmosphereDots] = useState([]);

  // Generate background atmospheric dots on mount
  useEffect(() => {
    const dots = [];
    for (let i = 0; i < 45; i++) {
      dots.push({
        id: i,
        width: Math.random() * 4 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.5,
      });
    }
    setAtmosphereDots(dots);
  }, []);

  const nodes = [
    { id: 0, x: 400, y: 200, r: 25, color: '#2563eb', name: 'Main' },
    { id: 1, x: 200, y: 100, r: 18, color: '#7c3aed', name: 'Parser' },
    { id: 2, x: 200, y: 300, r: 18, color: '#006242', name: 'Auth' },
    { id: 3, x: 600, y: 100, r: 18, color: '#7c3aed', name: 'UI' },
    { id: 4, x: 600, y: 300, r: 18, color: '#7c3aed', name: 'Graph' },
    { id: 5, x: 100, y: 200, r: 12, color: '#ba1a1a', name: 'Utils' },
    { id: 6, x: 700, y: 200, r: 12, color: '#434655', name: 'API' }
  ];

  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 5], [3, 6], [4, 6]
  ];

  return (
    <div className="font-sans antialiased overflow-x-hidden bg-canvas text-on-surface">
      {/* Top Header Navigation */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md z-50 border-b border-outline-variant/30 px-8 flex justify-between items-center select-none">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
            <span className="font-display text-xl font-bold text-primary tracking-tight">CodeMap AI</span>
          </NavLink>
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink to="/" className="text-sm font-semibold text-primary">Home</NavLink>
            <a className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#features">Features</a>
            <NavLink to="/docs" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Docs</NavLink>
            <NavLink to="/pricing" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Pricing</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <NavLink to="/login" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Sign In</NavLink>
          <NavLink to="/login" className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-all active:scale-95 shadow-sm">
            Get Started
          </NavLink>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[750px] flex flex-col items-center justify-center text-center px-8 bg-[radial-gradient(50%_50%_at_50%_50%,#dbe1ff_0%,#f1f5f9_100%)] overflow-hidden">
          <div className="max-w-4xl z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#dbe1ff] px-4 py-1.5 rounded-full border border-primary/20">
              <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="text-[12px] font-bold text-[#003ea8] uppercase tracking-wider">AI-Powered Code Intelligence</span>
            </div>
            <h1 className="font-display text-4xl md:text-[56px] md:leading-[1.1] text-on-surface font-extrabold tracking-tighter">
              Visualize, Parse, and Chat with Your <span className="text-primary">Codebase</span> Automatically
            </h1>
            <p className="text-on-surface-variant text-[18px] max-w-2xl mx-auto leading-relaxed">
              Transform complex repositories into interactive call graphs using advanced AST static analysis and intelligent RAG-driven chat assistants.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={() => navigate('/repository')}
                className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-primary-hover transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined">upload_file</span>
                Upload ZIP
              </button>
              <button 
                onClick={() => navigate('/docs')}
                className="flex items-center gap-2 border border-outline text-on-surface px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-surface-container-low transition-all bg-white/50 backdrop-blur-sm active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined">description</span>
                Read Docs
              </button>
            </div>
          </div>

          {/* Background atmosphere dots */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            {atmosphereDots.map(dot => (
              <div 
                key={dot.id}
                className="absolute rounded-full bg-primary/20"
                style={{
                  width: `${dot.width}px`,
                  height: `${dot.width}px`,
                  left: `${dot.left}%`,
                  top: `${dot.top}%`,
                  opacity: dot.opacity
                }}
              />
            ))}
          </div>
        </section>

        {/* Live Dashboard Preview */}
        <section className="px-8 -mt-24 pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/70 backdrop-blur-md border border-[#e2e8f0] rounded-2xl shadow-2xl overflow-hidden aspect-[16/9] flex flex-col">
              {/* Mock Browser Header */}
              <div className="h-12 border-b border-[#c3c6d7] bg-[#eff4ff] flex items-center px-4 justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ba1a1a]/40"></div>
                  <div className="w-3 h-3 rounded-full bg-[#8a4cfc]/40"></div>
                  <div className="w-3 h-3 rounded-full bg-[#007d55]/40"></div>
                </div>
                <div className="bg-white rounded-md px-3 py-1 border border-[#c3c6d7] text-[11px] font-mono text-outline flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  codemap.ai/dashboard/project-nebula
                </div>
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-outline text-[18px]">search</span>
                  <span className="material-symbols-outlined text-outline text-[18px]">more_vert</span>
                </div>
              </div>

              {/* Mock Dashboard Body */}
              <div className="flex-1 relative bg-white overflow-hidden p-6">
                {/* SVG Graph Preview */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <svg className="w-full h-full" viewBox="0 0 800 400" width="100%" height="100%">
                    {edges.map((edge, idx) => {
                      const start = nodes[edge[0]];
                      const end = nodes[edge[1]];
                      return (
                        <line 
                          key={idx}
                          x1={start.x}
                          y1={start.y}
                          x2={end.x}
                          y2={end.y}
                          stroke="#c3c6d7"
                          strokeWidth="1"
                        />
                      );
                    })}
                    {nodes.map(node => (
                      <g key={node.id}>
                        <circle 
                          cx={node.x}
                          cy={node.y}
                          r={node.r}
                          fill={node.color}
                          className="animate-pulse"
                        />
                        <text 
                          x={node.x}
                          y={node.y + node.r + 20}
                          textAnchor="middle"
                          fill="#434655"
                          fontSize="12px"
                          fontFamily="Inter"
                        >
                          {node.name}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Interface Overlays */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex gap-4 items-start">
                    <div className="bg-white/95 p-4 border border-[#e2e8f0] rounded-xl shadow-sm w-48 space-y-3">
                      <h4 className="text-[11px] font-bold text-outline uppercase tracking-wider">Statistics</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] font-medium text-on-surface-variant">Modules</span>
                        <span className="font-mono text-sm text-primary font-semibold">124</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] font-medium text-on-surface-variant">Functions</span>
                        <span className="font-mono text-sm text-primary font-semibold">1.2k</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] font-medium text-on-surface-variant">Total LoC</span>
                        <span className="font-mono text-sm text-primary font-semibold">48k</span>
                      </div>
                    </div>

                    <div className="bg-primary p-4 border border-primary rounded-xl shadow-lg flex-1 flex items-center justify-between">
                      <div className="text-white">
                        <p className="text-[11px] font-bold opacity-80 tracking-wider">AI INSIGHT</p>
                        <p className="text-base font-semibold">High cyclic complexity in <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-[13px]">auth_service.py</code></p>
                      </div>
                      <button onClick={() => navigate('/graph')} className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">Refactor</button>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <div className="bg-white/95 border border-[#e2e8f0] rounded-xl shadow-lg w-72 overflow-hidden">
                      <div className="bg-[#eff4ff] px-3 py-2 border-b border-[#e2e8f0] flex items-center justify-between">
                        <span className="text-xs font-bold text-on-surface">AI ASSISTANT</span>
                        <span className="material-symbols-outlined text-[16px] text-outline">close</span>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="bg-[#eff4ff] p-2 rounded-lg text-xs text-on-surface-variant">
                          Explain how the data flows from the Zip upload to the AST parser.
                        </div>
                        <div className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-[12px]">smart_toy</span>
                          </div>
                          <div className="text-xs italic text-outline animate-pulse">Generating architectural overview...</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-8 py-24 bg-surface-container-low">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface">Engineered for Technical Precision</h2>
              <p className="text-on-surface-variant text-base max-w-xl mx-auto">
                Go beyond simple search routines. Our static parser deeply maps the logical architecture of your source code.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-surface-variant rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[28px]">account_tree</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-3">AST Static Analysis</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Complete parsing of codebase syntax trees. Extract parameters, class hierarchies, and route decorators without executing code.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-surface-variant rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[28px]">hub</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-3">Interactive Call Graphs</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Dynamic visual mapping of module dependencies and routing pathways. Zoom into single nodes or inspect the system-wide architecture.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-surface-variant rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[28px]">forum</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-3">Contextual RAG Chat</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  A chat companion that understands your code logic. Ask deep query questions grounded in your repository's local context.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="px-8 py-24 bg-white overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <h2 className="font-display text-3xl font-extrabold text-on-surface">Zero-Configuration Analysis</h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                Simply drop your source files and let our engine map out structural connections. Built on secure, local-first protocols designed for codebase privacy.
              </p>
              <ul class="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary">check_circle</span>
                  <span className="text-sm font-semibold text-on-surface">Automatic Language Structure Detection</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary">check_circle</span>
                  <span className="text-sm font-semibold text-on-surface">Smooth Zoom & Interactive Viewport Canvas</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary">check_circle</span>
                  <span className="text-sm font-semibold text-on-surface">Secure, Local Ingestion Processes</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-outline-variant">
                <img 
                  className="w-full h-[360px] object-cover" 
                  alt="CodeMap AI Dashboard Preview" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjolmZmMET5sUwzvtcSaX7IZJHl-FZ2biCKKFr1W2OEuiiUGHdDwmrpT2vbx7XczE0C8i9QIUmvnKSy0ugLGAwdAQiyyb_1P2HczewyzqC_fsDr2f28yclLNjJal5F8JRekuPhAHiJbN5nIgYVgEE3HsS-xPl3PNkuLq0tdjpfFEtwaghWrCfvAY3EuLZBeBYDIvyQe4gzjeoDu34UJ4nsdXwRlzdrUVuTG9yARjSjW-83ITh95XI9ZnTOIrKeceLfgDm9KEUfXhU"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* CTA Footer Section */}
        <section className="px-8 py-24 bg-[radial-gradient(50%_50%_at_50%_50%,#dbe1ff_0%,#f1f5f9_100%)] text-center border-t border-outline-variant/30">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-display text-3xl font-extrabold">Ready to map your logic?</h2>
            <p className="text-on-surface-variant text-sm">Join developers who are decoding complex directories with ease. Get started today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/repository')}
                className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl text-base font-semibold shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                Create Your First Map
              </button>
              <button 
                onClick={() => navigate('/docs')}
                className="bg-white border border-[#c3c6d7] text-on-surface px-10 py-4 rounded-xl text-base font-semibold hover:bg-surface-container-high transition-all active:scale-95 cursor-pointer"
              >
                Contact Enterprise
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Details */}
      <footer className="bg-inverse-surface text-on-primary-fixed border-t border-white/5 py-16 px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[14px]">hub</span>
              </div>
              <span className="text-base font-bold text-white">CodeMap AI</span>
            </div>
            <p className="text-[#a8b2c1] text-xs leading-relaxed">Building visual discovery and understanding tools for engineering terms and codebases.</p>
          </div>
          <div>
            <h4 class="text-xs font-bold text-white mb-4 uppercase tracking-widest">Product</h4>
            <ul class="space-y-2 text-[#a8b2c1] text-xs">
              <li><a className="hover:text-white transition-colors" href="#features">Features</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Changelog</a></li>
              <li><NavLink className="hover:text-white transition-colors" to="/pricing">Pricing</NavLink></li>
              <li><a className="hover:text-white transition-colors" href="#">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-bold text-white mb-4 uppercase tracking-widest">Resources</h4>
            <ul class="space-y-2 text-[#a8b2c1] text-xs">
              <li><NavLink className="hover:text-white transition-colors" to="/docs">Documentation</NavLink></li>
              <li><NavLink className="hover:text-white transition-colors" to="/docs">API Reference</NavLink></li>
              <li><NavLink className="hover:text-white transition-colors" to="/docs">Tutorials</NavLink></li>
              <li><a className="hover:text-white transition-colors" href="#">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-bold text-white mb-4 uppercase tracking-widest">Company</h4>
            <ul class="space-y-2 text-[#a8b2c1] text-xs">
              <li><NavLink className="hover:text-white transition-colors" to="/about">About Us</NavLink></li>
              <li><NavLink className="hover:text-white transition-colors" to="/contact">Contact</NavLink></li>
              <li><a className="hover:text-white transition-colors" href="#">Privacy</a></li>
              <li><a className="hover:text-white transition-colors" href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#a8b2c1] text-xs">© 2026 CodeMap AI. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-[#a8b2c1] hover:text-white cursor-pointer transition-colors">public</span>
            <span className="material-symbols-outlined text-[#a8b2c1] hover:text-white cursor-pointer transition-colors">alternate_email</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

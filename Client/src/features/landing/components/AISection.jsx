import React, { forwardRef } from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

const AISection = forwardRef(({ 
  containerRef, 
  titleRef, 
  descRef, 
  graphContainerRef, 
  aiPanelRef,
  promptTextRef,
  responseTextRef,
  nodesRefs,
  edgesRefs
}, ref) => {

  const localNodes = [
    { id: 'api.router', label: 'routes.py', color: '#a855f7', x: 180, y: 70 },
    { id: 'auth.controller', label: 'auth.py', color: '#00f0ff', x: 180, y: 160 },
    { id: 'auth.model', label: 'users.py', color: '#10b981', x: 180, y: 250 },
    { id: 'db.client', label: 'database.py', color: '#10b981', x: 180, y: 340 }
  ];

  return (
    <section 
      id="ai-section"
      ref={containerRef} 
      className="h-screen w-full relative bg-[#040609] overflow-hidden select-none flex items-center"
    >
      {/* Blueprint grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:36px_36px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12 px-6 md:px-12 z-10">
        {/* Left: Headline Description (45% width) */}
        <div className="w-full md:w-[45%] z-10 space-y-5">
          <Badge variant="info" size="sm" className="uppercase tracking-wider font-mono text-[14px] bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]">04 . Semantic Queries</Badge>
          <h2 
            ref={titleRef} 
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Graph + AI <br /> In Perfect Sync
          </h2>
          <p 
            ref={descRef} 
            className="text-slate-300 font-sans text-lg md:text-[21px] leading-relaxed"
          >
            Ask CodeMap AI questions about your codebase architecture. The assistant scans the relational call graph to explain code flows, highlighting symbols and file routes interactively as they are discussed.
          </p>
        </div>

        {/* Right Content Area: Split between Graph (Left) and AI panel (Right) (55% width) */}
        <div className="w-full md:w-[55%] flex flex-col sm:flex-row items-center justify-center gap-6 relative h-[450px] md:h-[500px]">
          {/* Shifted Graph container */}
          <div 
            ref={graphContainerRef}
            className="w-full sm:w-[48%] h-[380px] md:h-[450px] border border-[#3e4651]/55 bg-[#0d1117]/50 rounded-2xl overflow-hidden shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
            <svg className="w-full h-full relative z-10" viewBox="0 0 360 400">
              {/* Connectors */}
              <g ref={edgesRefs}>
                <line x1="180" y1="70" x2="180" y2="160" stroke="#22303f" strokeWidth="2.5" />
                <line x1="180" y1="160" x2="180" y2="250" stroke="#22303f" strokeWidth="2.5" />
                <line x1="180" y1="250" x2="180" y2="340" stroke="#22303f" strokeWidth="2.5" />
              </g>

              {/* Node items */}
              {localNodes.map((n, idx) => (
                <g 
                  key={idx}
                  ref={el => nodesRefs.current[idx] = el}
                  transform={`translate(${n.x}, ${n.y})`}
                  className="cursor-pointer"
                >
                  <circle r="9" fill="#0d1117" stroke={n.color} strokeWidth="2.5" />
                  <text x="20" y="4" fill="#e2e8f0" fontSize="10" fontFamily="monospace" textAnchor="start" fontWeight="semibold">
                    {n.label}
                  </text>
                </g>
              ))}
            </svg>
            <div className="absolute bottom-3 left-3 bg-[#0d1117]/85 border border-[#30363d] px-2 py-0.5 rounded text-[9px] font-mono text-gray-500 font-semibold uppercase tracking-wider">
              Auth Context Subset
            </div>
          </div>

          {/* AI Console panel */}
          <div 
            ref={aiPanelRef}
            className="w-full sm:w-[48%] h-[380px] md:h-[450px] border border-[#3e4651]/55 bg-[#161b22]/85 backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between p-5 overflow-hidden relative"
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-[#30363d]/30 pb-3 mb-3 shrink-0">
              <div className="w-6 h-6 rounded-lg bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-[#c084fc] font-mono">AI</span>
              </div>
              <span className="text-[11px] font-mono font-semibold text-gray-200">Architecture Copilot</span>
            </div>

            {/* Chat message content box */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-[11px] font-mono select-text">
              {/* User message */}
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-[#00f0ff]/20 flex items-center justify-center shrink-0 text-cyan-400 text-[8px] font-bold font-mono border border-[#00f0ff]/20 select-none">U</div>
                <div className="bg-[#0d1117]/70 border border-[#30363d] rounded-xl px-3 py-2 text-gray-300 max-w-[85%]">
                  <span ref={promptTextRef}></span>
                </div>
              </div>

              {/* AI Message */}
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-full bg-[#a855f7]/20 flex items-center justify-center shrink-0 text-[#c084fc] text-[8px] font-bold font-mono border border-[#a855f7]/20 select-none">AI</div>
                <div className="bg-[#0d1117]/50 border border-[#30363d]/30 rounded-xl px-3 py-2 text-slate-300 leading-relaxed max-w-[85%] select-text">
                  <span ref={responseTextRef}></span>
                </div>
              </div>
            </div>

            {/* Bottom prompt bar simulator */}
            <div className="mt-3 shrink-0">
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-2.5 text-[10px] text-slate-500 font-sans flex items-center justify-between select-none">
                <span>Ask Copilot...</span>
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-2-9-18-9 18 9 2zm0 0v-8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AISection;

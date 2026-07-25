import React, { forwardRef } from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

const PreviewSection = forwardRef(({ containerRef, dashboardRef, statRefs }, ref) => {
  const statsList = [
    { label: 'Files Analyzed', targetValue: 127, type: 'info' },
    { label: 'Functions Indexed', targetValue: 642, type: 'success' },
    { label: 'API Endpoints', targetValue: 31, type: 'warning' },
    { label: 'System Modules', targetValue: 12, type: 'purple' }
  ];

  return (
    <section 
      id="preview-section"
      ref={containerRef}
      className="relative min-h-screen bg-[#040609] overflow-hidden flex flex-col justify-center items-center px-6 py-20 select-none"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:36px_36px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#a855f7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 space-y-12 w-full text-center">
        {/* Intro */}
        <div className="space-y-4">
          <Badge variant="info" size="sm" className="uppercase tracking-wider font-mono text-[14px] bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]">05 . Interactive Workspace</Badge>
          <h2 className="text-4xl md:text-[60px] lg:text-[64px] font-extrabold tracking-tight text-white leading-[1.1]">
            Designed for Developers
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-[22px] lg:text-[24px] text-slate-300 font-sans leading-relaxed">
            Manage files, explore dependencies, trace execution flows, and query codebase semantics in a high-fidelity workspace environment.
          </p>
        </div>

        {/* Dashboard Preview container */}
        <div 
          ref={dashboardRef}
          className="relative w-full border border-[#3e4651]/55 bg-[#0d1117]/60 backdrop-blur-md rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col gap-6 text-left"
        >
          {/* Mock Window buttons */}
          <div className="flex items-center gap-2 border-b border-[#30363d]/30 pb-4 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            <span className="text-[11px] font-mono text-slate-400 ml-4 font-semibold uppercase tracking-wider">Workspace: HospitalManagement-v2</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsList.map((s, idx) => (
              <Card 
                key={idx}
                className="bg-[#161b22]/40 border border-[#3e4651]/40 hover:border-[#00f0ff]/30 transition-all duration-300"
                bodyClassName="p-4"
              >
                <div className="space-y-1 font-mono">
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">{s.label}</span>
                  <span 
                    ref={el => statRefs.current[idx] = el}
                    className="text-3xl lg:text-4xl font-extrabold text-[#00f0ff] tracking-tight block"
                  >
                    0
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Grid Layout Layout details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Visual graph snippet card */}
            <Card title="Interactive Blueprint Explorer" titleClassName="text-[22px] font-semibold text-white" className="md:col-span-2 bg-[#161b22]/30 border border-[#3e4651]/40">
              <div className="h-[210px] border border-[#3e4651]/30 bg-[#0d1117]/30 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:12px_12px] opacity-15" />
                <svg className="w-full h-full relative z-10" viewBox="0 0 300 180">
                  <g stroke="#30363d" strokeWidth="2" strokeDasharray="3 3">
                    <line x1="80" y1="90" x2="150" y2="40" />
                    <line x1="80" y1="90" x2="150" y2="140" />
                    <line x1="150" y1="40" x2="220" y2="90" />
                    <line x1="150" y1="140" x2="220" y2="90" />
                  </g>
                  <circle cx="80" cy="90" r="7.5" fill="#0d1117" stroke="#00f0ff" strokeWidth="3.5" />
                  <circle cx="150" cy="40" r="7.5" fill="#0d1117" stroke="#a855f7" strokeWidth="3.5" />
                  <circle cx="150" cy="140" r="7.5" fill="#0d1117" stroke="#10b981" strokeWidth="3.5" />
                  <circle cx="220" cy="90" r="7.5" fill="#0d1117" stroke="#00f0ff" strokeWidth="3.5" />
                  
                  <text x="80" y="110" fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="bold">app.py</text>
                  <text x="150" y="24" fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="bold">auth_service.py</text>
                  <text x="150" y="161" fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="bold">payment_service.py</text>
                  <text x="220" y="110" fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="bold">db_client.py</text>
                </svg>
              </div>
            </Card>

            {/* Sidebar Details Panel snippet */}
            <Card title="Node Inspector Panel" titleClassName="text-[22px] font-semibold text-white" className="bg-[#161b22]/30 border border-[#3e4651]/40">
              <div className="space-y-5 p-1">
                <div className="space-y-2 border-b border-[#30363d]/30 pb-3">
                  <span className="text-slate-500 font-mono text-[10px]">Selected Symbol:</span>
                  <p className="text-gray-100 font-extrabold uppercase font-mono text-xs tracking-wider">auth_service.py</p>
                </div>
                <div className="space-y-2 text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span>File Size:</span>
                    <span className="text-gray-100 font-semibold">12.4 KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hops Traversed:</span>
                    <span className="text-gray-100 font-semibold">240 LOC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Circular Warning:</span>
                    <span className="text-red-400 font-bold uppercase text-[9px] border border-red-500/25 bg-red-950/20 px-2 py-0.5 rounded-md">1 warning</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
});

export default PreviewSection;

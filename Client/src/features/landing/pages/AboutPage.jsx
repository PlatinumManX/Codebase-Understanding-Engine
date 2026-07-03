import React from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

export default function AboutPage() {
  const team = [
    {
      name: 'Mukesh Kushwaha',
      role: 'Lead Frontend UI Architect',
      desc: 'Responsible for React system framework architecture, routing layers, and GSAP timeline bindings.',
      college: 'Sem-7 | Computer Engineering'
    },
    {
      name: 'Priya Sharma',
      role: 'Backend API Engineer',
      desc: 'Responsible for Fast API service connectors, routers, and database indexing optimizations.',
      college: 'Sem-7 | Computer Engineering'
    },
    {
      name: 'Rahul Verma',
      role: 'AST Parser Architect',
      desc: 'Developed abstract syntax tree parsing modules, code segment analysis rules, and circular dependency checks.',
      college: 'Sem-7 | Computer Engineering'
    },
    {
      name: 'Amit Patel',
      role: 'Graph Engine Engineer',
      desc: 'Developed relational diagram generators, graph node coordinate models, and SVG render pipelines.',
      college: 'Sem-7 | Computer Engineering'
    }
  ];

  return (
    <div className="bg-[#040609] min-h-screen text-gray-200 py-24 px-6 font-mono select-none relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:36px_36px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#a855f7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Title */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            How Unknown Repositories <br /> Become Understandable
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-[21px] text-slate-300 font-sans leading-relaxed">
            CodeMap AI was engineered to bridge the gap between complex raw source codebases and clear mental architecture diagrams.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="Problem Statement" className="bg-[#161b22]/30 border-[#3e4651]/55">
            <p className="text-slate-300 font-sans text-sm leading-relaxed p-1">
              Onboarding developers to a legacy backend repository is notoriously slow. Static document files get outdated instantly, and tracing deep functional connections through thousands of lines of code is mentally exhausting.
            </p>
          </Card>
          <Card title="Our Mission" className="bg-[#161b22]/30 border-[#3e4651]/55">
            <p className="text-slate-300 font-sans text-sm leading-relaxed p-1">
              We aim to automate developer onboarding. By combining AST parser systems, execution timeline analyzers, and AI semantic lookup models, we turn raw code into living visual maps.
            </p>
          </Card>
        </div>

        {/* Meet the Team */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Meet the Team</h2>
            <p className="text-xs text-slate-400 font-sans">Developed as a final year Mini Project (MPR).</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, idx) => (
              <Card 
                key={idx} 
                className="bg-[#0d1117]/60 border border-[#3e4651]/45 hover:border-[#00f0ff]/30 transition-all duration-300"
                bodyClassName="p-5 flex flex-col gap-4 justify-between h-full"
              >
                <div className="space-y-3">
                  {/* Photo Placeholder */}
                  <div className="h-36 bg-[#161b22]/50 border border-[#30363d] rounded-xl flex items-center justify-center text-slate-500 font-bold text-xs uppercase tracking-wider relative overflow-hidden select-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:12px_12px] opacity-15" />
                    <span>[ Photo ]</span>
                  </div>
                  
                  <div className="space-y-1 font-mono">
                    <h3 className="text-sm font-bold text-white leading-tight">{t.name}</h3>
                    <p className="text-[10px] text-[#00f0ff] uppercase tracking-wider font-semibold">{t.role}</p>
                  </div>
                  
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="border-t border-[#30363d]/40 pt-3 mt-1 text-[9px] text-slate-500 font-mono">
                  {t.college}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Project Guide and College details */}
        <div className="border border-[#1f2937]/35 bg-[#0d1117]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white">Project Guide & Coordinator</h4>
            <p className="text-xs text-slate-300 font-sans max-w-xl leading-relaxed">
              We extend our gratitude to our project guide for mentoring us through AST syntax parsing frameworks, FastAPI route designs, and relational call graph abstractions.
            </p>
          </div>
          <div className="font-mono text-right text-xs shrink-0 bg-[#161b22]/40 border border-[#30363d] px-4 py-3 rounded-xl min-w-[200px]">
            <span className="text-[#a855f7] block uppercase tracking-wider font-semibold text-[10px] mb-1">Coordinator</span>
            <p className="text-gray-200 font-bold">Prof. Rajesh Gupta</p>
            <span className="text-[10px] text-gray-500">Dept. of Computer Engineering</span>
          </div>
        </div>
      </div>
    </div>
  );
}

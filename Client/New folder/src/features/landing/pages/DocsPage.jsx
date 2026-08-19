import React from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

export default function DocsPage({ isSection = false }) {
  const sections = [
    {
      title: '1. Ingestion Pipeline & AST Parser',
      desc: 'The parser leverages Python’s built-in AST library to compile source codes, indexing classes, imports, function symbols, and global references recursively. It outputs a standardized JSON node relational catalog.',
      tech: 'FastAPI, AST library, JSON catalog'
    },
    {
      title: '2. Relational Graph Engine',
      desc: 'Transforms raw parser entries into visual graphs. It parses importing connections (e.g. imports, function invocations) to detect node paths, rendering coordinates via SVG trees and locating circular imports.',
      tech: 'SVG mapping, coordinates layout, cycle detection'
    },
    {
      title: '3. AI Code Explanation Copilot',
      desc: 'Queries the relational graph database models using context-augmented prompts to explain complex function pathways and workflows. Highlights related code files interactively as they are typed.',
      tech: 'FastAPI router, prompt augmentations'
    },
    {
      title: '4. High-Fidelity Frontend UI',
      desc: 'Designed as a responsive, monospaced developer dashboard. Bypasses general framework sidebars for full-viewport landing pages, syncs scroll timelines using GSAP, and enables clean navigation.',
      tech: 'React 19, GSAP timelines, Lenis scroll'
    }
  ];

  return (
    <div className={`bg-[#040609] text-gray-200 font-mono select-none relative ${isSection ? 'py-16' : 'min-h-screen py-24 px-6'}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:36px_36px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#a855f7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-[60px] lg:text-[64px] font-extrabold tracking-tight text-white leading-tight">
            Developer Reference Documentation
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-[22px] lg:text-[24px] text-slate-300 font-sans leading-relaxed">
            Technical workflow specifications, AST parsing parameters, and frontend dashboard architecture.
          </p>
        </div>

        {/* System Diagram Placeholder */}
        <div className="border border-[#3e4651]/55 bg-[#0d1117]/60 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#30363d]/40 pb-4">
            <span className="text-xs text-white font-bold uppercase tracking-wider">System Architecture Diagram</span>
            <span className="text-[10px] text-slate-500 font-mono">WORKSPACE PIPELINE</span>
          </div>

          <div className="h-64 border border-[#30363d]/30 bg-[#0d1117]/30 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:12px_12px] opacity-15" />
            <svg className="w-full h-full relative z-10 px-4" viewBox="0 0 600 200">
              {/* Flows */}
              <g stroke="#3e4651" strokeWidth="1.5" strokeDasharray="4 4" fill="none">
                <path d="M 80,100 L 180,100" />
                <path d="M 280,100 L 380,100" />
                <path d="M 480,100 L 520,100" />
              </g>
              
              {/* Blocks */}
              {/* Block 1: ZIP Archive */}
              <rect x="20" y="70" width="80" height="60" rx="6" fill="#0d1117" stroke="#a855f7" strokeWidth="2" />
              <text x="60" y="105" fill="#e2e8f0" fontSize="8" textAnchor="middle">ZIP / Git URL</text>

              {/* Block 2: AST Parser */}
              <rect x="180" y="70" width="100" height="60" rx="6" fill="#0d1117" stroke="#00f0ff" strokeWidth="2" />
              <text x="230" y="100" fill="#e2e8f0" fontSize="8" textAnchor="middle">AST Parser</text>
              <text x="230" y="112" fill="#00f0ff" fontSize="7" textAnchor="middle">(FastAPI)</text>

              {/* Block 3: Graph Engine */}
              <rect x="380" y="70" width="100" height="60" rx="6" fill="#0d1117" stroke="#10b981" strokeWidth="2" />
              <text x="430" y="100" fill="#e2e8f0" fontSize="8" textAnchor="middle">Graph Engine</text>
              <text x="430" y="112" fill="#10b981" fontSize="7" textAnchor="middle">(SVG / Cycle)</text>

              {/* Block 4: UI Dashboard */}
              <rect x="500" y="70" width="80" height="60" rx="6" fill="#0d1117" stroke="#a855f7" strokeWidth="2" />
              <text x="540" y="105" fill="#e2e8f0" fontSize="8" textAnchor="middle">React UI</text>
            </svg>
          </div>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((sec, idx) => (
            <Card key={idx} title={sec.title} titleClassName="text-[22px] font-semibold text-white" className="bg-[#161b22]/30 border-[#3e4651]/55">
              <div className="space-y-4 p-1">
                <p className="text-slate-300 font-sans text-[18px] leading-relaxed">
                  {sec.desc}
                </p>
                <div className="border-t border-[#30363d]/30 pt-3 text-[15px] text-slate-500 font-mono flex justify-between">
                  <span>Stack:</span>
                  <span className="text-[#00f0ff] font-semibold">{sec.tech}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

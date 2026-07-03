import React, { forwardRef } from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

const DecodingSection = forwardRef(({ 
  containerRef, 
  text1Ref, 
  text2Ref, 
  zipRef, 
  filesRef, 
  graphRef, 
  edgesRef,
  fileRefs,
  nodeRefs
}, ref) => {

  const filesList = [
    { name: 'app.py', size: '2.4 KB', color: 'border-cyan-500/40 hover:border-cyan-400' },
    { name: 'routes.py', size: '5.8 KB', color: 'border-[#a855f7]/40 hover:border-[#a855f7]' },
    { name: 'auth.py', size: '12.4 KB', color: 'border-cyan-500/40 hover:border-cyan-400' },
    { name: 'payment.py', size: '8.2 KB', color: 'border-[#a855f7]/40 hover:border-[#a855f7]' },
    { name: 'users.py', size: '4.1 KB', color: 'border-[#10b981]/40 hover:border-[#10b981]' },
    { name: 'database.py', size: '3.9 KB', color: 'border-[#10b981]/40 hover:border-[#10b981]' }
  ];

  const graphNodes = [
    { label: 'app.py', type: 'file', color: '#00f0ff', x: 260, y: 60 },
    { label: 'routes.py', type: 'file', color: '#a855f7', x: 260, y: 150 },
    { label: 'auth.py', type: 'service', color: '#00f0ff', x: 120, y: 240 },
    { label: 'payment.py', type: 'service', color: '#a855f7', x: 400, y: 240 },
    { label: 'users.py', type: 'model', color: '#10b981', x: 120, y: 340 },
    { label: 'database.py', type: 'database', color: '#10b981', x: 260, y: 370 }
  ];

  const graphEdges = [
    { source: 0, target: 1, label: 'imports' }, // app -> routes
    { source: 1, target: 2, label: 'routes' },  // routes -> auth
    { source: 1, target: 3, label: 'routes' },  // routes -> payment
    { source: 2, target: 4, label: 'calls' },   // auth -> users
    { source: 2, target: 5, label: 'connects' },// auth -> db
    { source: 3, target: 5, label: 'connects' },// payment -> db
    { source: 4, target: 5, label: 'queries' }  // users -> db
  ];

  return (
    <section 
      id="decoding-section"
      ref={containerRef} 
      className="h-screen w-full relative bg-[#040609] overflow-hidden select-none flex items-center"
    >
      {/* Blueprint grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:36px_36px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12 px-6 md:px-12 z-10">
        {/* Left Side: Explanatory Storytelling Texts (45% width) */}
        <div className="w-full md:w-[45%] flex flex-col justify-center relative min-h-[340px] md:min-h-[400px]">
          {/* Section 2 Text: Decoding */}
          <div 
            ref={text1Ref} 
            className="space-y-5 md:absolute md:inset-x-0"
          >
            <Badge variant="info" size="sm" className="uppercase tracking-wider font-mono text-[14px] bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]">01 . Ingestion</Badge>
            <h2 className="text-4xl md:text-[60px] lg:text-[64px] font-extrabold tracking-tight text-white leading-[1.1]">
              Repository <br /> Decoding
            </h2>
            <p className="text-slate-300 font-sans text-lg md:text-[22px] lg:text-[24px] leading-relaxed">
              Every repository begins as a collection of loose files. CodeMap AI automatically parses raw source directories, discovering functions, classes, and routing trees instantly.
            </p>
          </div>

          {/* Section 3 Text: Graph Generation */}
          <div 
            ref={text2Ref} 
            className="space-y-5 md:absolute md:inset-x-0 opacity-0 pointer-events-none"
          >
            <Badge variant="info" size="sm" className="uppercase tracking-wider font-mono text-[14px] bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]">02 . Visual Mapping</Badge>
            <h2 className="text-4xl md:text-[60px] lg:text-[64px] font-extrabold tracking-tight text-white leading-[1.1]">
              Automatically Build <br /> Architecture
            </h2>
            <div className="text-slate-300 font-sans text-lg md:text-[22px] lg:text-[24px] leading-relaxed space-y-4">
              <p>
                Extracted raw files gradually morph into a structured dependency graph model.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2 font-mono text-xs">
                <span className="px-2.5 py-1 bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] rounded-md font-semibold">Modules</span>
                <span className="px-2.5 py-1 bg-[#a855f7]/10 border border-[#a855f7]/30 text-[#c084fc] rounded-md font-semibold">Dependencies</span>
                <span className="px-2.5 py-1 bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] rounded-md font-semibold">Relationships</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Animated Canvas (55% width) */}
        <div className="w-full md:w-[55%] flex items-center justify-center relative h-[420px] md:h-[500px]">
          {/* 1. Landing zip card placeholder */}
          <div 
            ref={zipRef}
            className="absolute bg-[#0d1117]/95 border border-[#3e4651] rounded-2xl p-6 shadow-2xl z-10 w-[340px] flex items-center gap-4 opacity-0 pointer-events-none hover:border-[#00f0ff]/40 transition-colors"
          >
            <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-yellow-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div className="min-w-0 font-mono">
              <p className="text-xs font-semibold text-gray-200 truncate">HospitalManagement.zip</p>
              <span className="text-[10px] text-gray-500">Extracting AST...</span>
            </div>
          </div>

          {/* 2. Loose floating files card layout */}
          <div 
            ref={filesRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
          >
            {filesList.map((file, idx) => (
              <div
                key={idx}
                ref={el => fileRefs.current[idx] = el}
                className={`absolute w-44 bg-[#0d1117]/95 border ${file.color} rounded-xl p-4 shadow-2xl flex items-center gap-2.5 font-mono text-xs select-none transition-colors duration-300`}
              >
                <svg className="w-4.5 h-4.5 text-[#00f0ff] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-200 truncate leading-tight">{file.name}</p>
                  <span className="text-[9px] text-slate-400 mt-0.5 block">{file.size}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Dependency graph SVG canvas container */}
          <div 
            ref={graphRef}
            className="absolute w-full h-full max-w-[550px] max-h-[460px] border border-[#3e4651]/55 bg-[#0d1117]/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] opacity-0 pointer-events-none"
          >
            {/* Background mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:16px_16px] opacity-25" />

            <svg className="w-full h-full relative z-10" viewBox="0 0 520 420">
              {/* Draw Edges */}
              <g ref={edgesRef}>
                {graphEdges.map((edge, idx) => {
                  const from = graphNodes[edge.source];
                  const to = graphNodes[edge.target];
                  return (
                    <line
                      key={idx}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#22303f"
                      strokeWidth="2.8"
                    />
                  );
                })}
              </g>

              {/* Draw Node circles */}
              {graphNodes.map((node, idx) => (
                <g 
                  key={idx}
                  ref={el => nodeRefs.current[idx] = el}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer group"
                >
                  <circle
                    r="14"
                    fill="#0d1117"
                    stroke={node.color}
                    strokeWidth="3.5"
                    className="group-hover:scale-110 transition-transform"
                  />
                  <text
                    y="28"
                    fill="#e2e8f0"
                    fontSize="13"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
});

export default DecodingSection;

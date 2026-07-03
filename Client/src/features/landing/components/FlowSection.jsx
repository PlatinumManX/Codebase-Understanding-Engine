import React, { forwardRef } from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

const FlowSection = forwardRef(({ 
  containerRef, 
  titleRef, 
  descRef, 
  graphRef, 
  pathNodesRefs, 
  pathEdgesRefs, 
  pulseRef 
}, ref) => {

  const pathSteps = [
    { label: 'POST /login', type: 'endpoint', color: '#a855f7', x: 260, y: 55 },
    { label: 'login()', type: 'controller', color: '#00f0ff', x: 260, y: 125 },
    { label: 'validate_user()', type: 'service', color: '#00f0ff', x: 260, y: 195 },
    { label: 'database()', type: 'database', color: '#10b981', x: 260, y: 265 },
    { label: 'generate_token()', type: 'utility', color: '#f59e0b', x: 260, y: 335 },
    { label: 'response', type: 'response', color: '#10b981', x: 260, y: 395 }
  ];

  return (
    <section 
      id="flow-section"
      ref={containerRef} 
      className="h-screen w-full relative bg-[#040609] overflow-hidden select-none flex items-center"
    >
      {/* Blueprint grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:36px_36px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12 px-6 md:px-12 z-10">
        {/* Left: Headline & Text (45% width) */}
        <div className="w-full md:w-[45%] z-10 space-y-5">
          <Badge variant="info" size="sm" className="uppercase tracking-wider font-mono text-[14px] bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]">03 . Execution Flow</Badge>
          <h2 
            ref={titleRef} 
            className="text-4xl md:text-[60px] lg:text-[64px] font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Trace Every <br /> Execution Path
          </h2>
          <p 
            ref={descRef} 
            className="text-slate-300 font-sans text-lg md:text-[22px] lg:text-[24px] leading-relaxed"
          >
            Go beyond static files. CodeMap AI tracks and maps dynamic transaction pathways step-by-step, showing how logic flows from routes through controllers, services, databases, and token generators.
          </p>
        </div>

        {/* Right: Interactive SVG execution path tree (55% width) */}
        <div className="w-full md:w-[55%] flex items-center justify-center relative h-[420px] md:h-[500px]">
          <div 
            ref={graphRef}
            className="relative w-full h-full max-w-[520px] max-h-[460px] border border-[#3e4651]/55 bg-[#0d1117]/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
            
            <svg className="w-full h-full relative z-10" viewBox="0 0 520 440">
              <defs>
                <marker
                  id="flow-arrow"
                  viewBox="0 0 10 10"
                  refX="20"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                </marker>
              </defs>

              {/* Edge connectors */}
              {pathSteps.map((step, idx) => {
                if (idx === pathSteps.length - 1) return null;
                const nextStep = pathSteps[idx + 1];
                return (
                  <line
                    key={idx}
                    ref={el => pathEdgesRefs.current[idx] = el}
                    x1={step.x}
                    y1={step.y}
                    x2={nextStep.x}
                    y2={nextStep.y}
                    stroke="#1e293b"
                    strokeWidth="3.5"
                    markerEnd="url(#flow-arrow)"
                  />
                );
              })}

              {/* Glowing animated pulse ball */}
              <circle
                ref={pulseRef}
                r="8"
                fill="#00f0ff"
                className="opacity-0"
                style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }}
              />

              {/* Nodes */}
              {pathSteps.map((step, idx) => (
                <g 
                  key={idx}
                  ref={el => pathNodesRefs.current[idx] = el}
                  transform={`translate(${step.x}, ${step.y})`}
                  className="cursor-pointer group"
                >
                  {/* Outer halo */}
                  <circle
                    r="15"
                    fill="transparent"
                    stroke={step.color}
                    strokeWidth="1.5"
                    className="opacity-0 group-hover:opacity-30 transition-opacity"
                  />
                  <circle
                    r="11"
                    fill="#0d1117"
                    stroke={step.color}
                    strokeWidth="3.5"
                  />
                  {/* Text on side */}
                  <text
                    x="30"
                    y="5"
                    fill="#e2e8f0"
                    fontSize="13"
                    fontFamily="monospace"
                    textAnchor="start"
                    fontWeight="bold"
                    className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    {step.label}
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

export default FlowSection;

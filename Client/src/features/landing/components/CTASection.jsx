import React, { useEffect, useRef } from 'react';
import Button from '../../../shared/components/Button';

export default function CTASection() {
  const svgRef = useRef(null);

  useEffect(() => {
    let angle = 0;
    let animationFrameId;

    const rotate = () => {
      angle += 0.04;
      if (svgRef.current) {
        svgRef.current.style.transform = `rotate(${angle}deg) scale(1.15)`;
      }
      animationFrameId = requestAnimationFrame(rotate);
    };

    rotate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section className="relative min-h-[80vh] bg-[#040609] overflow-hidden flex flex-col justify-center items-center px-6 py-20 select-none">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:32px_32px] opacity-15 pointer-events-none" />

      {/* Rotating Background Ambient Graph */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg 
          ref={svgRef}
          className="w-[750px] h-[750px] transition-transform duration-100 ease-linear" 
          viewBox="0 0 400 400"
        >
          <g stroke="#30363d" strokeWidth="1" strokeDasharray="4 4">
            <line x1="200" y1="200" x2="100" y2="100" />
            <line x1="200" y1="200" x2="300" y2="100" />
            <line x1="200" y1="200" x2="100" y2="300" />
            <line x1="200" y1="200" x2="300" y2="300" />
            <line x1="100" y1="100" x2="300" y2="100" />
            <line x1="300" y1="100" x2="300" y2="300" />
            <line x1="300" y1="300" x2="100" y2="300" />
            <line x1="100" y1="300" x2="100" y2="100" />
          </g>
          <circle cx="200" cy="200" r="5" fill="#00f0ff" />
          <circle cx="100" cy="100" r="4.5" fill="#a855f7" />
          <circle cx="300" cy="100" r="4.5" fill="#10b981" />
          <circle cx="100" cy="300" r="4.5" fill="#10b981" />
          <circle cx="300" cy="300" r="4.5" fill="#a855f7" />
        </svg>
      </div>

      {/* Radial fade to hide outer SVG borders */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#040609] via-transparent to-[#040609] pointer-events-none" />

      {/* Content */}
      <div className="max-w-3xl mx-auto text-center z-10 space-y-6">
        <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-white leading-tight">
          Start Understanding <br /> Any Backend Project
        </h2>
        <p className="max-w-md mx-auto text-xs text-gray-400 font-sans leading-relaxed">
          Upload your zip archive or paste a git URL to auto-index call workflows and circular dependencies in seconds.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-3">
          <a href="#repository">
            <Button variant="primary" size="lg" className="font-mono text-xs cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              Upload Repository
            </Button>
          </a>
          <a href="#dashboard">
            <Button variant="outline" size="lg" className="font-mono text-xs cursor-pointer">
              Explore Platform
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Card from '../../../shared/components/Card';
import Loader from '../../../shared/components/Loader';

export default function ProcessingStatusCard() {
  const steps = [
    { label: 'File Discovery & AST Extraction', status: 'completed', desc: 'Identified 148 source files, parsed AST syntax structures.' },
    { label: 'Symbol Resolution & Call Graph Mapping', status: 'completed', desc: 'Mapped class hierarchies and visual function reference graphs.' },
    { label: 'Relational Database Linking', status: 'active', desc: 'Connecting endpoint routes with data query schemas.' },
    { label: 'Semantic Code Vector Indexing', status: 'pending', desc: 'Indexing files into semantic vectors for AI queries.' }
  ];

  return (
    <Card title="Active Parse Execution Status" subtitle="Analysis for repository: react-dashboard-mpr">
      <div className="space-y-5">
        {/* Loader top */}
        <div className="flex items-center gap-4 bg-[#0d1117]/50 border border-[#30363d] rounded-lg p-3">
          <Loader size="sm" text="" subtitle="" />
          <div className="min-w-0 font-mono">
            <p className="text-xs font-semibold text-gray-200">Executing codebase indices...</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Elapsed: 14s | CPU: 24% | Memory: 1.2 GB</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="relative border-l border-[#30363d] ml-2.5 pl-6 space-y-4 font-mono">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Stepper Dot */}
              <span className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                step.status === 'completed'
                  ? 'bg-[#10b981] border-[#10b981]'
                  : step.status === 'active'
                    ? 'bg-[#00f0ff] border-[#00f0ff] animate-pulse'
                    : 'bg-[#161b22] border-[#30363d]'
              }`}>
                {step.status === 'completed' && (
                  <svg className="w-2 h-2 text-[#0d1117]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>

              {/* Stepper Text */}
              <div className="space-y-0.5">
                <span className={`text-xs font-medium ${
                  step.status === 'completed'
                    ? 'text-gray-300'
                    : step.status === 'active'
                      ? 'text-[#00f0ff]'
                      : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                <p className="text-[10px] text-gray-500 leading-relaxed max-w-xl">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

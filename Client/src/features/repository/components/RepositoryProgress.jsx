import React from 'react';
import Card from '../../../shared/components/Card';
import Loader from '../../../shared/components/Loader';

const STAGES = [
  { label: 'Uploading ZIP', desc: 'Ingesting repository archive files...' },
  { label: 'Validating Archive', desc: 'Verifying file integrity and structure...' },
  { label: 'Extracting Repository', desc: 'Decompressing folders and building catalog trees...' },
  { label: 'Parsing Repository', desc: 'Compiling AST syntax symbols and call graphs...' },
  { label: 'Generating Metadata', desc: 'Indexing files into semantic vectors...' }
];

export default function RepositoryProgress({ progress, currentStage }) {
  return (
    <Card 
      title="Codebase Ingestion Pipeline" 
      titleClassName="text-lg font-bold text-[#00f0ff] font-mono"
      subtitle="Ingestion status of your uploaded repository"
    >
      <div className="space-y-6 font-mono select-none">
        {/* Loader top stats card */}
        <div className="flex items-center gap-4 bg-[#0d1117]/55 border border-[#30363d] rounded-xl p-4">
          <Loader size="sm" text="" subtitle="" />
          <div className="min-w-0 flex-grow">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-200">
              <span>Ingesting codebase...</span>
              <span className="text-[#00f0ff]">{progress}%</span>
            </div>
            {/* Progress Bar container */}
            <div className="w-full bg-[#161b22] h-1.5 rounded-full mt-2 overflow-hidden border border-[#30363d]">
              <div 
                className="bg-gradient-to-r from-[#00f0ff] to-[#a855f7] h-full transition-all duration-300 shadow-[0_0_10px_#00f0ff]" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Status: {progress === 100 ? 'Finishing...' : STAGES[currentStage]?.label || 'Processing...'}
            </p>
          </div>
        </div>

        {/* Stepper list stages */}
        <div className="relative border-l border-[#30363d] ml-3 pl-6 space-y-5">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStage;
            const isActive = idx === currentStage;
            const isPending = idx > currentStage;

            return (
              <div key={idx} className="relative">
                {/* Stepper Node Dot */}
                <span className={`absolute -left-[32.5px] top-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-[#10b981] border-[#10b981]'
                    : isActive
                      ? 'bg-[#00f0ff] border-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]'
                      : 'bg-[#161b22] border-[#30363d]'
                }`}>
                  {isCompleted && (
                    <svg className="w-2 h-2 text-[#0d1117]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>

                {/* Stepper text layout */}
                <div className="space-y-0.5">
                  <span className={`text-[14px] font-bold ${
                    isCompleted
                      ? 'text-gray-300'
                      : isActive
                        ? 'text-[#00f0ff]'
                        : 'text-slate-500'
                  }`}>
                    {stage.label}
                  </span>
                  <p className="text-[12px] text-slate-500 leading-normal max-w-xl font-sans">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

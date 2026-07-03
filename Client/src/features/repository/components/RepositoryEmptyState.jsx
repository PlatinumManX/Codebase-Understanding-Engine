import React from 'react';

export default function RepositoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-[#30363d] rounded-xl bg-[#0d1117]/35 border-dashed min-h-[220px] select-none">
      <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-full text-slate-500 mb-3">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-slate-300 font-mono">No repositories uploaded yet</h3>
      <p className="text-xs text-slate-500 font-sans mt-1 max-w-sm">
        Select a ZIP file above and trigger the ingestion pipeline to parse your first codebase coordinate.
      </p>
    </div>
  );
}

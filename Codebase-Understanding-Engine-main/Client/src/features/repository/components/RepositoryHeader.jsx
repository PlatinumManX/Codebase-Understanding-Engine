import React from 'react';

export default function RepositoryHeader() {
  return (
    <div className="border-b border-[#30363d] pb-6 mb-8 select-none">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-[38px] font-extrabold tracking-tight text-white leading-tight font-mono">
          Analyze Repository
        </h1>
        <p className="text-slate-300 font-sans text-[17px] leading-relaxed max-w-3xl">
          Upload a ZIP archive of your backend project to prepare it for parsing, metadata extraction and future graph analysis.
        </p>
      </div>
    </div>
  );
}

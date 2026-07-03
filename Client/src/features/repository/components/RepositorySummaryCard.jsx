import React from 'react';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import Badge from '../../../shared/components/Badge';

export default function RepositorySummaryCard({ repoName, fileSizeLabel, onUploadAnother }) {
  return (
    <Card 
      title="Upload Success" 
      titleClassName="text-lg font-bold text-[#10b981] font-mono"
      className="bg-[#0b1410]/30 border-[#10b981]/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
    >
      <div className="space-y-6 select-none">
        {/* Success Icon Animation Card */}
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="relative flex items-center justify-center w-16 h-16 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full text-[#10b981]">
            <span className="absolute inset-0 rounded-full border border-[#10b981]/20 animate-ping opacity-75" />
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-[22px] font-bold text-white font-mono leading-none">
              Repository Parsed Successfully
            </h3>
            <p className="text-[15px] text-slate-400 font-sans max-w-sm">
              Source AST schemas have been extracted, mapped, and linked into the database.
            </p>
          </div>
        </div>

        {/* Stats Table details */}
        <div className="border border-[#30363d] bg-[#0d1117]/65 rounded-xl divide-y divide-[#30363d] font-mono text-[14px]">
          <div className="flex items-center justify-between p-3.5">
            <span className="text-slate-400">Repository Name</span>
            <span className="text-white font-semibold truncate max-w-xs">{repoName}</span>
          </div>
          <div className="flex items-center justify-between p-3.5">
            <span className="text-slate-400">Primary Language</span>
            <span className="text-[#00f0ff] font-semibold">Python</span>
          </div>
          <div className="flex items-center justify-between p-3.5">
            <span className="text-slate-400">Total Files</span>
            <span className="text-white font-semibold">127</span>
          </div>
          <div className="flex items-center justify-between p-3.5">
            <span className="text-slate-400">Extracted Classes</span>
            <span className="text-white font-semibold">34</span>
          </div>
          <div className="flex items-center justify-between p-3.5">
            <span className="text-slate-400">Discovered Functions</span>
            <span className="text-white font-semibold">241</span>
          </div>
          <div className="flex items-center justify-between p-3.5">
            <span className="text-slate-400">Isolated Modules</span>
            <span className="text-white font-semibold">18</span>
          </div>
          <div className="flex items-center justify-between p-3.5">
            <span className="text-slate-400">Repository Size</span>
            <span className="text-white font-semibold">{fileSizeLabel || '24 MB'}</span>
          </div>
          <div className="flex items-center justify-between p-3.5">
            <span className="text-slate-400">Pipeline Status</span>
            <Badge variant="success" size="sm">READY</Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <Button variant="outline" onClick={onUploadAnother} className="flex-1 font-mono text-xs py-2.5">
            Upload Another
          </Button>
          <Button variant="primary" disabled className="flex-1 font-mono text-xs py-2.5 cursor-not-allowed opacity-50">
            Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}

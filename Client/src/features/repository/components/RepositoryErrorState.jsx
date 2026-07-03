import React from 'react';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

export default function RepositoryErrorState({ onReplace, errorMsg }) {
  return (
    <Card 
      title="Upload Error" 
      titleClassName="text-lg font-bold text-red-400 font-mono"
      className="bg-[#1a0f0f]/30 border-red-900/40"
    >
      <div className="flex flex-col items-center justify-center p-6 text-center select-none space-y-4">
        <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-full text-red-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-[20px] font-bold text-white font-mono">Invalid File Selected</h3>
          <p className="text-[17px] text-slate-300 font-sans max-w-md">
            {errorMsg || 'Only ZIP archives (.zip) are supported for codebase indexing.'}
          </p>
        </div>
        <div className="pt-2">
          <Button variant="danger" onClick={onReplace} className="font-mono text-xs">
            Replace File
          </Button>
        </div>
      </div>
    </Card>
  );
}

import React from 'react';
import Card from '../../../shared/components/Card';
import Loader from '../../../shared/components/Loader';

export default function RepositoryProgress() {
  return (
    <Card 
      title="Uploading Codebase" 
      titleClassName="text-lg font-bold text-[#00f0ff] font-mono"
      subtitle="FastAPI Ingestion Pipeline"
    >
      <div className="py-8 select-none">
        <Loader 
          size="md" 
          text="Uploading Repository..." 
          subtitle="FastAPI backend is extracting files and compiling AST call graphs. Please wait..."
        />
        <div className="max-w-xs mx-auto mt-2">
          <div className="w-full bg-[#161b22] h-1.5 rounded-full overflow-hidden border border-[#30363d]">
            <div className="bg-gradient-to-r from-[#00f0ff] to-[#a855f7] h-full w-2/3 rounded-full animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    </Card>
  );
}

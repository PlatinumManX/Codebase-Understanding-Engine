import React from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

export default function RecentRepositoriesCard({ repositories }) {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'ready': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'neutral';
    }
  };

  return (
    <Card
      title="Parsed Repositories"
      subtitle="Recently uploaded codebases"
      titleClassName="text-[15px] font-semibold text-gray-200 font-sans"
      className="border-[#30363d] bg-[#161b22]/30 backdrop-blur-sm"
    >
      <div className="space-y-1">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="group flex items-center justify-between gap-4 py-2.5 px-3 rounded-lg border border-transparent hover:border-[#30363d]/50 hover:bg-[#161b22]/30 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Folder Icon */}
              <div className="p-1.5 bg-[#161b22] border border-[#30363d] rounded text-gray-400 group-hover:text-[#00f0ff] group-hover:border-[#00f0ff]/30 transition-colors duration-200 shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              
              {/* Repo Details */}
              <div className="min-w-0 space-y-0.5">
                <span className="text-[13px] font-semibold text-gray-200 truncate block group-hover:text-white transition-colors duration-150">
                  {repo.name}
                </span>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-gray-500 font-mono">
                  <span>{repo.files} files</span>
                  <span className="text-gray-600">•</span>
                  <span>{repo.size}</span>
                  <span className="text-gray-600">•</span>
                  <span className="truncate">{repo.uploadedAt}</span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <Badge
              variant={getStatusVariant(repo.status)}
              size="sm"
              className="shrink-0 uppercase text-[9px] font-semibold tracking-wider"
            >
              {repo.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

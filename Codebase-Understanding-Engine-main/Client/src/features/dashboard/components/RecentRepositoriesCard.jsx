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
    <Card title="Parsed Repositories" subtitle="Recently uploaded codebases">
      <div className="divide-y divide-[#30363d]/30">
        {repositories.map((repo) => (
          <div key={repo.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
            <div className="min-w-0 font-mono space-y-1">
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-xs font-medium text-gray-200 truncate">{repo.name}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] text-gray-500 pl-5">
                <span>{repo.files} files</span>
                <span>•</span>
                <span>{repo.size}</span>
                <span>•</span>
                <span className="truncate">{repo.uploadedAt}</span>
              </div>
            </div>
            <Badge variant={getStatusVariant(repo.status)} size="sm" className="shrink-0 uppercase text-[9px]">
              {repo.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

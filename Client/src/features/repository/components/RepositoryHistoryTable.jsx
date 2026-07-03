import React from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';
import Button from '../../../shared/components/Button';
import RepositoryEmptyState from './RepositoryEmptyState';

export default function RepositoryHistoryTable({ repositories }) {
  if (!repositories || repositories.length === 0) {
    return (
      <Card 
        title="Recent Repository Uploads" 
        titleClassName="text-[20px] font-bold text-white font-mono"
        subtitle="Historical list of ingested projects"
      >
        <RepositoryEmptyState />
      </Card>
    );
  }

  const getStatusBadge = (status) => {
    switch (status.toUpperCase()) {
      case 'READY':
        return <Badge variant="success" size="sm">READY</Badge>;
      case 'PROCESSING':
        return <Badge variant="warning" size="sm" className="animate-pulse">PROCESSING</Badge>;
      case 'FAILED':
        return <Badge variant="danger" size="sm">FAILED</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  const getLanguageColor = (lang) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return 'text-cyan-400';
      case 'node':
      case 'javascript':
        return 'text-yellow-500';
      case 'go':
        return 'text-blue-400';
      case 'rust':
        return 'text-orange-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card 
      title="Recent Repository Uploads" 
      titleClassName="text-[20px] font-bold text-white font-mono"
      subtitle="Historical list of ingested projects"
    >
      <div className="w-full overflow-x-auto font-mono text-[14px]">
        <table className="w-full border-collapse text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-[#30363d] text-slate-500 text-xs">
              <th className="py-3 px-4 font-semibold uppercase">Repository</th>
              <th className="py-3 px-4 font-semibold uppercase">Language</th>
              <th className="py-3 px-4 font-semibold uppercase text-center">Files</th>
              <th className="py-3 px-4 font-semibold uppercase text-center">Status</th>
              <th className="py-3 px-4 font-semibold uppercase">Uploaded</th>
              <th className="py-3 px-4 font-semibold uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#30363d]/40">
            {repositories.map((repo, idx) => (
              <tr 
                key={idx} 
                className="hover:bg-[#161b22]/20 transition-colors group"
              >
                {/* Repo Info */}
                <td className="py-4 px-4 font-semibold text-white">
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-[#00f0ff] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                    </svg>
                    <span className="truncate max-w-[200px]">{repo.name}</span>
                  </div>
                </td>

                {/* Language */}
                <td className="py-4 px-4">
                  <span className={`font-semibold ${getLanguageColor(repo.language)}`}>
                    {repo.language}
                  </span>
                </td>

                {/* Files */}
                <td className="py-4 px-4 text-center text-slate-300">
                  {repo.files}
                </td>

                {/* Status */}
                <td className="py-4 px-4 text-center">
                  {getStatusBadge(repo.status)}
                </td>

                {/* Date */}
                <td className="py-4 px-4 text-slate-500 font-sans text-xs">
                  {repo.uploadedAt || 'Just now'}
                </td>

                {/* Actions */}
                <td className="py-4 px-4 text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled 
                    className="font-mono text-[11px] cursor-not-allowed opacity-50"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

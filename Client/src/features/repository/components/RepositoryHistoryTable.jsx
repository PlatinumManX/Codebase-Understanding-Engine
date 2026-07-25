import React from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';
import Button from '../../../shared/components/Button';
import RepositoryEmptyState from './RepositoryEmptyState';

export default function RepositoryHistoryTable({ 
  repositories, 
  selectedRepoId, 
  onSelect, 
  onDelete, 
  onRename 
}) {
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
      case 'UPLOADING':
      case 'EXTRACTING':
      case 'PARSING':
      case 'GENERATING_GRAPH':
        return <Badge variant="warning" size="sm" className="animate-pulse">{status}</Badge>;
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
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
            {repositories.map((repo) => {
              const isSelected = repo.repository_id === selectedRepoId;
              const fileCount = repo.statistics?.files ?? 0;
              return (
                <tr 
                  key={repo.repository_id} 
                  onClick={() => onSelect(repo)}
                  className={`hover:bg-[#161b22]/30 transition-colors group cursor-pointer ${
                    isSelected 
                      ? 'bg-[#161b22]/80 border-l-2 border-[#00f0ff]' 
                      : 'border-l-2 border-transparent'
                  }`}
                >
                  {/* Repo Info */}
                  <td className="py-4 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2.5">
                      <svg className={`w-4 h-4 transition-colors ${isSelected ? 'text-[#00f0ff]' : 'text-slate-500 group-hover:text-[#00f0ff]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                      </svg>
                      <span className="truncate max-w-[200px]" title={repo.repository_name}>
                        {repo.repository_name}
                      </span>
                    </div>
                  </td>

                  {/* Language */}
                  <td className="py-4 px-4">
                    <span className={`font-semibold ${getLanguageColor(repo.language || 'Python')}`}>
                      {repo.language || 'Python'}
                    </span>
                  </td>

                  {/* Files */}
                  <td className="py-4 px-4 text-center text-slate-300">
                    {fileCount}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center">
                    {getStatusBadge(repo.status || 'READY')}
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-slate-500 font-sans text-xs">
                    {formatDate(repo.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant={isSelected ? "primary" : "outline"} 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(repo);
                        }}
                        className="font-mono text-[11px]"
                      >
                        {isSelected ? "Active" : "View"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          const newName = prompt("Enter new name for the repository:", repo.repository_name);
                          if (newName && newName.trim()) {
                            onRename(repo.repository_id, newName.trim());
                          }
                        }}
                        className="font-mono text-[11px] border-slate-700 hover:border-slate-500"
                      >
                        Rename
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete repository "${repo.repository_name}"? This action is permanent.`)) {
                            onDelete(repo.repository_id);
                          }
                        }}
                        className="font-mono text-[11px] border-red-900/50 text-red-400 hover:bg-red-950/30 hover:text-red-300"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

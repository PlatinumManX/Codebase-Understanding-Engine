import React from 'react';
import Card from '../../../shared/components/Card';

export default function RepositoryInformationCard({ repoInfo, setRepoInfo }) {
  const handleChange = (field, val) => {
    setRepoInfo(prev => ({
      ...prev,
      [field]: val
    }));
  };

  return (
    <Card 
      title="Repository Information" 
      titleClassName="text-[22px] font-semibold text-white font-mono"
      subtitle="Configure repository meta parameters"
    >
      <div className="space-y-5 font-mono text-[14px] select-none">
        {/* Name input */}
        <div className="space-y-2">
          <label className="text-slate-400 font-semibold block text-xs">Repository Name</label>
          <input
            type="text"
            value={repoInfo.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. codemap-ai-core"
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] font-sans transition-colors"
          />
        </div>

        {/* Description textarea */}
        <div className="space-y-2">
          <label className="text-slate-400 font-semibold block text-xs">Description (Optional)</label>
          <textarea
            value={repoInfo.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the repository modules..."
            rows={3}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] font-sans transition-colors resize-none"
          />
        </div>

        {/* Type & Language row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-slate-400 font-semibold block text-xs">Repository Type</label>
            <select
              value={repoInfo.type || 'Backend'}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00f0ff] font-sans transition-colors"
            >
              <option value="Backend">Backend</option>
              <option value="Frontend">Frontend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Library">Library</option>
              <option value="CLI">CLI</option>
              <option value="Microservice">Microservice</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-slate-400 font-semibold block text-xs">Primary Language</label>
            <select
              value={repoInfo.language || 'Python'}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00f0ff] font-sans transition-colors"
            >
              <option value="Python">Python</option>
              <option value="Node">Node</option>
              <option value="Java">Java</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Version & Tags row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-slate-400 font-semibold block text-xs">Version</label>
            <input
              type="text"
              value={repoInfo.version || ''}
              onChange={(e) => handleChange('version', e.target.value)}
              placeholder="e.g. 1.0.0"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] font-sans transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-400 font-semibold block text-xs">Tags</label>
            <input
              type="text"
              value={repoInfo.tags || ''}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="e.g. fast-api, core"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] font-sans transition-colors"
            />
          </div>
        </div>

        {/* Read-only stats */}
        <div className="border-t border-[#30363d] pt-4 mt-2 grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-500 font-semibold">CREATED</span>
            <p className="text-slate-300 font-bold">Today</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 font-semibold">STATUS</span>
            <p className="text-[#00f0ff] font-bold">Draft</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

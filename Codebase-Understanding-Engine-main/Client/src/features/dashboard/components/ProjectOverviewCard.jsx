import React from 'react';
import Card from '../../../shared/components/Card';

export default function ProjectOverviewCard({ overview, summary }) {
  return (
    <Card title="Active Repository Details" subtitle={`Active branch: ${overview.activeBranch}`}>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-white font-mono">{overview.name}</h4>
          <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">{overview.description}</p>
        </div>

        {/* Language breakdown */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-mono text-gray-500 font-semibold tracking-wider">Language Distribution</span>
          <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden flex">
            {overview.languageBreakdown.map((lang, idx) => (
              <div
                key={idx}
                className={lang.color}
                style={{ width: `${lang.percentage}%` }}
                title={`${lang.language}: ${lang.percentage}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
            {overview.languageBreakdown.map((lang, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${lang.color}`}></span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {lang.language} ({lang.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Quality Summary Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#30363d]/50 font-mono">
          <div className="bg-[#0d1117]/30 p-2 border border-[#30363d] rounded">
            <span className="text-[9px] text-gray-500 block uppercase">Complexity</span>
            <span className="text-xs font-semibold text-[#00f0ff]">{summary.complexityScore}</span>
          </div>
          <div className="bg-[#0d1117]/30 p-2 border border-[#30363d] rounded">
            <span className="text-[9px] text-gray-500 block uppercase">Test Coverage</span>
            <span className="text-xs font-semibold text-[#10b981]">{summary.testCoverage}</span>
          </div>
          <div className="bg-[#0d1117]/30 p-2 border border-[#30363d] rounded">
            <span className="text-[9px] text-gray-500 block uppercase">Circular Dep</span>
            <span className={`text-xs font-semibold ${summary.circularDependencies > 0 ? 'text-red-400' : 'text-gray-400'}`}>
              {summary.circularDependencies} found
            </span>
          </div>
          <div className="bg-[#0d1117]/30 p-2 border border-[#30363d] rounded">
            <span className="text-[9px] text-gray-500 block uppercase">Dead Code</span>
            <span className="text-xs font-semibold text-yellow-500">{summary.deadCodeWarnings} items</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

import React from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';
import { Link } from "react-router-dom";

export default function ProjectOverviewCard({ overview, summary, statistics = [] }) {
  // Extract counts from statistics if available, otherwise fallback to standard dummy values
  const filesCount = statistics.find(s => s.label.toLowerCase().includes('files'))?.value || '148';
  const functionsCount = statistics.find(s => s.label.toLowerCase().includes('functions'))?.value || '612';
  const nodesCount = statistics.find(s => s.label.toLowerCase().includes('nodes'))?.value || '1,204';

  return (
    <Card className="relative overflow-hidden border-[#30363d] bg-[#161b22]/30 shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-md">
      {/* Visual cyber glow background accent */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00f0ff]/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#a855f7]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="space-y-6">
        {/* Header Grid: Name, metadata & Actions */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-1.5 bg-[#00f0ff]/10 rounded border border-[#00f0ff]/20 text-[#00f0ff]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
                {overview.name}
              </h2>
              <Badge variant="success" size="sm" className="uppercase font-semibold tracking-wider text-[9px]">
                ready
              </Badge>
              <Badge variant="neutral" size="sm" className="font-mono text-gray-400">
                <span className="text-[10px] text-gray-500 mr-1">branch:</span>
                {overview.activeBranch}
              </Badge>
            </div>
            <p className="text-[13px] md:text-sm text-gray-400 font-sans leading-relaxed max-w-3xl">
              {overview.description}
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last analyzed: {overview.lastUpdated}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
            <Link to="/graph" className="inline-flex">
              <button className="bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 hover:border-[#00f0ff]/50 px-3.5 py-2 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.05)] hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                Explore Graph
              </button>
            </Link>
            <Link to="/assistant" className="inline-flex">
              <button className="bg-[#a855f7]/10 hover:bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/30 hover:border-[#a855f7]/50 px-3.5 py-2 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Ask AI
              </button>
            </Link>
            <Link to="/repository" className="inline-flex">
              <button className="bg-[#161b22] hover:bg-[#1f242c] text-gray-300 hover:text-white border border-[#30363d] hover:border-gray-500 px-3.5 py-2 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all duration-300 cursor-pointer">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Repository
              </button>
            </Link>
          </div>
        </div>

        {/* Info Grid: Files, Functions, Graph Nodes */}
        <div className="grid grid-cols-3 gap-6 py-4 px-5 bg-[#0d1117]/40 border border-[#30363d]/50 rounded-xl">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider font-semibold">Total Files</span>
            <div className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight">{filesCount}</div>
          </div>
          <div className="space-y-1 border-l border-[#30363d]/50 pl-6">
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider font-semibold">Functions</span>
            <div className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight">{functionsCount}</div>
          </div>
          <div className="space-y-1 border-l border-[#30363d]/50 pl-6">
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider font-semibold">Graph Nodes</span>
            <div className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight">{nodesCount}</div>
          </div>
        </div>

        {/* Language Breakdown Progress Bar */}
        <div className="space-y-2.5 pt-2">
          <span className="text-[11px] uppercase font-mono text-gray-400 font-bold tracking-wider block">Language Distribution</span>
          <div className="w-full h-2 bg-[#0d1117] rounded-full overflow-hidden flex border border-[#30363d]/50 shadow-inner">
            {overview.languageBreakdown.map((lang, idx) => (
              <div
                key={idx}
                className={`${lang.color} h-full transition-all duration-500`}
                style={{ width: `${lang.percentage}%` }}
                title={`${lang.language}: ${lang.percentage}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
            {overview.languageBreakdown.map((lang, idx) => (
              <div key={idx} className="flex items-center gap-2 group cursor-default">
                <span className={`w-2.5 h-2.5 rounded-full ${lang.color} shadow-sm group-hover:scale-125 transition-transform duration-200`}></span>
                <span className="text-[11px] text-gray-400 font-mono group-hover:text-gray-200 transition-colors duration-200">
                  <span className="font-semibold text-gray-300">{lang.language}</span>
                  <span className="text-gray-500 ml-1">({lang.percentage}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

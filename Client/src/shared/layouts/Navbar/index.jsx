import React from 'react';
import SearchBar from '../../components/SearchBar';
import Badge from '../../components/Badge';

export default function Navbar() {
  return (
    <header className="bg-[#161b22]/80 backdrop-blur-md border-b border-[#30363d] text-gray-200 h-14 px-4 flex items-center justify-between shrink-0 select-none z-10">
      {/* Left: Project & Active Repo Name */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[10px] font-semibold text-gray-400 font-mono tracking-wider shrink-0 uppercase">
          CodeMap AI
        </span>
        <span className="text-gray-600 text-sm font-mono shrink-0">/</span>
        <div className="flex items-center gap-1.5 min-w-0">
          <svg className="w-4 h-4 text-[#00f0ff] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
          </svg>
          <span className="text-xs font-medium text-white font-mono truncate">
            codemap-ai-core
          </span>
          <Badge variant="success" size="sm" className="hidden sm:inline-flex shrink-0">
            active
          </Badge>
        </div>
      </div>

      {/* Middle: Custom Search Bar (hidden on mobile) */}
      <div className="hidden md:flex flex-1 justify-center max-w-xs px-4">
        <SearchBar placeholder="Search codebase..." />
      </div>

      {/* Right: Actions / Notification placeholder / User Profile details */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Branch selector mock */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#0d1117] border border-[#30363d] px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 select-none">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm8 2a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          <span>main</span>
        </div>

        {/* Notification placeholder */}
        <button className="text-gray-400 hover:text-gray-200 p-1 hover:bg-[#30363d]/30 rounded transition-colors relative cursor-pointer">
          <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-[#00f0ff] rounded-full"></span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* User avatar */}
        <div className="w-6 h-6 rounded bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center font-bold text-xs text-[#00f0ff] font-mono select-none">
          D
        </div>
      </div>
    </header>
  );
}

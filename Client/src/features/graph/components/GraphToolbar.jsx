import React from 'react';

const modes = [
  { key: 'Architecture', label: 'Architecture' },
  { key: 'Modules', label: 'Modules' },
  { key: 'Dependency', label: 'Dependency Graph' },
  { key: 'Classes', label: 'Class Hierarchy' },
  { key: 'Functions', label: 'Function Calls' },
  { key: 'Routes', label: 'Route Lifecycles' }
];

export default function GraphToolbar({ 
  activeMode, 
  onChangeMode, 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onZoomReset, 
  onFitView, 
  onCenterSelection, 
  onExpandAll, 
  onCollapseAll,
  showFilters,
  onToggleFilters,
  showChat,
  onToggleChat,
  onReloadGraph
}) {
  return (
    <div className="bg-[#161b22]/70 border border-[#30363d] px-4 py-2.5 rounded-lg flex flex-wrap items-center justify-between gap-4 font-mono text-xs select-none">
      {/* Semantic Exploration Modes */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-gray-500 font-semibold uppercase tracking-wider text-[9px] mr-1">Explore:</span>
        <select
          value={activeMode}
          onChange={(e) => onChangeMode(e.target.value)}
          className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-[10px] text-slate-300 font-semibold focus:outline-none focus:border-[#00f0ff] cursor-pointer appearance-none pr-8 relative"
          style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22%239ca3af%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M8%2011L3%206h10l-5%205z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
        >
          <option value="" disabled>Graph Views ▼</option>
          {modes.map((m) => (
            <option key={m.key} value={m.key}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Action Utilities & Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Graph Reload Button */}
        <button
          onClick={onReloadGraph}
          type="button"
          className="bg-[#0d1117] border border-[#30363d] px-2.5 py-1 rounded text-[10px] text-gray-400 hover:text-white hover:border-gray-500 transition-all cursor-pointer flex items-center gap-1 font-semibold"
          title="Reload Graph Canvas"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Reload
        </button>

        {/* Filters Panel Toggle */}
        <button
          onClick={onToggleFilters}
          type="button"
          className={`border px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
            showFilters 
              ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff]' 
              : 'bg-[#30363d]/50 hover:bg-[#30363d] border-[#30363d] hover:border-gray-500 text-gray-300'
          }`}
          title="Filters Panel"
        >
          Filters
        </button>

        {/* Chat Panel Toggle */}
        <button
          onClick={onToggleChat}
          type="button"
          className={`border px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
            showChat 
              ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff]' 
              : 'bg-[#30363d]/50 hover:bg-[#30363d] border-[#30363d] hover:border-gray-500 text-gray-300'
          }`}
          title="AI Chat"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat
        </button>
      </div>
    </div>
  );
}

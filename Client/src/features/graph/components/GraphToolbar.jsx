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
  onToggleFilters
}) {
  return (
    <div className="bg-[#161b22]/70 border border-[#30363d] px-4 py-2.5 rounded-lg flex flex-wrap items-center justify-between gap-4 font-mono text-xs select-none">
      {/* Semantic Exploration Modes */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-gray-500 font-semibold uppercase tracking-wider text-[9px] mr-1">Explore:</span>
        <div className="flex bg-[#0d1117] border border-[#30363d] p-0.5 rounded flex-wrap gap-0.5">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => onChangeMode(m.key)}
              type="button"
              className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                activeMode === m.key
                  ? 'bg-[#30363d] text-[#00f0ff] shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Utilities & Zoom */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Camera Utilities */}
        <div className="flex items-center bg-[#0d1117] border border-[#30363d] p-0.5 rounded gap-0.5">
          <button
            onClick={onFitView}
            type="button"
            className="px-2 py-0.5 rounded text-[10px] text-gray-400 hover:text-white hover:bg-[#30363d]/50 cursor-pointer"
            title="Fit graph in viewport"
          >
            Fit View
          </button>
          <button
            onClick={onCenterSelection}
            type="button"
            className="px-2 py-0.5 rounded text-[10px] text-gray-400 hover:text-white hover:bg-[#30363d]/50 cursor-pointer"
            title="Center camera on selection"
          >
            Center Node
          </button>
        </div>

        {/* Tree Expansion Controls */}
        <div className="flex items-center bg-[#0d1117] border border-[#30363d] p-0.5 rounded gap-0.5">
          <button
            onClick={onExpandAll}
            type="button"
            className="px-2 py-0.5 rounded text-[10px] text-gray-400 hover:text-white hover:bg-[#30363d]/50 cursor-pointer"
            title="Expand current visible level"
          >
            Expand All
          </button>
          <button
            onClick={onCollapseAll}
            type="button"
            className="px-2 py-0.5 rounded text-[10px] text-gray-400 hover:text-white hover:bg-[#30363d]/50 cursor-pointer"
            title="Collapse back to module level"
          >
            Collapse All
          </button>
        </div>

        {/* Scale Controls */}
        <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded divide-x divide-[#30363d]">
          <button
            onClick={onZoomOut}
            type="button"
            className="px-2 py-0.5 text-gray-400 hover:text-gray-200 cursor-pointer font-bold"
            title="Zoom Out"
          >
            -
          </button>
          <span className="px-1.5 py-0.5 text-[9px] text-gray-300 min-w-[34px] text-center font-bold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            type="button"
            className="px-2 py-0.5 text-gray-400 hover:text-gray-200 cursor-pointer font-bold"
            title="Zoom In"
          >
            +
          </button>
        </div>

        {/* Filters Panel Toggle */}
        <button
          onClick={onToggleFilters}
          type="button"
          className={`border px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
            showFilters 
              ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff]' 
              : 'bg-[#30363d]/50 hover:bg-[#30363d] border-[#30363d] hover:border-gray-500 text-gray-300'
          }`}
        >
          Filters
        </button>
      </div>
    </div>
  );
}

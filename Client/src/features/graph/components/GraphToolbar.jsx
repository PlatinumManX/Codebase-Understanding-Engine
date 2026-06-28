import React from 'react';

export default function GraphToolbar({ zoom, onZoomIn, onZoomOut, onZoomReset, layout, onChangeLayout }) {
  const layouts = ['Force-Directed', 'Hierarchical', 'Circular'];

  return (
    <div className="bg-[#161b22]/50 border border-[#30363d] px-3 py-2 rounded-lg flex flex-wrap items-center justify-between gap-3 font-mono text-xs select-none">
      {/* Layout engine selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Layout:</span>
        <div className="flex bg-[#0d1117] border border-[#30363d] p-0.5 rounded">
          {layouts.map((l) => (
            <button
              key={l}
              onClick={() => onChangeLayout(l)}
              type="button"
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                layout === l
                  ? 'bg-[#30363d] text-[#00f0ff]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom panel */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Scale:</span>
        <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded divide-x divide-[#30363d]">
          <button
            onClick={onZoomOut}
            type="button"
            className="px-2.5 py-0.5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer font-bold"
            title="Zoom Out"
          >
            -
          </button>
          <span className="px-2 py-0.5 text-[9px] text-gray-300 font-semibold min-w-[38px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            type="button"
            className="px-2.5 py-0.5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer font-bold"
            title="Zoom In"
          >
            +
          </button>
        </div>
        <button
          onClick={onZoomReset}
          type="button"
          className="bg-[#30363d]/50 hover:bg-[#30363d] border border-[#30363d] hover:border-gray-500 text-gray-300 text-[10px] px-2 py-1 rounded transition-colors cursor-pointer"
        >
          Reset View
        </button>
      </div>
    </div>
  );
}

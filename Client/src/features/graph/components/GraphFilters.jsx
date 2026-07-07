import React from 'react';
import Card from '../../../shared/components/Card';

const getPrettyLabel = (type) => {
  switch (type) {
    case 'module':
      return 'File Modules';
    case 'class':
      return 'Classes';
    case 'function':
      return 'Functions';
    case 'method':
      return 'Class Methods';
    case 'route':
      return 'API Endpoints';
    case 'external_class':
      return 'External Classes';
    default:
      return type;
  }
};

export default function GraphFilters({ 
  selectedGroups, 
  onToggleGroup, 
  showFilesOnly, 
  onToggleFilesOnly,
  typeCounts = {}
}) {
  const availableTypes = ['module', 'class', 'function', 'method', 'route', 'external_class'];

  return (
    <Card title="Graph Filters" subtitle="Filter canvas nodes">
      <div className="space-y-4 font-mono">
        {/* Toggle file only */}
        <div className="flex items-center justify-between pb-3 border-b border-[#30363d]/30">
          <span className="text-[11px] text-gray-300">File Modules Only</span>
          <button
            onClick={onToggleFilesOnly}
            type="button"
            className={`w-8 h-4 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
              showFilesOnly ? 'bg-[#00f0ff]' : 'bg-[#30363d]'
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-[#0d1117] transition-transform ${
              showFilesOnly ? 'translate-x-4' : ''
            }`} />
          </button>
        </div>

        {/* Symbol Type Filters */}
        <div className="space-y-2">
          <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Symbol Filters</span>
          <div className="space-y-1.5">
            {availableTypes.map((type) => {
              const isChecked = selectedGroups.includes(type);
              const count = typeCounts[type] || 0;
              return (
                <label
                  key={type}
                  className="flex items-center justify-between text-xs text-gray-300 hover:text-white cursor-pointer select-none py-0.5 animate-fade-in"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleGroup(type)}
                      className="rounded bg-[#0d1117] border-[#30363d] text-[#00f0ff] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>{getPrettyLabel(type)}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 bg-[#0d1117] px-1.5 py-0.5 rounded border border-[#30363d] leading-none font-semibold">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

import React from 'react';

export default function GraphLegend() {
  const categories = [
    { label: 'Repository Root', color: 'bg-[#3b82f6]', border: 'border-[#3b82f6]/30' },
    { label: 'File Modules', color: 'bg-[#10b981]', border: 'border-[#10b981]/30' },
    { label: 'Classes', color: 'bg-[#f97316]', border: 'border-[#f97316]/30' },
    { label: 'Functions', color: 'bg-[#8b5cf6]', border: 'border-[#8b5cf6]/30' },
    { label: 'Class Methods', color: 'bg-[#eab308]', border: 'border-[#eab308]/30' },
    { label: 'API Routes', color: 'bg-[#ef4444]', border: 'border-[#ef4444]/30' },
    { label: 'External Libraries', color: 'bg-[#64748b]', border: 'border-[#64748b]/30' }
  ];

  return (
    <div className="bg-[#161b22]/50 border border-[#30363d] rounded-lg p-3 flex flex-wrap gap-x-4 gap-y-2 justify-center font-mono text-[10px] select-none">
      {categories.map((c, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${c.color} border ${c.border}`}></span>
          <span className="text-gray-400">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

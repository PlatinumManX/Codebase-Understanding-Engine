import React from 'react';

export default function GraphLegend() {
  const categories = [
    { label: 'File Nodes', color: 'bg-[#38bdf8]', border: 'border-[#38bdf8]/30' },
    { label: 'Class Objects', color: 'bg-[#0284c7]', border: 'border-[#0284c7]/30' },
    { label: 'Router Endpoints', color: 'bg-[#a855f7]', border: 'border-[#a855f7]/30' },
    { label: 'Utility Helpers', color: 'bg-[#f59e0b]', border: 'border-[#f59e0b]/30' },
    { label: 'Database Client', color: 'bg-[#10b981]', border: 'border-[#10b981]/30' }
  ];

  return (
    <div className="bg-[#161b22]/50 border border-[#30363d] rounded-lg p-3 flex flex-wrap gap-x-4 gap-y-2 justify-center font-mono text-[10px]">
      {categories.map((c, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${c.color} border ${c.border}`}></span>
          <span className="text-gray-400">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

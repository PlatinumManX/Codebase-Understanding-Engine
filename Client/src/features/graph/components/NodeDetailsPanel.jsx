import React from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

export default function NodeDetailsPanel({ node, edges = [] }) {
  if (!node) {
    return (
      <Card title="Node Inspector" subtitle="Select a node to inspect">
        <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500 font-mono">
          <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span className="text-[11px] leading-relaxed max-w-[200px]">Click any node on the graph canvas to inspect parsed metadata.</span>
        </div>
      </Card>
    );
  }

  // Find relationships
  const incoming = edges.filter(e => e.target === node.id);
  const outgoing = edges.filter(e => e.source === node.id);

  return (
    <Card title="Node Inspector" subtitle={`ID: ${node.id}`}>
      <div className="space-y-4 font-mono text-xs">
        {/* Basic Metadata */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Symbol Name:</span>
            <span className="text-white font-semibold text-right truncate max-w-[140px]" title={node.label}>
              {node.label}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Symbol Type:</span>
            <Badge variant={node.type === 'file' ? 'info' : 'purple'} size="sm" className="uppercase text-[9px] leading-none">
              {node.type}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Module Group:</span>
            <span className="text-gray-300 capitalize">{node.group}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Lines of Code:</span>
            <span className="text-gray-300">{node.loc} LOC</span>
          </div>
        </div>

        {/* References / Incoming relationships */}
        <div className="space-y-2 pt-3 border-t border-[#30363d]/30">
          <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block">
            Incoming References ({incoming.length})
          </span>
          {incoming.length > 0 ? (
            <div className="space-y-1.5 bg-[#0d1117]/30 border border-[#30363d] rounded p-2 max-h-[85px] overflow-y-auto">
              {incoming.map((e, idx) => (
                <div key={idx} className="flex justify-between text-[10px] text-gray-400">
                  <span className="truncate max-w-[110px]">{e.source}</span>
                  <span className="text-gray-600 text-[9px] font-sans">({e.label})</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-gray-600 italic block">No incoming references.</span>
          )}
        </div>

        {/* Outgoing relationships */}
        <div className="space-y-2 pt-3 border-t border-[#30363d]/30">
          <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block">
            Dependencies ({outgoing.length})
          </span>
          {outgoing.length > 0 ? (
            <div className="space-y-1.5 bg-[#0d1117]/30 border border-[#30363d] rounded p-2 max-h-[85px] overflow-y-auto">
              {outgoing.map((e, idx) => (
                <div key={idx} className="flex justify-between text-[10px] text-gray-400">
                  <span className="truncate max-w-[110px]">{e.target}</span>
                  <span className="text-gray-600 text-[9px] font-sans">({e.label})</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-gray-600 italic block">No dependencies mapped.</span>
          )}
        </div>
      </div>
    </Card>
  );
}

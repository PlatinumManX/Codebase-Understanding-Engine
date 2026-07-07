import React from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

export default function NodeDetailsPanel({ node, edges = [], selectedEdge, onClearEdge }) {
  if (selectedEdge) {
    return (
      <Card 
        title="Relation Inspector" 
        subtitle="Edge connection details"
        actions={
          <button 
            onClick={onClearEdge} 
            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
          >
            Clear
          </button>
        }
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Source Node:</span>
              <span className="text-white font-semibold break-all bg-[#0d1117]/60 border border-[#30363d] p-1.5 rounded">{selectedEdge.source}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Target Node:</span>
              <span className="text-white font-semibold break-all bg-[#0d1117]/60 border border-[#30363d] p-1.5 rounded">{selectedEdge.target}</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-500">Relationship:</span>
              <Badge variant="info" size="sm" className="uppercase text-[9px]">{selectedEdge.type}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Edge Type:</span>
              <span className="text-slate-300 capitalize">{selectedEdge.type}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!node) {
    return (
      <Card title="Node Inspector" subtitle="Select a node to inspect">
        <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500 font-mono">
          <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span className="text-[11px] leading-relaxed max-w-[200px]">Click any node or edge on the canvas to inspect relationship structures.</span>
        </div>
      </Card>
    );
  }

  const incoming = edges.filter(e => e.target === node.id);
  const outgoing = edges.filter(e => e.source === node.id);
  const nd = node.data || {};

  return (
    <Card title="Node Inspector" subtitle={`Type: ${node.type || 'unknown'}`}>
      <div className="space-y-4 font-mono text-xs">
        {/* Basic Properties */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Name:</span>
            <span className="text-white font-semibold text-right truncate max-w-[140px]" title={node.label}>
              {node.label}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Type:</span>
            <Badge variant="purple" size="sm" className="uppercase text-[9px] leading-none">
              {node.type}
            </Badge>
          </div>
          {nd.file && (
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">File:</span>
              <span className="text-slate-300 break-all text-[10px] leading-tight bg-[#0d1117]/40 p-1 border border-[#30363d]/50 rounded" title={nd.file}>
                {nd.file}
              </span>
            </div>
          )}
          {nd.path && (
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Path:</span>
              <span className="text-slate-300 break-all text-[10px] leading-tight bg-[#0d1117]/40 p-1 border border-[#30363d]/50 rounded" title={nd.path}>
                {nd.path}
              </span>
            </div>
          )}
        </div>

        {/* Rich Metadata Section */}
        {node.type === 'class' && (
          <div className="space-y-2 pt-3 border-t border-[#30363d]/30">
            {nd.inherits && nd.inherits.length > 0 && (
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Inherits From:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {nd.inherits.map((p, idx) => (
                    <Badge key={idx} variant="secondary" size="sm">{p}</Badge>
                  ))}
                </div>
              </div>
            )}
            {nd.methods && nd.methods.length > 0 && (
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Methods:</span>
                <div className="bg-[#0d1117]/60 border border-[#30363d] p-1.5 rounded mt-1 max-h-[70px] overflow-y-auto space-y-1">
                  {nd.methods.map((m, idx) => (
                    <div key={idx} className="text-gray-300 text-[10px]">• {m}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {node.type === 'function' && (
          <div className="space-y-2 pt-3 border-t border-[#30363d]/30">
            {nd.parameters && nd.parameters.length > 0 && (
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Parameters:</span>
                <div className="text-slate-300 bg-[#0d1117]/60 border border-[#30363d] p-1.5 rounded mt-1 text-[10px] leading-normal font-sans">
                  {nd.parameters.join(', ')}
                </div>
              </div>
            )}
            {nd.resolved_calls && nd.resolved_calls.length > 0 && (
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Resolved Calls:</span>
                <div className="bg-[#0d1117]/60 border border-[#30363d] p-1.5 rounded mt-1 max-h-[75px] overflow-y-auto space-y-1">
                  {nd.resolved_calls.map((c, idx) => (
                    <div key={idx} className="text-slate-400 text-[9px] truncate" title={`${c.file} -> ${c.function}`}>
                      📞 {c.function}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {node.type === 'route' && (
          <div className="space-y-2 pt-3 border-t border-[#30363d]/30">
            {nd.methods && nd.methods.length > 0 && (
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">HTTP Methods:</span>
                <div className="flex gap-1 mt-1">
                  {nd.methods.map((m, idx) => (
                    <Badge key={idx} variant="warning" size="sm">{m}</Badge>
                  ))}
                </div>
              </div>
            )}
            {nd.handler && (
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Route Handler:</span>
                <div className="text-slate-300 font-bold bg-[#0d1117]/60 border border-[#30363d] p-1.5 rounded mt-1 text-[10px]">
                  ⚙️ {nd.handler}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Source Code Inspector */}
        {nd.source_code && (
          <div className="space-y-2 pt-3 border-t border-[#30363d]/30">
            <span className="text-[10px] text-gray-500 uppercase font-semibold block">Source Code Preview:</span>
            <pre className="bg-[#0d1117]/80 border border-[#30363d] p-2 rounded max-h-[120px] overflow-auto text-[9px] text-slate-300 font-mono leading-tight whitespace-pre-wrap select-text">
              {nd.source_code}
            </pre>
          </div>
        )}

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
                  <span className="text-gray-600 text-[9px] font-sans">({e.type})</span>
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
                  <span className="text-gray-600 text-[9px] font-sans">({e.type})</span>
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

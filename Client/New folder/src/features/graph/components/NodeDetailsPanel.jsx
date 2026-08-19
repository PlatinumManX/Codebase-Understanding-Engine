import React, { useState, useEffect } from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

export default function NodeDetailsPanel({ 
  node, 
  edges = [], 
  selectedEdge, 
  onClearEdge, 
  activeRepo,
  totalNodesCount = 0,
  totalEdgesCount = 0,
  visibleNodesCount = 0,
  visibleEdgesCount = 0
}) {
  const [activeTab, setActiveTab] = useState('node');

  // Automatically switch tabs on click selections for optimal UX
  useEffect(() => {
    if (selectedEdge) {
      setActiveTab('relationship');
    } else if (node) {
      setActiveTab('node');
    }
  }, [selectedEdge, node]);

  const tabs = [
    { id: 'node', label: 'Node Inspector' },
    { id: 'relationship', label: 'Relationship' },
    { id: 'repo', label: 'Repository Info' },
    { id: 'stats', label: 'Statistics' },
    { id: 'ai', label: 'AI Insights' }
  ];

  const incoming = node ? edges.filter(e => e.target === node.id) : [];
  const outgoing = node ? edges.filter(e => e.source === node.id) : [];
  const nd = node?.data || {};

  return (
    <div className="bg-[#161b22]/40 border border-[#30363d] rounded-lg overflow-hidden flex flex-col h-[240px] font-mono text-xs select-none">
      {/* Tabs Header */}
      <div className="bg-[#0d1117] border-b border-[#30363d] px-4 flex items-center justify-between h-[40px] flex-shrink-0">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-[40px] px-1 text-[11px] font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#00f0ff] text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {(selectedEdge || node) && (
          <button 
            onClick={() => {
              if (selectedEdge) onClearEdge();
              // clear selected node is handled in parent
            }} 
            className="text-[10px] text-cyan-400 hover:text-cyan-300"
          >
            Clear Selected
          </button>
        )}
      </div>

      {/* Tab Body Viewports */}
      <div className="p-4 overflow-y-auto flex-grow h-[200px]">
        {activeTab === 'node' && (
          <div>
            {!node ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <p className="text-[11px] max-w-[340px]">Click any node on the graph canvas to inspect parsed AST metadata (classes, methods, parameters, routes).</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basic Details */}
                <div className="space-y-2 border-r border-[#30363d]/30 pr-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="text-white font-semibold truncate max-w-[150px]" title={node.label}>{node.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Symbol Type:</span>
                    <Badge variant="purple" size="sm" className="uppercase text-[9px]">{node.type}</Badge>
                  </div>
                  {nd.file && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-500">File Reference:</span>
                      <span className="text-slate-300 break-all text-[10px] leading-snug">{nd.file}</span>
                    </div>
                  )}
                  {nd.path && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-500">Path Reference:</span>
                      <span className="text-slate-300 break-all text-[10px] leading-snug">{nd.path}</span>
                    </div>
                  )}
                </div>

                {/* Subclass/Params Details */}
                <div className="space-y-2 border-r border-[#30363d]/30 pr-4">
                  {node.type === 'class' && (
                    <div className="space-y-2">
                      {nd.inherits && nd.inherits.length > 0 && (
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Inherits From:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {nd.inherits.map((p, i) => (
                              <Badge key={i} variant="secondary" size="sm">{p}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {nd.methods && nd.methods.length > 0 && (
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Methods ({nd.methods.length}):</span>
                          <span className="text-gray-300 text-[10px] truncate block mt-0.5">{nd.methods.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {node.type === 'function' && (
                    <div className="space-y-2">
                      {nd.parameters && nd.parameters.length > 0 && (
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Parameters:</span>
                          <span className="text-slate-300 text-[10px] mt-0.5 block font-sans">({nd.parameters.join(', ')})</span>
                        </div>
                      )}
                      {nd.resolved_calls && nd.resolved_calls.length > 0 && (
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Resolved Calls ({nd.resolved_calls.length}):</span>
                          <span className="text-slate-400 text-[9px] truncate block mt-0.5">
                            {nd.resolved_calls.map(c => c.function).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {node.type === 'route' && (
                    <div className="space-y-2">
                      {nd.methods && nd.methods.length > 0 && (
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-semibold block">HTTP Methods:</span>
                          <div className="flex gap-1 mt-1">
                            {nd.methods.map((m, i) => (
                              <Badge key={i} variant="warning" size="sm">{m}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {nd.handler && (
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Route Handler:</span>
                          <span className="text-slate-300 font-bold mt-0.5 block">⚙️ {nd.handler}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!nd.inherits && !nd.parameters && !nd.handler && (
                    <div className="text-gray-600 italic py-4">No additional AST metadata properties mapping.</div>
                  )}
                </div>

                {/* Source Code Preview */}
                <div className="flex flex-col h-full justify-between">
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block">Source Code Preview:</span>
                  {nd.source_code ? (
                    <pre className="bg-[#0d1117]/80 border border-[#30363d] p-2 rounded max-h-[120px] overflow-auto text-[9px] text-slate-300 font-mono leading-tight whitespace-pre-wrap select-text mt-1">
                      {nd.source_code}
                    </pre>
                  ) : (
                    <div className="text-gray-600 italic py-4">Source code preview not available.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'relationship' && (
          <div>
            {selectedEdge ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 border-r border-[#30363d]/30 pr-4">
                  <div className="flex flex-col">
                    <span className="text-gray-500">Source:</span>
                    <span className="text-white font-semibold break-all text-[11px] bg-[#0d1117]/50 p-1 border border-[#30363d]/35 rounded mt-0.5">{selectedEdge.source}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Target:</span>
                    <span className="text-white font-semibold break-all text-[11px] bg-[#0d1117]/50 p-1 border border-[#30363d]/35 rounded mt-0.5">{selectedEdge.target}</span>
                  </div>
                </div>
                <div className="space-y-2 pl-2 flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Relationship:</span>
                    <Badge variant="info" size="sm" className="uppercase text-[9px]">{selectedEdge.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Call Type:</span>
                    <span className="text-slate-300 capitalize">{selectedEdge.type}</span>
                  </div>
                </div>
              </div>
            ) : node ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Incoming References */}
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block mb-1">
                    Incoming References ({incoming.length})
                  </span>
                  {incoming.length > 0 ? (
                    <div className="space-y-1 bg-[#0d1117]/30 border border-[#30363d]/80 rounded p-2 max-h-[120px] overflow-y-auto">
                      {incoming.map((e, idx) => (
                        <div key={idx} className="flex justify-between text-[10px] text-gray-400">
                          <span className="truncate max-w-[200px]" title={e.source}>{e.source}</span>
                          <span className="text-gray-600 text-[9px]">({e.type})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-600 italic block">No incoming references.</span>
                  )}
                </div>

                {/* Dependencies */}
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider block mb-1">
                    Dependencies ({outgoing.length})
                  </span>
                  {outgoing.length > 0 ? (
                    <div className="space-y-1 bg-[#0d1117]/30 border border-[#30363d]/80 rounded p-2 max-h-[120px] overflow-y-auto">
                      {outgoing.map((e, idx) => (
                        <div key={idx} className="flex justify-between text-[10px] text-gray-400">
                          <span className="truncate max-w-[200px]" title={e.target}>{e.target}</span>
                          <span className="text-gray-600 text-[9px]">({e.type})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-600 italic block">No dependencies mapped.</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                <p>Click any node or relationship line on the canvas to inspect connections.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'repo' && (
          <div>
            {!activeRepo ? (
              <div className="text-gray-500 text-center py-8">No active repository mapped.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 border-r border-[#30363d]/30 pr-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Repository Name:</span>
                    <span className="text-white font-semibold">{activeRepo.repository_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Language:</span>
                    <span className="text-cyan-400 font-semibold">{activeRepo.language || 'Python'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pipeline Status:</span>
                    <Badge variant="success" size="sm">READY</Badge>
                  </div>
                </div>
                <div className="space-y-2 border-r border-[#30363d]/30 pr-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Modules:</span>
                    <span className="text-gray-300 font-bold">{activeRepo.statistics?.modules || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Functions:</span>
                    <span className="text-gray-300 font-bold">{activeRepo.statistics?.functions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Classes:</span>
                    <span className="text-gray-300 font-bold">{activeRepo.statistics?.classes || 0}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span className="text-gray-400 text-[10px] font-sans">
                      {activeRepo.created_at ? new Date(activeRepo.created_at).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">DB Id:</span>
                    <span className="text-slate-500 text-[10px] font-mono truncate max-w-[120px]">{activeRepo.repository_id}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#0d1117]/60 border border-[#30363d] p-3 rounded text-center">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Visible Canvas Nodes</span>
              <span className="text-[18px] text-white font-bold block mt-1">{visibleNodesCount} / {totalNodesCount}</span>
            </div>
            <div className="bg-[#0d1117]/60 border border-[#30363d] p-3 rounded text-center">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Visible Canvas Edges</span>
              <span className="text-[18px] text-white font-bold block mt-1">{visibleEdgesCount} / {totalEdgesCount}</span>
            </div>
            <div className="bg-[#0d1117]/60 border border-[#30363d] p-3 rounded text-center col-span-2">
              <span className="text-[10px] text-gray-500 uppercase font-semibold block">Pipeline Sync Stages</span>
              <div className="flex justify-center gap-2 mt-2">
                <Badge variant="success" size="sm">PARSER</Badge>
                <Badge variant="success" size="sm">GRAPH</Badge>
                <Badge variant="secondary" size="sm">RETRIEVAL</Badge>
                <Badge variant="secondary" size="sm">FLOW</Badge>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex items-center gap-4 bg-[#00f0ff]/5 border border-[#00f0ff]/20 p-4 rounded-lg">
            <svg className="w-8 h-8 text-[#00f0ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <h4 className="text-white font-semibold text-xs mb-0.5">AI Graph Ingestion Context Ready</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans max-w-[500px]">
                The module graph and AST nodes are fully indexed. You can use the AI Assistant panel to query relations, ask for route lifecycles walkthroughs, or generate unit test cases based on this codebase model.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

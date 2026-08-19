import React, { useEffect, useMemo, useState } from 'react';
import Badge from '../../../shared/components/Badge';

const TYPE_VARIANTS = {
  repository: 'info',
  module: 'success',
  class: 'warning',
  function: 'purple',
  method: 'warning',
  route: 'danger',
  external: 'secondary'
};

function SectionLabel({ children }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500 font-semibold mb-2">
      {children}
    </div>
  );
}

function EmptyState({ children }) {
  return <p className="text-[11px] text-slate-600 italic leading-relaxed">{children}</p>;
}

export default function NodeDetailsPanel({
  node,
  edges = [],
  selectedEdge,
  onClearEdge,
  onClearNode,
  activeRepo,
  totalNodesCount = 0,
  totalEdgesCount = 0,
  visibleNodesCount = 0,
  visibleEdgesCount = 0
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveTab(selectedEdge ? 'relations' : 'overview');
  }, [selectedEdge, node]);

  const incoming = useMemo(
    () => (node ? edges.filter((edge) => edge.target === node.id) : []),
    [edges, node]
  );
  const outgoing = useMemo(
    () => (node ? edges.filter((edge) => edge.source === node.id) : []),
    [edges, node]
  );

  const nd = node?.data || {};
  const source = nd.source_code || '';
  const sourceLines = source ? source.split('\n') : [];

  const clearSelection = () => {
    if (selectedEdge) onClearEdge?.();
    if (node) onClearNode?.();
  };

  const copySource = async () => {
    if (!source) return;
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'source', label: 'Source' },
    { id: 'relations', label: 'Relations' },
    { id: 'context', label: 'Context' }
  ];

  return (
    <div className="h-[550px] rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden flex flex-col font-mono shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
      <div className="px-4 py-3 border-b border-[#30363d] bg-[#111820] flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#00f0ff] mb-1">
            {selectedEdge ? 'Relationship Inspector' : 'Node Inspector'}
          </div>
          <div className="text-sm font-bold text-white truncate" title={node?.label || selectedEdge?.type}>
            {node?.label || selectedEdge?.type || 'Selection'}
          </div>
          {node && (
            <div className="mt-2 flex items-center gap-2 min-w-0">
              <Badge variant={TYPE_VARIANTS[node.type] || 'secondary'} size="sm" className="uppercase text-[9px]">
                {node.type}
              </Badge>
              <span className="text-[10px] text-slate-500 truncate" title={nd.file || nd.path || ''}>
                {nd.file || nd.path || 'Parsed symbol'}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={clearSelection}
          className="w-7 h-7 shrink-0 rounded border border-[#30363d] text-slate-500 hover:text-white hover:border-slate-500 transition-colors"
          aria-label="Close inspector"
          title="Close inspector"
        >
          ×
        </button>
      </div>

      <div className="px-3 border-b border-[#30363d] bg-[#0b1016] flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 h-10 text-[10px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#00f0ff] text-white'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 select-text">
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {selectedEdge ? (
              <div className="space-y-4">
                <div>
                  <SectionLabel>Source</SectionLabel>
                  <div className="rounded border border-[#30363d] bg-[#080c11] p-3 text-[11px] text-slate-200 break-all">
                    {selectedEdge.source}
                  </div>
                </div>
                <div>
                  <SectionLabel>Target</SectionLabel>
                  <div className="rounded border border-[#30363d] bg-[#080c11] p-3 text-[11px] text-slate-200 break-all">
                    {selectedEdge.target}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Relationship</span>
                  <Badge variant="info" size="sm" className="uppercase text-[9px]">{selectedEdge.type}</Badge>
                </div>
              </div>
            ) : node ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded border border-[#30363d] bg-[#111820] p-3">
                    <div className="text-[9px] uppercase text-slate-600 mb-1">Incoming</div>
                    <div className="text-lg font-bold text-cyan-400">{incoming.length}</div>
                  </div>
                  <div className="rounded border border-[#30363d] bg-[#111820] p-3">
                    <div className="text-[9px] uppercase text-slate-600 mb-1">Outgoing</div>
                    <div className="text-lg font-bold text-violet-400">{outgoing.length}</div>
                  </div>
                </div>

                <div>
                  <SectionLabel>Symbol details</SectionLabel>
                  <div className="divide-y divide-[#30363d]/60 rounded border border-[#30363d] bg-[#080c11]">
                    <div className="flex justify-between gap-4 p-3 text-[11px]">
                      <span className="text-slate-500">Name</span>
                      <span className="text-slate-200 text-right break-all">{node.label}</span>
                    </div>
                    {(nd.file || nd.path) && (
                      <div className="p-3 text-[11px]">
                        <div className="text-slate-500 mb-1">File</div>
                        <div className="text-slate-300 break-all leading-relaxed">{nd.file || nd.path}</div>
                      </div>
                    )}
                    {nd.parameters?.length > 0 && (
                      <div className="p-3 text-[11px]">
                        <div className="text-slate-500 mb-1">Parameters</div>
                        <div className="text-slate-300 break-words">({nd.parameters.join(', ')})</div>
                      </div>
                    )}
                    {nd.inherits?.length > 0 && (
                      <div className="p-3 text-[11px]">
                        <div className="text-slate-500 mb-2">Inherits</div>
                        <div className="flex flex-wrap gap-1">
                          {nd.inherits.map((item) => <Badge key={item} variant="secondary" size="sm">{item}</Badge>)}
                        </div>
                      </div>
                    )}
                    {nd.methods?.length > 0 && (
                      <div className="p-3 text-[11px]">
                        <div className="text-slate-500 mb-1">Methods</div>
                        <div className="text-slate-300 break-words">{nd.methods.join(', ')}</div>
                      </div>
                    )}
                    {nd.handler && (
                      <div className="flex justify-between gap-4 p-3 text-[11px]">
                        <span className="text-slate-500">Handler</span>
                        <span className="text-slate-200 text-right break-all">{nd.handler}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('source')}
                  className="w-full rounded border border-[#00f0ff]/30 bg-[#00f0ff]/5 px-3 py-2.5 text-[11px] text-cyan-300 hover:bg-[#00f0ff]/10 transition-colors"
                >
                  Open source code →
                </button>
              </>
            ) : null}
          </div>
        )}

        {activeTab === 'source' && (
          <div className="h-full flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="min-w-0">
                <SectionLabel>Source code</SectionLabel>
                <div className="text-[10px] text-slate-500 truncate" title={nd.file || nd.path || ''}>
                  {nd.file || nd.path || node?.label || 'Selected symbol'}
                </div>
              </div>
              {source && (
                <button
                  type="button"
                  onClick={copySource}
                  className="shrink-0 rounded border border-[#30363d] px-2.5 py-1.5 text-[10px] text-slate-400 hover:text-white hover:border-slate-500"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            {source ? (
              <div className="rounded-md border border-[#30363d] bg-[#070b10] overflow-auto flex-1 min-h-[380px]">
                <table className="w-full border-collapse text-[11px] leading-5">
                  <tbody>
                    {sourceLines.map((line, index) => (
                      <tr key={`${index}-${line}`} className="hover:bg-white/[0.025] align-top">
                        <td className="w-10 select-none text-right pr-3 pl-2 text-slate-700 border-r border-[#202832] sticky left-0 bg-[#070b10]">
                          {index + 1}
                        </td>
                        <td className="pl-3 pr-4 whitespace-pre text-slate-300">{line || ' '}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded border border-dashed border-[#30363d] p-8 text-center">
                <EmptyState>Source code is not available for this graph node.</EmptyState>
              </div>
            )}
          </div>
        )}

        {activeTab === 'relations' && (
          <div className="space-y-5">
            {selectedEdge ? (
              <>
                <div>
                  <SectionLabel>Source → Target</SectionLabel>
                  <div className="rounded border border-[#30363d] bg-[#080c11] p-3 space-y-2 text-[11px]">
                    <div className="text-slate-300 break-all">{selectedEdge.source}</div>
                    <div className="text-cyan-500">↓ {selectedEdge.type}</div>
                    <div className="text-slate-300 break-all">{selectedEdge.target}</div>
                  </div>
                </div>
              </>
            ) : node ? (
              <>
                <div>
                  <SectionLabel>Called / referenced by ({incoming.length})</SectionLabel>
                  <div className="space-y-1.5">
                    {incoming.length ? incoming.map((edge, index) => (
                      <div key={`${edge.source}-${index}`} className="rounded border border-[#30363d] bg-[#080c11] p-2.5 flex justify-between gap-3 text-[10px]">
                        <span className="text-slate-300 break-all">{edge.source}</span>
                        <span className="text-slate-600 shrink-0">{edge.type}</span>
                      </div>
                    )) : <EmptyState>No incoming references.</EmptyState>}
                  </div>
                </div>
                <div>
                  <SectionLabel>Calls / depends on ({outgoing.length})</SectionLabel>
                  <div className="space-y-1.5">
                    {outgoing.length ? outgoing.map((edge, index) => (
                      <div key={`${edge.target}-${index}`} className="rounded border border-[#30363d] bg-[#080c11] p-2.5 flex justify-between gap-3 text-[10px]">
                        <span className="text-slate-300 break-all">{edge.target}</span>
                        <span className="text-slate-600 shrink-0">{edge.type}</span>
                      </div>
                    )) : <EmptyState>No outgoing dependencies.</EmptyState>}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {activeTab === 'context' && (
          <div className="space-y-5">
            <div>
              <SectionLabel>Repository context</SectionLabel>
              <div className="rounded border border-[#30363d] bg-[#080c11] divide-y divide-[#30363d]/60 text-[11px]">
                <div className="flex justify-between gap-3 p-3">
                  <span className="text-slate-500">Repository</span>
                  <span className="text-slate-200 text-right">{activeRepo?.repository_name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between gap-3 p-3">
                  <span className="text-slate-500">Visible nodes</span>
                  <span className="text-slate-300">{visibleNodesCount} / {totalNodesCount}</span>
                </div>
                <div className="flex justify-between gap-3 p-3">
                  <span className="text-slate-500">Visible edges</span>
                  <span className="text-slate-300">{visibleEdgesCount} / {totalEdgesCount}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-violet-500/20 bg-violet-500/[0.06] p-4">
              <div className="text-[10px] uppercase tracking-[0.16em] text-violet-300 mb-2">AI handoff</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                This selected symbol can be used as focused context for architecture questions, execution-flow explanations, and dependency analysis.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

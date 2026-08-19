import React from 'react';
import Card from '../../../shared/components/Card';

export default function FlowSelector({ selectedFlow, onSelectFlow }) {
  const flows = [
    { id: 'login', method: 'POST', path: '/login', time: '145ms', status: 'success' },
    { id: 'profile', method: 'GET', path: '/user/profile', time: '42ms', status: 'success' },
    { id: 'register', method: 'POST', path: '/user/register', time: '210ms', status: 'failed' }
  ];

  return (
    <Card title="Available Execution Traces" subtitle="Select a trace to visualize">
      <div className="space-y-2 font-mono">
        {flows.map((flow) => {
          const isSelected = selectedFlow === flow.id;
          const methodColors = {
            POST: 'text-[#a855f7]',
            GET: 'text-[#10b981]',
            PUT: 'text-[#f59e0b]',
            DELETE: 'text-red-400'
          };
          return (
            <button
              key={flow.id}
              onClick={() => onSelectFlow(flow.id)}
              type="button"
              className={`w-full flex items-center justify-between p-2.5 rounded border text-xs text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#161b22] border-[#00f0ff] text-[#00f0ff]'
                  : 'bg-transparent border-[#30363d] hover:border-gray-500 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`font-bold ${methodColors[flow.method] || 'text-gray-400'}`}>
                  {flow.method}
                </span>
                <span className="truncate text-gray-300 font-semibold">{flow.path}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-[10px] text-gray-500">{flow.time}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  flow.status === 'success' ? 'bg-[#10b981]' : 'bg-red-400'
                }`} />
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

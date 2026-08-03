import React from 'react';
import Card from '../../../shared/components/Card';

export default function FlowDetailsCard({ flowDetails }) {
  return (
    <Card title="Trace Metadata" subtitle="System metrics for selected transaction">
      <div className="space-y-4 font-mono text-xs">
        <div>
          <h4 className="text-sm font-semibold text-white">{flowDetails.title}</h4>
          <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
            {flowDetails.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#30363d]/30">
          <div className="bg-[#0d1117]/30 p-2 border border-[#30363d] rounded">
            <span className="text-[9px] text-gray-500 block">TOTAL LATENCY</span>
            <span className="text-xs font-semibold text-[#00f0ff]">{flowDetails.totalTimeMs} ms</span>
          </div>
          <div className="bg-[#0d1117]/30 p-2 border border-[#30363d] rounded">
            <span className="text-[9px] text-gray-500 block">HOP COUNT</span>
            <span className="text-xs font-semibold text-gray-300">{flowDetails.steps.length} Steps</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

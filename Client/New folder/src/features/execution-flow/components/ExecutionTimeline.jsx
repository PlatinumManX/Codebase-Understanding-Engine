import React, { useState } from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

export default function ExecutionTimeline({ steps }) {
  const [activeStep, setActiveStep] = useState(null);

  const getStepTypeColor = (type) => {
    switch (type) {
      case 'endpoint': return 'border-[#a855f7] text-[#c084fc] bg-[#a855f7]/10';
      case 'controller': return 'border-[#38bdf8] text-[#38bdf8] bg-[#38bdf8]/10';
      case 'service': return 'border-[#0284c7] text-[#0284c7] bg-[#0284c7]/10';
      case 'database': return 'border-[#10b981] text-[#10b981] bg-[#10b981]/10';
      case 'utility': return 'border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/10';
      case 'response': return 'border-[#10b981] text-[#10b981] bg-[#10b981]/10';
      default: return 'border-gray-500 text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <Card title="Execution Call Graph Timeline" subtitle="Interactive function invocation tree">
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isSelected = activeStep === step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step Connection Arrow */}
              {idx > 0 && (
                <div className="flex justify-center my-0.5">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                  </svg>
                </div>
              )}

              {/* Timeline Card */}
              <div
                onClick={() => setActiveStep(isSelected ? null : step.id)}
                className={`bg-[#0d1117]/80 border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.05)]'
                    : 'border-[#30363d] hover:border-gray-600 hover:bg-[#161b22]/30'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 font-mono">
                    <span className="text-[10px] text-gray-500 bg-[#161b22] border border-[#30363d] px-1.5 py-0.5 rounded leading-none shrink-0 select-none">
                      Step {step.id}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-semibold leading-none shrink-0 select-none ${getStepTypeColor(step.type)}`}>
                      {step.type}
                    </span>
                    <h4 className="text-xs font-semibold text-white truncate">{step.name}</h4>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                    <span className="text-gray-400">{step.duration}</span>
                    <Badge variant="success" size="sm" className="text-[8px] uppercase leading-none">
                      {step.status}
                    </Badge>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-[#30363d]/30 font-mono text-[10px] space-y-2 text-gray-400">
                    <p className="font-sans text-xs text-gray-300 leading-relaxed bg-[#161b22]/40 p-2 rounded border border-[#30363d]/30">
                      {step.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#0d1117] p-2 rounded border border-[#30363d]/30">
                      <div>
                        <span className="text-gray-500 block uppercase text-[9px]">File Trace</span>
                        <span className="text-gray-300 truncate block mt-0.5">{step.file}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase text-[9px]">Caller Layer</span>
                        <span className="text-gray-300 truncate block mt-0.5">{step.caller}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-gray-500 block uppercase text-[9px]">Callee Layer</span>
                        <span className="text-gray-300 truncate block mt-0.5">{step.callee}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
}

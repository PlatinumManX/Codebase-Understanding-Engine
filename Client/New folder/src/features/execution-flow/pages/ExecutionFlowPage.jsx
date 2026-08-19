import React, { useState } from 'react';
import PageHeader from '../../../shared/components/PageHeader';
import FlowSelector from '../components/FlowSelector';
import FlowDetailsCard from '../components/FlowDetailsCard';
import ExecutionTimeline from '../components/ExecutionTimeline';
import EmptyState from '../../../shared/components/EmptyState';
import { executionFlow } from '../../../shared/data/dummyData';

export default function ExecutionFlowPage() {
  const [selectedFlow, setSelectedFlow] = useState('login');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Execution Flow Explorer"
        description="Trace execution sequences across files, modules, controllers, and databases."
        breadcrumbs={['Home', 'Execution Flow']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <FlowSelector
            selectedFlow={selectedFlow}
            onSelectFlow={setSelectedFlow}
          />
          {selectedFlow === 'login' && (
            <FlowDetailsCard flowDetails={executionFlow} />
          )}
        </div>

        {/* Right Timeline Panel */}
        <div className="lg:col-span-3">
          {selectedFlow === 'login' ? (
            <ExecutionTimeline steps={executionFlow.steps} />
          ) : (
            <div className="h-full flex items-center justify-center min-h-[300px]">
              <EmptyState
                title="Trace Not Yet Indexed"
                description={`The transaction trace log for the selected flow has not been compiled. Please launch the trace indexer in settings.`}
                actionLabel="View Active POST /login Trace"
                onActionClick={() => setSelectedFlow('login')}
                icon="code"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

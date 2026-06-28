import React from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

export default function RecentQueriesCard({ queries }) {
  return (
    <Card title="Recent Copilot Inquiries" subtitle="Latest architecture queries processed">
      <div className="divide-y divide-[#30363d]/30 font-mono">
        {queries.map((q) => (
          <div key={q.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] shrink-0"></span>
                <p className="text-xs text-gray-300 truncate leading-normal">
                  {q.query}
                </p>
              </div>
              <span className="text-[9px] text-gray-500 block pl-3.5">
                {q.timestamp}
              </span>
            </div>
            <Badge variant="purple" size="sm" className="shrink-0 text-[9px]">
              {q.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

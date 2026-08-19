import React from 'react';
import Card from '../../../shared/components/Card';
import Badge from '../../../shared/components/Badge';

export default function RecentQueriesCard({ queries }) {
  return (
    <Card
      title="Recent Copilot Inquiries"
      subtitle="Latest architecture queries processed"
      titleClassName="text-[15px] font-semibold text-gray-200 font-sans"
      className="border-[#30363d] bg-[#161b22]/30 backdrop-blur-sm"
    >
      <div className="space-y-1">
        {queries.map((q) => (
          <div
            key={q.id}
            className="group flex items-center justify-between gap-4 py-2 px-3 rounded-lg border border-transparent hover:border-[#30363d]/50 hover:bg-[#161b22]/30 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Colored status dot with soft glow */}
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#a855f7] shadow-[0_0_8px_#a855f7]"></span>
              </span>
              <p className="text-[13px] text-gray-300 truncate font-sans group-hover:text-white transition-colors duration-150">
                {q.query}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] text-gray-500 font-mono">
                {q.timestamp}
              </span>
              <Badge variant="purple" size="sm" className="uppercase text-[9px] font-semibold tracking-wider">
                {q.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

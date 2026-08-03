import React from 'react';
import Card from '../../../shared/components/Card';

export default function ConversationPanel({ activeChat, onSelectChat }) {
  const threads = [
    { id: 1, title: 'Auth Architecture', snippet: 'MVC/Service architectural pattern', active: true },
    { id: 2, title: 'Database Configuration', snippet: 'Connection pooling details', active: false },
    { id: 3, title: 'Circular Dependency Scan', snippet: 'Circular relationships detected', active: false }
  ];

  return (
    <Card title="Copilot History" subtitle="Recent analysis transcripts">
      <div className="space-y-2 font-mono">
        {threads.map((t) => {
          const isSelected = activeChat === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectChat(t.id)}
              type="button"
              className={`w-full text-left p-2.5 rounded border text-xs transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#161b22] border-[#a855f7] text-[#c084fc]'
                  : 'bg-transparent border-[#30363d] hover:border-gray-500 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-semibold text-gray-200 truncate block">{t.title}</span>
              </div>
              <span className="text-[10px] text-gray-500 truncate block font-sans">
                {t.snippet}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

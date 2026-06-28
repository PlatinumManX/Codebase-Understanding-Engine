import React, { useState } from 'react';
import Button from '../../../shared/components/Button';

export default function PromptInput({ onSend }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSend(query);
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-[#30363d] rounded-lg bg-[#0d1117]/60 p-2 flex flex-col gap-1.5 font-mono">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about this codebase architecture..."
        className="w-full bg-transparent text-gray-200 text-xs px-2.5 py-1 focus:outline-none placeholder-gray-600 resize-none font-sans min-h-[48px] max-h-[120px]"
      />
      <div className="flex justify-between items-center px-1.5 pt-1.5 border-t border-[#30363d]/30">
        <span className="text-[9px] text-gray-600 font-mono select-none">
          Press Enter to send, Shift+Enter for newline
        </span>
        <Button
          type="submit"
          variant="purple"
          size="sm"
          disabled={!query.trim()}
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-2-9-18-9 18 9 2zm0 0v-8" />
            </svg>
          }
        >
          Send
        </Button>
      </div>
    </form>
  );
}

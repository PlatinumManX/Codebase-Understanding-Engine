import React from 'react';

export default function MessageBubble({ message }) {
  const isAssistant = message.role === 'assistant';

  // Formatter to translate simple markdown syntax (```code blocks and **bold**) into HTML
  const formatText = (text) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const language = hasLang ? firstLine : 'code';
        const codeContent = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={idx} className="my-2.5 rounded border border-[#30363d] bg-[#0d1117] font-mono text-[10px] text-gray-200">
            <div className="bg-[#161b22] px-3 py-1 border-b border-[#30363d] text-[9px] text-gray-500 uppercase flex justify-between items-center select-none font-mono">
              <span>{language}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(codeContent);
                  alert('Code copied to clipboard!');
                }}
                type="button"
                className="hover:text-gray-300 font-sans transition-colors cursor-pointer"
              >
                Copy
              </button>
            </div>
            <pre className="p-3 overflow-x-auto whitespace-pre-wrap">{codeContent}</pre>
          </div>
        );
      }

      // Format bold text **text**
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={idx}>
          {boldParts.map((bPart, bIdx) => {
            if (bPart.startsWith('**') && bPart.endsWith('**')) {
              return <strong key={bIdx} className="text-[#00f0ff] font-medium">{bPart.slice(2, -2)}</strong>;
            }
            return bPart;
          })}
        </span>
      );
    });
  };

  return (
    <div className={`flex gap-3 max-w-2xl ${isAssistant ? '' : 'flex-row-reverse ml-auto'}`}>
      {/* Profile Icon */}
      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-mono text-xs select-none ${
        isAssistant
          ? 'bg-[#a855f7]/20 border border-[#a855f7]/40 text-[#c084fc]'
          : 'bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-[#00f0ff]'
      }`}>
        {isAssistant ? 'AI' : 'U'}
      </div>

      {/* Bubble box */}
      <div className="space-y-1 min-w-0">
        <div className={`rounded-lg px-3 py-2 text-xs border leading-relaxed ${
          isAssistant
            ? 'bg-[#161b22]/70 border-[#30363d] text-gray-300'
            : 'bg-[#0d1117]/85 border-[#00f0ff]/20 text-gray-200'
        }`}>
          {formatText(message.text)}
        </div>
        <span className={`text-[9px] text-gray-500 font-mono block ${isAssistant ? '' : 'text-right'}`}>
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

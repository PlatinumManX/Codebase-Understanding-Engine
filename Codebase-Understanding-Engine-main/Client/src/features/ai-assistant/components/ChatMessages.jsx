import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatMessages({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4 overflow-y-auto pr-1 flex-1 max-h-[55vh] min-h-[280px]">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

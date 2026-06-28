import React, { useState } from 'react';
import PageHeader from '../../../shared/components/PageHeader';
import ConversationPanel from '../components/ConversationPanel';
import ChatMessages from '../components/ChatMessages';
import PromptInput from '../components/PromptInput';
import { assistantMessages } from '../../../shared/data/dummyData';

export default function AssistantPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [messages, setMessages] = useState(assistantMessages);

  const handleSendMessage = (text) => {
    const userMsg = {
      id: Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let aiResponseText = `I have analyzed your request: **"${text}"**.\n\nIn this simulator, all repository parsing functions are running locally. In a production build, this request will query the backend FastAPI symbol indexes and construct a detailed summary of structural nodes.`;

      if (text.toLowerCase().includes('auth') || text.toLowerCase().includes('explain authentication')) {
        aiResponseText = `The authentication structure in this parsed project comprises:\n\n* **Route Entry**: \`api/auth_endpoints.py\`\n* **Logic Service**: \`services/auth_service.py\`\n* **Hashed Utils**: \`utils/hash_utils.py\`\n\nDependencies flow downwards cleanly. Circular dependencies are 0 in the auth module, but a warning exists inside jwt_helper.`;
      } else if (text.toLowerCase().includes('circular')) {
        aiResponseText = `Scanning codebase mapping for circular dependency structures...\n\n⚠️ **2 Circular Dependencies Detected**:\n1. \`api/router.py\` -> \`controllers/auth_controller.py\` -> \`api/router.py\`\n2. \`services/auth_service.py\` -> \`utils/jwt_helper.py\` -> \`services/auth_service.py\`\n\nRecommendation: Extract JWT validation logic to a separate base context.`;
      } else if (text.toLowerCase().includes('trace') || text.toLowerCase().includes('login flow')) {
        aiResponseText = `Tracing **POST /login** execution flow. The sequence resolves in **145ms** across 6 hops:\n\n\`\`\`python\n# Execution sequence trace log\n1. Endpoint -> auth_endpoints.py:login_endpoint() [4ms]\n2. Controller -> auth_controller.py:login() [12ms]\n3. Service -> auth_service.py:validate() [85ms]\n4. Database -> DatabaseClient.find_user() [62ms]\n5. Signer -> jwt_helper.py:generate_token() [8ms]\n6. Response -> HTTP 200 OK [2ms]\n\`\`\``;
      } else if (text.toLowerCase().includes('unused')) {
        aiResponseText = `Analyzing AST mapping to find unreferenced symbols...\n\n💡 **Found 3 unused utility functions**:\n1. \`utils/hash_utils.py:verify_legacy_md5()\`\n2. \`utils/jwt_helper.py:decode_expired_gracefully()\`\n3. \`database/client.py:flush_mock_sessions()\`\n\nYou can safely delete these or mark them as deprecated.`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Show circular dependencies', 'Trace POST /login flow']
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const activeSuggestions = messages[messages.length - 1]?.suggestions || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Copilot Assistant"
        description="Query the AI assistant to trace controller flows, scan imports, and optimize codebase designs."
        breadcrumbs={['Home', 'AI Assistant']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Thread History Sidebar */}
        <div className="lg:col-span-1">
          <ConversationPanel
            activeChat={activeChat}
            onSelectChat={(id) => {
              setActiveChat(id);
              if (id === 1) setMessages(assistantMessages);
              else {
                setMessages([
                  {
                    id: 99,
                    role: 'assistant',
                    text: `Switched to thread **#${id}**. Let me know what you would like to analyze in this session.`,
                    timestamp: 'Just now',
                    suggestions: ['List unused utility functions', 'Explain authentication architecture']
                  }
                ]);
              }
            }}
          />
        </div>

        {/* Chat Console Panel */}
        <div className="lg:col-span-3 flex flex-col justify-between border border-[#30363d] bg-[#161b22]/40 rounded-lg p-4 min-h-[460px] h-[68vh]">
          {/* Messages scroll content */}
          <ChatMessages messages={messages} />

          {/* Suggestions & Input console */}
          <div className="space-y-3 pt-3 border-t border-[#30363d]/30 shrink-0">
            {/* Suggested prompts chips */}
            {activeSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 select-none">
                {activeSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    type="button"
                    className="bg-[#30363d]/50 hover:bg-[#30363d] text-gray-300 hover:text-white border border-[#30363d] hover:border-gray-500 rounded px-2.5 py-1 text-[10px] font-mono transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Prompt bar */}
            <PromptInput onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}

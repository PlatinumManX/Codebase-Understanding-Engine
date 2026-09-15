import React, { useState, useEffect, useRef } from 'react';
import Badge from '../../../shared/components/Badge';
import { sendAIQuery } from '../../../shared/api/repositoryApi';

export default function GraphChatPanel({
  activeRepo,
  selectedNode,
  onClose,
  onGraphAction
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const messageIdRef = useRef(0);

  const createMessageId = () => {
    messageIdRef.current += 1;
    return messageIdRef.current;
  };

  // Scroll whenever the conversation changes.
  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const buildSelectedNodeContext = () => {
    if (!selectedNode) {
      return null;
    }

    return {
      id: selectedNode.id,
      type: selectedNode.type,
      name: selectedNode.label,
      file:
        selectedNode.data?.file ||
        selectedNode.data?.path ||
        selectedNode.file ||
        null,
    };
  };

  const handleSend = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!inputValue.trim() || isThinking || !activeRepo) {
      return;
    }

    const userMessageText = inputValue.trim();

    setInputValue('');
    setErrorMsg(null);
    setIsThinking(true);

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: userMessageText,
    };

    setMessages((prev) => [
      ...prev,
      userMsg
    ]);

    try {
      const result = await sendAIQuery(
        activeRepo.repository_id,
        userMessageText,
        conversationId,
        buildSelectedNodeContext(),
        null
      );

      // The first request creates the conversation.
      if (result.conversation_id) {
        setConversationId(
          result.conversation_id
        );
      }

      if (result.graph_action && onGraphAction) {
        onGraphAction(result.graph_action);
      }

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text:
          result.answer ||
          'The AI did not return an answer.',
      };

      setMessages((prev) => [
        ...prev,
        assistantMsg
      ]);
    } catch (error) {
      console.error(
        'AI query failed:',
        error
      );

      setErrorMsg(
        error.message ||
        'Failed to get a response from the AI.'
      );
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendSuggested = async (text) => {
    if (
      isThinking ||
      !activeRepo ||
      !text?.trim()
    ) {
      return;
    }

    const userMessageText = text.trim();

    setErrorMsg(null);
    setIsThinking(true);

    const userMsg = {
      id: createMessageId(),
      role: 'user',
      text: userMessageText,
    };

    setMessages((prev) => [
      ...prev,
      userMsg
    ]);

    try {
      const result = await sendAIQuery(
        activeRepo.repository_id,
        userMessageText,
        conversationId,
        buildSelectedNodeContext(),
        null
      );

      if (result.conversation_id) {
        setConversationId(
          result.conversation_id
        );
      }

      if (result.graph_action && onGraphAction) {
        onGraphAction(result.graph_action);
      }

      const assistantMsg = {
        id:  createMessageId(),
        role: 'assistant',
        text:
          result.answer ||
          'The AI did not return an answer.',
      };

      setMessages((prev) => [
        ...prev,
        assistantMsg
      ]);
    } catch (error) {
      console.error(
        'AI query failed:',
        error
      );

      setErrorMsg(
        error.message ||
        'Failed to get a response from the AI.'
      );
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const suggestions = selectedNode
    ? [
        `Explain the selected node "${selectedNode.label}"`,
        `What files does "${selectedNode.label}" depend on?`,
        `How does "${selectedNode.label}" connect to the project?`,
        'What does this project do?'
      ]
    : [
        'What does this project do?',
        'What are the main components of this repository?',
        'Explain the architecture of this project.',
        'Show the dependency flow'
      ];
    
  //Reset Button
  const handleResetChat = () => {
    setMessages([]);
    setConversationId(null);
    setInputValue('');
    setErrorMsg(null);
  };

  return (
    <div className="h-[550px] rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden flex flex-col font-mono shadow-[0_18px_50px_rgba(0,0,0,0.28)] select-text">

      {/* Header */}
      <div className="px-4 py-3 border-b border-[#30363d] bg-[#111820] flex items-center justify-between gap-3 shrink-0 select-none">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#00f0ff] mb-1 font-bold">
            AI PROJECT ASSISTANT
          </div>

          <div className="text-[11px] text-gray-400 truncate">
            Ask questions about this project and graph context
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleResetChat}
            type="button"
            disabled={isThinking}
            className="text-[10px] text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Reset Chat"
          >
            Reset
          </button>

          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Close Chat"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Context Indicator */}
      <div className="px-4 py-2 border-b border-[#30363d] bg-[#161b22]/30 flex flex-col gap-1 shrink-0 select-none">
        <div className="text-[9px] uppercase tracking-[0.12em] text-slate-500 font-bold">
          CURRENT CONTEXT
        </div>

        {selectedNode ? (
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <div
                className="text-xs font-bold text-white truncate"
                title={selectedNode.label}
              >
                {selectedNode.label}
              </div>

              <div
                className="text-[9px] text-slate-400 truncate"
                title={
                  selectedNode.data?.file ||
                  selectedNode.data?.path ||
                  ''
                }
              >
                {selectedNode.data?.file ||
                  selectedNode.data?.path ||
                  'Parsed symbol'}
              </div>
            </div>

            <Badge
              variant="purple"
              size="sm"
              className="uppercase text-[9px] shrink-0"
            >
              {selectedNode.type}
            </Badge>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div
              className="text-xs font-bold text-gray-300 truncate"
              title={activeRepo?.repository_name}
            >
              Entire Repository
            </div>

            <Badge
              variant="info"
              size="sm"
              className="uppercase text-[9px] shrink-0 max-w-[120px] truncate"
            >
              {activeRepo?.repository_name ||
                'project'}
            </Badge>
          </div>
        )}
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0d1117]/85 flex flex-col min-h-0">
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col justify-center items-center text-center p-4 select-none">
            <div className="w-10 h-10 rounded-full bg-[#30363d]/30 border border-[#30363d] flex items-center justify-center text-[#00f0ff] mb-3 shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>

            <h4 className="text-xs font-bold text-white mb-1">
              AI Project Assistant
            </h4>

            <p className="text-[10px] text-slate-400 max-w-[240px] leading-relaxed mb-4">
              Ask questions about the active repository or the selected graph node to analyze dependencies and flows.
            </p>

            <div className="flex flex-col gap-1.5 w-full max-w-[260px]">
              {suggestions.map(
                (suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handleSendSuggested(
                        suggestion
                      )
                    }
                    type="button"
                    disabled={isThinking}
                    className="bg-[#30363d]/35 hover:bg-[#30363d]/70 text-gray-300 hover:text-white border border-[#30363d] rounded p-2 text-[10px] text-left transition-colors font-mono cursor-pointer truncate disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    • {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user'
                    ? 'items-end'
                    : 'items-start'
                } animate-fade-in`}
              >
                <div className="text-[9px] text-slate-500 mb-1 font-mono uppercase select-none">
                  {msg.role === 'user'
                    ? 'User'
                    : 'Assistant'}
                </div>

                <div
                  className={`max-w-[90%] rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-white rounded-tr-none font-sans'
                      : 'bg-[#161b22] border border-[#30363d] text-slate-300 rounded-tl-none font-mono text-[11px]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex flex-col items-start animate-fade-in">
                <div className="text-[9px] text-slate-500 mb-1 font-mono uppercase select-none">
                  Assistant
                </div>

                <div className="bg-[#161b22] border border-[#30363d] text-slate-400 rounded-lg rounded-tl-none p-3 text-[10px] font-mono flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-bounce"
                      style={{
                        animationDelay:
                          '150ms'
                      }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-bounce"
                      style={{
                        animationDelay:
                          '300ms'
                      }}
                    />
                  </div>

                  <span>
                    AI is analyzing project context...
                  </span>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-950/20 border border-red-900/50 text-red-400 rounded text-[10px] font-mono">
                {errorMsg}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-[#30363d] bg-[#111820] flex gap-2 items-end shrink-0 select-none"
      >
        <textarea
          value={inputValue}
          onChange={(e) =>
            setInputValue(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask about the codebase..."
          rows={1}
          className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono resize-none focus:outline-none focus:border-[#00f0ff] min-h-[32px] max-h-[80px] leading-relaxed"
          disabled={isThinking}
        />

        <button
          type="submit"
          disabled={
            isThinking ||
            !inputValue.trim()
          }
          className={`px-3 py-1.5 rounded text-xs font-bold font-mono transition-all cursor-pointer shrink-0 ${
            isThinking ||
            !inputValue.trim()
              ? 'bg-[#30363d]/50 text-gray-500 border border-[#30363d] cursor-not-allowed'
              : 'bg-[#00f0ff] text-[#0d1117] hover:bg-[#00d0e6]'
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
}
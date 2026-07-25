import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../../shared/context/ToastContext';
import { getRepositoryGraph } from '../../../shared/api/repositoryApi';

export default function AssistantPage() {
  const { showToast } = useToast();
  const location = useLocation();
  const chatContainerRef = useRef(null);

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: "Hello! I've analyzed your repository. I can help you with:\n\n* **Explaining the overall codebase structure** and import graphs.\n* **Tracing performance bottlenecks** or slow execution loops.\n* **Suggesting refactor workflows** for circular dependencies.",
      timestamp: '10:40 AM',
      suggestions: ['Explain authentication architecture', 'List circular dependencies']
    }
  ]);

  const [filesList, setFilesList] = useState([
    { id: 'main.py', label: 'main.py', code: `import os\nimport sys\n\ndef initialize_engine():\n    # Connect to the local context engine\n    engine = Engine(config="dev")\n    return engine.start()\n\nif __name__ == "__main__":\n    initialize_engine()` },
    { id: 'utils.py', label: 'utils.py', code: `def format_bytes(size):\n    # Helper to print human readable sizes\n    power = 2**10\n    n = 0\n    labels = {0: '', 1: 'KB', 2: 'MB', 3: 'GB'}\n    while size > power:\n        size /= power\n        n += 1\n    return f"{size:.2f} {labels[n]}"` },
    { id: 'README.md', label: 'README.md', code: `# CodeMap AI Engine\n\nRun uvicorn server app start. Connect MongoDB and configure Gemini key pools inside settings dashboard panel.` }
  ]);

  const [selectedFile, setSelectedFile] = useState(filesList[0]);

  // Load files from active repository if available
  useEffect(() => {
    const loadRepoFiles = async () => {
      const activeRepoId = localStorage.getItem('active_repository_id');
      if (!activeRepoId) return;

      try {
        const graph = await getRepositoryGraph(activeRepoId);
        if (graph && graph.nodes) {
          const modules = graph.nodes.filter(n => n.type === 'module');
          if (modules.length > 0) {
            const mappedFiles = modules.map(m => ({
              id: m.id,
              label: m.label,
              code: m.data?.source_code || `# Source preview of ${m.label} not extracted.\n# Class declarations: ${(m.data?.methods || []).join(', ') || 'None'}`
            }));
            setFilesList(mappedFiles);
            setSelectedFile(mappedFiles[0]);
          }
        }
      } catch (err) {
        console.error("AI Assistant could not load repository files:", err);
      }
    };
    
    loadRepoFiles();
  }, []);

  // Listen to navigation state for initial file selection
  useEffect(() => {
    if (location.state?.initialFile) {
      const targetId = location.state.initialFile;
      const match = filesList.find(f => f.id === targetId || f.label === targetId);
      if (match) setSelectedFile(match);
    }
  }, [location.state, filesList]);

  // Auto-scroll chat feed on update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      let aiResponseText = `I have analyzed your request: **"${text}"**.\n\nIn this simulator, all repository parsing functions run locally. You can view circular dependency structures in the explorer or run traces in the flow dashboard.`;
      let suggestions = ['Explain authentication architecture', 'List circular dependencies'];

      const query = text.toLowerCase();
      if (query.includes('auth') || query.includes('authentication')) {
        aiResponseText = `The **authentication workflow** comprises these primary layers:\n\n1. **Route Controller**: \`auth_endpoints.py\` (exposes login, signup endpoints)\n2. **Business logic**: \`auth_service.py\` (validates password checks against database)\n3. **Token verification**: \`jwt_helper.py\` (generates signed session payloads)\n\nDependencies are linear. No circular loops are detected inside the auth modules.`;
        suggestions = ['Trace POST /api/auth/login flow', 'Show modules dependencies'];
      } else if (query.includes('circular') || query.includes('dependency')) {
        aiResponseText = `Scanning codebase mapping graphs for circular loops...\n\n⚠️ **Circular Dependencies Detected**:\n* \`api/router.py\` ➔ \`auth_controller.py\` ➔ \`api/router.py\`\n* \`auth_service.py\` ➔ \`jwt_helper.py\` ➔ \`auth_service.py\`\n\n**Recommendation:** Extract validation classes into a standalone shared utility directory.`;
        suggestions = ['Explain circular dependency #1', 'Open settings key pool'];
      } else if (query.includes('trace') || query.includes('slow')) {
        aiResponseText = `Scanning database queries execution profiles...\n\n⚠️ **Slow Database Query Identified**:\n* **Query**: \`SELECT * FROM users WHERE email = $1\`\n* **Location**: \`data/db.client.js:query_db_by_email()\`\n* **Duration**: \`142ms\` (exceeds threshold limits of 100ms)\n\n**Action Item:** Ensure a unique index is configured on the email column in MongoDB.`;
        suggestions = ['Explain query details', 'Generate index script'];
      }

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const activeSuggestions = messages[messages.length - 1]?.suggestions || [];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden font-sans text-on-surface bg-canvas">
      
      {/* Left Pane: Explorer Tree & Preview (35%) */}
      <section className="w-[35%] flex flex-col border-r border-[#e2e8f0] bg-[#eff4ff] shrink-0 select-none h-full">
        {/* Explorer Title */}
        <div className="p-4 border-b border-[#e2e8f0] bg-white flex justify-between items-center shrink-0">
          <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Project Explorer</span>
          <span className="material-symbols-outlined text-outline cursor-pointer">filter_list</span>
        </div>

        {/* Directory File List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 text-xs space-y-1">
          <div className="flex items-center gap-2 p-1.5 hover:bg-[#dce9ff]/50 rounded cursor-pointer transition-colors font-bold text-on-surface">
            <span className="material-symbols-outlined text-sm text-outline">keyboard_arrow_down</span>
            <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span>
            <span>src</span>
          </div>
          
          <ul className="ml-6 border-l border-[#c3c6d7] pl-2 space-y-1">
            {filesList.map((file) => {
              const isSelected = selectedFile?.id === file.id;
              return (
                <li key={file.id}>
                  <div 
                    onClick={() => setSelectedFile(file)}
                    className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-[#dce9ff] text-primary font-bold' 
                        : 'text-on-surface-variant hover:bg-[#dce9ff]/45'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-sm ${isSelected ? 'text-primary' : 'text-outline'}`}>
                      description
                    </span>
                    <span className="truncate max-w-[180px]">{file.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Read-only Code Preview */}
        <div className="h-1/2 border-t border-[#e2e8f0] bg-[#f8fafc] flex flex-col shrink-0">
          <div className="px-4 py-2 border-b border-[#e2e8f0] bg-white flex justify-between items-center">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider">Preview: {selectedFile?.label}</span>
            <span className="material-symbols-outlined text-outline text-sm">fullscreen</span>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-on-surface-variant">
            <pre className="whitespace-pre">
              {selectedFile?.code}
            </pre>
          </div>
        </div>
      </section>

      {/* Right Pane: Chat Window (65%) */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden relative h-full">
        {/* Chat Feed */}
        <div 
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-6"
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={msg.id}
                className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded bg-[#dbe1ff] flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  </div>
                )}
                
                <div className={`p-4 rounded-xl shadow-sm border max-w-[80%] text-xs leading-relaxed ${
                  isUser 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white border-[#e2e8f0] text-on-surface'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* Suggestion Chips */}
                  {!isUser && activeSuggestions.length > 0 && msg.id === messages[messages.length - 1].id && (
                    <div className="flex flex-wrap gap-2 mt-4 select-none">
                      {activeSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="bg-[#eff4ff] hover:bg-[#dce9ff] text-primary border border-primary/20 hover:border-primary rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-all cursor-pointer"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#dbe1ff] border border-primary/20 flex items-center justify-center font-bold text-xs text-primary font-display shrink-0">
                    U
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-white border-t border-[#e2e8f0] shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputVal);
            }}
            className="max-w-4xl mx-auto flex items-end gap-3 bg-white border border-[#e2e8f0] p-2.5 rounded-xl shadow-md"
          >
            <button 
              type="button"
              onClick={() => alert('File upload simulated attachment.')}
              className="p-2 text-outline hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>
            
            <textarea 
              className="flex-grow bg-transparent border-none focus:ring-0 resize-none text-xs font-semibold py-2 max-h-32 min-h-[40px] outline-none"
              placeholder="Ask anything about your codebase..." 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputVal);
                }
              }}
              rows={1}
            />
            
            <button 
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white p-2.5 rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
          <div className="mt-2 text-center select-none">
            <p className="text-[10px] text-outline font-bold uppercase tracking-wider">AI responses may vary based on ZIP context complexity</p>
          </div>
        </div>
      </section>

    </div>
  );
}

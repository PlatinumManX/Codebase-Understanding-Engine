import React, { useState } from 'react';
import { useToast } from '../../../shared/context/ToastContext';

export default function SettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('keys');

  // Application config states
  const [depth, setDepth] = useState('5');
  const [autoIndex, setAutoIndex] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('github-dark');

  // API Keys state
  const [apiKeys, setApiKeys] = useState([
    { id: 1, label: 'Gemini 1.5 Pro', key: '••••••••••••4x9k', status: 'Active' },
    { id: 2, label: 'Gemini 1.5 Flash', key: '••••••••••••m3j2', status: 'Active' },
    { id: 3, label: 'Gemini 1.5 Pro', key: '••••••••••••92p1', status: 'Quota Alert' }
  ]);
  const [newModel, setNewModel] = useState('Gemini 1.5 Pro');
  const [newKey, setNewKey] = useState('');

  const handleAddKey = () => {
    if (!newKey.trim()) {
      showToast('error', 'Please enter a valid API key.');
      return;
    }
    const obfuscated = '••••••••••••' + newKey.slice(-4);
    const item = {
      id: Date.now(),
      label: newModel,
      key: obfuscated,
      status: 'Active'
    };
    setApiKeys(prev => [...prev, item]);
    setNewKey('');
    showToast('success', 'Gemini API key added to rotation pool.');
  };

  const handleDeleteKey = (id) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    showToast('info', 'Key removed from rotation pool.');
  };

  return (
    <div className="p-main_padding bg-canvas min-h-[calc(100vh-64px)] font-sans text-on-surface">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-display text-on-surface">Settings</h2>
          <p className="text-xs text-on-surface-variant font-semibold">Configure analyzer depths, database indices, and Gemini model rotation keys.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-8 border-b border-[#e2e8f0] mb-8 overflow-x-auto select-none">
          <button 
            onClick={() => setActiveTab('keys')}
            className={`pb-4 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'keys' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Gemini API Keys
          </button>
          <button 
            onClick={() => setActiveTab('app')}
            className={`pb-4 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'app' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Application Parser
          </button>
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`pb-4 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'appearance' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Appearance Theme
          </button>
          <button 
            onClick={() => setActiveTab('project')}
            className={`pb-4 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'project' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Project Info & Roadmaps
          </button>
        </div>

        {/* Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Center Settings Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tab: Gemini API Keys */}
            {activeTab === 'keys' && (
              <div className="space-y-6">
                
                {/* Active keys list */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#e2e8f0] flex justify-between items-center bg-slate-50">
                    <h3 className="text-xs font-bold uppercase text-on-surface">Active Rotation Keys</h3>
                    <span className="text-[10px] text-outline font-bold uppercase tracking-wider">{apiKeys.length} Keys in Pool</span>
                  </div>
                  
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-[#e2e8f0]">
                        <tr>
                          <th className="px-6 py-3 font-bold text-outline text-[10px] uppercase">Model Name</th>
                          <th className="px-6 py-3 font-bold text-outline text-[10px] uppercase">API Key Token</th>
                          <th className="px-6 py-3 font-bold text-outline text-[10px] uppercase">Pool Status</th>
                          <th className="px-6 py-3 font-bold text-outline text-[10px] uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e2e8f0]">
                        {apiKeys.map((key) => (
                          <tr key={key.id} className="hover:bg-[#eff4ff]/30 transition-colors">
                            <td class="px-6 py-4 font-bold text-on-surface">{key.label}</td>
                            <td class="px-6 py-4 font-mono text-on-surface-variant text-[11px]">{key.key}</td>
                            <td class="px-6 py-4">
                              {key.status === 'Quota Alert' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-error-container text-error uppercase">
                                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Quota Exceeded
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#d1fae5] text-[#065f46] uppercase">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Active
                                </span>
                              )}
                            </td>
                            <td class="px-6 py-4">
                              <button 
                                onClick={() => handleDeleteKey(key.id)}
                                className="text-error hover:bg-error-container/30 p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add new key form */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>key</span>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Add Gemini Key</h3>
                      <p className="text-[11px] text-on-surface-variant font-semibold">Integrate a new API credential to distribute processing load.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-outline uppercase text-[10px]">Select Model</label>
                      <select 
                        value={newModel}
                        onChange={(e) => setNewModel(e.target.value)}
                        className="w-full bg-[#eff4ff] border border-[#e2e8f0] rounded-lg p-2.5 font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option>Gemini 1.5 Pro</option>
                        <option>Gemini 1.5 Flash</option>
                        <option>Gemini 1.0 Ultra</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-outline uppercase text-[10px]">API Key Secret</label>
                      <input 
                        type="password"
                        placeholder="AIzaSy..." 
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        className="w-full bg-[#eff4ff] border border-[#e2e8f0] rounded-lg p-2.5 font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end pt-2">
                      <button 
                        onClick={handleAddKey}
                        className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add to Pool
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab: App Settings */}
            {activeTab === 'app' && (
              <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 space-y-6 text-xs">
                <div className="border-b border-[#e2e8f0] pb-3 mb-4">
                  <h3 className="text-xs font-bold uppercase text-on-surface">Application Parser Parameters</h3>
                  <p className="text-[11px] text-on-surface-variant font-semibold mt-1">Configure call-graph and index scan traversal bounds.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-outline uppercase text-[10px]">Maximum Call-Graph Trace Depth</label>
                  <select
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    className="w-full bg-[#eff4ff] border border-[#e2e8f0] rounded-lg p-2.5 font-bold focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="3">3 hops (fast scans)</option>
                    <option value="5">5 hops (default)</option>
                    <option value="10">10 hops (deep traversal)</option>
                    <option value="20">20 hops (full depth - slow)</option>
                  </select>
                  <p className="text-[10px] text-outline font-sans mt-0.5">Controls recursion depth when traversing reference symbols in the backend parser pipeline.</p>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-[#e2e8f0] mt-4">
                  <div>
                    <label className="font-bold text-on-surface text-xs block">Automatic Codebase Re-indexing</label>
                    <span className="text-[10px] text-outline font-sans block mt-0.5">Launches the AST parsing pipeline immediately following ZIP uploads.</span>
                  </div>
                  <button
                    onClick={() => setAutoIndex(!autoIndex)}
                    className={`w-10 h-5 rounded-full transition-all relative focus:outline-none cursor-pointer ${
                      autoIndex ? 'bg-primary' : 'bg-[#c3c6d7]'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      autoIndex ? 'translate-x-5' : ''
                    }`} />
                  </button>
                </div>

                <div className="pt-4 border-t border-[#e2e8f0] flex justify-end">
                  <button 
                    onClick={() => showToast('success', 'Application settings saved successfully.')}
                    className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Appearance Theme */}
            {activeTab === 'appearance' && (
              <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 space-y-6 text-xs">
                <div className="border-b border-[#e2e8f0] pb-3 mb-4">
                  <h3 className="text-xs font-bold uppercase text-on-surface">Workspace Skin Appearance</h3>
                  <p className="text-[11px] text-on-surface-variant font-semibold mt-1">Select your preferred editor theme style preset.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'github-dark', name: 'GitHub Dark (Default)', desc: 'Slate-grey deep editor layout canvas' },
                    { id: 'dracula', name: 'Dracula Pro', desc: 'Sleek purple neon highlights for high visibility' },
                    { id: 'monokai', name: 'Monokai Retro', desc: 'Warm high-contrast orange and green palettes' }
                  ].map((t) => {
                    const isSelected = selectedTheme === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTheme(t.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#eff4ff] border-primary ring-2 ring-primary/10'
                            : 'bg-white border-[#e2e8f0] hover:border-primary/50'
                        }`}
                      >
                        <span className="font-bold text-on-surface block text-xs mb-1">{t.name}</span>
                        <p className="text-[10px] text-outline font-sans leading-relaxed">{t.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#e2e8f0] flex justify-end">
                  <button 
                    onClick={() => showToast('success', 'Theme preference stored successfully.')}
                    className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    Apply Theme
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Project Info */}
            {activeTab === 'project' && (
              <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 space-y-6 text-xs">
                <div>
                  <h3 className="text-xs font-bold uppercase text-on-surface mb-2">About CodeMap AI</h3>
                  <p className="leading-relaxed text-on-surface-variant font-semibold font-sans">
                    CodeMap AI is a codebase understanding platform built for college senior projects. It facilitates fast parser ingestion, visually models dependencies via call-graphs, indexes symbol references, and leverages LLM assistants to deliver interactive code comprehension pipelines.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e2e8f0] leading-normal font-mono">
                  <div>
                    <span className="text-[10px] text-outline font-bold uppercase block">Ingestion Engines</span>
                    <span className="text-on-surface block mt-0.5">FastAPI & Python AST-Parser</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline font-bold uppercase block">Database Storage</span>
                    <span className="text-on-surface block mt-0.5">MongoDB & Vector indexes</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline font-bold uppercase block">Frontend Core</span>
                    <span className="text-on-surface block mt-0.5">React 19 & Tailwind CSS v4</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline font-bold uppercase block">Current Version</span>
                    <span className="text-on-surface block mt-0.5">py-code-parser-core v1.2</span>
                  </div>
                </div>

                {/* Roadmaps */}
                <div className="pt-4 border-t border-[#e2e8f0]">
                  <h4 className="text-[10px] font-bold text-outline uppercase tracking-wider mb-3">Planned Roadmaps</h4>
                  <div className="space-y-3 font-sans">
                    {[
                      { title: 'Docker Containers Ingestor', desc: 'Parses Dockerfiles and docker-compose.yml to visually trace microservices layouts.', status: 'planned' },
                      { title: 'SonarQube Quality Gateway', desc: 'Integrates automated code smell metrics directly into the codebase graph canvas.', status: 'planned' },
                      { title: 'VS Code Extension Sync', desc: 'Allows developers to click symbols on CodeMap to open them in their active local VS Code workspace.', status: 'in-review' }
                    ].map((integ, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 border border-[#e2e8f0] rounded-xl bg-slate-50">
                        <div>
                          <span className="text-xs font-bold text-on-surface block">{integ.title}</span>
                          <span className="text-[10px] text-outline block mt-0.5 leading-relaxed">{integ.desc}</span>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                          integ.status === 'in-review' ? 'bg-[#f3e8ff] text-[#6b21a8]' : 'bg-[#e2e8f0] text-outline'
                        }`}>
                          {integ.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar Widget Cards */}
          <div className="space-y-6 select-none">
            
            {/* Storage Gauge */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
              <h4 className="text-[10px] font-bold text-outline uppercase tracking-wider mb-6">Workspace Storage</h4>
              
              {/* Circular Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center rounded-full mb-6 bg-slate-50 border border-[#e2e8f0]">
                {/* Simulated circle indicator */}
                <div className="absolute inset-2 rounded-full border-4 border-[#e2e8f0]"></div>
                <div className="absolute inset-2 rounded-full border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent"></div>
                <div className="flex flex-col items-center justify-center z-10">
                  <span className="text-2xl font-bold text-primary font-display">42%</span>
                  <span className="text-[9px] text-outline font-bold tracking-wider">USED</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-bold text-on-surface">4.2 GB of 10.0 GB Limit</p>
                <p className="text-[11px] text-outline font-semibold leading-relaxed">Your database indices and code files are within standard boundaries.</p>
              </div>

              <button 
                onClick={() => showToast('info', 'Storage indexing running in optimal bounds.')}
                className="mt-6 w-full border border-[#e2e8f0] text-on-surface-variant hover:text-primary hover:bg-[#eff4ff] font-bold py-2 rounded-lg text-xs transition-all cursor-pointer shadow-sm"
              >
                Optimize Storage Index
              </button>
            </div>

            {/* Need Help Gemini keys promo */}
            <div className="bg-primary text-white rounded-xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute -top-6 -right-6 text-white/10">
                <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>help_center</span>
              </div>
              <h4 className="text-sm font-bold mb-2 font-display relative z-10">Need more keys?</h4>
              <p className="text-[11px] opacity-90 mb-4 leading-relaxed font-semibold relative z-10">Adding multiple keys allows CodeMap AI to bypass individual model API rate limits by rotating requests across your pool.</p>
              <a 
                href="https://aistudio.google.com" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 text-xs font-bold underline hover:no-underline transition-all relative z-10"
              >
                Visit Google AI Studio
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>

            {/* Daily consumption metrics */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Daily API Consumption</h4>
              
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-outline uppercase text-[9px]">Tokens In</span>
                    <span className="text-on-surface">1.2M / 5M</span>
                  </div>
                  <div className="w-full bg-[#eff4ff] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-outline uppercase text-[9px]">Tokens Out</span>
                    <span className="text-on-surface">450k / 1M</span>
                  </div>
                  <div className="w-full bg-[#eff4ff] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#7c3aed] h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

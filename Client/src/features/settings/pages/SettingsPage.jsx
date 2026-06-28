import React, { useState } from 'react';
import PageHeader from '../../../shared/components/PageHeader';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';
import Badge from '../../../shared/components/Badge';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('app');
  const [depth, setDepth] = useState('5');
  const [autoIndex, setAutoIndex] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('github-dark');

  const tabs = [
    { id: 'app', label: 'Application Settings' },
    { id: 'theme', label: 'Theme Customization' },
    { id: 'project', label: 'Project Info' },
    { id: 'integrations', label: 'Future Integrations' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure analyzer depth limits, workspace themes, and view platform descriptions."
        breadcrumbs={['Home', 'Settings']}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar tabs */}
        <div className="md:col-span-1">
          <Card bodyClassName="p-2 select-none font-mono">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                    className={`w-full text-left px-3 py-2 text-xs rounded transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#161b22] text-[#00f0ff] font-semibold border-l-2 border-[#00f0ff] pl-2.5'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#161b22]/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Settings Pane */}
        <div className="md:col-span-3">
          {activeTab === 'app' && (
            <Card title="Application Parser Parameters" subtitle="Configure AST traversal limits">
              <div className="space-y-4 font-mono text-xs text-gray-300">
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 font-semibold uppercase text-[10px]">Maximum Call-Graph Trace Depth</label>
                  <select
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    className="bg-[#0d1117] text-gray-200 border border-[#30363d] rounded p-2 focus:ring-1 focus:ring-[#00f0ff] focus:outline-none"
                  >
                    <option value="3">3 hops (fast scans)</option>
                    <option value="5">5 hops (default)</option>
                    <option value="10">10 hops (deep traversal)</option>
                    <option value="20">20 hops (full depth - slow)</option>
                  </select>
                  <p className="text-[10px] text-gray-500 font-sans mt-0.5">Controls recursion depth when resolving references in parser AST directories.</p>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-[#30363d]/30">
                  <div>
                    <label className="font-semibold text-gray-200 block">Automatic Codebase Re-indexing</label>
                    <span className="text-[10px] text-gray-500 font-sans block mt-0.5">Triggers AST indexing as soon as ZIP uploads complete.</span>
                  </div>
                  <button
                    onClick={() => setAutoIndex(!autoIndex)}
                    type="button"
                    className={`w-8 h-4 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                      autoIndex ? 'bg-[#00f0ff]' : 'bg-[#30363d]'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-[#0d1117] transition-transform ${
                      autoIndex ? 'translate-x-4' : ''
                    }`} />
                  </button>
                </div>

                <div className="pt-4 border-t border-[#30363d]/30 flex justify-end">
                  <Button variant="primary" size="sm" onClick={() => alert('Settings saved (Simulation)')}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'theme' && (
            <Card title="Workspace Appearance" subtitle="Select your preferred theme skin">
              <div className="space-y-4 font-mono text-xs text-gray-300">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'github-dark', name: 'GitHub Dark (Default)', desc: 'Slate-grey deep editor layout' },
                    { id: 'dracula', name: 'Dracula Dark', desc: 'Sleek purple neon highlights' },
                    { id: 'monokai', name: 'Monokai Pro', desc: 'Aesthetic retro high-contrast colors' }
                  ].map((t) => {
                    const isSelected = selectedTheme === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTheme(t.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#161b22] border-[#00f0ff]'
                            : 'bg-transparent border-[#30363d] hover:border-gray-500'
                        }`}
                      >
                        <span className="font-semibold text-gray-200 block">{t.name}</span>
                        <p className="text-[10px] text-gray-500 font-sans mt-1 leading-relaxed">{t.desc}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-4 border-t border-[#30363d]/30 flex justify-end">
                  <Button variant="primary" size="sm" onClick={() => alert('Appearance theme applied (Simulation)')}>
                    Apply Theme
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'project' && (
            <Card title="Project & Workspace Information" subtitle="Platform specs and details">
              <div className="space-y-4 text-xs font-mono text-gray-300">
                <div className="space-y-2">
                  <h4 className="text-white font-semibold">About CodeMap AI</h4>
                  <p className="font-sans leading-relaxed text-gray-400">
                    CodeMap AI is a codebase understanding platform built for college senior projects. It facilitates fast parser ingestion, visually models dependencies via call-graphs, indexes symbol references, and leverages LLM assistants to deliver interactive code comprehension pipelines.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#30363d]/30">
                  <div>
                    <span className="text-gray-500 block uppercase text-[9px]">Ingestion Engines</span>
                    <span className="text-gray-300 block mt-0.5">FastAPI & Python AST-Ingestor</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block uppercase text-[9px]">Database Storage</span>
                    <span className="text-gray-300 block mt-0.5">MongoDB & Vector index collections</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block uppercase text-[9px]">Frontend Core</span>
                    <span className="text-gray-300 block mt-0.5">React 19 & Tailwind CSS v4</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block uppercase text-[9px]">Parser Module</span>
                    <span className="text-gray-300 block mt-0.5">py-code-parser-core v1.2</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'integrations' && (
            <Card title="Planned Platform Integrations" subtitle="Upcoming roadmap modules for CodeMap AI">
              <div className="space-y-4 text-xs font-mono text-gray-300">
                <p className="font-sans text-gray-400 leading-relaxed">
                  The following adapters are planned for integration in Phase 2 of CodeMap AI:
                </p>

                <div className="space-y-2.5">
                  {[
                    { title: 'Docker Containers Ingestor', desc: 'Parses Dockerfiles and docker-compose.yml to visually trace microservices layouts.', status: 'planned' },
                    { title: 'SonarQube Quality Gateway', desc: 'Integrates automated code smell metrics directly into the codebase graph canvas.', status: 'planned' },
                    { title: 'VS Code Extension Sync', desc: 'Allows developers to click symbols on CodeMap to open them in their active local VS Code workspace.', status: 'in-review' }
                  ].map((integ, idx) => (
                    <div key={idx} className="flex items-start justify-between border border-[#30363d] p-3 rounded bg-[#0d1117]/30">
                      <div className="min-w-0">
                        <span className="text-gray-200 font-semibold block">{integ.title}</span>
                        <p className="text-[10px] text-gray-500 font-sans mt-0.5 leading-relaxed">{integ.desc}</p>
                      </div>
                      <Badge variant={integ.status === 'in-review' ? 'purple' : 'neutral'} size="sm" className="shrink-0 uppercase text-[9px] leading-none">
                        {integ.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

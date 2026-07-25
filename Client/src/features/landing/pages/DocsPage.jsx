import React, { useState } from 'react';

export default function DocsPage({ isSection = false }) {
  const [activeTopic, setActiveTopic] = useState('architecture');
  const [helpfulVote, setHelpfulVote] = useState(null);

  const docTopics = [
    {
      id: 'quickstart',
      category: 'Getting Started',
      title: 'Quickstart Guide',
      icon: 'rocket_launch',
      content: (
        <div>
          <h1 className="text-2xl font-bold font-display text-on-surface mb-4">Quickstart Guide</h1>
          <p className="text-xs text-on-surface-variant font-semibold leading-relaxed mb-6">
            Get up and running with CodeMap AI in under five minutes. This guide will walk you through compiling code archives and indexing structural references.
          </p>
          
          <h2 className="text-sm font-bold text-on-surface mb-2">1. Prepare your Workspace</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
            Compress your codebase root into a standard ZIP archive. Keep file size under 50MB to ensure smooth parsing transitions.
          </p>

          <h2 className="text-sm font-bold text-on-surface mb-2">2. Upload ZIP Ingestion</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
            Navigate to the ZIP Upload dashboard page. Drop your archive in the upload area, enable re-indexing triggers, and select "Index Workspace".
          </p>

          <div className="bg-[#eff4ff] border-l-4 border-primary p-4 rounded-r-lg mb-6">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Key Tip</h4>
            <p className="text-[11px] text-on-surface font-semibold leading-relaxed">
              If your repository has folders like node_modules or virtual environments, exclude them from your ZIP upload to speed up compilation.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'architecture',
      category: 'Getting Started',
      title: 'Architecture Overview',
      icon: 'rocket_launch',
      content: (
        <div>
          <h1 className="text-2xl font-bold font-display text-on-surface mb-4">Architecture Overview</h1>
          <p className="text-xs text-on-surface-variant font-semibold leading-relaxed mb-6">
            CodeMap AI is built on a distributed graph-processing engine designed to handle codebases. By combining Abstract Syntax Tree (AST) analysis with high-performance relation stores, we enable real-time semantic dependency checks.
          </p>
          
          <h2 className="text-sm font-bold text-on-surface mt-6 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-primary rounded-full"></span>
            Core Pipeline Components
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-xs text-on-surface-variant leading-relaxed mb-6">
            <li><strong className="text-on-surface">Static Analysis Layer:</strong> Extracts structural data using tree-sitter based parsers for multi-language configurations.</li>
            <li><strong className="text-on-surface">Relational Graph Store:</strong> Maps dependencies between functions, classes, and modules in a JSON-optimized format.</li>
            <li><strong className="text-on-surface">LLM Context Manager:</strong> Dynamically prunes irrelevant code blocks to fit high-density logic into token windows.</li>
          </ul>

          <div className="bg-error-container/30 border-l-4 border-error p-4 rounded-r-lg mb-6 flex gap-3">
            <span className="material-symbols-outlined text-error text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <div>
              <h4 className="text-[10px] font-bold text-error uppercase tracking-wider mb-1">Critical Requirement</h4>
              <p className="text-[11px] text-on-surface font-semibold leading-relaxed">
                Ensure your repository directory contains files formatted in supported languages (Python, TypeScript/JavaScript) to trigger call stack compilation.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ast',
      category: 'AST Analysis',
      title: 'AST Parsing Parameters',
      icon: 'analytics',
      content: (
        <div>
          <h1 className="text-2xl font-bold font-display text-on-surface mb-4">AST Parser configuration</h1>
          <p className="text-xs text-on-surface-variant font-semibold leading-relaxed mb-6">
            The AST indexing engine recursively scans class structures, import targets, function decorators, and method parameters.
          </p>
          
          <h2 className="text-sm font-bold text-on-surface mb-2">Supported Declarations</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
            Our current pipeline parses functions (with parameter definitions and call relationships), ES6 import statements, standard class declarations, and router endpoint configurations.
          </p>

          <h2 className="text-sm font-bold text-on-surface mb-2">Traversing Scopes</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
            You can configure call-graph trace depth limits inside settings to skip nested framework folders. Scans compile locally using AST parsers.
          </p>
        </div>
      )
    },
    {
      id: 'graph',
      category: 'Graph Engine',
      title: 'Graph Layouts & Cytoscape',
      icon: 'memory',
      content: (
        <div>
          <h1 className="text-2xl font-bold font-display text-on-surface mb-4">Graph Visualization Engine</h1>
          <p className="text-xs text-on-surface-variant font-semibold leading-relaxed mb-6">
            CodeMap AI uses Cytoscape.js to model dependencies, import maps, and inheritance paths interactively in real-time.
          </p>
          
          <h2 className="text-sm font-bold text-on-surface mb-2">Layout Algorithms</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
            We support **Hierarchical layouts** (powered by Dagre engine) for timeline flows, and **Force-Directed physics models** (powered by fCoSE) for broad dependency clouds.
          </p>

          <h2 className="text-sm font-bold text-on-surface mb-2">Interactions</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
            Drag to pan the viewport canvas, pinch or scroll to zoom, and double click any node to expand related functions in the Q&A assistant page.
          </p>
        </div>
      )
    }
  ];

  const activeDoc = docTopics.find(d => d.id === activeTopic) || docTopics[0];

  // Group topics by category
  const categories = docTopics.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = [];
    }
    acc[curr.category].push(curr);
    return acc;
  }, {});

  const currentIndex = docTopics.findIndex(d => d.id === activeTopic);
  const prevDoc = currentIndex > 0 ? docTopics[currentIndex - 1] : null;
  const nextDoc = currentIndex < docTopics.length - 1 ? docTopics[currentIndex + 1] : null;

  return (
    <div className={`bg-canvas text-on-surface select-none relative ${isSection ? 'py-12' : 'min-h-screen py-16 px-6'}`}>
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:36px_36px] opacity-10 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 relative z-10">
        
        {/* Left Side: Documentation Category List Sidebar */}
        {!isSection && (
          <aside className="w-full md:w-1/4 bg-white border border-[#e2e8f0] rounded-xl p-4 shrink-0 h-fit shadow-sm sticky top-20">
            <h3 className="text-[10px] font-bold text-outline uppercase tracking-wider mb-4 px-2">Documentation Hub</h3>
            
            <div className="space-y-4">
              {Object.entries(categories).map(([catName, items]) => (
                <div key={catName}>
                  <div className="flex items-center gap-2 text-on-surface-variant font-bold text-xs mb-2 px-2">
                    <span className="material-symbols-outlined text-sm text-outline">folder</span>
                    <span>{catName}</span>
                  </div>
                  
                  <ul className="ml-5 border-l border-[#e2e8f0] pl-2 space-y-1 text-xs">
                    {items.map(item => {
                      const isSelected = activeTopic === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => { setActiveTopic(item.id); setHelpfulVote(null); }}
                            className={`w-full text-left pl-3 py-1.5 rounded transition-all cursor-pointer ${
                              isSelected 
                                ? 'text-primary font-bold bg-[#eff4ff]' 
                                : 'text-on-surface-variant hover:text-primary hover:bg-slate-50'
                            }`}
                          >
                            {item.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Right Side: Documentation Article Content View */}
        <article className={`flex-grow bg-white border border-[#e2e8f0] rounded-xl p-8 shadow-sm ${isSection ? 'max-w-4xl mx-auto w-full' : 'md:w-3/4'}`}>
          {/* Breadcrumb path */}
          <nav className="flex items-center gap-1.5 text-[10px] font-bold text-outline uppercase tracking-wider mb-6">
            <span>Docs</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span>{activeDoc.category}</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-primary">{activeDoc.title}</span>
          </nav>

          {/* Active Documentation content block */}
          <div className="min-h-[250px] font-sans">
            {activeDoc.content}
          </div>

          {/* Next/Prev Navigation links */}
          {!isSection && (prevDoc || nextDoc) && (
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#e2e8f0]">
              {prevDoc ? (
                <button 
                  onClick={() => { setActiveTopic(prevDoc.id); setHelpfulVote(null); }}
                  className="flex items-center gap-2 group text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-[#e2e8f0] flex items-center justify-center group-hover:bg-[#eff4ff] transition-all">
                    <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary">arrow_back</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-outline uppercase tracking-wider block">Previous</span>
                    <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-all">{prevDoc.title}</span>
                  </div>
                </button>
              ) : <div />}

              {nextDoc ? (
                <button 
                  onClick={() => { setActiveTopic(nextDoc.id); setHelpfulVote(null); }}
                  className="flex items-center gap-2 text-right group cursor-pointer"
                >
                  <div>
                    <span className="text-[9px] font-bold text-outline uppercase tracking-wider block">Next</span>
                    <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-all">{nextDoc.title}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-[#e2e8f0] flex items-center justify-center group-hover:bg-[#eff4ff] transition-all">
                    <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary">arrow_forward</span>
                  </div>
                </button>
              ) : <div />}
            </div>
          )}

          {/* Was this helpful voting */}
          <div className="mt-12 bg-slate-50 border border-[#e2e8f0] rounded-xl p-6 flex flex-col items-center">
            <p className="text-xs font-bold text-on-surface mb-3">Was this page helpful?</p>
            {helpfulVote === null ? (
              <div className="flex gap-3">
                <button 
                  onClick={() => setHelpfulVote(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 border border-[#e2e8f0] bg-white rounded-lg hover:bg-[#eff4ff] hover:border-primary text-xs font-bold cursor-pointer transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm text-primary">thumb_up</span> Yes
                </button>
                <button 
                  onClick={() => setHelpfulVote(false)}
                  className="flex items-center gap-1.5 px-4 py-1.5 border border-[#e2e8f0] bg-white rounded-lg hover:bg-[#eff4ff] hover:border-primary text-xs font-bold cursor-pointer transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm text-outline">thumb_down</span> No
                </button>
              </div>
            ) : (
              <p className="text-xs text-primary font-bold">Thank you for your feedback!</p>
            )}
          </div>

          {/* Footer copyright */}
          <div className="mt-8 text-center text-[10px] text-outline font-bold border-t border-[#e2e8f0] pt-6">
            <p>© 2026 CodeMap AI. Built for intelligent codebase static analysis and visual call-graph understanding.</p>
          </div>
        </article>

      </div>
    </div>
  );
}

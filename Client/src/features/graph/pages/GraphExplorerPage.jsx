import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../shared/context/ToastContext';
import GraphCanvas from '../components/GraphCanvas';
import { 
  getRepositories, 
  getRepositoryGraph 
} from '../../../shared/api/repositoryApi';

export default function GraphExplorerPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [repositories, setRepositories] = useState([]);
  const [activeRepo, setActiveRepo] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);

  // Layout mode: Architecture (Standard), Classes, Dependency
  const [activeMode, setActiveMode] = useState('Architecture');
  
  // Selection states
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Camera action triggers
  const [fitViewTrigger, setFitViewTrigger] = useState(0);
  const [centerSelectionTrigger, setCenterSelectionTrigger] = useState(0);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Load repositories and initial graph data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const reposList = await getRepositories();
        setRepositories(reposList || []);
        
        let targetId = localStorage.getItem('active_repository_id');
        let activeRepoData = null;
        
        if (targetId) {
          activeRepoData = reposList.find(r => r.repository_id === targetId);
        }
        
        if (!activeRepoData && reposList.length > 0) {
          activeRepoData = reposList[0];
        }
        
        if (activeRepoData) {
          setActiveRepo(activeRepoData);
          localStorage.setItem('active_repository_id', activeRepoData.repository_id);
          localStorage.setItem('active_repository_name', activeRepoData.repository_name);
          
          const graph = await getRepositoryGraph(activeRepoData.repository_id);
          setGraphData(graph || { nodes: [], edges: [] });
        }
      } catch (err) {
        showToast('error', 'Failed to load initial graph data.');
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const handleSelectRepository = async (repoId) => {
    const selected = repositories.find(r => r.repository_id === repoId);
    if (!selected) return;
    
    try {
      setLoading(true);
      setActiveRepo(selected);
      setSelectedNode(null);
      setSelectedEdge(null);
      localStorage.setItem('active_repository_id', selected.repository_id);
      localStorage.setItem('active_repository_name', selected.repository_name);
      window.dispatchEvent(new Event('storage'));
      
      const graph = await getRepositoryGraph(selected.repository_id);
      setGraphData(graph || { nodes: [], edges: [] });
    } catch (err) {
      showToast('error', 'Failed to change repository graph.');
    } finally {
      setLoading(false);
    }
  };

  // Filter nodes and edges based on active mode
  const visibleNodes = useMemo(() => {
    return graphData?.nodes || [];
  }, [graphData]);

  const visibleEdges = useMemo(() => {
    const rawEdges = graphData?.edges || [];
    if (activeMode === 'Classes') {
      return rawEdges.filter(e => e.type === 'inherits' || e.type === 'contains');
    }
    if (activeMode === 'Dependency') {
      return rawEdges.filter(e => e.type === 'imports' || e.type === 'depends_on' || e.type === 'dependencies');
    }
    return rawEdges;
  }, [graphData, activeMode]);

  // Extract file list from nodes of type 'module'
  const fileNodes = useMemo(() => {
    return (graphData?.nodes || []).filter(n => n.type === 'module');
  }, [graphData]);

  const handleSearchSubmit = (query) => {
    if (!query || query.trim() === '') return;
    const cleanQuery = query.toLowerCase().trim();

    const match = (graphData?.nodes || []).find(node => 
      node.label.toLowerCase().includes(cleanQuery) || 
      node.id.toLowerCase().includes(cleanQuery)
    );

    if (match) {
      setSelectedNode(match);
      setTimeout(() => {
        setCenterSelectionTrigger(prev => prev + 1);
      }, 50);
    } else {
      showToast('info', 'No matching codebase node found.');
    }
  };

  const handleFileClick = (node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    setTimeout(() => {
      setCenterSelectionTrigger(prev => prev + 1);
    }, 50);
  };

  const handleNodeAction = (nodeId, action) => {
    if (action === 'expand' || action === 'focus') {
      const match = (graphData?.nodes || []).find(n => n.id === nodeId);
      if (match) {
        setSelectedNode(match);
        setTimeout(() => {
          setCenterSelectionTrigger(prev => prev + 1);
        }, 50);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-main_padding flex flex-col items-center justify-center min-h-[400px]">
        <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-xs text-on-surface-variant font-semibold">Loading dependency graph elements...</p>
      </div>
    );
  }

  if (!activeRepo) {
    return (
      <div className="p-main_padding text-center">
        <span className="material-symbols-outlined text-5xl text-outline mb-3">folder_open</span>
        <h3 className="text-base font-bold text-on-surface mb-2">No Active Repository</h3>
        <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-6">
          Please upload a ZIP file first to index your code structure.
        </p>
        <button 
          onClick={() => navigate('/repository')}
          className="bg-primary text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-md hover:bg-primary-hover active:scale-95 cursor-pointer"
        >
          Go to Upload ZIP
        </button>
      </div>
    );
  }

  // Get selected node's imports and connections
  const nodeConnections = selectedNode ? visibleEdges.filter(
    e => e.source === selectedNode.id || e.target === selectedNode.id
  ) : [];

  const nodeImports = nodeConnections.filter(e => e.type === 'imports' || e.type === 'depends_on');
  const nodeMethods = selectedNode?.data?.methods || [];
  const nodeParams = selectedNode?.data?.parameters || [];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden font-sans text-on-surface bg-canvas">
      
      {/* Top Controls Toolbar */}
      <div className="h-14 border-b border-[#e2e8f0] bg-white flex justify-between items-center px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <select
            value={activeRepo?.repository_id || ''}
            onChange={(e) => handleSelectRepository(e.target.value)}
            className="bg-white border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-xs font-bold text-on-surface focus:outline-none focus:border-primary cursor-pointer shadow-sm"
          >
            {repositories.map(r => (
              <option key={r.repository_id} value={r.repository_id}>
                {r.repository_name}
              </option>
            ))}
          </select>

          {/* Mode Switch Tabs */}
          <nav className="flex items-center gap-6 ml-4">
            <button 
              onClick={() => { setActiveMode('Architecture'); setSelectedNode(null); }}
              className={`text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'Architecture' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Module Graph
            </button>
            <button 
              onClick={() => { setActiveMode('Classes'); setSelectedNode(null); }}
              className={`text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'Classes' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Class Inheritances
            </button>
            <button 
              onClick={() => { setActiveMode('Dependency'); setSelectedNode(null); }}
              className={`text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'Dependency' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Import Map
            </button>
          </nav>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
          <input 
            className="w-full bg-[#eff4ff] border border-[#e2e8f0] rounded-lg pl-10 pr-4 py-1.5 text-xs font-semibold focus:outline-none focus:border-primary transition-all outline-none"
            placeholder="Search classes or methods..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
            type="text"
          />
        </div>
      </div>

      {/* Split Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Project Files Directory Tree */}
        <aside className="w-[240px] border-r border-[#e2e8f0] bg-[#eff4ff] flex flex-col shrink-0 select-none">
          <div className="p-4 border-b border-[#e2e8f0] bg-white">
            <h2 className="text-xs font-bold text-outline uppercase tracking-wider">Project Files</h2>
          </div>
          <div className="flex-grow overflow-y-auto p-3 space-y-1 text-xs">
            <div className="flex items-center gap-2 p-1.5 hover:bg-[#dce9ff]/50 rounded cursor-pointer transition-colors font-bold text-on-surface">
              <span className="material-symbols-outlined text-sm text-outline">keyboard_arrow_down</span>
              <span className="material-symbols-outlined text-primary">folder</span>
              <span>src</span>
            </div>
            
            <ul className="ml-6 border-l border-[#c3c6d7] pl-2 space-y-1">
              {fileNodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <li key={node.id}>
                    <div 
                      onClick={() => handleFileClick(node)}
                      className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-[#dce9ff] text-primary font-bold' 
                          : 'text-on-surface-variant hover:bg-[#dce9ff]/45'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-sm ${isSelected ? 'text-primary' : 'text-outline'}`} style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "" }}>
                        description
                      </span>
                      <span className="truncate max-w-[150px]">{node.label}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Center Section: Graph Canvas & Toolbar overlay */}
        <section className="flex-1 relative bg-white overflow-hidden flex flex-col">
          {/* Zoom Overlay Tools */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button 
              onClick={() => setFitViewTrigger(prev => prev + 1)}
              className="bg-white border border-[#e2e8f0] p-2 rounded-lg shadow-sm hover:bg-[#eff4ff] transition-colors cursor-pointer text-on-surface-variant hover:text-primary flex items-center justify-center" 
              title="Recenter Fit View"
            >
              <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
            </button>
            <button 
              onClick={() => setReloadTrigger(prev => prev + 1)}
              className="bg-white border border-[#e2e8f0] p-2 rounded-lg shadow-sm hover:bg-[#eff4ff] transition-colors cursor-pointer text-on-surface-variant hover:text-primary flex items-center justify-center" 
              title="Re-layout Graph"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
          </div>

          {/* Cytoscape Canvas viewport */}
          <div className="flex-grow">
            <GraphCanvas
              nodes={visibleNodes}
              edges={visibleEdges}
              selectedNode={selectedNode}
              onSelectNode={(node) => {
                setSelectedNode(node);
                setSelectedEdge(null);
              }}
              layout="Hierarchical"
              onSelectEdge={(edge) => {
                setSelectedEdge(edge);
                setSelectedNode(null);
              }}
              selectedEdge={selectedEdge}
              fitViewTrigger={fitViewTrigger}
              centerSelectionTrigger={centerSelectionTrigger}
              reloadTrigger={reloadTrigger}
              onNodeAction={handleNodeAction}
            />
          </div>

          {/* Graph Legend overlay */}
          <div className="absolute bottom-4 left-4 bg-white/95 border border-[#e2e8f0] p-3 rounded-lg shadow-sm pointer-events-none z-10">
            <div className="flex items-center gap-4 text-[10px] font-bold text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-primary"></span>
                <span>Module File</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#7c3aed]"></span>
                <span>Class</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#006242]"></span>
                <span>Function</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#f97316]"></span>
                <span>Route</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Slide-out Details Inspector Drawer */}
        <aside 
          className={`w-[300px] border-l border-[#e2e8f0] bg-white h-full shrink-0 shadow-2xl transition-transform duration-300 overflow-y-auto ${
            selectedNode ? 'translate-x-0' : 'translate-x-full'
          } absolute md:relative right-0 top-0 z-20`}
        >
          {selectedNode && (
            <div className="p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6 border-b border-[#e2e8f0] pb-3">
                  <h3 className="text-sm font-bold text-primary truncate max-w-[200px]">{selectedNode.label}</h3>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-[#eff4ff] text-outline hover:text-primary rounded-full transition-all cursor-pointer flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <div className="space-y-6 text-xs leading-normal">
                  {/* Module Name */}
                  <div>
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Symbol Type</label>
                    <span className="bg-[#eff4ff] text-primary px-2.5 py-1 rounded-full font-bold text-[10px] uppercase">
                      {selectedNode.type}
                    </span>
                  </div>

                  {/* Node Source File */}
                  {selectedNode.data?.file && (
                    <div>
                      <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Source File</label>
                      <p className="font-mono bg-[#eff4ff]/60 border border-[#e2e8f0] p-2 rounded text-[11px] text-on-surface break-all">
                        {selectedNode.data.file}
                      </p>
                    </div>
                  )}

                  {/* Exposed Parameters / Details */}
                  {nodeParams.length > 0 && (
                    <div>
                      <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">Parameters</label>
                      <p className="font-mono text-on-surface-variant text-[11px]">
                        ({nodeParams.join(', ')})
                      </p>
                    </div>
                  )}

                  {/* Exposed Methods */}
                  {nodeMethods.length > 0 && (
                    <div>
                      <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-2">Exposed Methods ({nodeMethods.length})</label>
                      <div className="space-y-1.5">
                        {nodeMethods.map((m, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-[#eff4ff]/60 border border-[#e2e8f0] rounded">
                            <span className="font-mono text-[11px] text-secondary font-semibold">{m}</span>
                            <span className="material-symbols-outlined text-sm text-outline">bolt</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dependencies/Imports List */}
                  {nodeImports.length > 0 && (
                    <div>
                      <label className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-2">Imports ({nodeImports.length})</label>
                      <ul className="space-y-1.5">
                        {nodeImports.slice(0, 5).map((edge, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-on-surface-variant font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></span>
                            <span className="truncate max-w-[200px]" title={edge.target}>{edge.target}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* View Source Trigger */}
              <div className="pt-6 border-t border-[#e2e8f0] mt-8">
                <button 
                  onClick={() => navigate('/assistant', { state: { initialFile: selectedNode.data?.file || selectedNode.id } })}
                  className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">code</span>
                  View Source Code
                </button>
              </div>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}

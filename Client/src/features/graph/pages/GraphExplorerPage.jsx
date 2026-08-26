//import React,
import { useState, useEffect, useMemo, useCallback } from 'react';
import PageHeader from '../../../shared/components/PageHeader';
import SearchBar from '../../../shared/components/SearchBar';
import GraphToolbar from '../components/GraphToolbar';
import GraphCanvas from '../components/GraphCanvas';
import GraphFilters from '../components/GraphFilters';
import GraphLegend from '../components/GraphLegend';
import NodeDetailsPanel from '../components/NodeDetailsPanel';
import GraphChatPanel from '../components/GraphChatPanel';
import Card from '../../../shared/components/Card';
import { 
  getRepositories, 
  getActiveRepository, 
  getRepositoryGraph 
} from '../../../shared/api/repositoryApi';

export default function GraphExplorerPage() {
  const [repositories, setRepositories] = useState([]);
  const [activeRepo, setActiveRepo] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);

  // Semantic exploration state
  const [activeMode, setActiveMode] = useState('Architecture'); // Architecture, Modules, Dependency, Classes, Functions, Routes
  const [expandedNodeIds, setExpandedNodeIds] = useState(new Set());
  
  // Selection states
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Collapsible Filters Panel
  const [showFilters, setShowFilters] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedNodeTypes, setSelectedNodeTypes] = useState(['module']);
  const [showFilesOnly, setShowFilesOnly] = useState(false);

  // Camera action triggers
  const [fitViewTrigger, setFitViewTrigger] = useState(0);
  const [centerSelectionTrigger, setCenterSelectionTrigger] = useState(0);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Layout engine shifts automatically based on exploration mode
  const layout = useMemo(() => {
    switch (activeMode) {
      case 'Modules':
      case 'Architecture':
      case 'Classes':
      case 'Functions':
      case 'Routes':
        return 'Hierarchical';
      case 'Dependency':
      default:
        return 'Force-Directed'; // Maps to fcose in GraphCanvas
    }
  }, [activeMode]);

  // Load repositories and initial graph
  useEffect(() => {
    const controller = new AbortController();
    
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const reposList = await getRepositories(controller.signal);
        setRepositories(reposList || []);
        
        let targetId = localStorage.getItem('active_repository_id');
        let activeRepoData = null;
        
        if (targetId) {
          activeRepoData = reposList.find(r => r.repository_id === targetId);
        }
        
        if (!activeRepoData) {
          try {
            activeRepoData = await getActiveRepository(controller.signal);
          } catch {
            // No active repository configured
          }
        }
        
        if (activeRepoData) {
          setActiveRepo(activeRepoData);
          localStorage.setItem('active_repository_id', activeRepoData.repository_id);
          localStorage.setItem('active_repository_name', activeRepoData.repository_name);
          
          const graph = await getRepositoryGraph(activeRepoData.repository_id, controller.signal);
          setGraphData(graph || { nodes: [], edges: [] });
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Failed to load initial graph explorer data:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
    return () => controller.abort();
  }, []);

  const handleSelectRepository = async (repoId) => {
    const selected = repositories.find(r => r.repository_id === repoId);
    if (!selected) return;
    
    try {
      setLoading(true);
      setActiveRepo(selected);
      setSelectedNode(null);
      setSelectedEdge(null);
      setExpandedNodeIds(new Set());
      localStorage.setItem('active_repository_id', selected.repository_id);
      localStorage.setItem('active_repository_name', selected.repository_name);
      
      const graph = await getRepositoryGraph(selected.repository_id);
      setGraphData(graph || { nodes: [], edges: [] });
    } catch (err) {
      console.error("Failed to load switched graph:", err);
    } finally {
      setLoading(false);
    }
  };

  const reloadGraphData = async () => {
    if (!activeRepo) return;
    try {
      const graph = await getRepositoryGraph(activeRepo.repository_id);
      setGraphData(graph || { nodes: [], edges: [] });
      // Trigger canvas rebuild after fetching new data
      setReloadTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Failed to reload graph:", err);
    }
  };

  // Node parent mapping helper
  const nodeParentsMap = useMemo(() => {
    const parentMap = {};
    if (!graphData?.edges) return parentMap;
    
    graphData.edges.forEach(edge => {
      if (edge.type === 'contains' || edge.type === 'defines_route' || edge.type === 'has_method') {
        parentMap[edge.target] = edge.source;
      }
    });
    return parentMap;
  }, [graphData]);

  // Progressive exploration node resolver
  const visibleNodes = useMemo(() => {
    const rawNodes = graphData?.nodes || [];
    if (rawNodes.length === 0) return [];

    const typeFiltered = rawNodes.filter(n => selectedNodeTypes.includes(n.type));
    // In all modes, the structural graph is determined entirely by the active mode and selected node types.
    // We no longer filter nodes dynamically based on the current user selection.
    // Selection state is completely separated and purely triggers visual CSS classes in the canvas.
    return typeFiltered;
  }, [graphData, activeMode, selectedNodeTypes]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes]);

  // Progressive exploration edge resolver
  const visibleEdges = useMemo(() => {
    const rawEdges = graphData?.edges || [];
    
    const boundsFiltered = rawEdges.filter(
      edge => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    if (activeMode === 'Classes') {
      return boundsFiltered.filter(e => e.type === 'inherits' || e.type === 'contains');
    }
    
    if (activeMode === 'Dependency') {
      return boundsFiltered.filter(e => e.type === 'imports' || e.type === 'depends_on' || e.type === 'dependencies');
    }

    if (activeMode === 'Functions' || activeMode === 'Routes') {
      return boundsFiltered.filter(e => e.type === 'calls' || e.type === 'defines_route' || e.type === 'contains');
    }

    return boundsFiltered;
  }, [graphData, visibleNodeIds, activeMode]);

  // Statistics counters
  const totalNodesCount = graphData?.nodes?.length || 0;
  const totalEdgesCount = graphData?.edges?.length || 0;
  const visibleNodesCount = visibleNodes.length;
  const visibleEdgesCount = visibleEdges.length;

  const typeCounts = useMemo(() => {
    const counts = {};
    (graphData?.nodes || []).forEach(n => {
      counts[n.type] = (counts[n.type] || 0) + 1;
    });
    return counts;
  }, [graphData]);

  // Action utilities handlers
  const handleFitView = () => setFitViewTrigger(prev => prev + 1);
  const handleCenterSelection = () => setCenterSelectionTrigger(prev => prev + 1);
  
  const handleExpandAll = () => {
    const newExpanded = new Set(expandedNodeIds);
    // Expand all currently visible modules and classes
    visibleNodes.forEach(node => {
      if (node.type === 'module' || node.type === 'class') {
        newExpanded.add(node.id);
      }
    });
    setExpandedNodeIds(newExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedNodeIds(new Set());
  };

  // Node click and expand actions
  const handleNodeAction = useCallback((nodeId, action) => {
    if (action === 'expand') {
      const node = (graphData?.nodes || []).find(n => n.id === nodeId);
      if (node?.type === 'function') {
        setActiveMode('Functions');
        setSelectedNode(node);
      } else if (node?.type === 'route') {
        setActiveMode('Routes');
        setSelectedNode(node);
      } else {
        setExpandedNodeIds(prev => {
          const next = new Set(prev);
          next.add(nodeId);
          return next;
        });
      }
    } else if (action === 'collapse') {
      setExpandedNodeIds(prev => {
        const next = new Set(prev);
        next.delete(nodeId);
        return next;
      });
    } else if (action === 'focus') {
      const node = (graphData?.nodes || []).find(n => n.id === nodeId);
      if (node) {
        setSelectedNode(node);
        handleCenterSelection();
      }
    }
  });

  const handleToggleNodeType = (type) => {
    setSelectedNodeTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Search logic
  const handleSearchSubmit = (query) => {
    if (!query || query.trim() === '') return;
    const cleanQuery = query.toLowerCase().trim();

    // Find first matching node in database
    const match = (graphData?.nodes || []).find(node => 
      node.label.toLowerCase().includes(cleanQuery) || 
      node.id.toLowerCase().includes(cleanQuery)
    );

    if (match) {
      setSelectedNode(match);
      
      // Auto expand parent modules to ensure matching node is visible
      const parentId = nodeParentsMap[match.id];
      if (parentId) {
        setExpandedNodeIds(prev => {
          const next = new Set(prev);
          next.add(parentId);
          const grandParentId = nodeParentsMap[parentId];
          if (grandParentId) next.add(grandParentId);
          return next;
        });
      }

      // Switch mode if search points to routes or functions specifically
      if (match.type === 'function') {
        setActiveMode('Functions');
      } else if (match.type === 'route') {
        setActiveMode('Routes');
      }

      // Center camera
      setTimeout(() => {
        handleCenterSelection();
      }, 50);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 font-mono">
        <PageHeader
          title="Graph Explorer"
          description="Visualize dependency charts, import maps, and class inheritance networks."
          breadcrumbs={['Home', 'Graph Explorer']}
        />
        <div className="py-32 flex flex-col items-center justify-center">
          <span className="w-10 h-10 rounded-full border-2 border-[#00f0ff] border-t-transparent animate-spin mb-4" />
          <p className="text-xs text-slate-400">Loading codebase dependency graph layout...</p>
        </div>
      </div>
    );
  }

  if (!activeRepo) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Graph Explorer"
          description="Visualize dependency charts, import maps, and class inheritance networks."
          breadcrumbs={['Home', 'Graph Explorer']}
        />
        <Card title="No Repository Loaded" subtitle="Get started by uploading a codebase">
          <div className="py-16 flex flex-col items-center justify-center font-mono text-center">
            <svg className="w-12 h-12 text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-white font-semibold mb-2">No Active Repository Mapped</h3>
            <p className="text-xs text-slate-500 max-w-[280px] leading-relaxed mb-6">
              Go to the Repository page, select a project, or upload a new codebase to generate a module graph.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono">
      {/* Page Header */}
      <PageHeader
        title="Graph Explorer"
        description="Visualize dependency charts, import maps, and class inheritance networks."
        breadcrumbs={['Home', 'Graph Explorer']}
        actions={
          <div className="flex items-center gap-3">
            <select
              value={activeRepo?.repository_id || ''}
              onChange={(e) => handleSelectRepository(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-[#00f0ff] cursor-pointer"
            >
              {repositories.map(r => (
                <option key={r.repository_id} value={r.repository_id}>
                  {r.repository_name}
                </option>
              ))}
            </select>
            <SearchBar
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearchSubmit(e.target.value);
              }}
              onClear={() => setSearchQuery('')}
              className="w-48 sm:w-56"
            />
          </div>
        }
      />

      {/* Toolbar */}
      <GraphToolbar
        activeMode={activeMode}
        onChangeMode={(mode) => {
          setActiveMode(mode);
          setSelectedNode(null);
          setSelectedEdge(null);
        }}
        zoom={1} // visual representation only
        onZoomIn={() => {}} // handled locally in Canvas
        onZoomOut={() => {}}
        onZoomReset={() => {}}
        onFitView={handleFitView}
        onCenterSelection={handleCenterSelection}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        showFilters={showFilters}
        onToggleFilters={() => {
          setShowFilters(prev => !prev);
          setShowChat(false);
        }}
        showChat={showChat}
        onToggleChat={() => {
          setShowChat(prev => !prev);
          setShowFilters(false);
        }}
        onReloadGraph={reloadGraphData}
      />

      {/* Developer workspace: graph stays visible while the selected symbol is inspected. */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch">
        <div className="min-w-0 flex-1 space-y-4">
          <GraphCanvas
            nodes={visibleNodes}
            edges={visibleEdges}
            selectedNode={selectedNode}
            onSelectNode={(node) => {
              setSelectedNode(node);
              setSelectedEdge(null);
            }}
            layout={layout}
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
          <GraphLegend />
        </div>

        {(selectedNode || selectedEdge || showFilters || showChat) && (
          <aside className="w-full xl:w-[390px] 2xl:w-[430px] shrink-0 space-y-4 animate-slide-in">
            {showChat && (
              <GraphChatPanel
                activeRepo={activeRepo}
                selectedNode={selectedNode}
                onClose={() => setShowChat(false)}
              />
            )}

            {!showChat && (selectedNode || selectedEdge) && (
              <NodeDetailsPanel
                node={selectedNode}
                edges={graphData?.edges || []}
                selectedEdge={selectedEdge}
                onClearEdge={() => setSelectedEdge(null)}
                onClearNode={() => setSelectedNode(null)}
                activeRepo={activeRepo}
                totalNodesCount={totalNodesCount}
                totalEdgesCount={totalEdgesCount}
                visibleNodesCount={visibleNodesCount}
                visibleEdgesCount={visibleEdgesCount}
              />
            )}

            {!showChat && showFilters && (
              <GraphFilters
                selectedGroups={selectedNodeTypes}
                onToggleGroup={handleToggleNodeType}
                showFilesOnly={showFilesOnly}
                onToggleFilesOnly={() => setShowFilesOnly(prev => !prev)}
                typeCounts={typeCounts}
              />
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

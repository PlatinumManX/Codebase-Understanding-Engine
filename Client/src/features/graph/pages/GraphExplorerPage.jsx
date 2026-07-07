import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../../shared/components/PageHeader';
import SearchBar from '../../../shared/components/SearchBar';
import GraphToolbar from '../components/GraphToolbar';
import GraphCanvas from '../components/GraphCanvas';
import GraphFilters from '../components/GraphFilters';
import NodeDetailsPanel from '../components/NodeDetailsPanel';
import GraphLegend from '../components/GraphLegend';
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
  
  const [zoom, setZoom] = useState(1);
  const [layout, setLayout] = useState('Force-Directed');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState(['module', 'class', 'function', 'method', 'route', 'external_class']);
  const [showFilesOnly, setShowFilesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);

  const handleToggleGroup = (groupKey) => {
    setSelectedGroups(prev =>
      prev.includes(groupKey)
        ? prev.filter(g => g !== groupKey)
        : [...prev, groupKey]
    );
  };

  const handleToggleFilesOnly = () => setShowFilesOnly(prev => !prev);

  // 1. Fetch repositories and initial active repository graph
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
          } catch (e) {
            // No active repo configured
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
          console.error("Failed to load graph explorer metadata:", err);
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

  // 2. Compute dynamic stats and node type counts
  const typeCounts = useMemo(() => {
    const counts = {};
    (graphData?.nodes || []).forEach(n => {
      counts[n.type] = (counts[n.type] || 0) + 1;
    });
    return counts;
  }, [graphData]);

  // 3. Filter canvas elements
  const filteredNodes = useMemo(() => {
    return (graphData?.nodes || []).filter((node) => {
      if (!selectedGroups.includes(node.type)) return false;
      if (showFilesOnly && node.type !== 'module') return false;
      if (searchQuery.trim() !== '') {
        return (
          node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    });
  }, [graphData, selectedGroups, showFilesOnly, searchQuery]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return (graphData?.edges || []).filter(
      edge => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );
  }, [graphData, filteredNodeIds]);

  const handleSelectEdge = (edge) => {
    setSelectedNode(null);
    setSelectedEdge(edge);
  };

  const handleSelectNode = (node) => {
    setSelectedEdge(null);
    setSelectedNode(node);
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
    <div className="space-y-4">
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
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              className="w-48 sm:w-56"
            />
          </div>
        }
      />

      {/* Toolbar */}
      <GraphToolbar
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        layout={layout}
        onChangeLayout={setLayout}
      />

      {/* Main Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar Filters */}
        <div className="space-y-4 lg:col-span-1">
          <GraphFilters
            selectedGroups={selectedGroups}
            onToggleGroup={handleToggleGroup}
            showFilesOnly={showFilesOnly}
            onToggleFilesOnly={handleToggleFilesOnly}
            typeCounts={typeCounts}
          />
          <NodeDetailsPanel 
            node={selectedNode} 
            edges={graphData?.edges || []} 
            selectedEdge={selectedEdge}
            onClearEdge={() => setSelectedEdge(null)}
          />
        </div>

        {/* Central Canvas Viewport */}
        <div className="lg:col-span-3 space-y-4">
          <GraphCanvas
            nodes={filteredNodes}
            edges={filteredEdges}
            selectedNode={selectedNode}
            onSelectNode={handleSelectNode}
            zoom={zoom}
            layout={layout}
            onSelectEdge={handleSelectEdge}
          />
          <GraphLegend />
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import PageHeader from '../../../shared/components/PageHeader';
import SearchBar from '../../../shared/components/SearchBar';
import GraphToolbar from '../components/GraphToolbar';
import GraphCanvas from '../components/GraphCanvas';
import GraphFilters from '../components/GraphFilters';
import NodeDetailsPanel from '../components/NodeDetailsPanel';
import GraphLegend from '../components/GraphLegend';
import { graphNodes, graphEdges } from '../../../shared/data/dummyData';

export default function GraphExplorerPage() {
  const [zoom, setZoom] = useState(1);
  const [layout, setLayout] = useState('Force-Directed');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState(['auth', 'database', 'api', 'utils']);
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

  // Search filter
  const filteredNodes = graphNodes.filter((node) => {
    if (!selectedGroups.includes(node.group)) return false;
    if (showFilesOnly && node.type !== 'file') return false;
    if (searchQuery.trim() !== '') {
      return (
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = graphEdges.filter(
    edge => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  );

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <PageHeader
        title="Graph Explorer"
        description="Visualize dependency charts, import maps, and class inheritance networks."
        breadcrumbs={['Home', 'Graph Explorer']}
        actions={
          <SearchBar
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            className="w-48 sm:w-56"
          />
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
          />
          <NodeDetailsPanel node={selectedNode} edges={graphEdges} />
        </div>

        {/* Central Canvas Viewport */}
        <div className="lg:col-span-3 space-y-4">
          <GraphCanvas
            nodes={filteredNodes}
            edges={filteredEdges}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            zoom={zoom}
          />
          <GraphLegend />
        </div>
      </div>
    </div>
  );
}

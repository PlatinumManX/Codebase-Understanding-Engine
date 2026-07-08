import React, { useState, useEffect, useMemo, useRef } from 'react';

const getNodeColor = (type) => {
  switch (type) {
    case 'module':
      return '#10b981'; // green
    case 'class':
      return '#f97316'; // orange
    case 'function':
      return '#8b5cf6'; // purple
    case 'method':
      return '#eab308'; // yellow
    case 'route':
      return '#ef4444'; // red
    case 'external_class':
      return '#64748b'; // gray
    case 'repository':
      return '#3b82f6'; // blue
    default:
      return '#94a3b8';
  }
};

const getNodeIcon = (type) => {
  switch (type) {
    case 'repository':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      );
    case 'module':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      );
    case 'class':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      );
    case 'function':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      );
    case 'method':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      );
    case 'route':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      );
    case 'external_class':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      );
    default:
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      );
  }
};

const getNodeRadius = (type) => {
  switch (type) {
    case 'repository':
      return 22;
    case 'module':
      return 18;
    case 'class':
    case 'route':
      return 15;
    case 'function':
      return 12;
    case 'method':
      return 10;
    default:
      return 12;
  }
};

const getIconScale = (type) => {
  switch (type) {
    case 'repository':
      return 0.7;
    case 'module':
      return 0.6;
    case 'class':
    case 'route':
      return 0.55;
    case 'function':
      return 0.45;
    case 'method':
      return 0.38;
    default:
      return 0.5;
  }
};

export default function GraphCanvas({
  nodes = [],
  edges = [],
  selectedNode,
  onSelectNode,
  zoom: parentZoom, // legacy compat
  layout = 'Force-Directed',
  onSelectEdge,
  selectedEdge,
  fitViewTrigger = 0,
  centerSelectionTrigger = 0,
  onNodeAction
}) {
  const containerRef = useRef(null);

  // 1. Coordinates state (to support dragging)
  const [nodePositions, setNodePositions] = useState({});

  // 2. Camera state (x, y translations and zoom)
  const [camera, setCamera] = useState({ x: 50, y: 50, zoom: 0.85 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // 3. Drag node state
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodeStartPos, setNodeStartPos] = useState({ x: 0, y: 0 });

  // 4. Hover connection highlight states
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  // 5. Layout coordinates calculation
  const calculatedCoordinates = useMemo(() => {
    const coords = {};
    if (!nodes || nodes.length === 0) return coords;

    const width = 800;
    const height = 550;

    if (layout === 'Circular') {
      const numNodes = nodes.length;
      const radius = 180;
      const centerX = width / 2;
      const centerY = height / 2;
      nodes.forEach((node, idx) => {
        const angle = (idx / numNodes) * 2 * Math.PI;
        coords[node.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });
    } else if (layout === 'Hierarchical') {
      const layers = {
        'repository': [],
        'module': [],
        'class': [],
        'function': [],
        'method': [],
        'route': [],
        'external_class': []
      };
      
      nodes.forEach(node => {
        const type = node.type || 'module';
        if (layers[type]) {
          layers[type].push(node);
        } else {
          layers['module'].push(node);
        }
      });

      const activeLayers = Object.keys(layers).filter(l => layers[l].length > 0);
      const heightGap = 450 / (activeLayers.length || 1);
      
      activeLayers.forEach((layerKey, layerIdx) => {
        const layerNodes = layers[layerKey];
        const widthGap = 750 / (layerNodes.length + 1);
        const y = 50 + layerIdx * heightGap;
        
        layerNodes.forEach((node, nodeIdx) => {
          coords[node.id] = {
            x: (nodeIdx + 1) * widthGap,
            y: y
          };
        });
      });
    } else {
      // Force-Directed Spring Embedder Layout
      nodes.forEach(node => {
        let hash = 0;
        for (let i = 0; i < node.id.length; i++) {
          hash = node.id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const seedX = 150 + (Math.abs(hash % 500));
        const seedY = 100 + (Math.abs((hash >> 8) % 350));
        coords[node.id] = { x: seedX, y: seedY };
      });

      const k = Math.sqrt((width * height) / (nodes.length || 1)) || 45;
      const iterations = 70;

      for (let iter = 0; iter < iterations; iter++) {
        const fRep = {};
        nodes.forEach(n1 => {
          fRep[n1.id] = { x: 0, y: 0 };
          nodes.forEach(n2 => {
            if (n1.id === n2.id) return;
            const dx = coords[n1.id].x - coords[n2.id].x;
            const dy = coords[n1.id].y - coords[n2.id].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 220) {
              const force = (k * k) / dist;
              fRep[n1.id].x += (dx / dist) * force;
              fRep[n1.id].y += (dy / dist) * force;
            }
          });
        });

        const fAtt = {};
        nodes.forEach(n => { fAtt[n.id] = { x: 0, y: 0 }; });
        edges.forEach(edge => {
          const from = coords[edge.source];
          const to = coords[edge.target];
          if (!from || !to) return;
          const dx = from.x - to.x;
          const dy = from.y - to.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist * dist) / k;
          fAtt[edge.source].x -= (dx / dist) * force;
          fAtt[edge.source].y -= (dy / dist) * force;
          fAtt[edge.target].x += (dx / dist) * force;
          fAtt[edge.target].y += (dy / dist) * force;
        });

        nodes.forEach(node => {
          const pos = coords[node.id];
          const fx = fRep[node.id].x + fAtt[node.id].x;
          const fy = fRep[node.id].y + fAtt[node.id].y;
          const mag = Math.sqrt(fx * fx + fy * fy) || 1;
          const disp = Math.min(mag, 8);
          pos.x += (fx / mag) * disp;
          pos.y += (fy / mag) * disp;
          
          pos.x = Math.max(30, Math.min(width - 30, pos.x));
          pos.y = Math.max(30, Math.min(height - 30, pos.y));
        });
      }
    }

    return coords;
  }, [nodes, edges, layout]);

  // Sync calculated positions to local state on layout changes
  useEffect(() => {
    setNodePositions(calculatedCoordinates);
  }, [calculatedCoordinates]);

  // Camera action listeners
  const handleFitView = () => {
    const keys = Object.keys(nodePositions);
    if (keys.length === 0) return;
    
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    keys.forEach(id => {
      const pos = nodePositions[id];
      if (!pos) return;
      if (pos.x < minX) minX = pos.x;
      if (pos.x > maxX) maxX = pos.x;
      if (pos.y < minY) minY = pos.y;
      if (pos.y > maxY) maxY = pos.y;
    });
    
    const padding = 80;
    const graphWidth = maxX - minX || 1;
    const graphHeight = maxY - minY || 1;
    
    const containerWidth = containerRef.current?.clientWidth || 800;
    const containerHeight = containerRef.current?.clientHeight || 550;
    
    const zoomX = (containerWidth - padding * 2) / graphWidth;
    const zoomY = (containerHeight - padding * 2) / graphHeight;
    const nextZoom = Math.max(0.2, Math.min(2.5, Math.min(zoomX, zoomY)));
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    setCamera({
      x: containerWidth / 2 - centerX * nextZoom,
      y: containerHeight / 2 - centerY * nextZoom,
      zoom: nextZoom
    });
  };

  const handleCenterSelection = () => {
    if (!selectedNode) return;
    const pos = nodePositions[selectedNode.id];
    if (!pos) return;
    
    const containerWidth = containerRef.current?.clientWidth || 800;
    const containerHeight = containerRef.current?.clientHeight || 550;
    
    setCamera({
      x: containerWidth / 2 - pos.x * camera.zoom,
      y: containerHeight / 2 - pos.y * camera.zoom,
      zoom: camera.zoom
    });
  };

  useEffect(() => {
    if (fitViewTrigger > 0) {
      handleFitView();
    }
  }, [fitViewTrigger, nodePositions]);

  useEffect(() => {
    if (centerSelectionTrigger > 0) {
      handleCenterSelection();
    }
  }, [centerSelectionTrigger]);

  // SVG Event handlers (Pan & Zoom)
  const handleMouseDown = (e) => {
    if (e.button === 0) { // Left Click
      setIsPanning(true);
      setPanStart({ x: e.clientX - camera.x, y: e.clientY - camera.y });
    }
    setContextMenu(null);
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setCamera(prev => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      }));
    } else if (draggedNode) {
      const dx = (e.clientX - dragStart.x) / camera.zoom;
      const dy = (e.clientY - dragStart.y) / camera.zoom;
      setNodePositions(prev => ({
        ...prev,
        [draggedNode]: {
          x: nodeStartPos.x + dx,
          y: nodeStartPos.y + dy
        }
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNode(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 1.08;
    const nextZoom = e.deltaY < 0 ? camera.zoom * zoomFactor : camera.zoom / zoomFactor;
    const clampedZoom = Math.max(0.15, Math.min(5, nextZoom));
    
    const rect = e.currentTarget.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;
    
    const dx = cursorX - camera.x;
    const dy = cursorY - camera.y;
    
    setCamera({
      x: cursorX - dx * (clampedZoom / camera.zoom),
      y: cursorY - dy * (clampedZoom / camera.zoom),
      zoom: clampedZoom
    });
  };

  // Node Drag handlers
  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    if (e.button === 0) {
      setDraggedNode(nodeId);
      setDragStart({ x: e.clientX, y: e.clientY });
      setNodeStartPos({ ...nodePositions[nodeId] });
    }
    setContextMenu(null);
  };

  const handleNodeContextMenu = (e, node) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    setContextMenu({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      nodeId: node.id,
      node: node
    });
  };

  // Neighborhood Highlight calculations
  const neighborIds = useMemo(() => {
    if (!hoveredNodeId) return null;
    const set = new Set([hoveredNodeId]);
    edges.forEach(edge => {
      if (edge.source === hoveredNodeId) set.add(edge.target);
      if (edge.target === hoveredNodeId) set.add(edge.source);
    });
    return set;
  }, [hoveredNodeId, edges]);

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden h-[550px] relative select-none cursor-grab active:cursor-grabbing"
      style={{ height: 'calc(100vh - 430px)', minHeight: '480px' }}
    >
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1.5px,transparent_1.5px),linear-gradient(to_bottom,#161b22_1.5px,transparent_1.5px)] bg-[size:32px_32px] pointer-events-none opacity-40 transition-transform" 
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
          transformOrigin: '0 0'
        }}
      />

      {/* SVG Canvas Viewport */}
      <svg className="w-full h-full relative z-10 pointer-events-none">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="24"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#30363d" />
          </marker>
        </defs>

        <g 
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
            transformOrigin: '0 0',
            transition: draggedNode ? 'none' : 'transform 0.1s ease-out'
          }}
          className="pointer-events-auto"
        >
          {/* Edges */}
          {edges.map((edge, idx) => {
            const from = nodePositions[edge.source];
            const to = nodePositions[edge.target];
            if (!from || !to) return null;

            const isSelected = selectedEdge && selectedEdge.id === edge.id;
            const isHighlighted = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);
            
            let isMuted = false;
            if (neighborIds) {
              isMuted = !neighborIds.has(edge.source) || !neighborIds.has(edge.target);
            }

            return (
              <g 
                key={edge.id || idx} 
                className="cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEdge && onSelectEdge(edge);
                }}
              >
                {/* Thick invisible line for easier edge clicking */}
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="transparent"
                  strokeWidth="8"
                />
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isSelected ? '#00f0ff' : isHighlighted ? '#00f0ff' : '#22303f'}
                  strokeWidth={isSelected ? 2 : isHighlighted ? 1.5 : 1}
                  strokeDasharray={edge.type === 'imports' ? '4 4' : '0'}
                  markerEnd="url(#arrow)"
                  className="transition-all duration-200"
                  opacity={isMuted ? 0.08 : 1}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const coord = nodePositions[node.id];
            if (!coord) return null;

            const isSelected = selectedNode && selectedNode.id === node.id;
            const nodeColor = getNodeColor(node.type);
            const r = getNodeRadius(node.type);
            const iconScale = getIconScale(node.type);
            
            let isMuted = false;
            if (neighborIds) {
              isMuted = !neighborIds.has(node.id);
            }

            return (
              <g
                key={node.id}
                transform={`translate(${coord.x}, ${coord.y})`}
                className="cursor-pointer group select-none"
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onContextMenu={(e) => handleNodeContextMenu(e, node)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onNodeAction && onNodeAction(node.id, 'expand');
                }}
                opacity={isMuted ? 0.15 : 1}
              >
                {/* Pulsing ring for selected active node */}
                {isSelected && (
                  <circle
                    r={r + 6}
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="1.5"
                    className="animate-ping opacity-35"
                  />
                )}
                
                {/* Node Circle base */}
                <circle
                  r={r}
                  fill="#0d1117"
                  stroke={isSelected ? '#00f0ff' : nodeColor}
                  strokeWidth={isSelected ? '2.5' : '2'}
                  className="transition-all duration-150 group-hover:scale-105"
                />

                {/* Node Vector Icon centered */}
                <g 
                  transform={`translate(-12, -12) scale(${iconScale})`} 
                  stroke={isSelected ? '#00f0ff' : nodeColor} 
                  fill="none"
                  strokeWidth="2.5"
                  className="pointer-events-none"
                >
                  {getNodeIcon(node.type)}
                </g>

                {/* Node label */}
                <text
                  y={r + 11}
                  fill={isSelected ? '#fff' : '#94a3b8'}
                  fontSize="8.5"
                  fontFamily="monospace"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)]"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Right Click Floating Context Menu */}
      {contextMenu && (
        <div 
          className="absolute bg-[#161b22]/95 border border-[#30363d] rounded-lg shadow-2xl py-1 z-50 font-mono text-[10px] min-w-[120px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseDown={(e) => e.stopPropagation()} // prevent pan on click
        >
          <button 
            onClick={() => {
              onNodeAction(contextMenu.nodeId, 'expand');
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#30363d] text-gray-300 hover:text-white cursor-pointer"
          >
            Expand Node
          </button>
          <button 
            onClick={() => {
              onNodeAction(contextMenu.nodeId, 'collapse');
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#30363d] text-gray-300 hover:text-white cursor-pointer border-b border-[#30363d]/40"
          >
            Collapse Node
          </button>
          <button 
            onClick={() => {
              // Center selection
              const pos = nodePositions[contextMenu.nodeId];
              if (pos) {
                const containerWidth = containerRef.current?.clientWidth || 800;
                const containerHeight = containerRef.current?.clientHeight || 550;
                setCamera({
                  x: containerWidth / 2 - pos.x * camera.zoom,
                  y: containerHeight / 2 - pos.y * camera.zoom,
                  zoom: camera.zoom
                });
              }
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#30363d] text-gray-300 hover:text-white cursor-pointer"
          >
            Center Camera
          </button>
          <button 
            onClick={() => {
              onNodeAction(contextMenu.nodeId, 'focus');
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#30363d] text-gray-300 hover:text-white cursor-pointer border-t border-[#30363d]/80"
          >
            Hide Unrelated
          </button>
        </div>
      )}

      {/* Floating Canvas controls helper */}
      <div className="absolute bottom-3 left-3 bg-[#0d1117]/85 border border-[#30363d] px-2 py-1 rounded text-[9px] font-mono text-gray-400 select-none z-20 pointer-events-none">
        🖱️ Drag empty space to Pan • Wheel to Zoom • Double click node to Expand • Right click for context menu
      </div>
    </div>
  );
}

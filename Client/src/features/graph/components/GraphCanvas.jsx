import React from 'react';

const getNodeColor = (type) => {
  switch (type) {
    case 'module':
      return '#00f0ff'; // cyan
    case 'class':
      return '#a855f7'; // purple
    case 'function':
      return '#10b981'; // green
    case 'method':
      return '#ec4899'; // pink
    case 'route':
      return '#f59e0b'; // orange
    case 'external_class':
      return '#64748b'; // gray
    default:
      return '#94a3b8';
  }
};

const getNodeIcon = (type) => {
  switch (type) {
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

export default function GraphCanvas({
  nodes = [],
  edges = [],
  selectedNode,
  onSelectNode,
  zoom,
  layout = 'Force-Directed',
  onSelectEdge
}) {
  const coordinates = React.useMemo(() => {
    const coords = {};
    if (!nodes || nodes.length === 0) return coords;

    const width = 600;
    const height = 400;

    if (layout === 'Circular') {
      const numNodes = nodes.length;
      const radius = 130;
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
      const heightGap = 280 / (activeLayers.length || 1);
      
      activeLayers.forEach((layerKey, layerIdx) => {
        const layerNodes = layers[layerKey];
        const widthGap = 550 / (layerNodes.length + 1);
        const y = 60 + layerIdx * heightGap;
        
        layerNodes.forEach((node, nodeIdx) => {
          coords[node.id] = {
            x: (nodeIdx + 1) * widthGap,
            y: y
          };
        });
      });
    } else {
      // Force-Directed Spring Embedder Layout
      // Seed positions deterministically using node id hashes for stable layout shifts
      nodes.forEach(node => {
        let hash = 0;
        for (let i = 0; i < node.id.length; i++) {
          hash = node.id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const seedX = 100 + (Math.abs(hash % 400));
        const seedY = 80 + (Math.abs((hash >> 8) % 240));
        coords[node.id] = { x: seedX, y: seedY };
      });

      const k = Math.sqrt((width * height) / (nodes.length || 1)) || 30;
      const iterations = 60;

      for (let iter = 0; iter < iterations; iter++) {
        const fRep = {};
        nodes.forEach(n1 => {
          fRep[n1.id] = { x: 0, y: 0 };
          nodes.forEach(n2 => {
            if (n1.id === n2.id) return;
            const dx = coords[n1.id].x - coords[n2.id].x;
            const dy = coords[n1.id].y - coords[n2.id].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 180) {
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

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden h-[420px] relative select-none">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      {/* Interactive SVG Canvas */}
      <svg
        className="w-full h-full"
        viewBox="0 0 600 400"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out',
        }}
      >
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

        {/* Draw Edges */}
        {edges.map((edge, idx) => {
          const from = coordinates[edge.source];
          const to = coordinates[edge.target];
          if (!from || !to) return null;

          const isHighlighted = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

          return (
            <g key={idx} className="cursor-pointer" onClick={() => onSelectEdge && onSelectEdge(edge)}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isHighlighted ? '#00f0ff' : '#22303f'}
                strokeWidth={isHighlighted ? 1.5 : 1}
                strokeDasharray={edge.type === 'imports' ? '4 4' : '0'}
                markerEnd="url(#arrow)"
                className="transition-colors duration-200"
              />
              {!isHighlighted && (
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 5}
                  fill="#475569"
                  fontSize="7"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {edge.type}
                </text>
              )}
            </g>
          );
        })}

        {/* Draw Nodes */}
        {nodes.map((node) => {
          const coord = coordinates[node.id];
          if (!coord) return null;

          const isSelected = selectedNode && selectedNode.id === node.id;
          const nodeColor = getNodeColor(node.type);

          return (
            <g
              key={node.id}
              transform={`translate(${coord.x}, ${coord.y})`}
              className="cursor-pointer group"
              onClick={() => onSelectNode(node)}
            >
              {/* Pulse effect for selected node */}
              {isSelected && (
                <circle
                  r="22"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="1.5"
                  className="animate-ping opacity-30"
                />
              )}
              
              {/* Base Circle background */}
              <circle
                r="13"
                fill="#0d1117"
                stroke={isSelected ? '#00f0ff' : nodeColor}
                strokeWidth={isSelected ? '2.5' : '2'}
                className="transition-all duration-150 group-hover:scale-105"
              />

              {/* Render vector path icon inside circle */}
              <g 
                transform="translate(-6, -6) scale(0.5)" 
                stroke={isSelected ? '#00f0ff' : nodeColor} 
                fill="none"
                strokeWidth="2.5"
              >
                {getNodeIcon(node.type)}
              </g>

              {/* Node label */}
              <text
                y="24"
                fill={isSelected ? '#fff' : '#94a3b8'}
                fontSize="8"
                fontFamily="monospace"
                fontWeight={isSelected ? 'bold' : 'normal'}
                textAnchor="middle"
                className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Canvas instruction overlay */}
      <div className="absolute bottom-3 left-3 bg-[#0d1117]/85 border border-[#30363d] px-2 py-1 rounded text-[10px] font-mono text-gray-400 select-none">
        💡 Hover or click nodes to inspect codebase relations
      </div>
    </div>
  );
}

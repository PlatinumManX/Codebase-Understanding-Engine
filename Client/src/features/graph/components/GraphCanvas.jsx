import React from 'react';

export default function GraphCanvas({
  nodes,
  edges,
  selectedNode,
  onSelectNode,
  zoom,
}) {
  const coordinates = {
    'api.router': { x: 80, y: 200 },
    'api.endpoints': { x: 180, y: 120 },
    'auth.controller': { x: 280, y: 150 },
    'auth.service': { x: 380, y: 200 },
    'auth.model': { x: 480, y: 120 },
    'utils.jwt': { x: 340, y: 50 },
    'utils.hash': { x: 480, y: 50 },
    'db.client': { x: 380, y: 320 },
    'db.config': { x: 480, y: 350 },
  };

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
        {/* Definition for Arrowheads */}
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="18"
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
            <g key={idx}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isHighlighted ? '#00f0ff' : '#22303f'}
                strokeWidth={isHighlighted ? 1.5 : 1}
                strokeDasharray={edge.type === 'include' ? '4 4' : '0'}
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
                  {edge.label}
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
                  r="16"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="1.5"
                  className="animate-ping opacity-30"
                />
              )}
              
              {/* Base Circle */}
              <circle
                r={isSelected ? "10" : "7"}
                fill="#0d1117"
                stroke={isSelected ? '#00f0ff' : node.color}
                strokeWidth={isSelected ? '2.5' : '2'}
                className="transition-all duration-150 group-hover:scale-110"
              />

              {/* Node label */}
              <text
                y={isSelected ? "20" : "16"}
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

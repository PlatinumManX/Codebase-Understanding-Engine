//import React
import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import dagre from 'cytoscape-dagre';

// Register layouts
if (!cytoscape.prototype.hasInitialised) {
  cytoscape.use(fcose);
  cytoscape.use(dagre);
  cytoscape.prototype.hasInitialised = true;
}

// Icon data URIs (Lucide icons rendered as white SVG, colored via styling or kept monochrome white/gray)
const ICONS = {
  repository: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%232563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>`,
  module: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%232563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>`,
  package: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%237c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  class: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%237c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
  function: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23006242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
  method: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23006242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>`,
  route: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>`,
  external: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23434655" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  unknown: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23737686" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
};

const COLORS = {
  repository: '#ffffff',
  package: '#ffffff',
  module: '#ffffff',
  class: '#ffffff',
  function: '#ffffff',
  method: '#ffffff',
  route: '#ffffff',
  external: '#ffffff',
  unknown: '#ffffff',
};

const BORDERS = {
  repository: '#2563eb',
  package: '#7c3aed',
  module: '#2563eb',
  class: '#7c3aed',
  function: '#006242',
  method: '#006242',
  route: '#f97316',
  external: '#737686',
  unknown: '#c3c6d7'
};

const SHAPES = {
  repository: 'roundrectangle',
  package: 'roundrectangle',
  module: 'roundrectangle',
  class: 'hexagon',
  function: 'roundrectangle',
  method: 'roundrectangle',
  route: 'diamond',
  external: 'roundrectangle',
  unknown: 'ellipse'
};

const SIZES = {
  repository: { width: 80, height: 80, font: 14 },
  package: { width: 70, height: 70, font: 12 },
  module: { width: 60, height: 60, font: 11 },
  class: { width: 55, height: 55, font: 10 },
  function: { width: 45, height: 45, font: 9 },
  method: { width: 40, height: 40, font: 9 },
  route: { width: 50, height: 50, font: 10 },
  external: { width: 50, height: 50, font: 10 },
  unknown: { width: 40, height: 40, font: 9 },
};

const STYLESHEET = [
  // Base Node Style
  {
    selector: 'node',
    style: {
      'label': 'data(label)',
      'background-color': '#ffffff',
      'border-width': 1.5,
      'border-color': (ele) => BORDERS[ele.data('type')] || BORDERS.unknown,
      'color': '#0b1c30',
      'font-weight': '600',
      'text-outline-width': 0,
      'font-family': 'Inter, sans-serif',
      'font-size': (ele) => SIZES[ele.data('type')]?.font || 11,
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': 6,
      'shape': (ele) => SHAPES[ele.data('type')] || 'ellipse',
      'width': (ele) => SIZES[ele.data('type')]?.width || 50,
      'height': (ele) => SIZES[ele.data('type')]?.height || 50,
      'shadow-blur': 4,
      'shadow-color': '#000000',
      'shadow-opacity': 0.04,
      'shadow-offset-x': 0,
      'shadow-offset-y': 2,
      'background-image': (ele) => ICONS[ele.data('type')] || ICONS.unknown,
      'background-width': '45%',
      'background-height': '45%',
      'background-image-opacity': 0.9,
      'transition-property': 'background-color, border-color, opacity, border-width, transform',
      'transition-duration': 200,
    }
  },
  // Label hiding logic for small nodes
  {
    selector: 'node[type = "function"], node[type = "method"]',
    style: {
      'min-zoomed-font-size': 7
    }
  },
  // Selected Node Style
  {
    selector: 'node:selected',
    style: {
      'border-color': '#06b6d4',
      'border-width': 3,
      'font-weight': 'bold',
      'text-background-color': '#e5eeff',
      'text-background-opacity': 0.9,
      'text-background-padding': 4,
      'text-background-shape': 'roundrectangle',
      'shadow-blur': 12,
      'shadow-color': '#06b6d4',
      'shadow-opacity': 0.25
    }
  },
  // Hovered Node
  {
    selector: 'node.hover',
    style: {
      'background-color': '#eff4ff',
      'border-color': '#2563eb',
      'border-width': 2.5
    }
  },
  // Muted Node (when another is highlighted)
  {
    selector: 'node.muted',
    style: {
      'opacity': 0.08
    }
  },
  // Highlighted Neighbor Node
  {
    selector: 'node.highlighted',
    style: {
      'border-color': '#06b6d4',
      'border-width': 2.5,
      'opacity': 1
    }
  },
  
  // Base Edge Style
  {
    selector: 'edge',
    style: {
      'width': 1.2,
      'line-color': '#c3c6d7',
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#cbd5e1',
      'arrow-scale': 1.1,
      'transition-property': 'line-color, target-arrow-color, width, opacity',
      'transition-duration': 200,
    }
  },
  // Edge Types
  {
    selector: 'edge[type = "imports"]',
    style: {
      'line-style': 'solid'
    }
  },
  {
    selector: 'edge[type = "depends_on"], edge[type = "dependencies"]',
    style: {
      'line-style': 'dashed'
    }
  },
  {
    selector: 'edge[type = "inherits"]',
    style: {
      'width': 2.2,
      'line-color': '#7c3aed',
      'target-arrow-color': '#7c3aed'
    }
  },
  {
    selector: 'edge[type = "calls"]',
    style: {
      'line-style': 'solid',
      'line-color': '#06b6d4',
      'target-arrow-color': '#06b6d4'
    }
  },
  {
    selector: 'edge[type = "defines_route"]',
    style: {
      'line-color': '#f97316',
      'target-arrow-color': '#f97316',
      'width': 1.8
    }
  },
  // Selected Edge
  {
    selector: 'edge:selected',
    style: {
      'line-color': '#06b6d4',
      'target-arrow-color': '#06b6d4',
      'width': 2.5
    }
  },
  // Highlighted Edge (when neighbor is selected)
  {
    selector: 'edge.highlighted',
    style: {
      'line-color': '#06b6d4',
      'target-arrow-color': '#06b6d4',
      'width': 2,
      'opacity': 1
    }
  },
  // Muted Edge
  {
    selector: 'edge.muted',
    style: {
      'opacity': 0.05
    }
  }
];

export default function GraphCanvas({
  nodes = [],
  edges = [],
  selectedNode,
  onSelectNode,
  layout = 'Force-Directed',
  onSelectEdge,
  selectedEdge,
  fitViewTrigger = 0,
  centerSelectionTrigger = 0,
  reloadTrigger = 0,
  onNodeAction
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  

  
  // Store latest callbacks to avoid re-binding or re-initializing
  const callbacksRef = useRef({ onSelectNode, onSelectEdge, onNodeAction });
  useEffect(() => {
    callbacksRef.current = { onSelectNode, onSelectEdge, onNodeAction };
  }, [onSelectNode, onSelectEdge, onNodeAction]);

  // Initialize Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;
    
    const cy = cytoscape({
      container: containerRef.current,
      style: STYLESHEET,
      wheelSensitivity: 0.8, // Doubled zoom speed (approx 4x original)
      minZoom: 0.1,
      maxZoom: 4,
    });
    
    cyRef.current = cy;
    
    // Event listeners
    cy.on('tap', 'node', (e) => {
      const nodeData = e.target.data();
      if (callbacksRef.current.onSelectNode) {
        callbacksRef.current.onSelectNode(nodeData.originalData);
      }
    });
    
    cy.on('tap', 'edge', (e) => {
      const edgeData = e.target.data();
      if (callbacksRef.current.onSelectEdge) {
        callbacksRef.current.onSelectEdge(edgeData.originalData);
      }
    });
    
    cy.on('tap', (e) => {
      if (e.target === cy) {
        if (callbacksRef.current.onSelectNode) callbacksRef.current.onSelectNode(null);
        if (callbacksRef.current.onSelectEdge) callbacksRef.current.onSelectEdge(null);
      }
    });
    
    // Double click / Double tap for expansion
    let lastTap = null;
    cy.on('tap', 'node', (e) => {
      const now = Date.now();
      if (lastTap && now - lastTap < 300) {
        // Double tap
        if (callbacksRef.current.onNodeAction) {
          callbacksRef.current.onNodeAction(e.target.id(), 'expand');
        }
      }
      lastTap = now;
    });
    
    // Hover effects
    cy.on('mouseover', 'node', (e) => {
      if (containerRef.current) containerRef.current.style.cursor = 'pointer';
      e.target.addClass('hover');
    });
    
    cy.on('mouseout', 'node', (e) => {
      if (containerRef.current) containerRef.current.style.cursor = 'grab';
      e.target.removeClass('hover');
    });
    
    // Context menu placeholder (right click)
    cy.on('cxttap', 'node', (e) => {
      if (callbacksRef.current.onNodeAction) {
        callbacksRef.current.onNodeAction(e.target.id(), 'expand');
      }
    });
    
    return () => {
      cy.destroy();
    };
  }, [reloadTrigger]); // Re-initialize completely only if reloadTrigger changes

  // Update Data and Layout
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    let topologyChanged = false;
    const currentLayoutName = cy.data('currentLayoutName');

    let isFreshLoad = false;
    
    cy.batch(() => {
      isFreshLoad = cy.elements().length === 0;
      
      const newIds = new Set();
      
      // Add or update nodes
      nodes.forEach(n => {
        const id = n.id;
        newIds.add(id);
        const existing = cy.getElementById(id);
        if (existing.length > 0) {
          existing.data({ label: n.label, type: n.type, originalData: n });
        } else {
          cy.add({ group: 'nodes', data: { id, label: n.label, type: n.type, originalData: n } });
          topologyChanged = true;
        }
      });

      // Add or update edges
      edges.forEach(e => {
        const id = e.id || `${e.source}-${e.target}-${e.type}`;
        newIds.add(id);
        const existing = cy.getElementById(id);
        if (existing.length > 0) {
          existing.data({ source: e.source, target: e.target, type: e.type, originalData: e });
        } else {
          cy.add({ group: 'edges', data: { id, source: e.source, target: e.target, type: e.type, originalData: e } });
          topologyChanged = true;
        }
      });

      // Remove obsolete elements
      cy.elements().forEach(el => {
        if (!newIds.has(el.id())) {
          cy.remove(el);
          topologyChanged = true;
        }
      });
    });

    // Only run layout if nodes/edges changed or layout mode changed
    if (topologyChanged || currentLayoutName !== layout) {
      cy.data('currentLayoutName', layout);
      
      const shouldFit = isFreshLoad || currentLayoutName !== layout;
      
      let layoutConfig;
      if (layout === 'Hierarchical' || layout === 'dagre' || layout === 'Tree') {
        layoutConfig = { 
          name: 'dagre',
          rankDir: 'TB',
          nodeSep: 60,
          edgeSep: 20,
          rankSep: 80,
          animate: true,
          animationDuration: 600,
          fit: shouldFit,
          padding: 50
        };
      } else if (layout === 'Circular') {
        layoutConfig = {
          name: 'circle',
          animate: true,
          animationDuration: 600,
          fit: shouldFit,
          padding: 50
        };
      } else {
        // Force-directed / fcose
        layoutConfig = {
          name: 'fcose',
          quality: 'default',
          randomize: false, // Prevents chaotic jumping, starts from current positions
          animate: true,
          animationDuration: 600,
          fit: shouldFit,
          padding: 50,
          nodeRepulsion: 4500,
          idealEdgeLength: 100,
          edgeElasticity: 0.45,
          gravity: 0.25,
          numIter: 2500,
          initialEnergyOnIncremental: 0.3
        };
      }
      
      // Small timeout ensures the DOM has painted the container dimensions
      setTimeout(() => {
        if (cyRef.current && !cyRef.current.destroyed()) {
          cyRef.current.layout(layoutConfig).run();
        }
      }, 50);
    }
  }, [nodes, edges, layout]);

  // Handle Selection Highlights
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    
    cy.elements().removeClass('selected highlighted muted');
    
    if (selectedNode) {
      const cyNode = cy.getElementById(selectedNode.id);
      if (cyNode.length) {
        cyNode.select();
        
        // Mute all
        cy.elements().addClass('muted');
        
        // Highlight node and its neighborhood
        cyNode.removeClass('muted');
        const neighborhood = cyNode.neighborhood();
        neighborhood.removeClass('muted').addClass('highlighted');
      }
    } else if (selectedEdge) {
      const cyEdge = cy.getElementById(selectedEdge.id || `${selectedEdge.source}-${selectedEdge.target}-${selectedEdge.type}`);
      if (cyEdge.length) {
        cyEdge.select();
        
        // Mute all
        cy.elements().addClass('muted');
        
        // Highlight edge and its connected nodes
        cyEdge.removeClass('muted').addClass('highlighted');
        cyEdge.connectedNodes().removeClass('muted').addClass('highlighted');
      }
    }
  }, [selectedNode, selectedEdge]);

  // Fit View
  useEffect(() => {
    const cy = cyRef.current;
    if (cy && fitViewTrigger > 0) {
      cy.animate({
        fit: {
          eles: cy.elements(),
          padding: 50
        },
        duration: 500,
        easing: 'ease-out-cubic'
      });
    }
  }, [fitViewTrigger]);

  // Center Selection
  useEffect(() => {
    const cy = cyRef.current;
    if (cy && centerSelectionTrigger > 0 && selectedNode) {
      const cyNode = cy.getElementById(selectedNode.id);
      if (cyNode.length) {
        cy.animate({
          center: {
            eles: cyNode
          },
          zoom: Math.max(cy.zoom(), 1.2), // Zoom in a bit if zoomed out
          duration: 500,
          easing: 'ease-out-cubic'
        });
      }
    }
  }, [centerSelectionTrigger, selectedNode]);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden h-[550px] relative">
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ height: 'calc(100vh - 430px)', minHeight: '480px' }}
      />
      
      {/* Floating helper */}
      <div className="absolute bottom-3 left-3 bg-white/90 border border-[#e2e8f0] px-3 py-1.5 rounded-md text-[10px] font-sans text-on-surface-variant font-semibold select-none z-20 pointer-events-none shadow-sm">
        🖱️ Drag canvas to pan • Wheel to zoom • Double click node to expand
      </div>
    </div>
  );
}

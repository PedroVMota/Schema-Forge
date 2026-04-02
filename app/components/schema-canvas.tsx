'use client'

import { useCallback, useMemo, useEffect, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  BackgroundVariant,
  ConnectionLineType,
} from '@xyflow/react'
import TableNode from './table-node'

interface SchemaCanvasProps {
  nodes: Node[]
  edges: Edge[]
  onConnect: (connection: Connection) => void
  onNodePositionChange: (nodeId: string, position: { x: number; y: number }) => void
  onEdgeDelete: (edgeId: string) => void
}

export default function SchemaCanvas({
  nodes: externalNodes,
  edges: externalEdges,
  onConnect,
  onNodePositionChange,
  onEdgeDelete,
}: SchemaCanvasProps) {
  const nodeTypes = useMemo(() => ({ tableNode: TableNode }), [])
  const [nodes, setNodes, onNodesChange] = useNodesState(externalNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(externalEdges)
  const prevNodesRef = useRef(externalNodes)
  const prevEdgesRef = useRef(externalEdges)

  useEffect(() => {
    if (prevNodesRef.current !== externalNodes) {
      setNodes(externalNodes)
      prevNodesRef.current = externalNodes
    }
  }, [externalNodes, setNodes])

  useEffect(() => {
    if (prevEdgesRef.current !== externalEdges) {
      setEdges(externalEdges)
      prevEdgesRef.current = externalEdges
    }
  }, [externalEdges, setEdges])

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes)
    for (const change of changes) {
      if (change.type === 'position' && change.dragging === false && change.position) {
        onNodePositionChange(change.id, change.position)
      }
    }
  }, [onNodesChange, onNodePositionChange])

  const handleConnect = useCallback((connection: Connection) => {
    onConnect(connection)
  }, [onConnect])

  const handleEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    for (const edge of deletedEdges) {
      onEdgeDelete(edge.id)
    }
  }, [onEdgeDelete])

  const onInit = useCallback((instance: { fitView: () => void }) => {
    setTimeout(() => instance.fitView(), 100)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onEdgesDelete={handleEdgesDelete}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: 'url(#edge-gradient)',
            strokeWidth: 2,
          },
        }}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{
          stroke: 'var(--t-conn-line)',
          strokeWidth: 2,
          strokeDasharray: '6 3',
        }}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode="Delete"
      >
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--t-edge-gradient-1)" />
              <stop offset="50%" stopColor="var(--t-edge-gradient-2)" />
              <stop offset="100%" stopColor="var(--t-edge-gradient-3)" />
            </linearGradient>
          </defs>
        </svg>
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="var(--t-dots)"
        />
        <Controls position="bottom-right" />
        <MiniMap
          nodeColor={() => 'var(--t-primary)'}
          maskColor="var(--t-minimap-mask)"
          pannable
          zoomable
          position="bottom-right"
          style={{ marginBottom: 60 }}
        />
      </ReactFlow>
    </div>
  )
}

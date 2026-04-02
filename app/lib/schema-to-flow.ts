import type { Node, Edge } from '@xyflow/react'
import type { ParsedSchema, Table } from './types'

const NODE_WIDTH = 300
const NODE_HEIGHT_BASE = 80
const ROW_HEIGHT = 34
const GAP_X = 160
const GAP_Y = 100

const NODE_COLORS = ['purple', 'cyan', 'pink', 'emerald', 'amber']

function estimateNodeHeight(table: Table): number {
  return NODE_HEIGHT_BASE + table.columns.length * ROW_HEIGHT
}

/**
 * Topology-aware layout: places tables in layers based on FK dependency.
 * Root tables (no FKs) go in layer 0, tables referencing them in layer 1, etc.
 * Within each layer, tables are spread horizontally.
 */
function computePositions(schema: ParsedSchema): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>()
  const tableById = new Map(schema.tables.map(t => [t.id, t]))

  // Build dependency graph: child -> set of parent table IDs
  const parents = new Map<string, Set<string>>()
  const children = new Map<string, Set<string>>()
  for (const t of schema.tables) {
    parents.set(t.id, new Set())
    children.set(t.id, new Set())
  }
  for (const rel of schema.relations) {
    if (rel.from.tableId !== rel.to.tableId) {
      parents.get(rel.from.tableId)?.add(rel.to.tableId)
      children.get(rel.to.tableId)?.add(rel.from.tableId)
    }
  }

  // Assign layers via topological BFS (Kahn's algorithm)
  const layer = new Map<string, number>()
  const inDegree = new Map<string, number>()
  for (const t of schema.tables) {
    inDegree.set(t.id, parents.get(t.id)?.size ?? 0)
  }

  const queue: string[] = []
  for (const t of schema.tables) {
    if ((inDegree.get(t.id) ?? 0) === 0) {
      queue.push(t.id)
      layer.set(t.id, 0)
    }
  }

  while (queue.length > 0) {
    const id = queue.shift()!
    const currentLayer = layer.get(id) ?? 0
    for (const childId of children.get(id) ?? []) {
      const newLayer = currentLayer + 1
      layer.set(childId, Math.max(layer.get(childId) ?? 0, newLayer))
      const deg = (inDegree.get(childId) ?? 1) - 1
      inDegree.set(childId, deg)
      if (deg === 0) queue.push(childId)
    }
  }

  // Handle cycles: assign remaining tables to max layer + 1
  const maxLayer = Math.max(0, ...Array.from(layer.values()))
  for (const t of schema.tables) {
    if (!layer.has(t.id)) layer.set(t.id, maxLayer + 1)
  }

  // Group tables by layer
  const layers = new Map<number, string[]>()
  for (const t of schema.tables) {
    const l = layer.get(t.id) ?? 0
    if (!layers.has(l)) layers.set(l, [])
    layers.get(l)!.push(t.id)
  }

  // Sort layers by number
  const sortedLayerKeys = Array.from(layers.keys()).sort((a, b) => a - b)

  // Position: each layer is a row, tables spread horizontally centered
  let currentY = 0
  for (const layerKey of sortedLayerKeys) {
    const ids = layers.get(layerKey)!

    // Sort within layer: tables with more children first (more "important" center)
    ids.sort((a, b) => (children.get(b)?.size ?? 0) - (children.get(a)?.size ?? 0))

    const totalWidth = ids.length * NODE_WIDTH + (ids.length - 1) * GAP_X
    const startX = -totalWidth / 2

    let maxHeight = 0
    for (let i = 0; i < ids.length; i++) {
      const table = tableById.get(ids[i])
      if (!table) continue
      const x = startX + i * (NODE_WIDTH + GAP_X)
      positions.set(ids[i], { x, y: currentY })
      maxHeight = Math.max(maxHeight, estimateNodeHeight(table))
    }

    currentY += maxHeight + GAP_Y
  }

  return positions
}

export function schemaToFlow(schema: ParsedSchema): { nodes: Node[]; edges: Edge[] } {
  // Compute topology-aware positions for tables without saved positions
  const needsLayout = schema.tables.some(t => !t.position)
  const autoPositions = needsLayout ? computePositions(schema) : new Map()

  const nodes: Node[] = schema.tables.map((table, i) => {
    const position = table.position ?? autoPositions.get(table.id) ?? { x: i * (NODE_WIDTH + GAP_X), y: 0 }

    return {
      id: table.id,
      type: 'tableNode',
      position,
      data: {
        tableId: table.id,
        label: table.name,
        columns: table.columns,
        color: NODE_COLORS[i % NODE_COLORS.length],
      },
    }
  })

  const edges: Edge[] = schema.relations.map((rel) => ({
    id: rel.id,
    source: rel.from.tableId,
    sourceHandle: `${rel.from.columnId}-source`,
    target: rel.to.tableId,
    targetHandle: `${rel.to.columnId}-target`,
    type: 'smoothstep',
    animated: true,
    style: {
      stroke: 'url(#edge-gradient)',
      strokeWidth: 2,
    },
    labelStyle: { fill: 'var(--t-edge-label)', fontSize: 10, fontWeight: 500 },
    labelBgStyle: { fill: 'var(--t-edge-label-bg)', fillOpacity: 1 },
    labelBgPadding: [6, 4] as [number, number],
    labelBgBorderRadius: 6,
  }))

  return { nodes, edges }
}

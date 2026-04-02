import type { Node, Edge } from '@xyflow/react'
import type { ParsedSchema } from './types'

const GRID_COLS = 3
const NODE_WIDTH = 300
const NODE_HEIGHT_BASE = 60
const ROW_HEIGHT = 32
const GAP_X = 120
const GAP_Y = 100

const NODE_COLORS = ['purple', 'cyan', 'pink', 'emerald', 'amber']

export function schemaToFlow(schema: ParsedSchema): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = schema.tables.map((table, i) => {
    let position = table.position

    if (!position) {
      const col = i % GRID_COLS
      const prevTablesInCol = schema.tables
        .slice(0, i)
        .filter((_, idx) => idx % GRID_COLS === col)
      const yOffset = prevTablesInCol.reduce(
        (sum, t) => sum + NODE_HEIGHT_BASE + t.columns.length * ROW_HEIGHT + GAP_Y,
        0,
      )
      position = {
        x: col * (NODE_WIDTH + GAP_X),
        y: yOffset,
      }
    }

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
      filter: 'drop-shadow(0 0 4px rgba(108, 99, 255, 0.3))',
    },
    labelStyle: { fill: 'rgba(255, 255, 255, 0.45)', fontSize: 10, fontWeight: 500 },
    labelBgStyle: { fill: 'rgba(12, 13, 24, 0.85)', fillOpacity: 1 },
    labelBgPadding: [6, 4] as [number, number],
    labelBgBorderRadius: 6,
  }))

  return { nodes, edges }
}

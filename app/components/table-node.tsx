'use client'

import { memo, useState, useRef, useEffect, useCallback } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { Column } from '../lib/types'
import { IconTable, IconTrash, IconPlus } from './icons'
import ColumnEditor from './column-editor'

interface TableNodeData {
  tableId: string
  label: string
  columns: Column[]
  color: string
  onRenameTable: (tableId: string, name: string) => void
  onRemoveTable: (tableId: string) => void
  onAddColumn: (tableId: string) => void
  onUpdateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => void
  onRemoveColumn: (tableId: string, columnId: string) => void
  [key: string]: unknown
}

const COLORS: Record<string, { gradient: string; glow: string; handle: string }> = {
  purple: {
    gradient: 'linear-gradient(135deg, rgba(108, 99, 255, 0.9), rgba(90, 79, 255, 0.8))',
    glow: '0 0 30px rgba(108, 99, 255, 0.25)',
    handle: '#6c63ff',
  },
  cyan: {
    gradient: 'linear-gradient(135deg, rgba(0, 212, 255, 0.85), rgba(0, 180, 230, 0.75))',
    glow: '0 0 30px rgba(0, 212, 255, 0.2)',
    handle: '#00d4ff',
  },
  pink: {
    gradient: 'linear-gradient(135deg, rgba(255, 110, 199, 0.85), rgba(230, 80, 170, 0.75))',
    glow: '0 0 30px rgba(255, 110, 199, 0.2)',
    handle: '#ff6ec7',
  },
  emerald: {
    gradient: 'linear-gradient(135deg, rgba(52, 211, 153, 0.85), rgba(40, 190, 130, 0.75))',
    glow: '0 0 30px rgba(52, 211, 153, 0.2)',
    handle: '#34d399',
  },
  amber: {
    gradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.85), rgba(230, 170, 20, 0.75))',
    glow: '0 0 30px rgba(251, 191, 36, 0.2)',
    handle: '#fbbf24',
  },
}

const HEADER_HEIGHT = 40
const ROW_HEIGHT = 34

function TableNode({ data }: NodeProps) {
  const {
    tableId,
    label,
    columns,
    color = 'purple',
    onRenameTable,
    onRemoveTable,
    onAddColumn,
    onUpdateColumn,
    onRemoveColumn,
  } = data as TableNodeData

  const palette = COLORS[color] || COLORS.purple
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(label)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setName(label) }, [label])
  useEffect(() => {
    if (editingName && nameRef.current) nameRef.current.focus()
  }, [editingName])

  const commitName = useCallback(() => {
    const trimmed = name.trim()
    if (trimmed && trimmed !== label) {
      onRenameTable(tableId, trimmed)
    } else {
      setName(label)
    }
    setEditingName(false)
  }, [name, label, tableId, onRenameTable])

  return (
    <div
      className="min-w-[280px] rounded-xl overflow-visible group/table"
      style={{
        background: 'var(--t-node-bg)',
        backdropFilter: 'var(--t-node-blur)',
        WebkitBackdropFilter: 'var(--t-node-blur)',
        border: '1px solid var(--t-node-border)',
        boxShadow: `${palette.glow}, var(--t-shadow), var(--t-node-inset)`,
      }}
    >
      {/* Header */}
      <div
        className="px-3 font-semibold text-[13px] tracking-wide rounded-t-xl flex items-center gap-2 relative"
        style={{
          height: HEADER_HEIGHT,
          background: palette.gradient,
          borderBottom: '1px solid var(--t-header-border)',
          textShadow: 'var(--t-header-shadow)',
          color: 'var(--t-text-on-color)',
        }}
      >
        <IconTable size={14} className="opacity-70 shrink-0" />

        {editingName ? (
          <input
            ref={nameRef}
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => {
              if (e.key === 'Enter') commitName()
              if (e.key === 'Escape') { setName(label); setEditingName(false) }
              e.stopPropagation()
            }}
            onClick={e => e.stopPropagation()}
            className="flex-1 bg-white/10 rounded px-1.5 py-0.5 text-[13px] font-semibold text-white outline-none border border-white/20"
          />
        ) : (
          <span
            className="flex-1 cursor-text truncate rounded px-1 transition-colors"
            style={{ }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-name-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            onClick={(e) => { e.stopPropagation(); setEditingName(true) }}
          >
            {label}
          </span>
        )}

        <button
          className="w-6 h-6 flex items-center justify-center rounded-lg opacity-0 group-hover/table:opacity-100 transition-all duration-200 shrink-0"
          style={{ background: 'var(--t-delete-bg)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-delete-hover)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--t-delete-bg)' }}
          onClick={(e) => { e.stopPropagation(); onRemoveTable(tableId) }}
          title="Delete table"
        >
          <IconTrash size={12} />
        </button>
      </div>

      {/* Columns */}
      <div>
        {columns.map((col, i) => (
          <div
            key={col.id}
            className="group/row flex items-center gap-1 px-2.5 text-xs relative"
            style={{
              height: ROW_HEIGHT,
              borderBottom: i < columns.length - 1 ? `1px solid var(--t-row-border)` : 'none',
              background: col.isPrimaryKey
                ? 'var(--t-row-pk)'
                : col.isForeignKey
                  ? 'var(--t-row-fk)'
                  : 'transparent',
            }}
          >
            <Handle
              type="target"
              position={Position.Left}
              id={`${col.id}-target`}
              style={{
                top: '50%',
                left: -5,
                transform: 'translateY(-50%)',
                width: 10,
                height: 10,
                background: palette.handle,
                border: '2px solid var(--t-handle-ring)',
                boxShadow: `0 0 8px ${palette.handle}50`,
              }}
            />

            <ColumnEditor
              column={col}
              onUpdate={(updates) => onUpdateColumn(tableId, col.id, updates)}
              onRemove={() => onRemoveColumn(tableId, col.id)}
            />

            <Handle
              type="source"
              position={Position.Right}
              id={`${col.id}-source`}
              style={{
                top: '50%',
                right: -5,
                transform: 'translateY(-50%)',
                width: 10,
                height: 10,
                background: palette.handle,
                border: '2px solid var(--t-handle-ring)',
                boxShadow: `0 0 8px ${palette.handle}50`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Add column button */}
      <button
        className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium rounded-b-xl transition-all duration-200"
        style={{
          color: 'var(--t-text-3)',
          borderTop: '1px solid var(--t-row-border)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = palette.handle
          e.currentTarget.style.background = 'var(--t-hover-overlay)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'var(--t-text-3)'
          e.currentTarget.style.background = 'transparent'
        }}
        onClick={(e) => { e.stopPropagation(); onAddColumn(tableId) }}
      >
        <IconPlus size={12} />
        Add Column
      </button>
    </div>
  )
}

export default memo(TableNode)

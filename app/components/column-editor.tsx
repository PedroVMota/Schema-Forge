'use client'

import { useState, useRef, useEffect } from 'react'
import type { Column } from '../lib/types'
import { SQL_TYPES } from '../lib/types'

interface ColumnEditorProps {
  column: Column
  onUpdate: (updates: Partial<Column>) => void
  onRemove: () => void
}

export default function ColumnEditor({ column, onUpdate, onRemove }: ColumnEditorProps) {
  const [editingName, setEditingName] = useState(false)
  const [editingType, setEditingType] = useState(false)
  const [name, setName] = useState(column.name)
  const [type, setType] = useState(column.type)
  const [typeFilter, setTypeFilter] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)
  const typeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingName && nameRef.current) nameRef.current.focus()
  }, [editingName])

  useEffect(() => {
    if (editingType && typeRef.current) typeRef.current.focus()
  }, [editingType])

  const commitName = () => {
    const trimmed = name.trim()
    if (trimmed && trimmed !== column.name) {
      onUpdate({ name: trimmed })
    } else {
      setName(column.name)
    }
    setEditingName(false)
  }

  const commitType = (value?: string) => {
    const final = value || type.trim() || column.type
    if (final !== column.type) {
      onUpdate({ type: final.toUpperCase() })
    }
    setType(final.toUpperCase())
    setEditingType(false)
    setTypeFilter('')
  }

  const filteredTypes = SQL_TYPES.filter(t =>
    t.toLowerCase().includes(typeFilter.toLowerCase()),
  )

  return (
    <div className="flex items-center gap-1.5 flex-1 min-w-0">
      {/* PK / FK badge */}
      {column.isForeignKey ? (
        <span
          className="w-5 h-5 flex items-center justify-center rounded text-[9px] font-bold shrink-0"
          style={{
            background: 'var(--t-fk-bg)',
            color: 'var(--t-fk-color)',
            border: '1px solid var(--t-fk-border)',
          }}
          title="Foreign Key"
        >
          FK
        </span>
      ) : (
        <button
          className="w-5 h-5 flex items-center justify-center rounded text-[9px] font-bold shrink-0 transition-all duration-150"
          style={{
            background: column.isPrimaryKey ? 'var(--t-pk-bg)' : 'transparent',
            color: column.isPrimaryKey ? 'var(--t-pk-color)' : 'var(--t-inactive)',
            border: column.isPrimaryKey ? '1px solid var(--t-pk-border)' : '1px solid transparent',
          }}
          onClick={(e) => { e.stopPropagation(); onUpdate({ isPrimaryKey: !column.isPrimaryKey, isNullable: column.isPrimaryKey ? column.isNullable : false }) }}
          title="Primary Key (one per table)"
        >
          PK
        </button>
      )}

      {/* Name */}
      {editingName ? (
        <input
          ref={nameRef}
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={commitName}
          onKeyDown={e => {
            if (e.key === 'Enter') commitName()
            if (e.key === 'Escape') { setName(column.name); setEditingName(false) }
            e.stopPropagation()
          }}
          onClick={e => e.stopPropagation()}
          className="glow-input flex-1 min-w-0 px-1.5 py-0.5 text-xs font-medium"
        />
      ) : (
        <span
          className="flex-1 min-w-0 truncate text-xs font-medium cursor-text px-0.5 rounded transition-colors"
          style={{ color: 'var(--t-text-1)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-row-hover)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          onClick={(e) => { e.stopPropagation(); setEditingName(true) }}
        >
          {column.name}
        </span>
      )}

      {/* Type */}
      <div className="relative shrink-0">
        {editingType ? (
          <div className="relative">
            <input
              ref={typeRef}
              value={typeFilter || type}
              onChange={e => { setTypeFilter(e.target.value); setType(e.target.value) }}
              onBlur={() => setTimeout(() => commitType(), 150)}
              onKeyDown={e => {
                if (e.key === 'Enter') commitType()
                if (e.key === 'Escape') { setType(column.type); setEditingType(false); setTypeFilter('') }
                e.stopPropagation()
              }}
              onClick={e => e.stopPropagation()}
              className="glow-input w-[110px] px-1.5 py-0.5 text-[10px] font-mono"
            />
            {filteredTypes.length > 0 && typeFilter && (
              <div
                className="absolute top-full left-0 mt-1 w-[130px] max-h-[140px] overflow-y-auto rounded-lg z-50 py-1"
                style={{
                  background: 'var(--t-dropdown-bg)',
                  backdropFilter: 'var(--t-blur)',
                  border: '1px solid var(--t-panel-border)',
                  boxShadow: 'var(--t-shadow)',
                }}
              >
                {filteredTypes.slice(0, 8).map(t => (
                  <button
                    key={t}
                    className="w-full text-left px-2.5 py-1 text-[10px] font-mono transition-colors"
                    style={{ color: 'var(--t-text-2)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-hover-overlay)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    onMouseDown={e => { e.preventDefault(); commitType(t) }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <span
            className="font-mono cursor-pointer rounded-md px-1.5 py-0.5 transition-colors"
            style={{
              fontSize: '10px',
              color: 'var(--t-type-color)',
              background: 'var(--t-type-bg)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-row-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--t-type-bg)' }}
            onClick={(e) => { e.stopPropagation(); setTypeFilter(''); setEditingType(true) }}
          >
            {column.type}
          </span>
        )}
      </div>

      {/* NN toggle */}
      <button
        className="shrink-0 rounded px-1 py-0.5 text-[9px] font-bold transition-all duration-150"
        style={{
          color: !column.isNullable ? 'var(--t-nn-color)' : 'var(--t-inactive)',
          background: !column.isNullable ? 'var(--t-nn-bg)' : 'transparent',
        }}
        onClick={(e) => { e.stopPropagation(); onUpdate({ isNullable: !column.isNullable }) }}
        title="NOT NULL"
      >
        NN
      </button>

      {/* UQ toggle */}
      <button
        className="shrink-0 rounded px-1 py-0.5 text-[9px] font-bold transition-all duration-150"
        style={{
          color: column.isUnique ? 'var(--t-uq-color)' : 'var(--t-inactive)',
          background: column.isUnique ? 'var(--t-uq-bg)' : 'transparent',
        }}
        onClick={(e) => { e.stopPropagation(); onUpdate({ isUnique: !column.isUnique }) }}
        title="UNIQUE"
      >
        UQ
      </button>

      {/* Delete */}
      <button
        className="shrink-0 w-5 h-5 flex items-center justify-center rounded opacity-0 group-hover/row:opacity-100 transition-all duration-150"
        style={{ color: 'var(--t-text-3)' }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--t-danger)'; e.currentTarget.style.background = 'var(--t-nn-bg)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--t-text-3)'; e.currentTarget.style.background = 'transparent' }}
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        title="Remove column"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

'use client'

import { useState } from 'react'
import type { ThemeId, CustomColors } from '../hooks/use-theme'
import ThemeSwitcher from './theme-switcher'

interface CanvasToolbarProps {
  onAddTable: (name: string) => void
  onToggleSQL: () => void
  onExportSQL: () => void
  onImportPrisma: () => void
  tableCount: number
  relationCount: number
  theme: ThemeId
  onThemeChange: (id: ThemeId) => void
  colors: CustomColors
  onColorsChange: (colors: CustomColors) => void
  onColorsReset: () => void
}

export default function CanvasToolbar({
  onAddTable,
  onToggleSQL,
  onExportSQL,
  tableCount,
  relationCount,
  onImportPrisma,
  colors,
  onColorsChange,
  onColorsReset,
  theme,
  onThemeChange,
}: CanvasToolbarProps) {
  const [showInput, setShowInput] = useState(false)
  const [tableName, setTableName] = useState('')

  const handleAdd = () => {
    const name = tableName.trim()
    if (!name) return
    onAddTable(name)
    setTableName('')
    setShowInput(false)
  }

  return (
    <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
      {(tableCount > 0 || relationCount > 0) && (
        <div className="glass-panel px-3 py-2 rounded-xl text-xs flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--t-stat-dot-1)', boxShadow: '0 0 6px var(--t-stat-dot-1)' }} />
            <span style={{ color: 'var(--t-text-2)' }}>{tableCount} tables</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--t-stat-dot-2)', boxShadow: '0 0 6px var(--t-stat-dot-2)' }} />
            <span style={{ color: 'var(--t-text-2)' }}>{relationCount} relations</span>
          </span>
        </div>
      )}

      {showInput ? (
        <div className="glass-panel rounded-xl px-3 py-2 flex items-center gap-2">
          <input
            value={tableName}
            onChange={e => setTableName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd()
              if (e.key === 'Escape') { setShowInput(false); setTableName('') }
            }}
            placeholder="Table name..."
            className="glow-input px-2.5 py-1.5 text-xs w-[140px]"
            autoFocus
          />
          <button onClick={handleAdd} className="btn-primary text-xs font-medium py-1.5 px-3 rounded-lg" style={{ color: 'var(--t-text-on-color)' }}>Add</button>
          <button
            onClick={() => { setShowInput(false); setTableName('') }}
            className="text-xs transition-colors"
            style={{ color: 'var(--t-text-3)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--t-text-1)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--t-text-3)' }}
          >
            &times;
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="btn-primary text-xs font-medium py-2 px-4 rounded-xl flex items-center gap-1.5"
          style={{ color: 'var(--t-text-on-color)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Table
        </button>
      )}

      <button
        onClick={onToggleSQL}
        className="glass-btn py-2 px-3 rounded-xl flex items-center gap-1.5 text-xs"
        style={{ color: 'var(--t-text-2)' }}
        title="Toggle SQL editor"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        SQL
      </button>

      <button
        onClick={onImportPrisma}
        className="glass-btn py-2 px-3 rounded-xl flex items-center gap-1.5 text-xs"
        style={{ color: 'var(--t-text-2)' }}
        title="Import Prisma schema"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        Prisma
      </button>

      <button
        onClick={onExportSQL}
        className="glass-btn py-2 px-3 rounded-xl flex items-center gap-1.5 text-xs"
        style={{ color: 'var(--t-text-2)' }}
        title="Copy SQL to clipboard"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        Copy
      </button>

      <ThemeSwitcher current={theme} onChange={onThemeChange} colors={colors} onColorsChange={onColorsChange} onColorsReset={onColorsReset} />
    </div>
  )
}

'use client'

import { useState } from 'react'
import type { ThemeId, CustomColors } from '../hooks/use-theme'
import { IconPlus, IconCode, IconPrisma, IconCopy } from './icons'
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
  onImportPrisma,
  tableCount,
  relationCount,
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
          <IconPlus size={14} />
          Add Table
        </button>
      )}

      <button onClick={onToggleSQL} className="glass-btn py-2 px-3 rounded-xl flex items-center gap-1.5 text-xs" style={{ color: 'var(--t-text-2)' }} title="Toggle SQL editor">
        <IconCode size={14} />
        SQL
      </button>

      <button onClick={onImportPrisma} className="glass-btn py-2 px-3 rounded-xl flex items-center gap-1.5 text-xs" style={{ color: 'var(--t-text-2)' }} title="Import Prisma schema">
        <IconPrisma size={14} />
        Prisma
      </button>

      <button onClick={onExportSQL} className="glass-btn py-2 px-3 rounded-xl flex items-center gap-1.5 text-xs" style={{ color: 'var(--t-text-2)' }} title="Copy SQL to clipboard">
        <IconCopy size={14} />
        Copy
      </button>

      <ThemeSwitcher current={theme} onChange={onThemeChange} colors={colors} onColorsChange={onColorsChange} onColorsReset={onColorsReset} />
    </div>
  )
}

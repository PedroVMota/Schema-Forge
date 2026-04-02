'use client'

import { useState, useEffect } from 'react'
import { SAMPLE_SQL } from '../lib/samples'
import { IconCode, IconClose } from './icons'
import { IconButton, PanelHeader } from './ui'

interface SQLEditorProps {
  generatedSQL: string
  onApplySQL: (sql: string) => void
  onClose: () => void
}

export default function SQLEditor({ generatedSQL, onApplySQL, onClose }: SQLEditorProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [editBuffer, setEditBuffer] = useState('')

  useEffect(() => {
    if (mode === 'view') setEditBuffer(generatedSQL)
  }, [generatedSQL, mode])

  const handleEnterEdit = () => { setEditBuffer(generatedSQL); setMode('edit') }
  const handleApply = () => { onApplySQL(editBuffer); setMode('view') }
  const handleCancel = () => { setEditBuffer(generatedSQL); setMode('view') }
  const handleLoadSample = () => { setEditBuffer(SAMPLE_SQL); setMode('edit') }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && mode === 'edit') {
      e.preventDefault()
      handleApply()
    }
  }

  const displaySQL = mode === 'view' ? generatedSQL : editBuffer

  return (
    <div className="glass-panel w-[380px] h-full flex flex-col" style={{ borderLeft: '1px solid var(--t-row-border)' }}>
      <PanelHeader
        icon={<IconCode size={14} />}
        title={`SQL ${mode === 'edit' ? '(editing)' : ''}`}
        trailing={
          <>
            <span
              className="text-[9px] font-medium px-2 py-0.5 rounded-full"
              style={{
                background: mode === 'edit' ? 'var(--t-mode-active-bg)' : 'var(--t-mode-inactive-bg)',
                color: mode === 'edit' ? 'var(--t-mode-active-color)' : 'var(--t-mode-inactive-color)',
              }}
            >
              {mode === 'view' ? 'READ' : 'EDIT'}
            </span>
            <IconButton title="Close" onClick={onClose}>
              <IconClose size={14} />
            </IconButton>
          </>
        }
      />

      <div className="flex gap-2 px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--t-row-border)' }}>
        {mode === 'view' ? (
          <>
            <button onClick={handleEnterEdit} className="btn-primary flex-1 text-sm font-medium py-2 px-4 rounded-lg" style={{ color: 'var(--t-text-on-color)' }}>Edit SQL</button>
            <button onClick={handleLoadSample} className="glass-btn text-sm py-2 px-3 rounded-lg" style={{ color: 'var(--t-text-2)' }}>Sample</button>
          </>
        ) : (
          <>
            <button onClick={handleApply} className="btn-primary flex-1 text-sm font-medium py-2 px-4 rounded-lg" style={{ color: 'var(--t-text-on-color)' }}>Apply</button>
            <button onClick={handleCancel} className="glass-btn text-sm py-2 px-3 rounded-lg" style={{ color: 'var(--t-text-2)' }}>Cancel</button>
          </>
        )}
      </div>

      <div className="flex-1 min-h-0 relative">
        <textarea
          value={displaySQL}
          onChange={e => { if (mode === 'edit') setEditBuffer(e.target.value) }}
          onKeyDown={handleKeyDown}
          readOnly={mode === 'view'}
          placeholder={mode === 'view' ? 'Add tables visually or edit SQL here...' : 'Paste your CREATE TABLE statements...'}
          className="w-full h-full bg-transparent text-xs font-mono p-4 resize-none outline-none block"
          style={{
            color: mode === 'view' ? 'var(--t-text-2)' : 'var(--t-text-1)',
            caretColor: 'var(--t-caret)',
            lineHeight: '1.7',
            cursor: mode === 'view' ? 'default' : 'text',
          }}
          spellCheck={false}
        />
        <div
          className="absolute inset-x-0 top-0 h-6 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, var(--t-grad-fade), transparent)' }}
        />
      </div>

      <div className="px-4 py-2 shrink-0 flex items-center justify-between" style={{ borderTop: '1px solid var(--t-row-border)' }}>
        <span className="text-[10px]" style={{ color: 'var(--t-text-3)' }}>
          {mode === 'edit' ? 'Ctrl+Enter to apply' : 'Auto-generated from schema'}
        </span>
        <span className="text-[10px] font-mono" style={{ color: 'var(--t-text-4)' }}>
          {displaySQL.split('\n').length} lines
        </span>
      </div>
    </div>
  )
}

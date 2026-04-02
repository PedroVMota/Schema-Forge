'use client'

import { useState, useEffect } from 'react'

const SAMPLE_SQL = `CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP
);

CREATE TABLE posts (
  id INT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  user_id INT NOT NULL,
  category_id INT,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE categories (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE comments (
  id INT PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`

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
      <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--t-row-border)' }}>
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--t-text-3)' }}>
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <h2 className="font-semibold text-xs uppercase tracking-widest" style={{ color: 'var(--t-text-2)' }}>
            SQL {mode === 'edit' ? '(editing)' : ''}
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[9px] font-medium px-2 py-0.5 rounded-full"
            style={{
              background: mode === 'edit' ? 'var(--t-mode-active-bg)' : 'var(--t-mode-inactive-bg)',
              color: mode === 'edit' ? 'var(--t-mode-active-color)' : 'var(--t-mode-inactive-color)',
            }}
          >
            {mode === 'view' ? 'READ' : 'EDIT'}
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-sm transition-all duration-200"
            style={{ color: 'var(--t-text-3)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-hover-overlay)'; e.currentTarget.style.color = 'var(--t-text-1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--t-text-3)' }}
            title="Close"
          >
            &times;
          </button>
        </div>
      </div>

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
          style={{ background: `linear-gradient(to bottom, var(--t-grad-fade), transparent)` }}
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

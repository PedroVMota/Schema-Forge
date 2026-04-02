'use client'

import { useState, useRef, useCallback } from 'react'
import { SAMPLE_PRISMA } from '../lib/samples'
import { IconPrisma, IconClose, IconUpload } from './icons'
import { IconButton } from './ui'

interface ImportPrismaModalProps {
  onImport: (schema: string) => void
  onClose: () => void
}

export default function ImportPrismaModal({ onImport, onClose }: ImportPrismaModalProps) {
  const [content, setContent] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (text) setContent(text)
    }
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleImport = () => {
    if (content.trim()) onImport(content)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[520px] max-h-[80vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: 'var(--t-panel)',
          backdropFilter: 'var(--t-blur)',
          border: '1px solid var(--t-panel-border)',
          boxShadow: 'var(--t-shadow), 0 0 80px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: '1px solid var(--t-row-border)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--t-primary-dim)' }}>
              <IconPrisma size={16} className="text-[var(--t-primary)]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--t-text-1)' }}>Import Prisma Schema</h2>
              <p className="text-[11px]" style={{ color: 'var(--t-text-3)' }}>Upload or paste a schema.prisma file</p>
            </div>
          </div>
          <IconButton title="Close" onClick={onClose}>
            <IconClose size={14} />
          </IconButton>
        </div>

        {/* Drop zone */}
        {!content && (
          <div
            className="mx-5 mt-4 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer"
            style={{
              borderColor: dragOver ? 'var(--t-primary)' : 'var(--t-input-border)',
              background: dragOver ? 'var(--t-primary-dim)' : 'var(--t-input-bg)',
            }}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2 py-8">
              <IconUpload size={24} strokeWidth={1.5} className="opacity-40" />
              <span className="text-xs font-medium" style={{ color: 'var(--t-text-2)' }}>
                Drop schema.prisma here or click to browse
              </span>
              <span className="text-[10px]" style={{ color: 'var(--t-text-3)' }}>
                .prisma files supported
              </span>
            </div>
            <input ref={fileRef} type="file" accept=".prisma,.txt" onChange={handleFileInput} className="hidden" />
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 min-h-0 px-5 py-3">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Or paste your Prisma schema here..."
            className="w-full h-[240px] rounded-xl text-xs font-mono p-4 resize-none outline-none"
            style={{
              background: 'var(--t-input-bg)',
              border: '1px solid var(--t-input-border)',
              color: 'var(--t-text-1)',
              caretColor: 'var(--t-caret)',
              lineHeight: '1.7',
            }}
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderTop: '1px solid var(--t-row-border)' }}>
          <button onClick={() => setContent(SAMPLE_PRISMA)} className="glass-btn text-xs py-2 px-3 rounded-lg" style={{ color: 'var(--t-text-2)' }}>
            Load Sample
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="glass-btn text-xs py-2 px-4 rounded-lg" style={{ color: 'var(--t-text-2)' }}>Cancel</button>
            <button
              onClick={handleImport}
              className="btn-primary text-xs font-medium py-2 px-5 rounded-lg flex items-center gap-1.5"
              style={{ color: 'var(--t-text-on-color)', opacity: content.trim() ? 1 : 0.5 }}
            >
              <IconPrisma size={14} />
              Import
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

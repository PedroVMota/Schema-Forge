'use client'

import { useState, useRef, useCallback } from 'react'

const SAMPLE_PRISMA = `model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
  role      String   @default("USER")
  posts     Post[]
  profile   Profile?
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  tags      Tag[]
  comments  Comment[]
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}

model Comment {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  content   String
  post      Post     @relation(fields: [postId], references: [id])
  postId    Int
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}`

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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal */}
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
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--t-primary-dim)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--t-primary)' }}>
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--t-text-1)' }}>Import Prisma Schema</h2>
              <p className="text-[11px]" style={{ color: 'var(--t-text-3)' }}>Upload or paste a schema.prisma file</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-xl transition-all duration-200"
            style={{ color: 'var(--t-text-3)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-hover-overlay)'; e.currentTarget.style.color = 'var(--t-text-1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--t-text-3)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--t-text-3)' }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-xs font-medium" style={{ color: 'var(--t-text-2)' }}>
                Drop schema.prisma here or click to browse
              </span>
              <span className="text-[10px]" style={{ color: 'var(--t-text-3)' }}>
                .prisma files supported
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".prisma,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        )}

        {/* Editor area */}
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
          <button
            onClick={() => setContent(SAMPLE_PRISMA)}
            className="glass-btn text-xs py-2 px-3 rounded-lg"
            style={{ color: 'var(--t-text-2)' }}
          >
            Load Sample
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="glass-btn text-xs py-2 px-4 rounded-lg"
              style={{ color: 'var(--t-text-2)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="btn-primary text-xs font-medium py-2 px-5 rounded-lg flex items-center gap-1.5"
              style={{ color: 'var(--t-text-on-color)', opacity: content.trim() ? 1 : 0.5 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              Import
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

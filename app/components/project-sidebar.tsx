'use client'

import { useState } from 'react'
import type { Project } from '../lib/types'

interface ProjectSidebarProps {
  projects: Project[]
  activeId: string | null
  onSwitch: (id: string) => void
  onAdd: (name: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
  onClose: () => void
}

export default function ProjectSidebar({
  projects,
  activeId,
  onSwitch,
  onAdd,
  onDelete,
  onRename,
  onClose,
}: ProjectSidebarProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleCreate = () => {
    const name = newName.trim()
    if (!name) return
    onAdd(name)
    setNewName('')
    setIsCreating(false)
  }

  const handleRename = (id: string) => {
    const name = editName.trim()
    if (!name) return
    onRename(id, name)
    setEditingId(null)
  }

  return (
    <div
      className="w-[240px] flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'var(--t-panel)',
        backdropFilter: 'var(--t-blur)',
        WebkitBackdropFilter: 'var(--t-blur)',
        border: '1px solid var(--t-panel-border)',
        boxShadow: 'var(--t-shadow)',
        maxHeight: 'calc(100vh - 32px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--t-primary)' }}>
            <path d="M3 7V5a2 2 0 012-2h4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2v-2" />
          </svg>
          <h2 className="font-semibold text-xs uppercase tracking-widest" style={{ color: 'var(--t-text-2)' }}>
            Projects
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCreating(true)}
            className="w-7 h-7 flex items-center justify-center rounded-xl text-sm transition-all duration-200"
            style={{ color: 'var(--t-primary)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-primary-dim)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            title="New project"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-xl text-sm transition-all duration-200"
            style={{ color: 'var(--t-text-3)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-hover-overlay)'; e.currentTarget.style.color = 'var(--t-text-1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--t-text-3)' }}
            title="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Create input */}
      {isCreating && (
        <div className="px-3 pb-2 shrink-0">
          <div className="flex gap-1.5">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCreate()
                if (e.key === 'Escape') { setIsCreating(false); setNewName('') }
              }}
              placeholder="Project name..."
              className="glow-input flex-1 px-3 py-1.5 text-xs"
              autoFocus
            />
            <button
              onClick={handleCreate}
              className="btn-primary w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
              style={{ color: 'var(--t-text-on-color)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="mx-3" style={{ borderTop: '1px solid var(--t-row-border)' }} />

      {/* Project list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 min-h-0">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--t-input-bg)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--t-text-3)' }}>
                <path d="M3 7V5a2 2 0 012-2h4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2v-2" />
              </svg>
            </div>
            <span className="text-[11px]" style={{ color: 'var(--t-text-3)' }}>No projects yet</span>
            <button
              onClick={() => setIsCreating(true)}
              className="text-[11px] font-medium px-3 py-1 rounded-lg transition-colors"
              style={{ color: 'var(--t-primary)', background: 'var(--t-primary-dim)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--t-active-bg)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--t-primary-dim)' }}
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {projects.map(project => {
              const isActive = project.id === activeId

              return (
                <div
                  key={project.id}
                  className="group flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl transition-all duration-200"
                  style={{
                    background: isActive ? 'var(--t-active-bg)' : 'transparent',
                  }}
                  onClick={() => onSwitch(project.id)}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'var(--t-hover-overlay)'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {/* Dot indicator */}
                  <div
                    className="w-2 h-2 rounded-full shrink-0 transition-all duration-200"
                    style={{
                      background: isActive ? 'var(--t-primary)' : 'var(--t-row-border)',
                      boxShadow: isActive ? '0 0 8px var(--t-primary)' : 'none',
                    }}
                  />

                  {editingId === project.id ? (
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRename(project.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      onBlur={() => handleRename(project.id)}
                      className="glow-input flex-1 px-2 py-0.5 text-xs"
                      autoFocus
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <div className="flex-1 min-w-0">
                      <span
                        className="block truncate text-xs font-medium"
                        style={{ color: isActive ? 'var(--t-primary)' : 'var(--t-text-1)' }}
                      >
                        {project.name}
                      </span>
                      <span className="block text-[10px] mt-0.5" style={{ color: 'var(--t-text-3)' }}>
                        {new Date(project.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={e => { e.stopPropagation(); setEditingId(project.id); setEditName(project.name) }}
                      className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors"
                      style={{ color: 'var(--t-text-3)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--t-text-1)'; e.currentTarget.style.background = 'var(--t-hover-overlay)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--t-text-3)'; e.currentTarget.style.background = 'transparent' }}
                      title="Rename"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); onDelete(project.id) }}
                      className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors"
                      style={{ color: 'var(--t-text-3)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--t-danger)'; e.currentTarget.style.background = 'var(--t-nn-bg)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--t-text-3)'; e.currentTarget.style.background = 'transparent' }}
                      title="Delete"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4h8v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer with count */}
      {projects.length > 0 && (
        <>
          <div className="mx-3" style={{ borderTop: '1px solid var(--t-row-border)' }} />
          <div className="px-4 py-2.5 shrink-0 flex items-center justify-between">
            <span className="text-[10px]" style={{ color: 'var(--t-text-3)' }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

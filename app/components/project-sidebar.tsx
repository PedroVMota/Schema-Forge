'use client'

import { useState } from 'react'
import type { Project } from '../lib/types'
import { IconPlus, IconClose, IconPencil, IconTrash, IconFolder, IconCheck } from './icons'
import { IconButton, PanelHeader, Divider } from './ui'

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
      <PanelHeader
        icon={<IconFolder size={14} />}
        title="Projects"
        trailing={
          <>
            <IconButton hover="primary" title="New project" onClick={() => setIsCreating(true)} style={{ color: 'var(--t-primary)' }}>
              <IconPlus size={14} strokeWidth={2.5} />
            </IconButton>
            <IconButton title="Close" onClick={onClose}>
              <IconClose size={14} />
            </IconButton>
          </>
        }
      />

      {isCreating && (
        <div className="px-3 pb-2 pt-2 shrink-0">
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
              <IconCheck size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      <Divider />

      <div className="flex-1 overflow-y-auto py-2 px-2 min-h-0">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--t-input-bg)' }}
            >
              <IconFolder size={20} strokeWidth={1.5} className="opacity-40" />
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
                  style={{ background: isActive ? 'var(--t-active-bg)' : 'transparent' }}
                  onClick={() => onSwitch(project.id)}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--t-hover-overlay)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
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
                      <span className="block truncate text-xs font-medium" style={{ color: isActive ? 'var(--t-primary)' : 'var(--t-text-1)' }}>
                        {project.name}
                      </span>
                      <span className="block text-[10px] mt-0.5" style={{ color: 'var(--t-text-3)' }}>
                        {new Date(project.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <IconButton size="sm" onClick={e => { e.stopPropagation(); setEditingId(project.id); setEditName(project.name) }} title="Rename">
                      <IconPencil size={11} />
                    </IconButton>
                    <IconButton size="sm" hover="danger" onClick={e => { e.stopPropagation(); onDelete(project.id) }} title="Delete">
                      <IconTrash size={11} />
                    </IconButton>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {projects.length > 0 && (
        <>
          <Divider />
          <div className="px-4 py-2.5 shrink-0">
            <span className="text-[10px]" style={{ color: 'var(--t-text-3)' }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

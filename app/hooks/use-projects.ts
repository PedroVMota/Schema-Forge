'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Project, ParsedSchema } from '../lib/types'
import { schemaToSQL } from '../lib/schema-to-sql'
import {
  loadProjects,
  saveProjects,
  getActiveProjectId,
  setActiveProjectId,
  createProject,
} from '../lib/storage'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const p = loadProjects()
    const id = getActiveProjectId()
    setProjects(p)
    setActiveId(id && p.find(proj => proj.id === id) ? id : p[0]?.id ?? null)
    setLoaded(true)
  }, [])

  const persist = useCallback((next: Project[], nextActiveId: string | null) => {
    setProjects(next)
    setActiveId(nextActiveId)
    saveProjects(next)
    setActiveProjectId(nextActiveId)
  }, [])

  const activeProject = projects.find(p => p.id === activeId) ?? null

  const addProject = useCallback((name: string, sql: string = '') => {
    const project = createProject(name, sql)
    const next = [...projects, project]
    persist(next, project.id)
    return project
  }, [projects, persist])

  const deleteProject = useCallback((id: string) => {
    const next = projects.filter(p => p.id !== id)
    const nextActive = activeId === id ? (next[0]?.id ?? null) : activeId
    persist(next, nextActive)
  }, [projects, activeId, persist])

  const updateSQL = useCallback((sql: string) => {
    if (!activeId) return
    const next = projects.map(p =>
      p.id === activeId ? { ...p, sql, updatedAt: Date.now() } : p,
    )
    persist(next, activeId)
  }, [projects, activeId, persist])

  const updateSchema = useCallback((schema: ParsedSchema) => {
    if (!activeId) return
    const sql = schemaToSQL(schema)
    const next = projects.map(p =>
      p.id === activeId ? { ...p, schema, sql, updatedAt: Date.now() } : p,
    )
    persist(next, activeId)
  }, [projects, activeId, persist])

  const renameProject = useCallback((id: string, name: string) => {
    const next = projects.map(p =>
      p.id === id ? { ...p, name, updatedAt: Date.now() } : p,
    )
    persist(next, activeId)
  }, [projects, activeId, persist])

  const switchProject = useCallback((id: string) => {
    setActiveId(id)
    setActiveProjectId(id)
  }, [])

  return {
    projects,
    activeProject,
    loaded,
    addProject,
    deleteProject,
    updateSQL,
    updateSchema,
    renameProject,
    switchProject,
  }
}

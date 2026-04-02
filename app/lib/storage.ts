import type { Project } from './types'

const STORAGE_KEY = 'sql-visualizer-projects'
const ACTIVE_KEY = 'sql-visualizer-active'

export function loadProjects(): Project[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const projects = JSON.parse(raw) as Project[]
    // Migrate legacy projects without schema field
    return projects.map(p => ({
      ...p,
      schema: p.schema ?? null,
    }))
  } catch {
    return []
  }
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function getActiveProjectId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACTIVE_KEY)
}

export function setActiveProjectId(id: string | null): void {
  if (id) {
    localStorage.setItem(ACTIVE_KEY, id)
  } else {
    localStorage.removeItem(ACTIVE_KEY)
  }
}

export function createProject(name: string, sql: string = ''): Project {
  return {
    id: crypto.randomUUID(),
    name,
    sql,
    schema: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

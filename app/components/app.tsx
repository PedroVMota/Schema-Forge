'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Connection } from '@xyflow/react'
import type { Column } from '../lib/types'
import { useProjects } from '../hooks/use-projects'
import { useSchema } from '../hooks/use-schema'
import { useTheme } from '../hooks/use-theme'
import { parseSQL } from '../lib/sql-parser'
import { parsePrismaSchema } from '../lib/prisma-parser'
import { schemaToSQL } from '../lib/schema-to-sql'
import { schemaToFlow } from '../lib/schema-to-flow'
import ProjectSidebar from './project-sidebar'
import SQLEditor from './sql-editor'
import SchemaCanvas from './schema-canvas'
import CanvasToolbar from './canvas-toolbar'
import ThemeSwitcher from './theme-switcher'
import ImportPrismaModal from './import-prisma-modal'

export default function App() {
  const { theme, setTheme, colors, setColors, resetColors, loaded: themeLoaded } = useTheme()

  const {
    projects,
    activeProject,
    loaded,
    addProject,
    deleteProject,
    updateSchema: persistSchema,
    renameProject,
    switchProject,
  } = useProjects()

  const [showEditor, setShowEditor] = useState(false)
  const [showProjects, setShowProjects] = useState(true)
  const [showPrismaImport, setShowPrismaImport] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSchemaChange = useCallback((schema: Parameters<typeof persistSchema>[0]) => {
    persistSchema(schema)
  }, [persistSchema])

  const {
    schema,
    loadSchema,
    addTable,
    removeTable,
    renameTable,
    updateTablePosition,
    addColumn,
    removeColumn,
    updateColumn,
    addRelation,
    removeRelation,
  } = useSchema(activeProject?.schema ?? null, handleSchemaChange)

  const [prevActiveId, setPrevActiveId] = useState<string | null>(null)
  useEffect(() => {
    if (activeProject && activeProject.id !== prevActiveId) {
      if (activeProject.schema) {
        loadSchema(activeProject.schema)
      } else if (activeProject.sql) {
        try {
          const parsed = parseSQL(activeProject.sql)
          loadSchema(parsed)
        } catch {
          loadSchema({ tables: [], relations: [] })
        }
      } else {
        loadSchema({ tables: [], relations: [] })
      }
      setPrevActiveId(activeProject.id)
      setError(null)
    }
  }, [activeProject, prevActiveId, loadSchema])

  const flow = useMemo(() => schemaToFlow(schema), [schema])

  const nodesWithCallbacks = useMemo(() => {
    return flow.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onRenameTable: renameTable,
        onRemoveTable: removeTable,
        onAddColumn: addColumn,
        onUpdateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => updateColumn(tableId, columnId, updates),
        onRemoveColumn: removeColumn,
      },
    }))
  }, [flow.nodes, renameTable, removeTable, addColumn, updateColumn, removeColumn])

  const handleConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) return
    addRelation(
      { tableId: connection.source, columnId: connection.sourceHandle.replace('-source', '') },
      { tableId: connection.target, columnId: connection.targetHandle.replace('-target', '') },
    )
  }, [addRelation])

  const handleEdgeDelete = useCallback((edgeId: string) => { removeRelation(edgeId) }, [removeRelation])

  const handleApplySQL = useCallback((sql: string) => {
    try {
      const parsed = parseSQL(sql)
      if (parsed.tables.length === 0) { setError('No CREATE TABLE statements found'); return }
      loadSchema(parsed)
      setError(null)
    } catch { setError('Failed to parse SQL') }
  }, [loadSchema])

  const handleImportPrisma = useCallback((prismaSchema: string) => {
    try {
      const parsed = parsePrismaSchema(prismaSchema)
      if (parsed.tables.length === 0) { setError('No models found in Prisma schema'); return }
      loadSchema(parsed)
      setError(null)
      setShowPrismaImport(false)
    } catch { setError('Failed to parse Prisma schema') }
  }, [loadSchema])

  const handleAddTable = useCallback((name: string) => { addTable(name) }, [addTable])

  const handleExportSQL = useCallback(async () => {
    const sql = schemaToSQL(schema)
    await navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [schema])

  const handleSwitch = useCallback((id: string) => { switchProject(id) }, [switchProject])

  const generatedSQL = useMemo(() => schemaToSQL(schema), [schema])

  if (!loaded || !themeLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center relative z-10">
        <div className="flex items-center gap-3" style={{ color: 'var(--t-text-3)' }}>
          <div
            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--t-primary)', borderTopColor: 'transparent' }}
          />
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden z-10">
      {/* Canvas */}
      <div className="absolute inset-0">
        {schema.tables.length > 0 ? (
          <SchemaCanvas
            nodes={nodesWithCallbacks}
            edges={flow.edges}
            onConnect={handleConnect}
            onNodePositionChange={updateTablePosition}
            onEdgeDelete={handleEdgeDelete}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'var(--t-logo-gradient)',
                    boxShadow: 'var(--t-logo-shadow)',
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 3v18" />
                  </svg>
                </div>
              </div>
              <div>
                <h1
                  className="text-3xl font-bold tracking-tight mb-2"
                  style={{
                    background: 'var(--t-hero-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  SQL Visualizer
                </h1>
                <p style={{ color: 'var(--t-text-3)', fontSize: '14px' }}>
                  Add tables visually or import SQL to get started
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleAddTable('new_table')}
                  className="btn-primary text-sm font-medium py-2.5 px-5 rounded-xl flex items-center gap-2"
                  style={{ color: 'var(--t-text-on-color)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Table
                </button>
                <button
                  onClick={() => setShowEditor(true)}
                  className="glass-btn text-sm font-medium py-2.5 px-5 rounded-xl flex items-center gap-2"
                  style={{ color: 'var(--t-text-2)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  Import SQL
                </button>
                <button
                  onClick={() => setShowPrismaImport(true)}
                  className="glass-btn text-sm font-medium py-2.5 px-5 rounded-xl flex items-center gap-2"
                  style={{ color: 'var(--t-text-2)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  Import Prisma
                </button>
              </div>
              {/* Theme switcher on empty state */}
              <div className="flex justify-center pt-2">
                <ThemeSwitcher current={theme} onChange={setTheme} colors={colors} onColorsChange={setColors} onColorsReset={resetColors} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      {schema.tables.length > 0 && (
        <CanvasToolbar
          onAddTable={handleAddTable}
          onToggleSQL={() => setShowEditor(v => !v)}
          onExportSQL={handleExportSQL}
          onImportPrisma={() => setShowPrismaImport(true)}
          tableCount={schema.tables.length}
          relationCount={schema.relations.length}
          theme={theme}
          onThemeChange={setTheme}
          colors={colors}
          onColorsChange={setColors}
          onColorsReset={resetColors}
        />
      )}

      {/* Error toast */}
      {error && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-50 text-sm px-5 py-2.5 rounded-xl"
          style={{
            background: 'var(--t-error-bg)',
            backdropFilter: 'var(--t-blur)',
            border: '1px solid var(--t-error-border)',
            color: 'var(--t-danger)',
            boxShadow: 'var(--t-shadow)',
          }}
        >
          {error}
        </div>
      )}

      {/* Copied toast */}
      {copied && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-50 text-sm px-5 py-2.5 rounded-xl"
          style={{
            background: 'var(--t-success-bg)',
            backdropFilter: 'var(--t-blur)',
            border: '1px solid var(--t-success-border)',
            color: 'var(--t-success)',
            boxShadow: 'var(--t-shadow)',
          }}
        >
          SQL copied to clipboard
        </div>
      )}

      {/* Projects toggle */}
      {!showProjects && (
        <div className="absolute top-4 left-4 z-40">
          <button
            onClick={() => setShowProjects(true)}
            className="glass-btn px-4 py-2 rounded-xl text-xs font-medium"
            style={{ color: 'var(--t-text-2)' }}
          >
            Projects
          </button>
        </div>
      )}

      {/* Project island */}
      {showProjects && (
        <div className="absolute top-4 left-4 bottom-4 z-30 pointer-events-auto">
          <ProjectSidebar
            projects={projects}
            activeId={activeProject?.id ?? null}
            onSwitch={handleSwitch}
            onAdd={addProject}
            onDelete={deleteProject}
            onRename={renameProject}
            onClose={() => setShowProjects(false)}
          />
        </div>
      )}

      {/* SQL editor panel */}
      {showEditor && (
        <div className="absolute top-0 bottom-0 z-30 pointer-events-auto" style={{ left: showProjects ? 264 : 0 }}>
          <SQLEditor
            generatedSQL={generatedSQL}
            onApplySQL={handleApplySQL}
            onClose={() => setShowEditor(false)}
          />
        </div>
      )}

      {/* Prisma import modal */}
      {showPrismaImport && (
        <ImportPrismaModal
          onImport={handleImportPrisma}
          onClose={() => setShowPrismaImport(false)}
        />
      )}
    </div>
  )
}

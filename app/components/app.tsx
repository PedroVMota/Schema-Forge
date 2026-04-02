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
import { IconPlus, IconCode, IconPrisma, IconTable } from './icons'
import { Toast } from './ui'
import ProjectSidebar from './project-sidebar'
import SQLEditor from './sql-editor'
import SchemaCanvas from './schema-canvas'
import CanvasToolbar from './canvas-toolbar'
import ThemeSwitcher from './theme-switcher'
import ImportPrismaModal from './import-prisma-modal'

const EMPTY_SCHEMA = { tables: [], relations: [] }

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

  // Sync schema when switching projects
  const [prevActiveId, setPrevActiveId] = useState<string | null>(null)
  useEffect(() => {
    if (activeProject && activeProject.id !== prevActiveId) {
      if (activeProject.schema) {
        loadSchema(activeProject.schema)
      } else if (activeProject.sql) {
        try { loadSchema(parseSQL(activeProject.sql)) }
        catch { loadSchema(EMPTY_SCHEMA) }
      } else {
        loadSchema(EMPTY_SCHEMA)
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

  const handleEdgeDelete = useCallback((edgeId: string) => removeRelation(edgeId), [removeRelation])

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

  const handleAddTable = useCallback((name: string) => addTable(name), [addTable])

  const handleExportSQL = useCallback(async () => {
    await navigator.clipboard.writeText(schemaToSQL(schema))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [schema])

  const handleSwitch = useCallback((id: string) => switchProject(id), [switchProject])

  const generatedSQL = useMemo(() => schemaToSQL(schema), [schema])

  if (!loaded || !themeLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center relative z-10">
        <div className="flex items-center gap-3" style={{ color: 'var(--t-text-3)' }}>
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--t-primary)', borderTopColor: 'transparent' }} />
          Loading...
        </div>
      </div>
    )
  }

  const hasSchema = schema.tables.length > 0

  return (
    <div className="relative h-full w-full overflow-hidden z-10">
      {/* Canvas */}
      <div className="absolute inset-0">
        {hasSchema ? (
          <SchemaCanvas
            nodes={nodesWithCallbacks}
            edges={flow.edges}
            onConnect={handleConnect}
            onNodePositionChange={updateTablePosition}
            onEdgeDelete={handleEdgeDelete}
          />
        ) : (
          <EmptyState
            onAddTable={() => handleAddTable('new_table')}
            onImportSQL={() => setShowEditor(true)}
            onImportPrisma={() => setShowPrismaImport(true)}
            themeSwitcher={<ThemeSwitcher current={theme} onChange={setTheme} colors={colors} onColorsChange={setColors} onColorsReset={resetColors} />}
          />
        )}
      </div>

      {/* Toolbar */}
      {hasSchema && (
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

      {/* Toasts */}
      {error && <Toast message={error} variant="error" />}
      {copied && <Toast message="SQL copied to clipboard" variant="success" />}

      {/* Projects toggle */}
      {!showProjects && (
        <div className="absolute top-4 left-4 z-40">
          <button onClick={() => setShowProjects(true)} className="glass-btn px-4 py-2 rounded-xl text-xs font-medium" style={{ color: 'var(--t-text-2)' }}>
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
          <SQLEditor generatedSQL={generatedSQL} onApplySQL={handleApplySQL} onClose={() => setShowEditor(false)} />
        </div>
      )}

      {/* Prisma import modal */}
      {showPrismaImport && (
        <ImportPrismaModal onImport={handleImportPrisma} onClose={() => setShowPrismaImport(false)} />
      )}
    </div>
  )
}

/* ============================================================
 * EmptyState — extracted from inline JSX
 * ============================================================ */

function EmptyState({ onAddTable, onImportSQL, onImportPrisma, themeSwitcher }: {
  onAddTable: () => void
  onImportSQL: () => void
  onImportPrisma: () => void
  themeSwitcher: React.ReactNode
}) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--t-logo-gradient)', boxShadow: 'var(--t-logo-shadow)' }}
          >
            <IconTable size={28} strokeWidth={1.5} className="text-white" />
          </div>
        </div>
        <div>
          <h1
            className="text-3xl font-bold tracking-tight mb-2"
            style={{ background: 'var(--t-hero-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            SQL Visualizer
          </h1>
          <p style={{ color: 'var(--t-text-3)', fontSize: '14px' }}>
            Add tables visually or import SQL to get started
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button onClick={onAddTable} className="btn-primary text-sm font-medium py-2.5 px-5 rounded-xl flex items-center gap-2" style={{ color: 'var(--t-text-on-color)' }}>
            <IconPlus size={16} />
            Add Table
          </button>
          <button onClick={onImportSQL} className="glass-btn text-sm font-medium py-2.5 px-5 rounded-xl flex items-center gap-2" style={{ color: 'var(--t-text-2)' }}>
            <IconCode size={16} />
            Import SQL
          </button>
          <button onClick={onImportPrisma} className="glass-btn text-sm font-medium py-2.5 px-5 rounded-xl flex items-center gap-2" style={{ color: 'var(--t-text-2)' }}>
            <IconPrisma size={16} />
            Import Prisma
          </button>
        </div>
        <div className="flex justify-center pt-2">{themeSwitcher}</div>
      </div>
    </div>
  )
}

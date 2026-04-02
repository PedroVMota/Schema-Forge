'use client'

import { useState, useCallback } from 'react'
import type { ParsedSchema, Table, Column } from '../lib/types'

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function makeColumn(overrides: Partial<Column> = {}): Column {
  return {
    id: uid(),
    name: 'new_column',
    type: 'VARCHAR(255)',
    isPrimaryKey: false,
    isForeignKey: false,
    isNullable: true,
    isUnique: false,
    ...overrides,
  }
}

const EMPTY_SCHEMA: ParsedSchema = { tables: [], relations: [] }

export function useSchema(
  initial: ParsedSchema | null,
  onChange: (schema: ParsedSchema) => void,
) {
  const [schema, setSchemaState] = useState<ParsedSchema>(initial ?? EMPTY_SCHEMA)

  const update = useCallback((next: ParsedSchema) => {
    setSchemaState(next)
    onChange(next)
  }, [onChange])

  const loadSchema = useCallback((s: ParsedSchema) => {
    update(s)
  }, [update])

  // === Tables ===

  const addTable = useCallback((name: string, position?: { x: number; y: number }) => {
    const table: Table = {
      id: uid(),
      name,
      position: position ?? { x: 100 + schema.tables.length * 50, y: 100 + schema.tables.length * 50 },
      columns: [
        makeColumn({ name: 'id', type: 'INT', isPrimaryKey: true, isNullable: false }),
      ],
    }
    update({ ...schema, tables: [...schema.tables, table] })
    return table
  }, [schema, update])

  const removeTable = useCallback((tableId: string) => {
    update({
      tables: schema.tables.filter(t => t.id !== tableId),
      relations: schema.relations.filter(
        r => r.from.tableId !== tableId && r.to.tableId !== tableId,
      ),
    })
  }, [schema, update])

  const renameTable = useCallback((tableId: string, name: string) => {
    update({
      ...schema,
      tables: schema.tables.map(t =>
        t.id === tableId ? { ...t, name } : t,
      ),
    })
  }, [schema, update])

  const updateTablePosition = useCallback((tableId: string, position: { x: number; y: number }) => {
    update({
      ...schema,
      tables: schema.tables.map(t =>
        t.id === tableId ? { ...t, position } : t,
      ),
    })
  }, [schema, update])

  // === Columns ===

  const addColumn = useCallback((tableId: string) => {
    const col = makeColumn()
    update({
      ...schema,
      tables: schema.tables.map(t =>
        t.id === tableId ? { ...t, columns: [...t.columns, col] } : t,
      ),
    })
    return col
  }, [schema, update])

  const removeColumn = useCallback((tableId: string, columnId: string) => {
    update({
      tables: schema.tables.map(t =>
        t.id === tableId
          ? { ...t, columns: t.columns.filter(c => c.id !== columnId) }
          : t,
      ),
      relations: schema.relations.filter(
        r => !(
          (r.from.tableId === tableId && r.from.columnId === columnId) ||
          (r.to.tableId === tableId && r.to.columnId === columnId)
        ),
      ),
    })
  }, [schema, update])

  const updateColumn = useCallback((tableId: string, columnId: string, updates: Partial<Column>) => {
    update({
      ...schema,
      tables: schema.tables.map(t => {
        if (t.id !== tableId) return t
        // If setting this column as PK, clear PK from all others
        const clearOtherPKs = updates.isPrimaryKey === true
        return {
          ...t,
          columns: t.columns.map(c => {
            if (c.id === columnId) return { ...c, ...updates, id: c.id }
            if (clearOtherPKs && c.isPrimaryKey) return { ...c, isPrimaryKey: false }
            return c
          }),
        }
      }),
    })
  }, [schema, update])

  // === Relations ===

  const addRelation = useCallback((
    from: { tableId: string; columnId: string },
    to: { tableId: string; columnId: string },
  ) => {
    // Prevent duplicate
    const exists = schema.relations.some(
      r =>
        r.from.tableId === from.tableId &&
        r.from.columnId === from.columnId &&
        r.to.tableId === to.tableId &&
        r.to.columnId === to.columnId,
    )
    if (exists) return

    // Mark the source column as FK
    const updatedTables = schema.tables.map(t => {
      if (t.id === from.tableId) {
        return {
          ...t,
          columns: t.columns.map(c =>
            c.id === from.columnId
              ? { ...c, isForeignKey: true, references: { tableId: to.tableId, columnId: to.columnId } }
              : c,
          ),
        }
      }
      return t
    })

    update({
      tables: updatedTables,
      relations: [
        ...schema.relations,
        { id: uid(), from, to },
      ],
    })
  }, [schema, update])

  const removeRelation = useCallback((relationId: string) => {
    const rel = schema.relations.find(r => r.id === relationId)
    let tables = schema.tables
    if (rel) {
      tables = tables.map(t => {
        if (t.id === rel.from.tableId) {
          return {
            ...t,
            columns: t.columns.map(c =>
              c.id === rel.from.columnId
                ? { ...c, isForeignKey: false, references: undefined }
                : c,
            ),
          }
        }
        return t
      })
    }
    update({
      tables,
      relations: schema.relations.filter(r => r.id !== relationId),
    })
  }, [schema, update])

  return {
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
  }
}

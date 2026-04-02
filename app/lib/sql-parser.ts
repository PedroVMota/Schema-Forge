import type { Column, Table, Relation, ParsedSchema } from './types'

let _counter = 0
function uid(): string {
  return `${Date.now().toString(36)}-${(++_counter).toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function parseSQL(sql: string): ParsedSchema {
  const tables: Table[] = []
  const relations: Relation[] = []

  const cleaned = sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')

  const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"']?(\w+)[`"']?\s*\(([\s\S]*?)\)\s*;/gi
  let tableMatch: RegExpExecArray | null

  // First pass: create all tables with columns (no relations yet)
  const pendingRelations: {
    fromTable: string
    fromColumn: string
    toTable: string
    toColumn: string
  }[] = []

  while ((tableMatch = tableRegex.exec(cleaned)) !== null) {
    const tableName = tableMatch[1]
    const body = tableMatch[2]
    const columns: Column[] = []
    const tableId = uid()

    const pkColumns = extractPrimaryKeys(body)
    const uniqueColumns = extractUniqueConstraints(body)
    const fkConstraints = extractForeignKeys(body)

    for (const fk of fkConstraints) {
      pendingRelations.push({
        fromTable: tableName,
        fromColumn: fk.column,
        toTable: fk.refTable,
        toColumn: fk.refColumn,
      })
    }

    const lines = splitColumnDefs(body)

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      if (/^\s*(PRIMARY\s+KEY|UNIQUE|CONSTRAINT|FOREIGN\s+KEY|INDEX|KEY\s)/i.test(trimmed)) {
        continue
      }

      const col = parseColumnDef(trimmed, pkColumns, uniqueColumns, fkConstraints)
      if (col) {
        // Check inline REFERENCES
        const inlineRef = trimmed.match(/REFERENCES\s+[`"']?(\w+)[`"']?\s*\([`"']?(\w+)[`"']?\)/i)
        if (inlineRef && !fkConstraints.find(f => f.column === col.name)) {
          pendingRelations.push({
            fromTable: tableName,
            fromColumn: col.name,
            toTable: inlineRef[1],
            toColumn: inlineRef[2],
          })
          col.isForeignKey = true
        }
        columns.push(col)
      }
    }

    tables.push({ id: tableId, name: tableName, columns })
  }

  // Second pass: resolve relations using table/column IDs
  for (const pr of pendingRelations) {
    const fromTable = tables.find(t => t.name === pr.fromTable)
    const toTable = tables.find(t => t.name === pr.toTable)
    if (!fromTable || !toTable) continue

    const fromCol = fromTable.columns.find(c => c.name === pr.fromColumn)
    const toCol = toTable.columns.find(c => c.name === pr.toColumn)
    if (!fromCol || !toCol) continue

    fromCol.references = { tableId: toTable.id, columnId: toCol.id }

    relations.push({
      id: uid(),
      from: { tableId: fromTable.id, columnId: fromCol.id },
      to: { tableId: toTable.id, columnId: toCol.id },
    })
  }

  return { tables, relations }
}

function splitColumnDefs(body: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''

  for (const char of body) {
    if (char === '(') depth++
    if (char === ')') depth--
    if (char === ',' && depth === 0) {
      parts.push(current)
      current = ''
    } else {
      current += char
    }
  }
  if (current.trim()) parts.push(current)
  return parts
}

function extractPrimaryKeys(body: string): Set<string> {
  const pks = new Set<string>()
  const match = body.match(/PRIMARY\s+KEY\s*\(([^)]+)\)/i)
  if (match) {
    match[1].split(',').forEach(col => {
      pks.add(col.trim().replace(/[`"']/g, ''))
    })
  }
  return pks
}

function extractUniqueConstraints(body: string): Set<string> {
  const uniques = new Set<string>()
  const regex = /UNIQUE\s*\(([^)]+)\)/gi
  let match: RegExpExecArray | null
  while ((match = regex.exec(body)) !== null) {
    match[1].split(',').forEach(col => {
      uniques.add(col.trim().replace(/[`"']/g, ''))
    })
  }
  return uniques
}

interface FKConstraint {
  column: string
  refTable: string
  refColumn: string
}

function extractForeignKeys(body: string): FKConstraint[] {
  const fks: FKConstraint[] = []
  const regex = /FOREIGN\s+KEY\s*\([`"']?(\w+)[`"']?\)\s*REFERENCES\s+[`"']?(\w+)[`"']?\s*\([`"']?(\w+)[`"']?\)/gi
  let match: RegExpExecArray | null
  while ((match = regex.exec(body)) !== null) {
    fks.push({ column: match[1], refTable: match[2], refColumn: match[3] })
  }
  return fks
}

function parseColumnDef(
  line: string,
  pkColumns: Set<string>,
  uniqueColumns: Set<string>,
  fkConstraints: FKConstraint[],
): Column | null {
  const match = line.match(/^[`"']?(\w+)[`"']?\s+(\w+(?:\s*\([^)]*\))?(?:\s+\w+)*)/i)
  if (!match) return null

  const name = match[1]
  const rest = line.slice(match[1].length).trim()
  const typeMatch = rest.match(/^(\w+(?:\s*\([^)]*\))?)/i)
  const type = typeMatch ? typeMatch[1].toUpperCase() : 'UNKNOWN'

  const isPrimaryKey = pkColumns.has(name) || /PRIMARY\s+KEY/i.test(line)
  const isNullable = !/NOT\s+NULL/i.test(line)
  const isUnique = uniqueColumns.has(name) || /UNIQUE/i.test(line)

  const fk = fkConstraints.find(f => f.column === name)

  return {
    id: uid(),
    name,
    type,
    isPrimaryKey,
    isForeignKey: !!fk,
    isNullable,
    isUnique,
    references: undefined,
  }
}

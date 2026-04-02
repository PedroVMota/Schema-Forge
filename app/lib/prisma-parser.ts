import type { Column, Table, Relation, ParsedSchema } from './types'

let _counter = 0
function uid(): string {
  return `${Date.now().toString(36)}-${(++_counter).toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

const PRISMA_TYPE_MAP: Record<string, string> = {
  'String': 'VARCHAR(255)',
  'Int': 'INT',
  'BigInt': 'BIGINT',
  'Float': 'FLOAT',
  'Decimal': 'DECIMAL',
  'Boolean': 'BOOLEAN',
  'DateTime': 'TIMESTAMP',
  'Json': 'JSON',
  'Bytes': 'BYTEA',
}

interface PrismaField {
  name: string
  type: string
  isOptional: boolean
  isList: boolean
  attributes: string[]
  rawLine: string
}

interface PrismaModel {
  name: string
  fields: PrismaField[]
  blockAttributes: string[]
}

function parseModels(schema: string): PrismaModel[] {
  const models: PrismaModel[] = []
  // Remove comments
  const cleaned = schema
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')

  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g
  let match: RegExpExecArray | null

  while ((match = modelRegex.exec(cleaned)) !== null) {
    const name = match[1]
    const body = match[2]
    const fields: PrismaField[] = []
    const blockAttributes: string[] = []

    for (const line of body.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue

      // Block-level attributes like @@unique, @@id, @@map
      if (trimmed.startsWith('@@')) {
        blockAttributes.push(trimmed)
        continue
      }

      // Parse field: name Type? @attr1 @attr2
      const fieldMatch = trimmed.match(/^(\w+)\s+(\w+)(\[\])?\??(\[\])?\s*(.*)$/)
      if (!fieldMatch) continue

      const fieldName = fieldMatch[1]
      const fieldType = fieldMatch[2]
      const isList = !!(fieldMatch[3] || fieldMatch[4])
      const isOptional = trimmed.includes('?')
      const attrStr = fieldMatch[5] || ''

      // Extract attributes
      const attributes: string[] = []
      const attrRegex = /@(\w+)(?:\(([^)]*)\))?/g
      let attrMatch: RegExpExecArray | null
      while ((attrMatch = attrRegex.exec(attrStr)) !== null) {
        attributes.push(attrMatch[0])
      }

      fields.push({
        name: fieldName,
        type: fieldType,
        isOptional,
        isList,
        attributes,
        rawLine: trimmed,
      })
    }

    models.push({ name, fields, blockAttributes })
  }

  return models
}

function isScalarType(type: string): boolean {
  return type in PRISMA_TYPE_MAP || ['Enum'].includes(type)
}

function getRelationInfo(field: PrismaField): { fields: string[]; references: string[] } | null {
  for (const attr of field.attributes) {
    const relMatch = attr.match(/@relation\(([^)]*)\)/)
    if (relMatch) {
      const body = relMatch[1]
      const fieldsMatch = body.match(/fields:\s*\[([^\]]*)\]/)
      const refsMatch = body.match(/references:\s*\[([^\]]*)\]/)
      if (fieldsMatch && refsMatch) {
        return {
          fields: fieldsMatch[1].split(',').map(s => s.trim()),
          references: refsMatch[1].split(',').map(s => s.trim()),
        }
      }
    }
  }
  return null
}

export function parsePrismaSchema(schema: string): ParsedSchema {
  const models = parseModels(schema)
  const tables: Table[] = []
  const relations: Relation[] = []

  // First pass: create all tables with scalar columns
  const tableMap = new Map<string, Table>()
  const columnMap = new Map<string, Map<string, Column>>() // tableName -> (colName -> Column)

  for (const model of models) {
    const tableId = uid()
    const columns: Column[] = []
    const colNameToId = new Map<string, string>()

    for (const field of model.fields) {
      // Skip relation fields (type is another model name and no scalar mapping)
      const isRelation = models.some(m => m.name === field.type) || field.isList
      if (isRelation && !PRISMA_TYPE_MAP[field.type]) continue

      const colId = uid()
      const isPrimaryKey = field.attributes.some(a => a.startsWith('@id'))
      const isUnique = field.attributes.some(a => a.startsWith('@unique'))

      // Map Prisma type to SQL type
      let sqlType = PRISMA_TYPE_MAP[field.type] || field.type.toUpperCase()

      // Check for @db.* type override
      const dbAttr = field.attributes.find(a => a.startsWith('@db.'))
      if (dbAttr) {
        sqlType = dbAttr.replace('@db.', '').toUpperCase()
      }

      // Check for autoincrement
      if (field.attributes.some(a => a.includes('autoincrement'))) {
        sqlType = 'SERIAL'
      }

      const col: Column = {
        id: colId,
        name: field.name,
        type: sqlType,
        isPrimaryKey,
        isForeignKey: false,
        isNullable: field.isOptional,
        isUnique,
      }

      columns.push(col)
      colNameToId.set(field.name, colId)
    }

    const table: Table = { id: tableId, name: model.name, columns }
    tables.push(table)
    tableMap.set(model.name, table)

    const colMap = new Map<string, Column>()
    for (const col of columns) colMap.set(col.name, col)
    columnMap.set(model.name, colMap)
  }

  // Second pass: resolve relations
  for (const model of models) {
    for (const field of model.fields) {
      const relInfo = getRelationInfo(field)
      if (!relInfo) continue

      const fromTable = tableMap.get(model.name)
      const toTable = tableMap.get(field.type)
      if (!fromTable || !toTable) continue

      const fromColMap = columnMap.get(model.name)
      const toColMap = columnMap.get(field.type)
      if (!fromColMap || !toColMap) continue

      // For each field/reference pair
      for (let i = 0; i < relInfo.fields.length; i++) {
        const fromColName = relInfo.fields[i]
        const toColName = relInfo.references[i]

        const fromCol = fromColMap.get(fromColName)
        const toCol = toColMap.get(toColName)
        if (!fromCol || !toCol) continue

        // Mark as FK
        fromCol.isForeignKey = true
        fromCol.references = { tableId: toTable.id, columnId: toCol.id }

        relations.push({
          id: uid(),
          from: { tableId: fromTable.id, columnId: fromCol.id },
          to: { tableId: toTable.id, columnId: toCol.id },
        })
      }
    }
  }

  return { tables, relations }
}

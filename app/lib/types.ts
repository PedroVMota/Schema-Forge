export interface Column {
  id: string
  name: string
  type: string
  isPrimaryKey: boolean
  isForeignKey: boolean
  isNullable: boolean
  isUnique: boolean
  references?: {
    tableId: string
    columnId: string
  }
}

export interface Table {
  id: string
  name: string
  columns: Column[]
  position?: { x: number; y: number }
}

export interface Relation {
  id: string
  from: { tableId: string; columnId: string }
  to: { tableId: string; columnId: string }
}

export interface ParsedSchema {
  tables: Table[]
  relations: Relation[]
}

export interface Project {
  id: string
  name: string
  sql: string
  schema: ParsedSchema | null
  createdAt: number
  updatedAt: number
}

export const SQL_TYPES = [
  'INT',
  'BIGINT',
  'SMALLINT',
  'SERIAL',
  'FLOAT',
  'DOUBLE',
  'DECIMAL',
  'NUMERIC',
  'VARCHAR(255)',
  'VARCHAR(100)',
  'VARCHAR(50)',
  'CHAR(1)',
  'TEXT',
  'BOOLEAN',
  'DATE',
  'TIME',
  'TIMESTAMP',
  'DATETIME',
  'UUID',
  'JSON',
  'JSONB',
  'BLOB',
  'BYTEA',
] as const

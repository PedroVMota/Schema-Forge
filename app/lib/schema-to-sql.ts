import type { ParsedSchema } from './types'

export function schemaToSQL(schema: ParsedSchema): string {
  const lines: string[] = []

  for (const table of schema.tables) {
    const colDefs: string[] = []
    const constraints: string[] = []

    for (const col of table.columns) {
      let def = `  ${col.name} ${col.type}`
      if (col.isPrimaryKey) def += ' PRIMARY KEY'
      if (!col.isNullable && !col.isPrimaryKey) def += ' NOT NULL'
      if (col.isUnique && !col.isPrimaryKey) def += ' UNIQUE'
      colDefs.push(def)
    }

    // FK constraints
    for (const rel of schema.relations) {
      if (rel.from.tableId !== table.id) continue

      const fromCol = table.columns.find(c => c.id === rel.from.columnId)
      const toTable = schema.tables.find(t => t.id === rel.to.tableId)
      const toCol = toTable?.columns.find(c => c.id === rel.to.columnId)

      if (fromCol && toTable && toCol) {
        constraints.push(`  FOREIGN KEY (${fromCol.name}) REFERENCES ${toTable.name}(${toCol.name})`)
      }
    }

    const allDefs = [...colDefs, ...constraints]
    lines.push(`CREATE TABLE ${table.name} (`)
    lines.push(allDefs.join(',\n'))
    lines.push(');\n')
  }

  return lines.join('\n')
}

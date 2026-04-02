# Architecture

Technical overview for contributors who want to understand how Schema Forge works under the hood.

## Tech stack

| Technology | Purpose |
|-----------|---------|
| [Next.js](https://nextjs.org/) 16 | App framework (App Router) |
| [React](https://react.dev/) 19 | UI library |
| [TypeScript](https://www.typescriptlang.org/) 5 | Type safety |
| [@xyflow/react](https://reactflow.dev/) 12 | Interactive diagram canvas |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Styling |

## Zero-backend architecture

Schema Forge runs **entirely in the browser**. There are no API routes, no database, and no server-side state. All data is stored in `localStorage`.

```
Browser
  ├── React App
  │     ├── Components (UI)
  │     ├── Hooks (state management)
  │     └── Lib (parsers, utilities)
  └── localStorage (persistence)
```

## Data flow

```
SQL Input ──► sql-parser ──► ParsedSchema ──► schema-to-flow ──► Canvas (nodes/edges)
                                  │
Prisma Input ► prisma-parser ─────┘                │
                                              schema-to-sql ──► SQL Output
```

### Bidirectional conversion

- **SQL -> Schema**: `sql-parser.ts` parses CREATE TABLE statements into `ParsedSchema`
- **Prisma -> Schema**: `prisma-parser.ts` parses Prisma models into `ParsedSchema`
- **Schema -> SQL**: `schema-to-sql.ts` generates CREATE TABLE statements
- **Schema -> Canvas**: `schema-to-flow.ts` converts to @xyflow/react nodes and edges

Both parsers use a **two-pass approach**:
1. First pass: create all table and column definitions
2. Second pass: resolve foreign key relationships (requires all tables to exist)

## Data model

```typescript
interface Column {
  id: string
  name: string
  type: string
  isPrimaryKey: boolean
  isForeignKey: boolean
  isNullable: boolean
  isUnique: boolean
  references?: { tableId: string; columnId: string }
}

interface Table {
  id: string
  name: string
  columns: Column[]
  position?: { x: number; y: number }
}

interface Relation {
  id: string
  from: { tableId: string; columnId: string }
  to: { tableId: string; columnId: string }
}

interface ParsedSchema {
  tables: Table[]
  relations: Relation[]
}

interface Project {
  id: string
  name: string
  sql: string
  schema: ParsedSchema | null
  createdAt: number
  updatedAt: number
}
```

## Component hierarchy

```
layout.tsx
  └── page.tsx
        └── App (app.tsx) — central state orchestrator
              ├── ProjectSidebar — project CRUD
              ├── CanvasToolbar — top actions bar
              ├── SchemaCanvas — @xyflow/react canvas
              │     ├── TableNode — individual table
              │     │     └── ColumnEditor — column editing
              │     └── Edges — relationship lines
              ├── SqlEditor — SQL input/output panel
              ├── ImportPrismaModal — Prisma import dialog
              └── ThemeSwitcher — dark/light toggle
```

## Hooks

| Hook | Responsibility |
|------|---------------|
| `useProjects` | Project CRUD, active project switching, localStorage sync |
| `useSchema` | Schema mutations: add/remove/update tables, columns, relations |
| `useTheme` | Theme switching, custom color management |

## Styling

The theme system uses CSS custom properties (`--t-*` prefix) defined in `globals.css`. Two base themes (`glass-dark`, `glass-light`) are set via `data-theme` attribute on the root element, with 6 additional color scheme options.

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `pr-build-check.yml` | PR to `main` | Verify build passes |
| `version-and-release.yml` | `v*` tag push | Create GitHub Release + push Docker image to ghcr.io |

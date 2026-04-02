# Contributing

Thanks for your interest in contributing to Schema Forge! This guide will help you get started.

## Code of Conduct

Be respectful and constructive. We're all here to build something useful together.

## Getting started

### 1. Fork and clone

```bash
git clone https://github.com/<your-username>/Schema-Forge.git
cd Schema-Forge
npm ci
npm run dev
```

### 2. Create a branch

```bash
git checkout -b feat/your-feature-name
```

### Branch naming conventions

| Prefix | Purpose |
|--------|---------|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `docs/` | Documentation changes |
| `refactor/` | Code refactoring |
| `chore/` | Maintenance tasks |

### 3. Make your changes

Write your code following the project conventions:

- **TypeScript** — no `any` types without justification
- **Server components** by default, `"use client"` only when needed
- **Domain-based organization** — keep related code together
- Components should be under 300 lines

### 4. Verify your changes

Before pushing, make sure everything passes:

```bash
npm run lint
npm run build
```

### 5. Open a pull request

Push your branch and open a PR against `main`. The CI will automatically run a build check.

- Keep PRs focused — one feature or fix per PR
- Write a clear description of what changed and why
- Include screenshots if the change is visual

## Project structure

```
app/
  components/    # React components
  hooks/         # Custom React hooks
  lib/           # Parsers, types, utilities
  layout.tsx     # Root layout
  page.tsx       # Main page
  globals.css    # Theme tokens + styles
```

For a deeper dive, see [Architecture](./architecture.md).

## Where to contribute

### Good first issues

Check [issues labeled `good first issue`](https://github.com/PedroVMota/Schema-Forge/labels/good%20first%20issue) for beginner-friendly tasks.

### Feature ideas

- Enum type support
- Export to Prisma schema
- Export as PNG/SVG image
- Undo/redo support
- Shareable schema links
- More SQL dialects (MySQL, SQLite)

### Bug reports

[Open an issue](https://github.com/PedroVMota/Schema-Forge/issues/new) with:

1. What you expected to happen
2. What actually happened
3. Steps to reproduce
4. Browser and OS info

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

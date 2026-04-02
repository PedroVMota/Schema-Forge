# Schema Forge

> Visual database schema editor that runs entirely in your browser.

<!-- TODO: Add hero screenshot -->
![Schema Forge](./docs/assets/screenshots/overview.png)

Design database schemas visually — create tables, define columns, draw relationships, and export production-ready SQL. No sign-up, no backend, no data leaves your machine.

## Features

- **Visual canvas** — drag-and-drop tables with an interactive ERD editor
- **SQL import & export** — paste CREATE TABLE statements or export your design as SQL
- **Prisma import** — visualize Prisma schema files as diagrams
- **Multiple projects** — organize schemas with local persistence
- **Dark & light themes** — with 6 color schemes
- **Zero backend** — everything runs client-side in your browser

## Quick Start

### Use online

<!-- TODO: Add URL -->
Visit [schema-forge.example.com](#) — no installation needed.

### Run locally

```bash
git clone https://github.com/PedroVMota/Schema-Forge.git
cd Schema-Forge
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker

```bash
docker pull ghcr.io/pedrovmota/schema-forge:latest
docker run -p 3000:3000 ghcr.io/pedrovmota/schema-forge:latest
```

## Documentation

Full documentation is available in the [`docs/`](./docs/README.md) directory:

- [Introduction](./docs/introduction.md)
- [Getting Started](./docs/getting-started.md)
- [Features](./docs/features/README.md)
- [Self-Hosting](./docs/self-hosting.md)
- [Contributing](./docs/contributing.md)
- [Architecture](./docs/architecture.md)
- [FAQ](./docs/faq.md)

## Tech Stack

- [Next.js](https://nextjs.org/) 16 — App framework
- [React](https://react.dev/) 19 — UI library
- [@xyflow/react](https://reactflow.dev/) — Interactive diagrams
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) 4 — Styling

## Contributing

Contributions are welcome! See the [Contributing Guide](./docs/contributing.md) for details.

## License

<!-- TODO: Add license -->
See [LICENSE](./LICENSE) for details.

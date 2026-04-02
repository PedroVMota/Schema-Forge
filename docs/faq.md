# FAQ

## General

### Is Schema Forge free?

Yes. Schema Forge is free and open source.

### Where is my data stored?

All data is stored in your browser's `localStorage`. Nothing is sent to any server.

### Can I use Schema Forge offline?

Once the page is loaded, most features work offline since everything runs client-side. You'll need an internet connection for the initial page load.

### Will I lose my data if I clear my browser?

Yes. Clearing browser data (cookies, localStorage) will remove your projects. Export your SQL before clearing.

## Features

### Can I export my schema as an image?

Not yet — this is a planned feature. For now, you can use your browser's screenshot tool or a browser extension.

### Does it support MySQL / SQLite / SQL Server syntax?

Currently, Schema Forge generates PostgreSQL-style SQL. Support for other dialects is planned.

### Can I undo changes?

Undo/redo is not yet implemented. This is a planned feature.

### Can I share my schema with someone?

Currently there's no built-in sharing. You can export your SQL and share the text, or self-host an instance for your team.

## Troubleshooting

### My projects disappeared

This usually happens when browser data is cleared. Check that you're using the same browser and profile.

### The canvas is blank after importing SQL

Make sure your SQL contains valid `CREATE TABLE` statements. Check the browser console for parsing errors.

### Tables are overlapping after import

After importing, tables are auto-positioned. You can drag them to rearrange. Your layout is saved automatically.

## Contributing

### How can I contribute?

See the [Contributing Guide](./contributing.md) for details on setting up the project and submitting PRs.

### I found a bug — where do I report it?

[Open an issue on GitHub](https://github.com/PedroVMota/Schema-Forge/issues/new) with steps to reproduce the bug.

# Getting Started

Get up and running with Schema Forge in under a minute.

## Using the hosted version

<!-- TODO: Add URL -->
Visit [schema-forge.example.com](#) and start designing — no installation needed.

## Running locally

### Prerequisites

- [Node.js](https://nodejs.org/) 22 or later
- npm (comes with Node.js)

### Steps

```bash
# Clone the repository
git clone https://github.com/PedroVMota/Schema-Forge.git
cd Schema-Forge

# Install dependencies
npm ci

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Your first schema

### 1. Create a table

Click the **"Add Table"** button in the toolbar. A new table node appears on the canvas.

<!-- TODO: Add screenshot -->
![Add Table](./assets/screenshots/add-table.png)

### 2. Add columns

Click a table to expand it, then use the **"+"** button to add columns. Set the name, type, and constraints for each column.

<!-- TODO: Add screenshot -->
![Add Column](./assets/screenshots/add-column.png)

### 3. Define relationships

Connect two tables by dragging from a column handle on one table to a column on another. This creates a foreign key relationship.

<!-- TODO: Add screenshot -->
![Create Relationship](./assets/screenshots/create-relationship.png)

### 4. Export your SQL

Click the **"Export SQL"** button in the toolbar to copy the generated `CREATE TABLE` statements to your clipboard.

<!-- TODO: Add screenshot -->
![Export SQL](./assets/screenshots/export-sql.png)

## Importing an existing schema

Already have SQL or a Prisma schema? You can import it directly:

### Import SQL

1. Click the **SQL Editor** toggle in the toolbar
2. Paste your `CREATE TABLE` statements
3. Click **"Apply"**

### Import Prisma

1. Click the **"Import Prisma"** button in the toolbar
2. Paste your Prisma schema file contents
3. Click **"Import"**

<!-- TODO: Add screenshot -->
![Import Prisma](./assets/screenshots/import-prisma.png)

## Next steps

- [Explore all features](./features/README.md)
- [Self-host your own instance](./self-hosting.md)
- [Contribute to the project](./contributing.md)

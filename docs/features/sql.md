# SQL Import & Export

Schema Forge supports bidirectional conversion between visual schemas and SQL.

## Importing SQL

1. Click the **SQL Editor** toggle in the toolbar
2. Paste your `CREATE TABLE` statements into the editor
3. Click **"Apply"**

<!-- TODO: Add screenshot -->
![SQL Import](../assets/screenshots/sql-import.png)

### Supported SQL syntax

- `CREATE TABLE` statements
- Column definitions with types
- Inline constraints: `PRIMARY KEY`, `NOT NULL`, `UNIQUE`
- `FOREIGN KEY ... REFERENCES` constraints
- Quoted identifiers (backticks and double quotes)

### Example input

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

## Exporting SQL

Click **"Export SQL"** in the toolbar to copy the generated SQL to your clipboard. The output includes:

- `CREATE TABLE` statements for all tables
- Column definitions with types and constraints
- `FOREIGN KEY` constraints for all relationships

## SQL Editor panel

The SQL editor panel shows a live preview of the generated SQL as you edit your schema. It updates automatically when you add, remove, or modify tables and columns.

<!-- TODO: Add screenshot -->
![SQL Editor](../assets/screenshots/sql-editor.png)

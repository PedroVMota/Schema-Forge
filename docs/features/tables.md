# Table Editor

Tables are the building blocks of your schema.

<!-- TODO: Add screenshot -->
![Table Node](../assets/screenshots/table-node.png)

## Creating a table

Click **"Add Table"** in the toolbar or use the empty state buttons when starting a new project.

## Renaming a table

Click the table name in the header to edit it inline.

## Columns

Each table contains columns with the following properties:

| Property | Description |
|----------|-------------|
| **Name** | Column name (e.g., `id`, `email`, `created_at`) |
| **Type** | SQL data type |
| **Primary Key** (PK) | Marks the column as a primary key |
| **Foreign Key** (FK) | Automatically set when a relationship is created |
| **Not Null** (NN) | Column cannot contain NULL values |
| **Unique** (UQ) | Column values must be unique |

### Supported column types

| Category | Types |
|----------|-------|
| **Integer** | `INT`, `BIGINT`, `SMALLINT`, `SERIAL`, `BIGSERIAL` |
| **Text** | `VARCHAR(255)`, `TEXT`, `CHAR(1)` |
| **Boolean** | `BOOLEAN` |
| **Date/Time** | `DATE`, `TIMESTAMP`, `TIMESTAMPTZ`, `TIME` |
| **Numeric** | `DECIMAL`, `FLOAT`, `DOUBLE PRECISION`, `REAL`, `NUMERIC` |
| **Identifiers** | `UUID` |
| **Structured** | `JSON`, `JSONB` |
| **Binary** | `BYTEA` |

## Adding a column

Click the **"+"** button on a table to add a new column. Set the name, type, and constraints.

<!-- TODO: Add screenshot -->
![Add Column](../assets/screenshots/column-editor.png)

## Editing a column

Click on an existing column to edit its properties.

## Deleting a column

Use the delete icon next to a column to remove it. If the column has a foreign key relationship, the relationship is also removed.

## Deleting a table

Use the delete button in the table header. This removes the table and all its relationships.

## Column badges

Columns display badges to indicate their constraints:

- **PK** — Primary Key (blue)
- **FK** — Foreign Key (purple)
- **NN** — Not Null (yellow)
- **UQ** — Unique (green)

<!-- TODO: Add screenshot -->
![Column Badges](../assets/screenshots/column-badges.png)

# Relationships

Relationships represent foreign key constraints between tables.

<!-- TODO: Add screenshot -->
![Relationships](../assets/screenshots/relationships.png)

## Creating a relationship

1. Hover over a column on the source table — a connection handle appears
2. Drag from the handle to a column on the target table
3. Release to create the foreign key relationship

The source column is automatically marked as a **Foreign Key (FK)**.

## Viewing relationships

Relationships are displayed as edges (lines) connecting two columns across tables. Each edge shows the direction of the reference.

## Deleting a relationship

Click on the edge between two tables to select it, then press **Delete** or use the edge controls to remove it.

## How it maps to SQL

A relationship between `orders.user_id` and `users.id` generates:

```sql
CREATE TABLE orders (
    -- ...
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

# Prisma Import

Import Prisma schema files and convert them into visual ERD diagrams.

## How to import

1. Click the **"Import Prisma"** button in the toolbar
2. Paste your Prisma schema content into the modal
3. Click **"Import"**

<!-- TODO: Add screenshot -->
![Prisma Import Modal](../assets/screenshots/prisma-import.png)

## Supported Prisma features

| Feature | Support |
|---------|---------|
| `model` definitions | Yes |
| Field types (`String`, `Int`, `DateTime`, etc.) | Yes |
| `@id` attribute | Yes |
| `@unique` attribute | Yes |
| Optional fields (`?`) | Yes |
| `@relation()` with `fields` and `references` | Yes |
| `@db.*` type overrides | Yes |
| `enum` definitions | Not yet |
| `@@index`, `@@map` | Not yet |

## Type mapping

Prisma types are automatically mapped to SQL types:

| Prisma Type | SQL Type |
|-------------|----------|
| `String` | `VARCHAR(255)` |
| `Int` | `INT` |
| `BigInt` | `BIGINT` |
| `Float` | `FLOAT` |
| `Decimal` | `DECIMAL` |
| `Boolean` | `BOOLEAN` |
| `DateTime` | `TIMESTAMP` |
| `Json` | `JSONB` |
| `Bytes` | `BYTEA` |

## Example

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  body     String?
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
```

This generates two tables with a foreign key from `Post.authorId` to `User.id`.

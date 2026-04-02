export const SAMPLE_SQL = `CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP
);

CREATE TABLE posts (
  id INT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  user_id INT NOT NULL,
  category_id INT,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE categories (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE comments (
  id INT PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`

export const SAMPLE_PRISMA = `model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
  role      String   @default("USER")
  posts     Post[]
  profile   Profile?
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  tags      Tag[]
  comments  Comment[]
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}

model Comment {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  content   String
  post      Post     @relation(fields: [postId], references: [id])
  postId    Int
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}`

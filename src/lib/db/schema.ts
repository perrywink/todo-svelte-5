import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: int().primaryKey({ autoIncrement: true }),
  description: text().notNull(),
  completed: int({ mode: "boolean" }).default(false),
});

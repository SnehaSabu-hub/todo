import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  completed: boolean("completed").notNull().default(false),
  emoji: text("emoji").notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks)
  .pick({
    content: true,
    emoji: true,
  })
  .extend({
    content: z.string().min(1, "Task content is required").max(200, "Task content is too long"),
  });

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const functionsTable = pgTable("functions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  signature: text("signature").notNull(),
  codeExample: text("code_example").notNull(),
  parametersJson: text("parameters_json").notNull().default("[]"),
  returns: text("returns").notNull(),
  tagsJson: text("tags_json").notNull().default("[]"),
});

export const insertFunctionSchema = createInsertSchema(functionsTable);
export type InsertFunction = z.infer<typeof insertFunctionSchema>;
export type FunctionDef = typeof functionsTable.$inferSelect;

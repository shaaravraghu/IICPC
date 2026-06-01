import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const testRunsTable = pgTable("test_runs", {
  id: text("id").primaryKey(),
  submissionId: text("submission_id").notNull(),
  status: text("status").notNull().default("queued"),
  currentStage: text("current_stage"),
  progressPct: integer("progress_pct"),
  technicalBotCount: integer("technical_bot_count").default(100),
  fundamentalBotCount: integer("fundamental_bot_count").default(50),
  sentimentBotCount: integer("sentiment_bot_count").default(50),
  durationSeconds: integer("duration_seconds").default(60),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertTestRunSchema = createInsertSchema(testRunsTable).omit({ startedAt: true, completedAt: true });
export type InsertTestRun = z.infer<typeof insertTestRunSchema>;
export type TestRun = typeof testRunsTable.$inferSelect;

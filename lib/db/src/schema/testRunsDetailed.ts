import { pgTable, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const testRunsDetailedTable = pgTable("test_runs_detailed", {
  id: text("id").primaryKey(),
  testRunId: text("test_run_id").notNull(),
  submissionId: text("submission_id"),
  currentLayer: text("current_layer").notNull().default("queued"),
  status: text("status").notNull().default("queued"),
  assetsTotal: integer("assets_total").notNull().default(0),
  assetsAnalyzed: integer("assets_analyzed").notNull().default(0),
  technicalPassCount: integer("technical_pass_count").notNull().default(0),
  fundamentalPassCount: integer("fundamental_pass_count").notNull().default(0),
  sentimentPassCount: integer("sentiment_pass_count").notNull().default(0),
  sentimentAvgScore: real("sentiment_avg_score"),
  executionAvgScore: real("execution_avg_score"),
  paperAvgScore: real("paper_avg_score"),
  progressPct: integer("progress_pct").notNull().default(0),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertTestRunDetailedSchema = createInsertSchema(testRunsDetailedTable).omit({
  startedAt: true,
  updatedAt: true,
  completedAt: true,
});
export type InsertTestRunDetailed = z.infer<typeof insertTestRunDetailedSchema>;
export type TestRunDetailed = typeof testRunsDetailedTable.$inferSelect;

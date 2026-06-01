import { pgTable, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const submissionsTable = pgTable("submissions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  teamName: text("team_name"),
  language: text("language").notNull(),
  filename: text("filename").notNull(),
  code: text("code").notNull(),
  status: text("status").notNull().default("pending"),
  speedScore: real("speed_score"),
  stabilityScore: real("stability_score"),
  correctnessScore: real("correctness_score"),
  compositeScore: real("composite_score"),
  p50Latency: real("p50_latency"),
  p90Latency: real("p90_latency"),
  p99Latency: real("p99_latency"),
  tps: real("tps"),
  totalOrders: integer("total_orders"),
  fillAccuracy: real("fill_accuracy"),
  uptimePct: real("uptime_pct"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertSubmissionSchema = createInsertSchema(submissionsTable).omit({ createdAt: true, completedAt: true });
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissionsTable.$inferSelect;

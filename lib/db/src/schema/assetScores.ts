import { pgTable, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const assetScoresTable = pgTable("asset_scores", {
  id: text("id").primaryKey(),
  assetId: text("asset_id").notNull(),
  symbol: text("symbol").notNull(),
  testRunId: text("test_run_id").notNull(),
  technicalPass: integer("technical_pass").notNull().default(0),
  technicalScore: real("technical_score"),
  fundamentalPass: integer("fundamental_pass").notNull().default(0),
  fundamentalScore: real("fundamental_score"),
  sentimentScore: real("sentiment_score"),
  executionScore: real("execution_score"),
  paperScore: real("paper_score"),
  compositeScore: real("composite_score"),
  compositeRank: integer("composite_rank"),
  rejectedAtLayer: text("rejected_at_layer"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAssetScoreSchema = createInsertSchema(assetScoresTable).omit({
  createdAt: true,
  updatedAt: true,
});
export type InsertAssetScore = z.infer<typeof insertAssetScoreSchema>;
export type AssetScore = typeof assetScoresTable.$inferSelect;

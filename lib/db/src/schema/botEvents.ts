import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const botEventsTable = pgTable("bot_events", {
  id: text("id").primaryKey(),
  testRunId: text("test_run_id").notNull(),
  botId: text("bot_id").notNull(),
  assetId: text("asset_id").notNull(),
  symbol: text("symbol"),
  metricGroupId: text("metric_group_id").notNull(),
  layer: text("layer").notNull(),
  status: text("status").notNull().default("completed"),
  resultJson: jsonb("result_json").notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBotEventSchema = createInsertSchema(botEventsTable).omit({ createdAt: true });
export type InsertBotEvent = z.infer<typeof insertBotEventSchema>;
export type BotEvent = typeof botEventsTable.$inferSelect;

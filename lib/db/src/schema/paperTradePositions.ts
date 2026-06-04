import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const paperTradePositionsTable = pgTable("paper_trade_positions", {
  id: text("id").primaryKey(),
  testRunId: text("test_run_id").notNull(),
  assetScoreId: text("asset_score_id"),
  symbol: text("symbol").notNull(),
  side: text("side").notNull().default("long"),
  quantity: real("quantity").notNull().default(0),
  entryPrice: real("entry_price").notNull(),
  entryTime: timestamp("entry_time").notNull(),
  exitPrice: real("exit_price"),
  exitTime: timestamp("exit_time"),
  pnl: real("pnl"),
  pnlPct: real("pnl_pct"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPaperTradePositionSchema = createInsertSchema(paperTradePositionsTable).omit({
  createdAt: true,
  updatedAt: true,
});
export type InsertPaperTradePosition = z.infer<typeof insertPaperTradePositionSchema>;
export type PaperTradePosition = typeof paperTradePositionsTable.$inferSelect;

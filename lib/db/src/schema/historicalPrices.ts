import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const historicalPricesTable = pgTable("historical_prices", {
  id: text("id").primaryKey(),
  symbol: text("symbol").notNull(),
  interval: text("interval").notNull().default("daily"),
  date: timestamp("date").notNull(),
  open: real("open").notNull(),
  high: real("high").notNull(),
  low: real("low").notNull(),
  close: real("close").notNull(),
  volume: real("volume").notNull(),
  source: text("source").notNull().default("manual"),
  cachedAt: timestamp("cached_at").notNull().defaultNow(),
});

export const insertHistoricalPriceSchema = createInsertSchema(historicalPricesTable).omit({
  cachedAt: true,
});
export type InsertHistoricalPrice = z.infer<typeof insertHistoricalPriceSchema>;
export type HistoricalPrice = typeof historicalPricesTable.$inferSelect;

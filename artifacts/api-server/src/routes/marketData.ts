import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { db, historicalPricesTable } from "@workspace/db";

const router: IRouter = Router();

type SymbolInput = string | string[] | undefined;
type DateRangeInput = { start?: string; end?: string };
type FetchMarketDataRequest = {
  symbol_list?: SymbolInput;
  symbolList?: SymbolInput;
  date_range?: DateRangeInput;
  dateRange?: DateRangeInput;
  interval?: string;
};

// POST /market-data/fetch
router.post("/market-data/fetch", async (req, res): Promise<void> => {
  const parsed = parseFetchMarketDataBody(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const symbols = normalizeSymbols(parsed.data.symbol_list ?? parsed.data.symbolList);
  if (symbols.length === 0) {
    res.status(400).json({ error: "symbol_list is required" });
    return;
  }

  const interval = parsed.data.interval ?? "daily";
  const dateRange = parsed.data.date_range ?? parsed.data.dateRange;
  const bars = symbols.flatMap((symbol) => generateBars(symbol, interval, dateRange?.start, dateRange?.end));

  await db.insert(historicalPricesTable).values(
    bars.map((bar) => ({
      id: randomUUID(),
      symbol: bar.symbol,
      interval: bar.interval,
      date: bar.date,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
      volume: bar.volume,
      source: "phase-1-synthetic-cache",
    }))
  );

  res.status(202).json({
    symbols,
    interval,
    cachedBars: bars.length,
    source: "phase-1-synthetic-cache",
  });
});

function normalizeSymbols(rawSymbols: string | string[] | undefined): string[] {
  if (!rawSymbols) return [];

  const values = Array.isArray(rawSymbols) ? rawSymbols : rawSymbols.split(",");
  return Array.from(
    new Set(values.map((symbol) => symbol.trim().toUpperCase()).filter((symbol) => symbol.length > 0))
  );
}

function parseFetchMarketDataBody(body: unknown): { ok: true; data: FetchMarketDataRequest } | { ok: false; error: string } {
  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be an object" };
  }

  const data: FetchMarketDataRequest = {};
  for (const key of ["symbol_list", "symbolList"] as const) {
    const value = body[key];
    if (value !== undefined && typeof value !== "string" && !isStringArray(value)) {
      return { ok: false, error: `${key} must be a CSV string or string array` };
    }
    data[key] = value;
  }

  for (const key of ["date_range", "dateRange"] as const) {
    const value = body[key];
    if (value !== undefined && !isDateRange(value)) {
      return { ok: false, error: `${key} must include optional string start and end fields` };
    }
    data[key] = value;
  }

  const interval = body["interval"];
  if (interval !== undefined && typeof interval !== "string") {
    return { ok: false, error: "interval must be a string" };
  }
  data.interval = interval;

  return { ok: true, data };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isDateRange(value: unknown): value is DateRangeInput {
  if (!isRecord(value)) return false;
  return (
    (value["start"] === undefined || typeof value["start"] === "string") &&
    (value["end"] === undefined || typeof value["end"] === "string")
  );
}

function generateBars(symbol: string, interval: string, start?: string, end?: string) {
  const endDate = end ? new Date(end) : new Date();
  const startDate = start ? new Date(start) : new Date(endDate.getTime() - 29 * 24 * 60 * 60 * 1000);
  const days = Math.max(1, Math.min(120, Math.ceil((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1));
  const basePrice = 50 + (symbol.charCodeAt(0) % 80);

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(startDate.getTime() + index * 86_400_000);
    const drift = index * 0.35;
    const wave = Math.sin(index / 3) * 2;
    const open = roundPrice(basePrice + drift + wave);
    const close = roundPrice(open + Math.cos(index / 2) * 1.4);
    const high = roundPrice(Math.max(open, close) + 1.2);
    const low = roundPrice(Math.min(open, close) - 1.1);

    return {
      symbol,
      interval,
      date,
      open,
      high,
      low,
      close,
      volume: 500_000 + (symbol.length + index) * 12_500,
    };
  });
}

function roundPrice(value: number): number {
  return Math.round(value * 100) / 100;
}

export default router;

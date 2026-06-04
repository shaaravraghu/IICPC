import { Router, type IRouter } from "express";
import {
  fetchHistoricalDataBatch,
  seedTopMarketData,
  type MarketDataProvider,
} from "../lib/marketDataFetcher";

const router: IRouter = Router();

type SymbolInput = string | string[] | undefined;
type DateRangeInput = { start?: string; end?: string };
type FetchMarketDataRequest = {
  symbol_list?: SymbolInput;
  symbolList?: SymbolInput;
  date_range?: DateRangeInput;
  dateRange?: DateRangeInput;
  interval?: string;
  provider?: MarketDataProvider;
  yearsBack?: number;
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
  const bars = await fetchHistoricalDataBatch(symbols, {
    interval,
    start: dateRange?.start,
    end: dateRange?.end,
    provider: parsed.data.provider,
    yearsBack: parsed.data.yearsBack,
    cache: true,
  });

  res.status(202).json({
    symbols,
    interval,
    cachedBars: bars.length,
    source: bars[0]?.source ?? parsed.data.provider ?? "synthetic",
  });
});

// POST /market-data/seed
router.post("/market-data/seed", async (req, res): Promise<void> => {
  const parsed = parseSeedMarketDataBody(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const result = await seedTopMarketData(parsed.data.limit, {
    interval: parsed.data.interval ?? "daily",
    provider: parsed.data.provider,
    yearsBack: parsed.data.yearsBack,
  });

  res.status(202).json(result);
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

  const provider = body["provider"];
  if (provider !== undefined && !isProvider(provider)) {
    return { ok: false, error: "provider must be alpha-vantage, polygon, or synthetic" };
  }
  data.provider = provider;

  const yearsBack = body["yearsBack"];
  if (yearsBack !== undefined && (typeof yearsBack !== "number" || yearsBack <= 0)) {
    return { ok: false, error: "yearsBack must be a positive number" };
  }
  data.yearsBack = yearsBack;

  return { ok: true, data };
}

function parseSeedMarketDataBody(
  body: unknown
): { ok: true; data: { limit: number; interval?: string; provider?: MarketDataProvider; yearsBack?: number } } | { ok: false; error: string } {
  if (!isRecord(body)) {
    return { ok: false, error: "Request body must be an object" };
  }

  const limit = body["limit"];
  if (limit !== undefined && (typeof limit !== "number" || limit <= 0 || limit > 100)) {
    return { ok: false, error: "limit must be a number between 1 and 100" };
  }

  const interval = body["interval"];
  if (interval !== undefined && typeof interval !== "string") {
    return { ok: false, error: "interval must be a string" };
  }

  const provider = body["provider"];
  if (provider !== undefined && !isProvider(provider)) {
    return { ok: false, error: "provider must be alpha-vantage, polygon, or synthetic" };
  }

  const yearsBack = body["yearsBack"];
  if (yearsBack !== undefined && (typeof yearsBack !== "number" || yearsBack <= 0)) {
    return { ok: false, error: "yearsBack must be a positive number" };
  }

  return {
    ok: true,
    data: {
      limit: limit ?? 100,
      interval,
      provider,
      yearsBack,
    },
  };
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

function isProvider(value: unknown): value is MarketDataProvider {
  return value === "alpha-vantage" || value === "polygon" || value === "synthetic";
}

export default router;

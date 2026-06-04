import { randomUUID } from "crypto";
import { and, desc, eq } from "drizzle-orm";
import { db, historicalPricesTable } from "@workspace/db";
import { logger } from "./logger";

export type MarketDataProvider = "alpha-vantage" | "polygon" | "synthetic";
export type HistoricalBar = {
  symbol: string;
  interval: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  source: string;
};

export type FetchHistoricalDataOptions = {
  interval?: string;
  start?: string;
  end?: string;
  yearsBack?: number;
  provider?: MarketDataProvider;
  cache?: boolean;
};

export const TOP_100_SYMBOLS = [
  "AAPL",
  "MSFT",
  "NVDA",
  "AMZN",
  "GOOGL",
  "META",
  "BRK.B",
  "LLY",
  "AVGO",
  "TSLA",
  "JPM",
  "V",
  "UNH",
  "XOM",
  "MA",
  "COST",
  "PG",
  "HD",
  "WMT",
  "NFLX",
  "JNJ",
  "BAC",
  "ABBV",
  "CRM",
  "KO",
  "ORCL",
  "MRK",
  "CVX",
  "AMD",
  "PEP",
  "ADBE",
  "TMO",
  "LIN",
  "ACN",
  "MCD",
  "CSCO",
  "ABT",
  "WFC",
  "QCOM",
  "GE",
  "IBM",
  "INTU",
  "TXN",
  "DHR",
  "AMAT",
  "NOW",
  "PM",
  "VZ",
  "CAT",
  "ISRG",
  "DIS",
  "NEE",
  "RTX",
  "PFE",
  "UBER",
  "SPGI",
  "GS",
  "AMGN",
  "LOW",
  "BKNG",
  "UNP",
  "HON",
  "T",
  "AXP",
  "PGR",
  "BLK",
  "SYK",
  "TJX",
  "ETN",
  "ELV",
  "C",
  "SCHW",
  "LMT",
  "VRTX",
  "BSX",
  "MDT",
  "REGN",
  "ADI",
  "PANW",
  "CB",
  "MMC",
  "DE",
  "CI",
  "MU",
  "LRCX",
  "ADP",
  "KLAC",
  "UPS",
  "PLD",
  "FI",
  "SBUX",
  "BX",
  "SO",
  "GILD",
  "NKE",
  "MO",
  "DUK",
  "ICE",
  "ZTS",
  "CME",
];

export async function fetchHistoricalData(
  symbol: string,
  options: FetchHistoricalDataOptions = {}
): Promise<HistoricalBar[]> {
  const normalizedSymbol = normalizeSymbol(symbol);
  if (!isValidSymbol(normalizedSymbol)) {
    throw new Error(`Invalid market data symbol: ${symbol}`);
  }

  const interval = options.interval ?? "daily";
  const provider = options.provider ?? selectProvider();
  const cache = options.cache ?? true;
  const end = options.end ? new Date(options.end) : new Date();
  const start = options.start ? new Date(options.start) : yearsBefore(end, options.yearsBack ?? 5);

  const bars = await fetchBarsWithFallback(normalizedSymbol, {
    provider,
    interval,
    start,
    end,
    yearsBack: options.yearsBack ?? 5,
  });

  if (cache && bars.length > 0) {
    await cacheHistoricalBars(bars).catch((err: unknown) => {
      logger.warn({ err, symbol: normalizedSymbol, interval }, "Failed to cache market data bars");
    });
  }

  return bars;
}

export async function fetchHistoricalDataBatch(
  symbols: string[],
  options: FetchHistoricalDataOptions = {}
): Promise<HistoricalBar[]> {
  const uniqueSymbols = Array.from(new Set(symbols.map(normalizeSymbol).filter(Boolean)));
  const batches = await Promise.all(uniqueSymbols.map((symbol) => fetchHistoricalData(symbol, options)));
  return batches.flat();
}

export async function seedTopMarketData(limit = 100, options: FetchHistoricalDataOptions = {}): Promise<{
  symbols: string[];
  cachedBars: number;
  provider: MarketDataProvider;
}> {
  const symbols = TOP_100_SYMBOLS.slice(0, limit);
  const provider = options.provider ?? selectProvider();
  const bars = await fetchHistoricalDataBatch(symbols, {
    interval: "daily",
    yearsBack: 5,
    ...options,
    provider,
    cache: true,
  });

  return {
    symbols,
    cachedBars: bars.length,
    provider,
  };
}

async function fetchBars(optionsSymbol: string, options: {
  provider: MarketDataProvider;
  interval: string;
  start: Date;
  end: Date;
  yearsBack: number;
}): Promise<HistoricalBar[]> {
  if (options.provider === "alpha-vantage") {
    return fetchAlphaVantageBars(optionsSymbol, options);
  }

  if (options.provider === "polygon") {
    return fetchPolygonBars(optionsSymbol, options);
  }

  return generateSyntheticBars(optionsSymbol, options.interval, options.start, options.end);
}

async function fetchBarsWithFallback(symbol: string, options: {
  provider: MarketDataProvider;
  interval: string;
  start: Date;
  end: Date;
  yearsBack: number;
}): Promise<HistoricalBar[]> {
  try {
    const providerBars = validateBars(await fetchBars(symbol, options), symbol, options.interval);
    if (providerBars.length > 0) {
      return providerBars;
    }
    logger.warn({ symbol, interval: options.interval, provider: options.provider }, "Provider returned no valid market data bars");
  } catch (err) {
    logger.warn({ err, symbol, interval: options.interval, provider: options.provider }, "Provider market data fetch failed");
  }

  const cachedBars = validateBars(await fetchCachedBars(symbol, options.interval, options.start, options.end), symbol, options.interval);
  if (cachedBars.length > 0) {
    return cachedBars;
  }

  return generateSyntheticBars(symbol, options.interval, options.start, options.end);
}

async function fetchAlphaVantageBars(symbol: string, options: {
  interval: string;
  start: Date;
  end: Date;
}): Promise<HistoricalBar[]> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    return generateSyntheticBars(symbol, options.interval, options.start, options.end);
  }

  const isIntraday = options.interval !== "daily";
  const params = new URLSearchParams({
    function: isIntraday ? "TIME_SERIES_INTRADAY" : "TIME_SERIES_DAILY",
    symbol,
    apikey: apiKey,
    outputsize: "full",
  });
  if (isIntraday) {
    params.set("interval", normalizeAlphaVantageInterval(options.interval));
  }

  const response = await fetch(`https://www.alphavantage.co/query?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Alpha Vantage market data request failed with ${response.status}`);
  }

  const payload = await response.json() as Record<string, unknown>;
  const seriesKey = Object.keys(payload).find((key) => key.includes("Time Series"));
  const series = seriesKey ? payload[seriesKey] : undefined;
  if (!isRecord(series)) {
    return generateSyntheticBars(symbol, options.interval, options.start, options.end);
  }

  return Object.entries(series)
    .map(([timestamp, raw]) => parseAlphaVantageBar(symbol, options.interval, timestamp, raw))
    .filter((bar): bar is HistoricalBar => Boolean(bar))
    .filter((bar) => bar.date >= options.start && bar.date <= options.end)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

async function fetchPolygonBars(symbol: string, options: {
  interval: string;
  start: Date;
  end: Date;
}): Promise<HistoricalBar[]> {
  const apiKey = process.env.POLYGON_API_KEY;
  if (!apiKey) {
    return generateSyntheticBars(symbol, options.interval, options.start, options.end);
  }

  const { multiplier, timespan } = polygonInterval(options.interval);
  const from = formatDate(options.start);
  const to = formatDate(options.end);
  const url = new URL(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}`);
  url.searchParams.set("adjusted", "true");
  url.searchParams.set("sort", "asc");
  url.searchParams.set("limit", "50000");
  url.searchParams.set("apiKey", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Polygon market data request failed with ${response.status}`);
  }

  const payload = await response.json() as { results?: Array<Record<string, unknown>> };
  if (!Array.isArray(payload.results)) {
    return generateSyntheticBars(symbol, options.interval, options.start, options.end);
  }

  return payload.results
    .map((raw) => parsePolygonBar(symbol, options.interval, raw))
    .filter((bar): bar is HistoricalBar => Boolean(bar));
}

async function cacheHistoricalBars(bars: HistoricalBar[]): Promise<void> {
  const validBars = validateBars(bars);
  if (validBars.length === 0) return;

  await db.insert(historicalPricesTable).values(
    validBars.map((bar) => ({
      id: randomUUID(),
      symbol: bar.symbol,
      interval: bar.interval,
      date: bar.date,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
      volume: bar.volume,
      source: bar.source,
    }))
  );
}

async function fetchCachedBars(symbol: string, interval: string, start: Date, end: Date): Promise<HistoricalBar[]> {
  const rows = await db
    .select()
    .from(historicalPricesTable)
    .where(and(eq(historicalPricesTable.symbol, symbol), eq(historicalPricesTable.interval, interval)))
    .orderBy(desc(historicalPricesTable.date))
    .limit(5000);

  return rows
    .filter((row) => row.date >= start && row.date <= end)
    .map((row) => ({
      symbol: row.symbol,
      interval: row.interval,
      date: row.date,
      open: row.open,
      high: row.high,
      low: row.low,
      close: row.close,
      volume: row.volume,
      source: `${row.source}:cached`,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function parseAlphaVantageBar(
  symbol: string,
  interval: string,
  timestamp: string,
  raw: unknown
): HistoricalBar | null {
  if (!isRecord(raw)) return null;

  const open = numericValue(raw["1. open"]);
  const high = numericValue(raw["2. high"]);
  const low = numericValue(raw["3. low"]);
  const close = numericValue(raw["4. close"]);
  const volume = numericValue(raw["5. volume"]);
  if (open == null || high == null || low == null || close == null || volume == null) return null;

  return {
    symbol,
    interval,
    date: new Date(timestamp),
    open,
    high,
    low,
    close,
    volume,
    source: "alpha-vantage",
  };
}

function parsePolygonBar(symbol: string, interval: string, raw: Record<string, unknown>): HistoricalBar | null {
  const open = numericValue(raw["o"]);
  const high = numericValue(raw["h"]);
  const low = numericValue(raw["l"]);
  const close = numericValue(raw["c"]);
  const volume = numericValue(raw["v"]);
  const timestamp = numericValue(raw["t"]);
  if (open == null || high == null || low == null || close == null || volume == null || timestamp == null) return null;

  return {
    symbol,
    interval,
    date: new Date(timestamp),
    open,
    high,
    low,
    close,
    volume,
    source: "polygon",
  };
}

function generateSyntheticBars(symbol: string, interval: string, start: Date, end: Date): HistoricalBar[] {
  const days = Math.max(1, Math.min(252 * 5, Math.ceil((end.getTime() - start.getTime()) / 86_400_000) + 1));
  const barsPerDay = interval === "5min" ? 78 : 1;
  const totalBars = Math.min(days * barsPerDay, interval === "5min" ? 5000 : 1260);
  const basePrice = 50 + (symbol.charCodeAt(0) % 80);

  return Array.from({ length: totalBars }, (_, index) => {
    const offsetMs = interval === "5min" ? index * 5 * 60_000 : index * 86_400_000;
    const date = new Date(start.getTime() + offsetMs);
    const drift = index * 0.025;
    const wave = Math.sin(index / 9) * 2.4;
    const open = roundPrice(basePrice + drift + wave);
    const close = roundPrice(open + Math.cos(index / 5) * 1.2);
    const high = roundPrice(Math.max(open, close) + 0.9);
    const low = roundPrice(Math.min(open, close) - 0.85);

    return {
      symbol,
      interval,
      date,
      open,
      high,
      low,
      close,
      volume: 500_000 + (symbol.length + index) * 12_500,
      source: "synthetic",
    };
  });
}

function validateBars(bars: HistoricalBar[], expectedSymbol?: string, expectedInterval?: string): HistoricalBar[] {
  return bars.filter((bar) => {
    const valid =
      (!expectedSymbol || bar.symbol === expectedSymbol) &&
      (!expectedInterval || bar.interval === expectedInterval) &&
      bar.date instanceof Date &&
      !Number.isNaN(bar.date.getTime()) &&
      isPositiveNumber(bar.open) &&
      isPositiveNumber(bar.high) &&
      isPositiveNumber(bar.low) &&
      isPositiveNumber(bar.close) &&
      Number.isFinite(bar.volume) &&
      bar.volume >= 0 &&
      bar.high >= bar.low &&
      bar.high >= bar.open &&
      bar.high >= bar.close &&
      bar.low <= bar.open &&
      bar.low <= bar.close;

    if (!valid) {
      logger.debug({ bar }, "Discarded invalid OHLCV bar");
    }
    return valid;
  });
}

function selectProvider(): MarketDataProvider {
  if (process.env.POLYGON_API_KEY) return "polygon";
  if (process.env.ALPHA_VANTAGE_API_KEY) return "alpha-vantage";
  return "synthetic";
}

function normalizeSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

function isValidSymbol(symbol: string): boolean {
  return /^[A-Z][A-Z0-9.-]{0,9}$/.test(symbol);
}

function normalizeAlphaVantageInterval(interval: string): string {
  if (interval === "5min" || interval === "15min" || interval === "30min" || interval === "60min") {
    return interval;
  }
  return "5min";
}

function polygonInterval(interval: string): { multiplier: number; timespan: string } {
  if (interval === "5min") return { multiplier: 5, timespan: "minute" };
  if (interval === "15min") return { multiplier: 15, timespan: "minute" };
  if (interval === "30min") return { multiplier: 30, timespan: "minute" };
  if (interval === "60min") return { multiplier: 1, timespan: "hour" };
  return { multiplier: 1, timespan: "day" };
}

function yearsBefore(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() - years);
  return result;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function roundPrice(value: number): number {
  return Math.round(value * 100) / 100;
}

function numericValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

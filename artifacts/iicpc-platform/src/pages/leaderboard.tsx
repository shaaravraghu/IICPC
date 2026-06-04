import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Activity, ArrowDown, ArrowUp, Search, BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type PipelineRun = {
  id: string;
  submissionId: string;
  status: string;
  currentStage: string | null;
  progressPct: number | null;
  startedAt: string;
  completedAt: string | null;
};

type AssetLeaderboardRow = {
  rank: number;
  assetId: string;
  symbol: string;
  sentimentScore: number | null;
  executionScore: number | null;
  paperScore: number | null;
  compositeScore: number | null;
  technicalScore: number | null;
  fundamentalScore: number | null;
  technicalPass: boolean;
  fundamentalPass: boolean;
  rejectedAtLayer: string | null;
  rejectionReason: string | null;
  team: string | null;
  submissionId: string | null;
  testRunId: string;
  timestamp: string;
};

type SortKey = "rank" | "sentimentScore" | "executionScore" | "paperScore" | "compositeScore";

const SORT_LABELS: Record<SortKey, string> = {
  rank: "Rank",
  sentimentScore: "Sentiment",
  executionScore: "Execution",
  paperScore: "Paper",
  compositeScore: "Composite",
};

function scoreValue(value: number | null): number {
  return value ?? 0;
}

function ScoreCell({ value, tone }: { value: number | null; tone: string }) {
  const width = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div className="space-y-1">
      <div className="text-right font-mono text-sm font-semibold">{value == null ? "-" : value.toFixed(1)}</div>
      <div className="h-1.5 w-full overflow-hidden rounded bg-border">
        <div className={`h-full rounded ${tone}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export default function Leaderboard() {
  const initialRunId = new URLSearchParams(window.location.search).get("run") ?? "";
  const [requestedRunId, setRequestedRunId] = useState(initialRunId);
  const [symbolFilter, setSymbolFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("compositeScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { data: runs, isLoading: runsLoading } = useQuery({
    queryKey: ["pipeline-runs-latest"],
    queryFn: () => fetchJson<PipelineRun[]>("/api/pipeline/runs?limit=1"),
    refetchInterval: 2000,
  });

  const activeRunId = requestedRunId.trim() || runs?.[0]?.id || "";
  const { data: rows, isLoading: rowsLoading } = useQuery({
    queryKey: ["asset-leaderboard", activeRunId],
    queryFn: () => fetchJson<AssetLeaderboardRow[]>(`/api/leaderboard/${activeRunId}`),
    enabled: activeRunId.length > 0,
    refetchInterval: 2000,
  });

  const sortedRows = useMemo(() => {
    const filtered = (rows ?? []).filter((row) =>
      row.symbol.toLowerCase().includes(symbolFilter.trim().toLowerCase())
    );
    return filtered.sort((a, b) => {
      const aValue = sortKey === "rank" ? a.rank : scoreValue(a[sortKey]);
      const bValue = sortKey === "rank" ? b.rank : scoreValue(b[sortKey]);
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [rows, sortDirection, sortKey, symbolFilter]);

  const topRow = sortedRows[0];
  const scoreSummary = useMemo(() => {
    const values = sortedRows.flatMap((row) => [
      row.sentimentScore,
      row.executionScore,
      row.paperScore,
      row.compositeScore,
    ]).filter((value): value is number => typeof value === "number");
    return {
      assets: sortedRows.length,
      average: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0,
      topComposite: topRow?.compositeScore ?? 0,
      completeRows: sortedRows.filter((row) => row.paperScore != null).length,
    };
  }, [sortedRows, topRow]);

  const chartData = sortedRows.slice(0, 8).map((row) => ({
    symbol: row.symbol,
    sentiment: row.sentimentScore ?? 0,
    execution: row.executionScore ?? 0,
    paper: row.paperScore ?? 0,
  }));

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDirection(key === "rank" ? "asc" : "desc");
  };

  const loading = runsLoading || rowsLoading;

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-border bg-card/30 px-8 py-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Asset Leaderboard</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {activeRunId ? `Run ${activeRunId}` : "Waiting for a run"}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={symbolFilter}
                onChange={(event) => setSymbolFilter(event.target.value)}
                placeholder="Symbol"
                className="h-9 w-full pl-8 font-mono text-xs sm:w-32"
              />
            </div>
            <Input
              value={requestedRunId}
              onChange={(event) => setRequestedRunId(event.target.value)}
              placeholder="Test run ID"
              className="h-9 w-full font-mono text-xs sm:w-72"
            />
            <Badge variant="outline" className="h-9 justify-center gap-2 rounded px-3 font-mono text-xs">
              <span className="h-2 w-2 rounded-full bg-primary" />
              2s
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-16" />)
          ) : (
            <>
              <div className="rounded border border-border bg-card p-3">
                <div className="mb-1 flex items-center gap-1 font-mono text-xs uppercase text-muted-foreground">
                  <Activity className="h-3 w-3" />Assets
                </div>
                <div className="font-mono text-2xl font-bold">{scoreSummary.assets}</div>
              </div>
              <div className="rounded border border-border bg-card p-3">
                <div className="mb-1 flex items-center gap-1 font-mono text-xs uppercase text-muted-foreground">
                  <Trophy className="h-3 w-3" />Top
                </div>
                <div className="font-mono text-2xl font-bold text-primary">{scoreSummary.topComposite.toFixed(1)}</div>
              </div>
              <div className="rounded border border-border bg-card p-3">
                <div className="mb-1 flex items-center gap-1 font-mono text-xs uppercase text-muted-foreground">
                  <BarChart3 className="h-3 w-3" />Average
                </div>
                <div className="font-mono text-2xl font-bold">{scoreSummary.average.toFixed(1)}</div>
              </div>
              <div className="rounded border border-border bg-card p-3">
                <div className="mb-1 flex items-center gap-1 font-mono text-xs uppercase text-muted-foreground">
                  <Activity className="h-3 w-3" />Paper
                </div>
                <div className="font-mono text-2xl font-bold text-chart-2">{scoreSummary.completeRows}</div>
              </div>
            </>
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="shrink-0 border-b border-border px-8 py-4">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="symbol" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                }}
              />
              <Bar dataKey="sentiment" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
              <Bar dataKey="execution" fill="hsl(var(--chart-2))" radius={[3, 3, 0, 0]} />
              <Bar dataKey="paper" fill="hsl(var(--chart-3))" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="shrink-0 border-b border-border bg-card/20 px-8 py-2">
        <div className="grid grid-cols-12 gap-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          <SortHeader label="Rank" active={sortKey === "rank"} direction={sortDirection} onClick={() => toggleSort("rank")} className="col-span-1" />
          <div className="col-span-2">Asset</div>
          <SortHeader label="Sentiment" active={sortKey === "sentimentScore"} direction={sortDirection} onClick={() => toggleSort("sentimentScore")} className="col-span-2 text-right" />
          <SortHeader label="Execution" active={sortKey === "executionScore"} direction={sortDirection} onClick={() => toggleSort("executionScore")} className="col-span-2 text-right" />
          <SortHeader label="Paper" active={sortKey === "paperScore"} direction={sortDirection} onClick={() => toggleSort("paperScore")} className="col-span-2 text-right" />
          <SortHeader label="Composite" active={sortKey === "compositeScore"} direction={sortDirection} onClick={() => toggleSort("compositeScore")} className="col-span-2 text-right" />
          <div className="col-span-1 text-right">State</div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="space-y-2 px-8 py-4">
            {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-14 w-full" />)}
          </div>
        ) : sortedRows.length > 0 ? (
          sortedRows.map((row) => (
            <div
              key={`${row.testRunId}-${row.assetId}`}
              className="grid grid-cols-12 items-center gap-3 border-b border-border px-8 py-3 transition-colors hover:bg-card/50"
            >
              <div className="col-span-1 font-mono text-sm font-bold text-muted-foreground">#{row.rank}</div>
              <div className="col-span-2 min-w-0">
                <div className="truncate font-semibold">{row.symbol}</div>
                <div className="truncate text-xs text-muted-foreground">{row.team ?? row.submissionId ?? "analysis"}</div>
              </div>
              <div className="col-span-2"><ScoreCell value={row.sentimentScore} tone="bg-primary" /></div>
              <div className="col-span-2"><ScoreCell value={row.executionScore} tone="bg-chart-2" /></div>
              <div className="col-span-2"><ScoreCell value={row.paperScore} tone="bg-chart-3" /></div>
              <div className="col-span-2"><ScoreCell value={row.compositeScore} tone="bg-chart-4" /></div>
              <div className="col-span-1 flex justify-end">
                <Badge variant={row.rejectedAtLayer ? "destructive" : "outline"} className="rounded font-mono text-[10px]">
                  {row.rejectedAtLayer ?? "live"}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Trophy className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">No ranked assets</p>
            <p className="mt-1 text-xs text-muted-foreground/60">Start an execution run to populate this board</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function SortHeader({
  label,
  active,
  direction,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`h-auto justify-start p-0 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:bg-transparent ${className ?? ""}`}
      title={`Sort by ${SORT_LABELS[label as SortKey] ?? label}`}
    >
      <span className="ml-auto inline-flex items-center gap-1">
        {label}
        {active && (direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
      </span>
    </Button>
  );
}

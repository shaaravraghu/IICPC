import { useState } from "react";
import {
  useGetLeaderboard,
  getGetLeaderboardQueryKey,
  useGetLeaderboardSummary,
  getGetLeaderboardSummaryQueryKey,
  useGetSubmissionTelemetry,
  getGetSubmissionTelemetryQueryKey,
} from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Zap, Clock, CheckSquare, Users, ChevronDown, ChevronUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const LANG_COLOR: Record<string, string> = {
  cpp: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  rust: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  go: "bg-primary/20 text-primary border-primary/30",
};

function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="h-1 w-full bg-border rounded overflow-hidden">
      <div className={`h-full rounded ${color}`} style={{ width: `${(value / max) * 100}%` }} />
    </div>
  );
}

function ExpandedRow({ submissionId }: { submissionId: string }) {
  const { data: telemetry, isLoading } = useGetSubmissionTelemetry(submissionId, {
    query: {
      queryKey: getGetSubmissionTelemetryQueryKey(submissionId),
    }
  });

  if (isLoading) return <div className="p-4"><Skeleton className="h-24 w-full" /></div>;

  const latencyData = telemetry?.latencySeries ?? [];
  const tpsData = telemetry?.tpsSeries ?? [];

  return (
    <div className="px-6 py-4 bg-card/50 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Latency</div>
        <div className="space-y-1 text-xs font-mono">
          <div className="flex justify-between"><span className="text-muted-foreground">p50</span><span>{telemetry?.p50Latency?.toFixed(2) ?? "—"}ms</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">p90</span><span>{telemetry?.p90Latency?.toFixed(2) ?? "—"}ms</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">p99</span><span className="text-primary">{telemetry?.p99Latency?.toFixed(2) ?? "—"}ms</span></div>
        </div>
      </div>
      <div>
        <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Throughput</div>
        <div className="space-y-1 text-xs font-mono">
          <div className="flex justify-between"><span className="text-muted-foreground">Peak TPS</span><span>{telemetry?.peakTps?.toFixed(0) ?? "—"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Avg TPS</span><span>{telemetry?.avgTps?.toFixed(0) ?? "—"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Orders</span><span>{telemetry?.totalOrders?.toLocaleString() ?? "—"}</span></div>
        </div>
      </div>
      {latencyData.length > 0 && (
        <div className="col-span-1">
          <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Latency Trace</div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={latencyData}>
              <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" dot={false} strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {tpsData.length > 0 && (
        <div className="col-span-1">
          <div className="text-xs font-mono text-muted-foreground uppercase mb-1">TPS Trace</div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={tpsData}>
              <Line type="monotone" dataKey="v" stroke="hsl(var(--chart-2))" dot={false} strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default function Leaderboard() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: entries, isLoading } = useGetLeaderboard(
    { limit: 50 },
    { query: { queryKey: getGetLeaderboardQueryKey({ limit: 50 }), refetchInterval: 8000 } }
  );

  const { data: summary, isLoading: summaryLoading } = useGetLeaderboardSummary({
    query: { queryKey: getGetLeaderboardSummaryQueryKey(), refetchInterval: 8000 }
  });

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-border bg-card/30 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Live rankings — updates every 8s</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground uppercase">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {summaryLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)
          ) : (
            <>
              <div className="bg-card border border-border rounded p-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono uppercase mb-1"><Users className="h-3 w-3" />Participants</div>
                <div className="text-2xl font-bold font-mono">{summary?.totalParticipants ?? 0}</div>
              </div>
              <div className="bg-card border border-border rounded p-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono uppercase mb-1"><Trophy className="h-3 w-3" />Submissions</div>
                <div className="text-2xl font-bold font-mono">{summary?.totalSubmissions ?? 0}</div>
              </div>
              <div className="bg-card border border-border rounded p-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono uppercase mb-1"><Zap className="h-3 w-3" />Best p99</div>
                <div className="text-2xl font-bold font-mono text-primary">{summary?.bestP99 != null ? `${summary.bestP99.toFixed(1)}ms` : "—"}</div>
              </div>
              <div className="bg-card border border-border rounded p-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono uppercase mb-1"><Clock className="h-3 w-3" />Best TPS</div>
                <div className="text-2xl font-bold font-mono text-chart-2">{summary?.bestTps != null ? summary.bestTps.toFixed(0) : "—"}</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 px-8 py-2 border-b border-border bg-card/20">
        <div className="grid grid-cols-12 text-xs font-mono text-muted-foreground uppercase tracking-wider">
          <div className="col-span-1">Rank</div>
          <div className="col-span-3">Contestant</div>
          <div className="col-span-1">Lang</div>
          <div className="col-span-2 text-right">Score</div>
          <div className="col-span-1 text-right">Speed</div>
          <div className="col-span-1 text-right">Stab</div>
          <div className="col-span-1 text-right">Corr</div>
          <div className="col-span-1 text-right">p99</div>
          <div className="col-span-1 text-right">TPS</div>
          <div className="col-span-1" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="px-8 py-4 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : entries && entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry.submissionId} data-testid={`row-leaderboard-${entry.submissionId}`}>
              <div
                className="px-8 py-3 border-b border-border grid grid-cols-12 items-center cursor-pointer hover:bg-card/50 transition-colors"
                onClick={() => setExpanded(expanded === entry.submissionId ? null : entry.submissionId)}
              >
                <div className="col-span-1">
                  <span className={`text-sm font-bold font-mono ${
                    entry.rank === 1 ? "text-yellow-400" :
                    entry.rank === 2 ? "text-slate-400" :
                    entry.rank === 3 ? "text-amber-600" :
                    "text-muted-foreground"
                  }`}>#{entry.rank}</span>
                </div>
                <div className="col-span-3">
                  <div className="font-semibold text-sm truncate">{entry.username}</div>
                  {entry.teamName && <div className="text-xs text-muted-foreground truncate">{entry.teamName}</div>}
                </div>
                <div className="col-span-1">
                  <Badge variant="outline" className={`text-[10px] h-4 ${LANG_COLOR[entry.language] ?? ""}`}>
                    {entry.language.toUpperCase()}
                  </Badge>
                </div>
                <div className="col-span-2 text-right">
                  <div className="font-bold font-mono text-primary">{entry.compositeScore.toFixed(1)}</div>
                  <ScoreBar value={entry.compositeScore} color="bg-primary" />
                </div>
                <div className="col-span-1 text-right text-xs font-mono">{entry.speedScore.toFixed(0)}</div>
                <div className="col-span-1 text-right text-xs font-mono">{entry.stabilityScore.toFixed(0)}</div>
                <div className="col-span-1 text-right text-xs font-mono">{entry.correctnessScore.toFixed(0)}</div>
                <div className="col-span-1 text-right text-xs font-mono text-muted-foreground">
                  {entry.p99Latency != null ? `${entry.p99Latency.toFixed(1)}ms` : "—"}
                </div>
                <div className="col-span-1 text-right text-xs font-mono text-muted-foreground">
                  {entry.tps != null ? entry.tps.toFixed(0) : "—"}
                </div>
                <div className="col-span-1 flex justify-end">
                  {expanded === entry.submissionId ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
              {expanded === entry.submissionId && <ExpandedRow submissionId={entry.submissionId} />}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No submissions yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Be the first to submit your exchange engine</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

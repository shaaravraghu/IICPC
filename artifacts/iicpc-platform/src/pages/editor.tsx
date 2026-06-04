import { useState, useEffect } from "react";
import { useAuth } from "@clerk/react";
import {
  useCreateSubmission,
  useListSubmissions,
  getListSubmissionsQueryKey,
  useRunSubmission,
  useGetSubmissionTelemetry,
  getGetSubmissionTelemetryQueryKey,
  useGetSubmission,
  getGetSubmissionQueryKey,
} from "@workspace/api-client-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Upload, ChevronRight, Clock, Zap, CheckSquare, AlertTriangle, Trophy } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const STARTER_CODE: Record<string, string> = {
  cpp: `#include <map>
#include <queue>
#include <mutex>
#include <vector>
#include <cstdint>

// Minimal orderbook matching engine
// Requirements: handle Limit, Market, Cancel orders
// Expose via REST: POST /order, DELETE /order/:id, GET /orderbook

struct Order {
  uint64_t id;
  bool     is_buy;
  double   price;
  uint64_t qty;
  uint64_t remaining;
};

class OrderBook {
  std::map<double, std::queue<Order>, std::greater<double>> bids;
  std::map<double, std::queue<Order>>                       asks;
  std::mutex mtx;

public:
  void add_limit(Order o) {
    std::lock_guard<std::mutex> lk(mtx);
    if (o.is_buy) bids[o.price].push(o);
    else          asks[o.price].push(o);
    match();
  }

  void cancel(uint64_t id);
  void match();
};
`,
  rust: `use std::collections::BTreeMap;
use std::sync::{Arc, Mutex};

#[derive(Debug, Clone)]
pub struct Order {
    pub id: u64,
    pub is_buy: bool,
    pub price: u64, // price in ticks
    pub qty: u64,
    pub remaining: u64,
}

#[derive(Debug, Default)]
pub struct OrderBook {
    // BTreeMap for price-time priority
    bids: BTreeMap<u64, Vec<Order>>, // descending
    asks: BTreeMap<u64, Vec<Order>>, // ascending
}

impl OrderBook {
    pub fn add_limit(&mut self, order: Order) {
        if order.is_buy {
            self.bids.entry(order.price).or_default().push(order);
        } else {
            self.asks.entry(order.price).or_default().push(order);
        }
        self.match_orders();
    }

    fn match_orders(&mut self) {
        // TODO: implement matching logic
    }
}
`,
  go: `package main

import (
  "sync"
  "container/heap"
)

type Side int
const (Buy Side = iota; Sell)

type Order struct {
  ID        uint64
  Side      Side
  Price     float64
  Qty       uint64
  Remaining uint64
  Seq       uint64 // for time-priority
}

type PriceLevel []Order

type OrderBook struct {
  mu   sync.Mutex
  bids *MaxHeap
  asks *MinHeap
  seq  uint64
}

func NewOrderBook() *OrderBook {
  ob := &OrderBook{bids: &MaxHeap{}, asks: &MinHeap{}}
  heap.Init(ob.bids)
  heap.Init(ob.asks)
  return ob
}

func (ob *OrderBook) AddLimit(o Order) {
  ob.mu.Lock()
  defer ob.mu.Unlock()
  ob.seq++
  o.Seq = ob.seq
  if o.Side == Buy {
    heap.Push(ob.bids, o)
  } else {
    heap.Push(ob.asks, o)
  }
  ob.match()
}

func (ob *OrderBook) match() {
  // TODO: implement price-time priority matching
}
`,
};

const STAGE_LABELS = ["Technical", "Fundamental", "Sentiment", "Execution", "Paper", "Done"];
const DEFAULT_ANALYSIS_ASSETS = "AAPL,MSFT,NVDA,GOOGL,AMZN,META,TSLA,JPM,UNH,V";

type ExecutionStartResponse = {
  testRunId: string;
  submissionId: string;
  status: string;
  currentLayer: string;
  assetsToAnalyze: number;
  estimatedDurationSeconds: number;
};

type ExecutionStatus = {
  testRunId: string;
  submissionId: string | null;
  status: string;
  currentLayer: string;
  progressPct: number;
  assetsTotal: number;
  assetsAnalyzed: number;
  technicalPassCount: number;
  fundamentalPassCount: number;
  sentimentPassCount: number;
  sentimentAvgScore: number | null;
  executionAvgScore: number | null;
  paperAvgScore: number | null;
  completedAt: string | null;
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export default function Editor() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<"cpp" | "rust" | "go">("go");
  const [code, setCode] = useState(STARTER_CODE.go);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);
  const [activeTestRunId, setActiveTestRunId] = useState<string | null>(null);
  const [assetUniverse, setAssetUniverse] = useState(DEFAULT_ANALYSIS_ASSETS);
  const [runError, setRunError] = useState<string | null>(null);

  const createSubmission = useCreateSubmission();
  const runSubmission = useRunSubmission();

  const { data: submissions } = useListSubmissions(
    { userId: userId ?? undefined },
    { query: { queryKey: getListSubmissionsQueryKey({ userId: userId ?? undefined }) } }
  );

  const { data: activeSubmission } = useGetSubmission(
    activeSubmissionId ?? "",
    {
      query: {
        enabled: !!activeSubmissionId,
        queryKey: getGetSubmissionQueryKey(activeSubmissionId ?? ""),
        refetchInterval: activeSubmissionId ? 3000 : false,
      }
    }
  );

  const { data: telemetry } = useGetSubmissionTelemetry(
    activeSubmissionId ?? "",
    {
      query: {
        enabled: !!activeSubmissionId && activeSubmission?.status === "completed",
        queryKey: getGetSubmissionTelemetryQueryKey(activeSubmissionId ?? ""),
      }
    }
  );

  const { data: executionStatus } = useQuery({
    queryKey: ["execution-status", activeTestRunId],
    queryFn: () => getJson<ExecutionStatus>(`/api/executions/${activeTestRunId}/status`),
    enabled: !!activeTestRunId,
    refetchInterval: activeTestRunId ? 2000 : false,
  });

  useEffect(() => {
    setCode(STARTER_CODE[language]);
  }, [language]);

  const handleSubmit = async () => {
    setRunError(null);
    const sub = await createSubmission.mutateAsync({
      data: { language, filename: `solution.${language === "cpp" ? "cpp" : language}`, code }
    });
    setActiveSubmissionId(sub.id);
    await queryClient.invalidateQueries({ queryKey: getListSubmissionsQueryKey() });
    await runSubmission.mutateAsync({ id: sub.id, data: {} });

    try {
      const execution = await postJson<ExecutionStartResponse>("/api/executions/start", {
        submission_id: sub.id,
        assets_to_analyze: assetUniverse,
      });
      setActiveTestRunId(execution.testRunId);
    } catch (err) {
      setRunError(err instanceof Error ? err.message : "Execution run failed to start");
    }
  };

  const stageIndex = (() => {
    if (!executionStatus) return -1;
    if (executionStatus.currentLayer === "technical") return 0;
    if (executionStatus.currentLayer === "fundamental") return 1;
    if (executionStatus.currentLayer === "sentiment") return 2;
    if (executionStatus.currentLayer === "execution") return 3;
    if (executionStatus.currentLayer === "paper") return 4;
    if (executionStatus.currentLayer === "completed") return 5;
    if (executionStatus.status === "failed") return -1;
    return 0;
  })();

  const latencyData = telemetry?.latencySeries?.map((p) => ({ t: p.t, v: p.v })) ?? [];
  const tpsData = telemetry?.tpsSeries?.map((p) => ({ t: p.t, v: p.v })) ?? [];

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-semibold text-muted-foreground uppercase tracking-widest">Signal Analysis</span>
          <Select value={language} onValueChange={(v) => setLanguage(v as "cpp" | "rust" | "go")}>
            <SelectTrigger className="w-28 h-8 text-xs font-mono" data-testid="select-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
              <SelectItem value="go">Go</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={createSubmission.isPending || runSubmission.isPending}
          className="h-8 text-xs font-mono uppercase tracking-wider gap-2"
          data-testid="button-submit"
        >
          <Upload className="h-3.5 w-3.5" />
          {createSubmission.isPending || runSubmission.isPending ? "Starting..." : "Run Analysis"}
        </Button>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        <ResizablePanel defaultSize={55} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 border-b border-border bg-card/50 flex items-center gap-2 shrink-0">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-mono text-muted-foreground">editor</span>
            </div>
            <div className="border-b border-border bg-card/30 p-3">
              <div className="mb-1 text-xs font-mono uppercase text-muted-foreground">Assets</div>
              <textarea
                value={assetUniverse}
                onChange={(event) => setAssetUniverse(event.target.value)}
                className="h-16 w-full resize-none rounded border border-border bg-background p-2 font-mono text-xs outline-none"
                spellCheck={false}
              />
            </div>
            <textarea
              data-testid="input-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 resize-none bg-[hsl(240_10%_4%)] text-foreground font-mono text-sm p-4 outline-none leading-relaxed"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={45} minSize={25}>
          <div className="h-full flex flex-col overflow-hidden">
            <div className="px-4 py-2 border-b border-border bg-card/50 flex items-center gap-2 shrink-0">
              <div className="h-2 w-2 rounded-full bg-chart-2" />
              <span className="text-xs font-mono text-muted-foreground">results</span>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {!activeSubmissionId && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Play className="h-10 w-10 text-muted-foreground/40 mb-4" />
                    <p className="text-sm text-muted-foreground">Submit your code to start a test run</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Results and telemetry will appear here</p>
                  </div>
                )}

                {activeSubmissionId && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Pipeline</span>
                        {executionStatus?.status === "failed" && (
                          <Badge variant="destructive" className="text-xs">Failed</Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        {STAGE_LABELS.map((label, i) => (
                          <div key={label} className="flex items-center gap-3">
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                              i < stageIndex ? "border-primary bg-primary/20" :
                              i === stageIndex ? "border-primary bg-primary animate-pulse" :
                              "border-border bg-transparent"
                            }`}>
                              {i < stageIndex && <div className="h-2 w-2 rounded-full bg-primary" />}
                            </div>
                            <span className={`text-xs font-mono ${i <= stageIndex ? "text-foreground" : "text-muted-foreground/50"}`}>{label}</span>
                            {i === stageIndex && stageIndex < 5 && (
                              <span className="text-xs text-primary animate-pulse">running...</span>
                            )}
                          </div>
                        ))}
                      </div>
                      {activeSubmission?.status !== "failed" && stageIndex >= 0 && (
                        <Progress value={executionStatus?.progressPct ?? (stageIndex / 5) * 100} className="mt-4 h-1" />
                      )}
                      {executionStatus && (
                        <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-mono">
                          <div className="rounded border border-border bg-card p-2">
                            <div className="uppercase text-muted-foreground/60">Assets</div>
                            <div>{executionStatus.assetsAnalyzed}/{executionStatus.assetsTotal}</div>
                          </div>
                          <div className="rounded border border-border bg-card p-2">
                            <div className="uppercase text-muted-foreground/60">Technical</div>
                            <div>{executionStatus.technicalPassCount}</div>
                          </div>
                          <div className="rounded border border-border bg-card p-2">
                            <div className="uppercase text-muted-foreground/60">Sentiment</div>
                            <div>{executionStatus.sentimentAvgScore?.toFixed(1) ?? "-"}</div>
                          </div>
                        </div>
                      )}
                      {activeTestRunId && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 h-8 gap-2 font-mono text-xs"
                          onClick={() => setLocation(`/leaderboard?run=${encodeURIComponent(activeTestRunId)}`)}
                        >
                          <Trophy className="h-3.5 w-3.5" />
                          Open Leaderboard
                        </Button>
                      )}
                    </div>

                    {runError && (
                      <div className="flex items-center gap-2 p-3 border border-destructive/30 rounded bg-destructive/10">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                        <p className="text-xs text-destructive">{runError}</p>
                      </div>
                    )}

                    {activeSubmission?.status === "completed" && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: "Composite", value: activeSubmission.compositeScore?.toFixed(1), icon: ChevronRight, color: "text-primary" },
                            { label: "Speed", value: activeSubmission.speedScore?.toFixed(1), icon: Zap, color: "text-chart-1" },
                            { label: "Stability", value: activeSubmission.stabilityScore?.toFixed(1), icon: Clock, color: "text-chart-2" },
                            { label: "Correctness", value: activeSubmission.correctnessScore?.toFixed(1), icon: CheckSquare, color: "text-chart-3" },
                          ].map((s) => (
                            <div key={s.label} className="bg-card border border-border rounded p-3">
                              <div className="text-xs text-muted-foreground font-mono uppercase">{s.label}</div>
                              <div className={`text-2xl font-bold font-mono mt-1 ${s.color}`}>{s.value ?? "—"}</div>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                          {[
                            { label: "p50", value: telemetry?.p50Latency != null ? `${telemetry.p50Latency.toFixed(2)}ms` : "—" },
                            { label: "p90", value: telemetry?.p90Latency != null ? `${telemetry.p90Latency.toFixed(2)}ms` : "—" },
                            { label: "p99", value: telemetry?.p99Latency != null ? `${telemetry.p99Latency.toFixed(2)}ms` : "—" },
                            { label: "Peak TPS", value: telemetry?.peakTps != null ? `${telemetry.peakTps.toFixed(0)}` : "—" },
                            { label: "Avg TPS", value: telemetry?.avgTps != null ? `${telemetry.avgTps.toFixed(0)}` : "—" },
                            { label: "Fill Acc", value: telemetry?.fillAccuracy != null ? `${(telemetry.fillAccuracy * 100).toFixed(1)}%` : "—" },
                          ].map((m) => (
                            <div key={m.label} className="bg-card border border-border rounded p-2">
                              <div className="text-muted-foreground/60 uppercase">{m.label}</div>
                              <div className="text-foreground mt-0.5">{m.value}</div>
                            </div>
                          ))}
                        </div>

                        {latencyData.length > 0 && (
                          <div>
                            <div className="text-xs font-mono text-muted-foreground uppercase mb-2">Latency Over Time</div>
                            <ResponsiveContainer width="100%" height={100}>
                              <LineChart data={latencyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="t" hide />
                                <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} width={30} />
                                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 11 }} />
                                <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" dot={false} strokeWidth={1.5} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}

                        {tpsData.length > 0 && (
                          <div>
                            <div className="text-xs font-mono text-muted-foreground uppercase mb-2">TPS Over Time</div>
                            <ResponsiveContainer width="100%" height={100}>
                              <LineChart data={tpsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="t" hide />
                                <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} width={35} />
                                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 11 }} />
                                <Line type="monotone" dataKey="v" stroke="hsl(var(--chart-2))" dot={false} strokeWidth={1.5} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </>
                    )}

                    {activeSubmission?.status === "failed" && (
                      <div className="flex items-center gap-2 p-3 border border-destructive/30 rounded bg-destructive/10">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                        <p className="text-xs text-destructive">Test run failed. Check your implementation and retry.</p>
                      </div>
                    )}
                  </>
                )}

                {submissions && submissions.length > 0 && (
                  <div>
                    <div className="text-xs font-mono text-muted-foreground uppercase mb-2">Previous Submissions</div>
                    <div className="space-y-1.5">
                      {submissions.slice(0, 5).map((s) => (
                        <div
                          key={s.id}
                          className={`flex items-center justify-between p-2 rounded border cursor-pointer text-xs font-mono transition-colors ${
                            s.id === activeSubmissionId ? "border-primary/50 bg-primary/5" : "border-border hover:border-border/80"
                          }`}
                          onClick={() => setActiveSubmissionId(s.id)}
                          data-testid={`row-submission-${s.id}`}
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] h-4">{s.language.toUpperCase()}</Badge>
                            <span className="text-muted-foreground">{new Date(s.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {s.compositeScore != null && (
                              <span className="text-primary">{s.compositeScore.toFixed(1)}</span>
                            )}
                            <span className={`uppercase ${
                              s.status === "completed" ? "text-primary" :
                              s.status === "failed" ? "text-destructive" :
                              "text-muted-foreground"
                            }`}>{s.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

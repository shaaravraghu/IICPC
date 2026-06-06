import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJson, postJson } from "@/lib/api";
import { useSocketEvent } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Activity,
  Trophy,
  DollarSign,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Calendar,
  Briefcase,
  Search,
} from "lucide-react";

type PipelineRun = {
  id: string;
  submissionId: string;
  status: string;
  currentStage: string | null;
  progressPct: number | null;
  startedAt: string;
  completedAt: string | null;
};

type PaperPosition = {
  symbol: string;
  side: string;
  quantity: number;
  entryPrice: number;
  exitPrice: number | null;
  pnl: number;
  pnlPct: number;
  status: string;
};

type PaperTradingExecutionResult = {
  testRunId: string;
  timeline: string;
  initialCapital: number;
  paperScore: number;
  metrics: {
    totalReturnPct: number;
    winRate: number;
    maxDrawdown: number;
    finalEquity: number;
  };
  positions: PaperPosition[];
};

export default function PaperTrading() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [requestedRunId, setRequestedRunId] = useState("");
  const [timeline, setTimeline] = useState("7d");
  const [capital, setCapital] = useState(100000);

  // Fetch latest runs to default to the most recent one
  const { data: runs, isLoading: runsLoading } = useQuery<PipelineRun[]>({
    queryKey: ["pipeline-runs-latest"],
    queryFn: () => fetchJson<PipelineRun[]>("/api/pipeline/runs?limit=1"),
    refetchInterval: 5000,
  });

  const activeRunId = requestedRunId.trim() || runs?.[0]?.id || "";

  // Query for fetching existing paper trading positions
  const { data: positionsData, isLoading: positionsLoading } = useQuery<{
    testRunId: string;
    positions: PaperPosition[];
  }>({
    queryKey: ["paper-trading-positions", activeRunId],
    queryFn: () => fetchJson<{ testRunId: string; positions: PaperPosition[] }>(`/api/paper-trading/${activeRunId}/positions`),
    enabled: activeRunId.length > 0,
  });

  // Query for fetching status (to get paper score)
  const { data: runStatus, isLoading: statusLoading } = useQuery<{
    paperAvgScore: number | null;
  }>({
    queryKey: ["execution-status-paper", activeRunId],
    queryFn: () => fetchJson<{ paperAvgScore: number | null }>(`/api/executions/${activeRunId}/status`),
    enabled: activeRunId.length > 0,
  });

  // Socket event listener to auto-invalidate queries and get live P&L updates
  const { data: leaderboardUpdate } = useSocketEvent<any>(
    ["leaderboard:update", "leaderboard:rows", "leaderboard-update"],
    activeRunId ? `leaderboard:${activeRunId}` : "leaderboard"
  );

  useEffect(() => {
    if (leaderboardUpdate) {
      queryClient.invalidateQueries({ queryKey: ["paper-trading-positions", activeRunId] });
      queryClient.invalidateQueries({ queryKey: ["execution-status-paper", activeRunId] });
    }
  }, [leaderboardUpdate, activeRunId, queryClient]);

  // Execute paper trading mutation
  const executeMutation = useMutation<PaperTradingExecutionResult, Error, { testRunId: string; initialCapital: number; timeline: string }>({
    mutationFn: (variables) =>
      postJson<PaperTradingExecutionResult>("/api/paper-trading/execute", {
        test_run_id: variables.testRunId,
        initial_capital: variables.initialCapital,
        timeline: variables.timeline,
      }),
    onSuccess: (data) => {
      toast({
        title: "Paper Trading Simulation Succeeded",
        description: `Simulated timeline: ${data.timeline}. Capitalized at $${data.initialCapital.toLocaleString()}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["paper-trading-positions", activeRunId] });
      queryClient.invalidateQueries({ queryKey: ["execution-status-paper", activeRunId] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Simulation Failed",
        description: error.message || "Failed to execute paper trading simulation.",
      });
    },
  });

  const handleStartSimulation = () => {
    if (!activeRunId) {
      toast({
        variant: "destructive",
        title: "No active run ID selected",
        description: "Please trigger an analysis run first or enter a valid Test Run ID.",
      });
      return;
    }
    executeMutation.mutate({
      testRunId: activeRunId,
      initialCapital: capital,
      timeline,
    });
  };

  const loading = runsLoading || positionsLoading || statusLoading;
  const positions = positionsData?.positions ?? [];
  const paperScore = runStatus?.paperAvgScore ?? null;

  // Calculate quick metrics based on current positions
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const winRate = positions.length === 0
    ? 0
    : (positions.filter((p) => p.pnl > 0).length / positions.length) * 100;
  const totalReturnPct = positions.length === 0
    ? 0
    : (totalPnl / (capital || 100000)) * 100;

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header section */}
      <div className="shrink-0 border-b border-border bg-card/30 px-8 py-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Paper Trading Simulator</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {activeRunId ? `Testing Strategy Run: ${activeRunId}` : "Select a run to trade"}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={requestedRunId}
                onChange={(event) => setRequestedRunId(event.target.value)}
                placeholder="Test run ID"
                className="h-9 w-full pl-8 font-mono text-xs sm:w-80"
              />
            </div>
            <Badge variant="outline" className="h-9 justify-center gap-2 rounded px-3 font-mono text-xs bg-card">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              live
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-8 overflow-hidden min-h-0">
        {/* Left column: controls & parameters */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          <Card className="bg-card/40 backdrop-blur-md border-border/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
                <Briefcase className="h-4 w-4 text-primary" /> Setup Simulation
              </CardTitle>
              <CardDescription>
                Deploy your strategy against historical performance with mock capital.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Initial Capital (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(Number(e.target.value))}
                    className="pl-9 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Trade Horizon Timeline
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["7d", "30d", "90d"].map((t) => (
                    <Button
                      key={t}
                      variant={timeline === t ? "default" : "outline"}
                      onClick={() => setTimeline(t)}
                      className="font-mono text-xs uppercase"
                    >
                      <Calendar className="mr-1.5 h-3.5 w-3.5" /> {t}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleStartSimulation}
                disabled={executeMutation.isPending || loading}
                className="w-full font-mono uppercase tracking-wider text-xs h-10 gap-2"
              >
                {executeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Simulating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Start Paper Trade
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Performance scorecard */}
          <Card className="bg-card/40 backdrop-blur-md border-border/80 flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
                <Trophy className="h-4 w-4 text-yellow-400" /> Scorecard & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded border border-border bg-card/60 p-4">
                  <div className="text-xs text-muted-foreground font-mono uppercase">Paper Score</div>
                  <div className="text-3xl font-mono font-bold mt-1 text-primary">
                    {paperScore != null ? paperScore.toFixed(1) : "—"}
                  </div>
                  <div className="text-[10px] text-muted-foreground/60 mt-1">Weight: 25% of Composite</div>
                </div>

                <div className="rounded border border-border bg-card/60 p-4">
                  <div className="text-xs text-muted-foreground font-mono uppercase">Total Return</div>
                  <div className={`text-3xl font-mono font-bold mt-1 flex items-center ${
                    totalReturnPct >= 0 ? "text-emerald-400" : "text-rose-500"
                  }`}>
                    {totalReturnPct >= 0 ? "+" : ""}
                    {totalReturnPct.toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-muted-foreground/60 mt-1">Based on paper execution</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded border border-border bg-card/60 p-4">
                  <div className="text-xs text-muted-foreground font-mono uppercase">Win Rate</div>
                  <div className="text-2xl font-mono font-bold mt-1">
                    {winRate.toFixed(1)}%
                  </div>
                </div>

                <div className="rounded border border-border bg-card/60 p-4">
                  <div className="text-xs text-muted-foreground font-mono uppercase">Total P&L</div>
                  <div className={`text-2xl font-mono font-bold mt-1 ${
                    totalPnl >= 0 ? "text-emerald-400" : "text-rose-500"
                  }`}>
                    {totalPnl >= 0 ? "+" : ""}
                    ${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: positions table */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Card className="bg-card/40 backdrop-blur-md border-border/80 flex-1 flex flex-col overflow-hidden">
            <CardHeader className="shrink-0 border-b border-border">
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
                <Activity className="h-4 w-4 text-emerald-400" /> Active & Closed Positions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                {loading ? (
                  <div className="space-y-3 p-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : positions.length > 0 ? (
                  <div className="min-w-full">
                    {/* Table Headers */}
                    <div className="grid grid-cols-12 gap-3 border-b border-border bg-card/20 px-6 py-3 font-mono text-xs uppercase text-muted-foreground">
                      <div className="col-span-2">Symbol</div>
                      <div className="col-span-2 text-right">Side</div>
                      <div className="col-span-2 text-right">Quantity</div>
                      <div className="col-span-2 text-right">Entry</div>
                      <div className="col-span-2 text-right">Exit / Current</div>
                      <div className="col-span-2 text-right">P&L</div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-border/60">
                      {positions.map((pos, index) => {
                        const isProfit = pos.pnl >= 0;
                        return (
                          <div
                            key={`${pos.symbol}-${index}`}
                            className="grid grid-cols-12 gap-3 items-center px-6 py-4 transition-colors hover:bg-card/30"
                          >
                            <div className="col-span-2 font-mono font-bold text-foreground">
                              {pos.symbol}
                              <Badge variant="outline" className="ml-2 py-0 px-1 text-[9px] font-normal uppercase bg-background">
                                {pos.status}
                              </Badge>
                            </div>
                            <div className="col-span-2 text-right font-mono text-xs text-muted-foreground uppercase">
                              {pos.side}
                            </div>
                            <div className="col-span-2 text-right font-mono text-xs">
                              {pos.quantity.toLocaleString()}
                            </div>
                            <div className="col-span-2 text-right font-mono text-xs text-muted-foreground">
                              ${pos.entryPrice.toFixed(2)}
                            </div>
                            <div className="col-span-2 text-right font-mono text-xs text-muted-foreground">
                              ${(pos.exitPrice ?? pos.entryPrice).toFixed(2)}
                            </div>
                            <div className={`col-span-2 text-right font-mono text-xs font-semibold flex items-center justify-end ${
                              isProfit ? "text-emerald-400" : "text-rose-500"
                            }`}>
                              {isProfit ? <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" /> : <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />}
                              <span>
                                {isProfit ? "+" : ""}
                                ${pos.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({pos.pnlPct.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-center">
                    <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground/30" />
                    <p className="text-muted-foreground text-sm">No paper trades active</p>
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      Select a test run and click "Start Paper Trade" to simulate positions.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

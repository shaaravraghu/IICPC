import { useGetPipelineStatus, getGetPipelineStatusQueryKey, useGetBotFleetStatus, getGetBotFleetStatusQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const ok = status === "healthy" || status === "running" || status === "online";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${ok ? "bg-[#38bdf8]/15 text-[#38bdf8]" : "bg-destructive/15 text-destructive"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" : "bg-destructive"} animate-pulse`} />
      {status.toUpperCase()}
    </span>
  );
}

export default function Home() {
  const { data: pipeline, isLoading: pipelineLoading } = useGetPipelineStatus({
    query: {
      refetchInterval: 5000,
      queryKey: getGetPipelineStatusQueryKey(),
    }
  });

  const { data: botFleet, isLoading: botFleetLoading } = useGetBotFleetStatus({
    query: {
      refetchInterval: 5000,
      queryKey: getGetBotFleetStatusQueryKey(),
    }
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-[40%] h-[300px] rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4c1d95 0%, transparent 70%)" }}
      />

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to right, #38bdf8, #818cf8)" }}>
          Pipeline Monitor
        </h1>
        <p className="text-muted-foreground mt-1 font-light">Mission control for platform health and bot fleet status.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Pipeline Status",
            content: pipelineLoading ? null : (
              <div className={`text-2xl font-black uppercase ${pipeline?.overall === "healthy" ? "text-[#38bdf8]" : "text-destructive"}`}>
                {pipeline?.overall ?? "UNKNOWN"}
              </div>
            ),
          },
          {
            label: "Total Bots",
            content: botFleetLoading ? null : (
              <div className="text-2xl font-black text-white">{botFleet?.totalBots ?? 0}</div>
            ),
          },
          {
            label: "Active Runs",
            content: pipelineLoading ? null : (
              <div className="text-2xl font-black text-white">{pipeline?.activeRuns ?? 0}</div>
            ),
          },
          {
            label: "Queue Depth",
            content: pipelineLoading ? null : (
              <div className="text-2xl font-black text-white">{pipeline?.queueDepth ?? 0}</div>
            ),
          },
        ].map((s) => (
          <GlassCard key={s.label}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{s.label}</p>
            {s.content === null
              ? <Skeleton className="h-8 w-24 bg-white/5" />
              : s.content}
          </GlassCard>
        ))}
      </div>

      {/* Main panels */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Components */}
        <GlassCard>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Components</h2>
          {pipelineLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full bg-white/5" />
              <Skeleton className="h-14 w-full bg-white/5" />
              <Skeleton className="h-14 w-full bg-white/5" />
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {pipeline?.components?.map((comp) => (
                <div key={comp.name} className="flex items-center justify-between py-3.5">
                  <div>
                    <div className="font-semibold text-sm text-white">{comp.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{comp.description}</div>
                  </div>
                  <StatusPill status={comp.status} />
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Bot Fleet */}
        <GlassCard>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Bot Fleet Classes</h2>
          {botFleetLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full bg-white/5" />
              <Skeleton className="h-14 w-full bg-white/5" />
              <Skeleton className="h-14 w-full bg-white/5" />
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {botFleet?.classes?.map((cls) => (
                <div key={cls.class} className="flex items-center justify-between py-3.5">
                  <div>
                    <div className="font-semibold text-sm text-white capitalize">{cls.class} Bots</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{cls.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-[#38bdf8]">
                      {cls.activeCount ?? 0} <span className="text-muted-foreground font-normal">/ {cls.count}</span>
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">{cls.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

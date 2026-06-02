import { useGetPipelineStatus, getGetPipelineStatusQueryKey, useGetBotFleetStatus, getGetBotFleetStatusQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

function TerminalPanel({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`term-panel p-5 ${className}`}>
      {title && (
        <div className="text-primary text-xs uppercase tracking-widest border-b border-primary/25 pb-3 mb-4">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const ok = status === "healthy" || status === "running" || status === "online";
  return (
    <span className={`text-xs font-mono tracking-wider ${ok ? "text-primary" : "text-destructive"}`}>
      [{status.toUpperCase()}]
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
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="border-b border-primary/25 pb-4">
        <h1 className="text-sm uppercase tracking-widest text-primary">
          &gt; PIPELINE_MONITOR
        </h1>
        <p className="text-xs text-muted-foreground mt-1 tracking-wide">
          // MISSION_CONTROL — PLATFORM_HEALTH AND BOT_FLEET_STATUS
        </p>
      </div>

      {/* Stat strip */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "PIPELINE_STATUS",
            value: pipelineLoading
              ? null
              : <span className={pipeline?.overall === "healthy" ? "text-primary" : "text-destructive"}>
                  {pipeline?.overall?.toUpperCase() ?? "UNKNOWN"}
                </span>,
          },
          {
            label: "TOTAL_BOTS",
            value: botFleetLoading ? null : <span>{botFleet?.totalBots ?? 0}</span>,
          },
          {
            label: "ACTIVE_RUNS",
            value: pipelineLoading ? null : <span>{pipeline?.activeRuns ?? 0}</span>,
          },
          {
            label: "QUEUE_DEPTH",
            value: pipelineLoading ? null : <span>{pipeline?.queueDepth ?? 0}</span>,
          },
        ].map((s) => (
          <TerminalPanel key={s.label}>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">{s.label}</div>
            {s.value === null
              ? <Skeleton className="h-7 w-24 bg-primary/10" />
              : <div className="text-2xl font-bold tracking-wider">{s.value}</div>
            }
          </TerminalPanel>
        ))}
      </div>

      {/* Main panels */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Components */}
        <TerminalPanel title="// COMPONENTS">
          {pipelineLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full bg-primary/10" />
              <Skeleton className="h-10 w-full bg-primary/10" />
              <Skeleton className="h-10 w-full bg-primary/10" />
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-primary/10">
              {pipeline?.components?.map((comp) => (
                <div key={comp.name} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide">{comp.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{comp.description}</div>
                  </div>
                  <StatusBadge status={comp.status} />
                </div>
              ))}
            </div>
          )}
        </TerminalPanel>

        {/* Bot Fleet */}
        <TerminalPanel title="// BOT_FLEET_CLASSES">
          {botFleetLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full bg-primary/10" />
              <Skeleton className="h-10 w-full bg-primary/10" />
              <Skeleton className="h-10 w-full bg-primary/10" />
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-primary/10">
              {botFleet?.classes?.map((cls) => (
                <div key={cls.class} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide">
                      {cls.class}_BOTS
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{cls.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-primary font-bold">
                      {cls.activeCount ?? 0} / {cls.count}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {cls.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TerminalPanel>
      </div>
    </div>
  );
}

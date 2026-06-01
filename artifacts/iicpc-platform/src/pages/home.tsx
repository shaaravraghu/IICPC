import { useGetPipelineStatus, getGetPipelineStatusQueryKey, useGetBotFleetStatus, getGetBotFleetStatusQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Server, Cpu, Database, ActivitySquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Pipeline Monitor</h1>
        <p className="text-muted-foreground mt-2">Mission control for platform health and bot fleet status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Status</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {pipelineLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className={`text-2xl font-bold uppercase ${pipeline?.overall === 'healthy' ? 'text-primary' : 'text-destructive'}`}>
                {pipeline?.overall || 'UNKNOWN'}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {botFleetLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{botFleet?.totalBots || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Runs</CardTitle>
            <ActivitySquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {pipelineLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{pipeline?.activeRuns || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Depth</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {pipelineLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{pipeline?.queueDepth || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pipelineLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {pipeline?.components?.map((comp) => (
                  <div key={comp.name} className="flex items-center justify-between p-4 border border-border rounded-md">
                    <div>
                      <div className="font-semibold">{comp.name}</div>
                      <div className="text-sm text-muted-foreground">{comp.description}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-mono font-bold uppercase ${comp.status === 'healthy' ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                      {comp.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Bot Fleet Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {botFleetLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {botFleet?.classes?.map((cls) => (
                  <div key={cls.class} className="flex items-center justify-between p-4 border border-border rounded-md">
                    <div>
                      <div className="font-semibold capitalize">{cls.class} Bots</div>
                      <div className="text-sm text-muted-foreground">{cls.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">{cls.activeCount || 0} / {cls.count}</div>
                      <div className="text-xs text-muted-foreground uppercase">{cls.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

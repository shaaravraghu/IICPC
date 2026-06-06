import { Link, useLocation } from "wouter";
import { Activity, Code2, Trophy, BookOpen, UserCircle, LogOut, TrendingUp } from "lucide-react";
import { useClerk } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

type PipelineStatus = {
  overall: "healthy" | "degraded" | "down";
  activeRuns: number;
  queueDepth: number;
  updatedAt: string;
};

const menuItems = [
  { icon: Activity,    label: "Monitor",     path: "/" },
  { icon: Code2,       label: "Editor",      path: "/editor" },
  { icon: Trophy,      label: "Leaderboard", path: "/leaderboard" },
  { icon: TrendingUp,  label: "Paper Trading", path: "/paper-trading" },
  { icon: BookOpen,    label: "Learn",       path: "/learn" },
  { icon: UserCircle,  label: "Profile",     path: "/profile" },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { data: pipelineStatus } = useQuery({
    queryKey: ["sidebar-pipeline-status"],
    queryFn: async () => {
      const response = await fetch("/api/pipeline/status");
      if (!response.ok) throw new Error(`Pipeline status failed with ${response.status}`);
      return response.json() as Promise<PipelineStatus>;
    },
    refetchInterval: 5000,
  });

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-white/8 p-5">
        <div
          className="text-xl font-black tracking-tight bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(to right, #38bdf8, #818cf8)" }}
        >
          IICPC
        </div>
        <p className="text-xs text-muted-foreground font-medium tracking-wider mt-0.5 uppercase">
          Benchmarking Platform
        </p>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarMenu>
          {menuItems.map((item) => {
            const active = location === item.path;
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.label}
                  className={
                    active
                      ? "bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/15 hover:text-[#38bdf8]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }
                >
                  <Link href={item.path} className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${active ? "text-[#38bdf8]" : ""}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
        <div className="mx-4 mt-4 rounded border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-muted-foreground">Runs</span>
            <span className={`h-2 w-2 rounded-full ${
              pipelineStatus?.overall === "down"
                ? "bg-destructive"
                : pipelineStatus?.overall === "degraded"
                ? "bg-yellow-400"
                : "bg-primary"
            }`} />
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <div>
              <div className="text-muted-foreground/60">Active</div>
              <div className="text-foreground">{pipelineStatus?.activeRuns ?? 0}</div>
            </div>
            <div>
              <div className="text-muted-foreground/60">Queue</div>
              <div className="text-foreground">{pipelineStatus?.queueDepth ?? 0}</div>
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/8 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut()}
              className="text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

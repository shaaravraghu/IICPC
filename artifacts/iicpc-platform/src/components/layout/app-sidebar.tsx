import { Link, useLocation } from "wouter";
import { Activity, Code2, Trophy, BookOpen, UserCircle, LogOut } from "lucide-react";
import { useClerk } from "@clerk/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: Activity,    label: "Monitor",     path: "/" },
  { icon: Code2,       label: "Editor",      path: "/editor" },
  { icon: Trophy,      label: "Leaderboard", path: "/leaderboard" },
  { icon: BookOpen,    label: "Learn",       path: "/learn" },
  { icon: UserCircle,  label: "Profile",     path: "/profile" },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { signOut } = useClerk();

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

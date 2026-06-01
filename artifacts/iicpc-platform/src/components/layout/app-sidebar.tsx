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

export function AppSidebar() {
  const [location] = useLocation();
  const { signOut } = useClerk();

  const menuItems = [
    { icon: Activity, label: "Monitor", path: "/" },
    { icon: Code2, label: "Editor", path: "/editor" },
    { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
    { icon: BookOpen, label: "Learn", path: "/learn" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-4">
        <h2 className="text-xl font-bold text-primary tracking-tight">IICPC</h2>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
          Benchmarking Platform
        </p>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={location === item.path}
                tooltip={item.label}
              >
                <Link href={item.path}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

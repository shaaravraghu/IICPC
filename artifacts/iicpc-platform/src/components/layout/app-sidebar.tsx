import { Link, useLocation } from "wouter";
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
  { prefix: ">", label: "MONITOR", path: "/" },
  { prefix: "</>", label: "EDITOR", path: "/editor" },
  { prefix: "#", label: "LEADERBOARD", path: "/leaderboard" },
  { prefix: "?", label: "LEARN", path: "/learn" },
  { prefix: "~", label: "PROFILE", path: "/profile" },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { signOut } = useClerk();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-primary/25 p-4">
        <div className="text-primary text-base font-bold tracking-tight">
          &gt;_ IICPC
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">
          // BENCHMARKING_PLATFORM
        </div>
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
                  className={active ? "border-l-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"}
                >
                  <Link href={item.path} className="flex items-center gap-3 px-4 py-2">
                    <span className="text-primary text-xs w-5 shrink-0">{item.prefix}</span>
                    <span className="tracking-widest text-xs">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-primary/25 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut()}
              className="text-muted-foreground hover:text-foreground flex items-center gap-3 px-4 py-2"
            >
              <span className="text-primary text-xs w-5 shrink-0">$</span>
              <span className="tracking-widest text-xs">SIGN_OUT</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

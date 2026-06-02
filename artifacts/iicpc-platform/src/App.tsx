import { useEffect, useRef, useState } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { dark } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

import Home from "@/pages/home";
import Editor from "@/pages/editor";
import Leaderboard from "@/pages/leaderboard";
import Learn from "@/pages/learn";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  theme: dark,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#00e5cc",
    colorBackground: "hsl(240 10% 4%)",
    colorInput: "hsl(240 10% 8%)",
    colorInputForeground: "hsl(0 0% 85%)",
    colorForeground: "hsl(0 0% 85%)",
    colorMutedForeground: "hsl(240 5% 50%)",
    colorDanger: "hsl(348 100% 58%)",
    colorNeutral: "hsl(240 10% 8%)",
    fontFamily: '"Space Mono", monospace',
    borderRadius: "0px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#060607] w-[440px] max-w-full overflow-hidden border border-[#00e5cc]/25",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-foreground",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "text-foreground",
    formFieldLabel: "text-foreground",
    footerActionLink: "text-primary",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    identityPreviewEditButton: "text-primary",
    formFieldSuccessText: "text-primary",
    alertText: "text-destructive",
    logoBox: "",
    logoImage: "",
    socialButtonsBlockButton: "border-border",
    formButtonPrimary: "bg-primary text-primary-foreground",
    formFieldInput: "bg-input text-foreground border-border",
    footerAction: "",
    dividerLine: "bg-border",
    alert: "bg-destructive/10 border-destructive",
    otpCodeFieldInput: "border-border",
    formFieldRow: "",
    main: "",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 overflow-auto bg-background flex flex-col min-h-screen">
            {children}
          </main>
        </SidebarProvider>
      </Show>
      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}

const LEADERBOARD_DATA = [
  { rank: 1, team: "AlphaBot",     score: "99.84", latency: "1.2ms" },
  { rank: 2, team: "NullPtr Team", score: "98.12", latency: "1.5ms" },
  { rank: 3, team: "0xDEAD",       score: "95.44", latency: "2.1ms" },
  { rank: 4, team: "FastLane",     score: "91.02", latency: "3.4ms" },
  { rank: 5, team: "MemAligned",   score: "88.99", latency: "4.8ms" },
];

const PLATFORM_STATUS = [
  { name: "NATS" },
  { name: "DOCKER_SWARM" },
  { name: "CLICKHOUSE" },
  { name: "GO_BOTS" },
];

function LandingPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toISOString().split("T")[1].replace("Z", "");

  return (
    <div className="min-h-screen bg-background text-foreground font-mono flex flex-col relative overflow-hidden">
      {/* Top status bar */}
      <div className="flex justify-between items-center border-b border-primary/25 px-6 py-2 text-xs shrink-0">
        <div className="flex gap-3">
          <span className="text-primary">SYS.TIME:</span>
          <span>{timeStr}</span>
        </div>
        <div className="flex gap-3">
          <span className="text-primary">NET.STAT:</span>
          <span className="text-green-400">OPTIMAL</span>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 flex flex-col justify-center z-10">
        {/* Hero */}
        <div className="mb-14">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight uppercase">
            <span className="text-primary">{">"}</span>{" "}
            IICPC_BENCHMARKING_
            <br />
            <span className="pl-8">
              PLATFORM_2026
              <span className="animate-blink text-primary">_</span>
            </span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl mb-8 leading-relaxed uppercase tracking-wide">
            ELITE DISTRIBUTED EXCHANGE ENGINE COMPETITION. TOP 1% SYSTEMS
            PROGRAMMERS ONLY. SUBMIT C++/RUST/GO ORDERBOOK ENGINES.
            STRESS-TESTED BY 200 SYNTHETIC BOTS.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={`${basePath}/sign-in`}
              className="border border-primary text-primary hover:bg-primary/15 px-8 py-3 uppercase tracking-widest text-sm transition-colors"
            >
              [CONNECT]
            </a>
            <a
              href={`${basePath}/sign-up`}
              className="bg-primary text-primary-foreground hover:bg-primary/80 px-8 py-3 uppercase tracking-widest text-sm font-bold transition-colors"
            >
              [REGISTER]
            </a>
          </div>
        </div>

        {/* Data panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="col-span-1 lg:col-span-2 term-panel p-6">
            <div className="flex justify-between items-center border-b border-primary/25 pb-3 mb-4">
              <h2 className="text-primary text-xs uppercase tracking-widest">
                LIVE_LEADERBOARD
              </h2>
              <span className="text-xs text-muted-foreground animate-pulse">
                UPDATING...
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-muted-foreground uppercase border-b border-primary/15">
                  <tr>
                    <th className="px-2 py-2">RNK</th>
                    <th className="px-2 py-2">TEAM_ID</th>
                    <th className="px-2 py-2 text-right">SCORE</th>
                    <th className="px-2 py-2 text-right">LATENCY</th>
                  </tr>
                </thead>
                <tbody>
                  {LEADERBOARD_DATA.map((row) => (
                    <tr
                      key={row.rank}
                      className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-2 py-3 text-primary font-bold">{row.rank}</td>
                      <td className="px-2 py-3">{row.team}</td>
                      <td className="px-2 py-3 text-right">{row.score}</td>
                      <td className="px-2 py-3 text-right text-muted-foreground">{row.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side panels */}
          <div className="col-span-1 space-y-6">
            {/* Platform status */}
            <div className="term-panel p-6">
              <h2 className="text-primary text-xs uppercase tracking-widest border-b border-primary/25 pb-3 mb-4">
                PLATFORM_STATUS
              </h2>
              <div className="space-y-3 text-xs">
                {PLATFORM_STATUS.map((s) => (
                  <div key={s.name} className="flex justify-between items-center">
                    <span>{s.name}</span>
                    <span className="text-green-400 tracking-wider">[ONLINE]</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Global metrics */}
            <div className="term-panel p-6">
              <h2 className="text-primary text-xs uppercase tracking-widest border-b border-primary/25 pb-3 mb-4">
                GLOBAL_METRICS
              </h2>
              <div className="space-y-5 text-xs">
                <div>
                  <div className="text-muted-foreground mb-1">REQ/SEC</div>
                  <div className="text-2xl text-primary font-bold tracking-wider">56.12</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">ACTIVE_NODES</div>
                  <div className="text-2xl font-bold tracking-wider">1,024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/25 px-6 py-3 text-xs text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-3 z-10 shrink-0">
        <div>IICPC_BENCHMARK_2026 // ALL_RIGHTS_RESERVED</div>
        <a
          href={`${basePath}/sign-up`}
          className="text-primary hover:text-foreground transition-colors"
        >
          INITIALIZE_REGISTRATION {">"}
        </a>
      </footer>
    </div>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />

      <Route path="/">
        <ProtectedLayout><Home /></ProtectedLayout>
      </Route>
      <Route path="/editor">
        <ProtectedLayout><Editor /></ProtectedLayout>
      </Route>
      <Route path="/leaderboard">
        <ProtectedLayout><Leaderboard /></ProtectedLayout>
      </Route>
      <Route path="/learn">
        <ProtectedLayout><Learn /></ProtectedLayout>
      </Route>
      <Route path="/profile">
        <ProtectedLayout><Profile /></ProtectedLayout>
      </Route>

      <Route>
        <ProtectedLayout><NotFound /></ProtectedLayout>
      </Route>
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <AppRouter />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;

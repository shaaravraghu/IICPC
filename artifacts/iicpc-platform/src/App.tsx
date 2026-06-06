import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { dark } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Activity, Zap, ShieldCheck, ChevronRight } from "lucide-react";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WebSocketProvider } from "@/hooks/useWebSocket";

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
    colorPrimary: "#38bdf8",
    colorBackground: "hsl(240 15% 5%)",
    colorInput: "hsl(240 15% 10%)",
    colorInputForeground: "hsl(0 0% 100%)",
    colorForeground: "hsl(0 0% 100%)",
    colorMutedForeground: "hsl(217 20% 55%)",
    colorDanger: "hsl(348 100% 58%)",
    colorNeutral: "hsl(240 15% 10%)",
    fontFamily: '"Inter", sans-serif',
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#0a0a12] w-[440px] max-w-full overflow-hidden border border-white/10 rounded-2xl",
    card: "!shadow-none !border-0 !bg-transparent",
    footer: "!shadow-none !border-0 !bg-transparent",
    headerTitle: "text-white",
    headerSubtitle: "text-slate-400",
    socialButtonsBlockButtonText: "text-white",
    formFieldLabel: "text-white",
    footerActionLink: "text-[#38bdf8]",
    footerActionText: "text-slate-400",
    dividerText: "text-slate-400",
    identityPreviewEditButton: "text-[#38bdf8]",
    formFieldSuccessText: "text-[#38bdf8]",
    alertText: "text-destructive",
    logoBox: "",
    logoImage: "",
    socialButtonsBlockButton: "border-white/10",
    formButtonPrimary: "bg-[#38bdf8] text-[#030308]",
    formFieldInput: "bg-white/5 text-white border-white/10",
    footerAction: "",
    dividerLine: "bg-white/10",
    alert: "bg-destructive/10 border-destructive",
    otpCodeFieldInput: "border-white/10",
    formFieldRow: "",
    main: "",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4c1d95 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)" }} />
      <div className="relative z-10">
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4c1d95 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)" }} />
      <div className="relative z-10">
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
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

const FEATURES = [
  {
    icon: Zap,
    title: "Speed",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.5)",
    bgGlow: "#38bdf8",
    desc: "Microsecond latency is the baseline. Your engine will be hammered with millions of concurrent orders. Every cycle counts.",
  },
  {
    icon: ShieldCheck,
    title: "Stability",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.5)",
    bgGlow: "#818cf8",
    desc: "No segfaults allowed. Our synthetic fleet simulates malicious actors, network partitions, and erratic market conditions.",
  },
  {
    icon: Activity,
    title: "Correctness",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.5)",
    bgGlow: "#c084fc",
    desc: "Price-time priority is absolute. Every match is cryptographically verified against a deterministic reference implementation.",
  },
];

const BAR_HEIGHTS = [30, 50, 40, 70, 60, 90, 80, 100, 75, 85, 45, 65];

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030308] text-white overflow-hidden font-sans relative">
      {/* Background orb glows */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4c1d95 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1e1b4b 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)" }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='40' height='40' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20">
          {/* Decorative chart behind hero */}
          <div className="absolute inset-0 flex items-end justify-center opacity-[0.03] pointer-events-none overflow-hidden pb-[20vh]">
            <div className="flex items-end gap-4 w-full max-w-5xl h-[50vh]">
              {BAR_HEIGHTS.map((h, i) => (
                <div key={i} className="w-full bg-white rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto relative z-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8] text-sm font-medium mb-10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8] animate-pulse" />
              Season 2 Registration Open
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05]">
              <span className="block text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.7))" }}>
                DISTRIBUTED
              </span>
              <span className="block text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(to right, #38bdf8, #818cf8, #c084fc)" }}>
                ORDERBOOK
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              The elite benchmarking platform for systems programmers. Submit C++, Rust, or Go engines. Withstand 200 synthetic bots. Claim your rank.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`${basePath}/sign-in`}
                className="relative w-full sm:w-auto px-8 py-4 rounded-xl bg-[#38bdf8] text-black font-bold tracking-wide hover:bg-[#7dd3fc] transition-colors group"
              >
                <div className="absolute inset-0 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:shadow-[0_0_32px_rgba(56,189,248,0.6)] transition-shadow pointer-events-none" />
                Sign In
              </a>
              <a
                href={`${basePath}/sign-up`}
                className="relative w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-all overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                Register Engine
              </a>
            </div>
          </div>
        </section>

        {/* Social proof ticker */}
        <section className="border-y border-white/10 bg-black/40 backdrop-blur-md py-5 px-6">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6 text-sm text-slate-400 font-medium uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">200</span> Synthetic Bots
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <span className="text-[#38bdf8] font-bold">3</span> Supported Languages
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              Live Scoring
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, color, glow, bgGlow, desc }) => (
              <div
                key={title}
                className="relative p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-colors overflow-hidden group"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                  style={{ background: bgGlow }}
                />
                <Icon
                  className="w-8 h-8 mb-6"
                  style={{ color, filter: `drop-shadow(0 0 8px ${glow})` }}
                />
                <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
                <p className="text-slate-400 leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 px-6 relative flex flex-col items-center justify-center text-center border-t border-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b]/20 to-transparent pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white relative z-10">
            Ready to deploy your engine?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg relative z-10 font-light">
            Join thousands of systems engineers competing for the title of the fastest distributed matching engine.
          </p>
          <div className="relative z-10 group cursor-pointer p-[1px] rounded-xl overflow-hidden" style={{ background: "linear-gradient(to right, #38bdf8, #818cf8, #c084fc)" }}>
            <div className="absolute inset-0 opacity-50 blur-xl group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(to right, #38bdf8, #818cf8, #c084fc)" }} />
            <a
              href={`${basePath}/sign-up`}
              className="relative flex items-center gap-2 bg-[#030308] px-8 py-4 rounded-xl text-white font-medium group-hover:bg-transparent transition-colors duration-300"
            >
              Start Competing <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-slate-600 border-t border-white/5">
          <p>IICPC Benchmarking Platform © {new Date().getFullYear()}</p>
        </footer>
      </main>
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
        <WebSocketProvider>
          <TooltipProvider>
            <AppRouter />
            <Toaster />
          </TooltipProvider>
        </WebSocketProvider>
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

import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { dark } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
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
    colorPrimary: "hsl(192 100% 50%)",
    colorBackground: "hsl(240 10% 6%)",
    colorInput: "hsl(240 10% 12%)",
    colorInputForeground: "hsl(0 0% 98%)",
    colorForeground: "hsl(0 0% 98%)",
    colorMutedForeground: "hsl(240 5% 65%)",
    colorDanger: "hsl(348 100% 58%)",
    colorNeutral: "hsl(240 10% 12%)",
    fontFamily: '"Inter", sans-serif',
    borderRadius: "0.25rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#0f0f10] rounded-sm w-[440px] max-w-full overflow-hidden border border-[#1c1c20]",
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

function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse inline-block" />
          IICPC Summer Hackathon 2026
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
          Distributed Benchmarking<br />Platform
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Submit your exchange engine. Survive 200 synthetic bots. Claim the top spot.
        </p>
      </div>

      <div className="flex gap-3 mb-12">
        <a
          href={`${basePath}/sign-in`}
          className="inline-flex items-center justify-center h-10 px-6 rounded bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Sign In
        </a>
        <a
          href={`${basePath}/sign-up`}
          className="inline-flex items-center justify-center h-10 px-6 rounded border border-border text-foreground text-sm font-semibold hover:bg-card transition-colors"
        >
          Register
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4 text-left max-w-lg w-full">
        {[
          { label: "Bot Types", value: "3", sub: "Technical · Fundamental · Sentiment" },
          { label: "Languages", value: "3", sub: "C++ · Rust · Go" },
          { label: "Metrics", value: "3", sub: "Speed · Stability · Correctness" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded p-4">
            <div className="text-2xl font-bold font-mono text-primary">{s.value}</div>
            <div className="text-xs text-muted-foreground font-mono uppercase mt-0.5">{s.label}</div>
            <div className="text-[10px] text-muted-foreground/60 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>
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

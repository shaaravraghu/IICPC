import React from "react";
import { Activity, Zap, ShieldCheck, ChevronRight } from "lucide-react";

export function Gradient() {
  return (
    <div className="min-h-screen bg-[#030308] text-white overflow-hidden font-sans selection:bg-[#38bdf8] selection:text-white relative">
      {/* Background Orbs/Glows */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4c1d95 0%, transparent 70%)' }}
      />
      <div 
        className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1e1b4b 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }}
      />

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CgkgIDxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KCSAgPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz4KCTwvc3ZnPg==')] opacity-50 pointer-events-none"></div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20">
          
          {/* Decorative Chart Behind Hero */}
          <div className="absolute inset-0 flex items-end justify-center opacity-[0.03] pointer-events-none overflow-hidden pb-[20vh]">
            <div className="flex items-end gap-4 w-full max-w-5xl h-[50vh]">
              {[30, 50, 40, 70, 60, 90, 80, 100, 75, 85, 45, 65].map((h, i) => (
                <div 
                  key={i} 
                  className="w-full bg-white rounded-t-sm transition-all duration-1000"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto relative z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8] text-sm font-medium mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8] animate-pulse"></span>
              Season 2 Registration Open
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                DISTRIBUTED
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc]">
                ORDERBOOK
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light">
              The elite benchmarking platform for systems programmers. Submit C++, Rust, or Go engines. Withstand 200 synthetic bots. Claim your rank.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/sign-in" 
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#38bdf8] text-black font-bold tracking-wide hover:bg-[#7dd3fc] transition-colors relative group"
              >
                <div className="absolute inset-0 rounded-lg shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition-shadow pointer-events-none"></div>
                Sign In
              </a>
              <a 
                href="/sign-up" 
                className="w-full sm:w-auto px-8 py-4 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-all relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                Register Engine
              </a>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="border-y border-white/10 bg-black/40 backdrop-blur-md py-6 px-6">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-8 text-sm md:text-base text-slate-400 font-medium uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="text-white text-shadow-[0_0_10px_rgba(255,255,255,0.5)]">200</span>
              Synthetic Bots
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-white/30"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#38bdf8] text-shadow-[0_0_10px_rgba(56,189,248,0.5)]">3</span>
              Supported Languages
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-white/30"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></div>
              Live Scoring
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div 
              className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#38bdf8]/10 blur-3xl rounded-full pointer-events-none"></div>
              <Zap className="w-8 h-8 text-[#38bdf8] mb-6 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
              <h3 className="text-xl font-bold mb-3 text-white">Speed</h3>
              <p className="text-slate-400 leading-relaxed font-light">
                Microsecond latency is the baseline. Your engine will be hammered with millions of concurrent orders. Every cycle counts.
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#818cf8]/10 blur-3xl rounded-full pointer-events-none"></div>
              <ShieldCheck className="w-8 h-8 text-[#818cf8] mb-6 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
              <h3 className="text-xl font-bold mb-3 text-white">Stability</h3>
              <p className="text-slate-400 leading-relaxed font-light">
                No segfaults allowed. Our synthetic fleet simulates malicious actors, network partitions, and erratic market conditions.
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c084fc]/10 blur-3xl rounded-full pointer-events-none"></div>
              <Activity className="w-8 h-8 text-[#c084fc] mb-6 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
              <h3 className="text-xl font-bold mb-3 text-white">Correctness</h3>
              <p className="text-slate-400 leading-relaxed font-light">
                Price-time priority is absolute. Every match is cryptographically verified against a deterministic reference implementation.
              </p>
            </div>

          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 px-6 relative flex flex-col items-center justify-center text-center border-t border-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b]/20 to-transparent pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white relative z-10">
            Ready to deploy your engine?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg relative z-10 font-light">
            Join thousands of systems engineers competing for the title of the fastest distributed matching engine.
          </p>
          
          <div className="relative z-10 group cursor-pointer p-[1px] rounded-lg bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] opacity-50 blur-xl group-hover:opacity-100 transition-opacity duration-500"></div>
             <a 
               href="/sign-up" 
               className="relative flex items-center gap-2 bg-[#030308] px-8 py-4 rounded-lg text-white font-medium group-hover:bg-transparent transition-colors duration-300"
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

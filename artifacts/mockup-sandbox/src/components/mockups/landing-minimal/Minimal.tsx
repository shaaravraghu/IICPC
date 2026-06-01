import React from "react";
import { ArrowRight, ChevronRight } from "lucide-react";

export function Minimal() {
  return (
    <div className="min-h-[100dvh] bg-[#0a0a0b] text-zinc-400 font-sans flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
      `}} />

      <header className="px-6 py-8 flex items-center justify-between border-b border-[#ffffff10] max-w-7xl mx-auto w-full">
        <div className="font-display font-bold text-white tracking-tight text-xl">IICPC</div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href="/sign-in" className="hover:text-white transition-colors">Sign In</a>
          <a href="/sign-up" className="text-[#0a0a0b] bg-[#34d399] hover:bg-[#2eb986] px-4 py-2 rounded-sm transition-colors">
            Register
          </a>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-6">
        <section className="w-full py-32 md:py-48 flex flex-col items-start border-b border-[#ffffff10]">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium border border-[#ffffff10] text-zinc-300 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-[#34d399]" />
            Summer Hackathon 2026
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-[6rem] leading-[1.05] font-bold text-white mb-8 tracking-tight max-w-4xl">
            The Distributed <br />Exchange Engine.
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            An elite benchmarking platform for the top 1% of systems programmers.
            Submit C++, Rust, or Go orderbook engines to be stress-tested by 200 synthetic bots.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a href="/sign-up" className="w-full sm:w-auto px-8 py-4 bg-[#34d399] hover:bg-[#2eb986] text-[#0a0a0b] font-medium text-lg rounded-sm transition-colors inline-flex items-center justify-center gap-2">
              Start Building <ArrowRight className="w-5 h-5" />
            </a>
            <a href="/sign-in" className="w-full sm:w-auto px-8 py-4 border border-[#ffffff10] hover:bg-[#ffffff05] text-white font-medium text-lg rounded-sm transition-colors inline-flex items-center justify-center gap-2">
              Sign In
            </a>
          </div>
        </section>

        <section className="w-full py-24 border-b border-[#ffffff10]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[
              { href: "/editor", title: "Editor", desc: "Code your engine in C++, Rust, or Go with a live split-screen environment" },
              { href: "/leaderboard", title: "Leaderboard", desc: "See how your engine ranks against every other submission globally" },
              { href: "/learn", title: "Learn", desc: "Study 17 market microstructure primitives — RSI, VWAP, MACD and more" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="group flex flex-col items-start">
                <div className="w-full border-l-2 border-[#ffffff10] group-hover:border-[#34d399] pl-6 transition-colors">
                  <h3 className="text-white text-xl font-display font-medium mb-3 flex items-center justify-between">
                    {item.title}
                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-[#34d399] transition-colors" />
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="w-full py-24">
          <p className="text-zinc-500 text-sm tracking-widest uppercase mb-12 font-medium">How it works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { n: "01", title: "Submit", desc: "Upload your trading engine source code in C++, Rust, or Go. We compile and containerise it automatically." },
              { n: "02", title: "Run", desc: "Your engine is deployed into a distributed environment and hit with orders from 200 synthetic trading bots across 7 pipeline stages." },
              { n: "03", title: "Score", desc: "Performance is measured across latency, throughput, and correctness. Top engines dominate the global leaderboard." },
            ].map((s) => (
              <div key={s.n} className="flex flex-col">
                <span className="text-white font-display text-3xl mb-4 font-light">{s.n}</span>
                <h4 className="text-white font-medium mb-2">{s.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full py-24 border-t border-[#ffffff10] flex flex-col items-center text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Ready to compete?</h2>
          <p className="text-zinc-400 mb-8 max-w-md">Join the IICPC Summer Hackathon 2026 and test your orderbook implementation against the best in the world.</p>
          <a href="/sign-up" className="px-8 py-4 bg-[#34d399] hover:bg-[#2eb986] text-[#0a0a0b] font-medium text-lg rounded-sm transition-colors inline-flex items-center gap-2">
            Register Now <ArrowRight className="w-5 h-5" />
          </a>
        </section>
      </main>

      <footer className="w-full border-t border-[#ffffff10] py-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">IICPC 2026 · Distributed Benchmarking Platform</p>
          <p className="text-zinc-600 text-sm">C++ · Rust · Go</p>
        </div>
      </footer>
    </div>
  );
}

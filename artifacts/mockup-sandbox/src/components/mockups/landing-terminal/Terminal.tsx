import React, { useEffect, useState } from "react";
import "./_group.css";

export function Terminal() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const leaderboardData = [
    { rank: 1, team: "AlphaBot", score: "99.84", latency: "1.2ms" },
    { rank: 2, team: "NullPtr Team", score: "98.12", latency: "1.5ms" },
    { rank: 3, team: "0xDEAD", score: "95.44", latency: "2.1ms" },
    { rank: 4, team: "FastLane", score: "91.02", latency: "3.4ms" },
    { rank: 5, team: "MemAligned", score: "88.99", latency: "4.8ms" },
  ];

  return (
    <div className="min-h-screen terminal-bg text-[#e0e0e0] font-terminal p-4 md:p-8 flex flex-col relative overflow-hidden">
      <div className="scanline" />
      
      {/* Top Bar */}
      <div className="flex justify-between items-center border-b border-[#00e5cc]/30 pb-2 mb-8 text-xs md:text-sm">
        <div className="flex gap-4">
          <span className="terminal-cyan">SYS.TIME:</span>
          <span>{time.toISOString().split('T')[1].replace('Z', '')}</span>
        </div>
        <div className="flex gap-4">
          <span className="terminal-cyan">NET.STAT:</span>
          <span className="text-green-500">OPTIMAL</span>
        </div>
      </div>

      {/* Hero */}
      <main className="flex-1 max-w-5xl mx-auto w-full z-10 flex flex-col justify-center">
        <div className="mb-16">
          <h1 className="text-3xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            <span className="terminal-cyan">{">"}</span> IICPC_BENCHMARKING_<br/>
            &nbsp;&nbsp;PLATFORM_2026<span className="animate-blink terminal-cyan">_</span>
          </h1>
          <p className="text-sm md:text-lg text-[#a0a0a0] max-w-3xl mb-8 leading-relaxed">
            ELITE DISTRIBUTED EXCHANGE ENGINE COMPETITION. TOP 1% SYSTEMS PROGRAMMERS ONLY. SUBMIT C++/RUST/GO ORDERBOOK ENGINES. STRESS-TESTED BY 200 SYNTHETIC BOTS.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="/sign-in" className="border border-[#00e5cc] text-[#00e5cc] hover:bg-[#00e5cc]/20 px-8 py-3 uppercase tracking-widest text-sm transition-colors">
              [CONNECT]
            </a>
            <a href="/sign-up" className="bg-[#00e5cc] text-[#060607] hover:bg-[#00e5cc]/80 px-8 py-3 uppercase tracking-widest text-sm font-bold transition-colors">
              [REGISTER]
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="col-span-1 lg:col-span-2 border border-[#00e5cc]/30 bg-[#060607]/80 p-6 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00e5cc]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00e5cc]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00e5cc]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00e5cc]"></div>

            <div className="flex justify-between items-center border-b border-[#00e5cc]/30 pb-3 mb-4">
              <h2 className="text-[#00e5cc] text-sm md:text-base uppercase tracking-widest">Live_Leaderboard</h2>
              <span className="text-xs text-[#a0a0a0] animate-pulse">UPDATING...</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[#a0a0a0] uppercase border-b border-[#00e5cc]/20">
                  <tr>
                    <th className="px-2 py-3">RNK</th>
                    <th className="px-2 py-3">TEAM_ID</th>
                    <th className="px-2 py-3 text-right">SCORE</th>
                    <th className="px-2 py-3 text-right">LATENCY</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((row, i) => (
                    <tr key={i} className="border-b border-[#00e5cc]/10 hover:bg-[#00e5cc]/5 transition-colors">
                      <td className="px-2 py-4 terminal-cyan font-bold">{row.rank}</td>
                      <td className="px-2 py-4">{row.team}</td>
                      <td className="px-2 py-4 text-right">{row.score}</td>
                      <td className="px-2 py-4 text-right text-[#a0a0a0]">{row.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status & Stats */}
          <div className="col-span-1 space-y-8">
            <div className="border border-[#00e5cc]/30 bg-[#060607]/80 p-6 relative">
               <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00e5cc]"></div>
               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00e5cc]"></div>
               <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00e5cc]"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00e5cc]"></div>

               <h2 className="text-[#00e5cc] text-sm md:text-base uppercase tracking-widest border-b border-[#00e5cc]/30 pb-3 mb-4">Platform_Status</h2>
               <div className="space-y-4 text-sm font-mono">
                 <div className="flex justify-between items-center">
                   <span>NATS</span>
                   <span className="text-green-500 tracking-wider">[ONLINE]</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span>DOCKER SWARM</span>
                   <span className="text-green-500 tracking-wider">[ONLINE]</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span>CLICKHOUSE</span>
                   <span className="text-green-500 tracking-wider">[ONLINE]</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span>GO BOTS</span>
                   <span className="text-green-500 tracking-wider">[ONLINE]</span>
                 </div>
               </div>
            </div>

            <div className="border border-[#00e5cc]/30 bg-[#060607]/80 p-6 relative">
               <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00e5cc]"></div>
               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00e5cc]"></div>
               <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00e5cc]"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00e5cc]"></div>

               <h2 className="text-[#00e5cc] text-sm md:text-base uppercase tracking-widest border-b border-[#00e5cc]/30 pb-3 mb-4">Global_Metrics</h2>
               <div className="space-y-6 text-sm">
                 <div>
                   <div className="text-[#a0a0a0] text-xs mb-2">REQ/SEC</div>
                   <div className="text-2xl tick-animation terminal-cyan font-bold tracking-wider"></div>
                 </div>
                 <div>
                   <div className="text-[#a0a0a0] text-xs mb-2">ACTIVE_NODES</div>
                   <div className="text-2xl text-[#e0e0e0] font-bold tracking-wider">1,024</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-auto border-t border-[#00e5cc]/30 pt-4 pb-2 text-center text-xs text-[#a0a0a0] z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>IICPC_BENCHMARK_2026 // ALL_RIGHTS_RESERVED</div>
        <a href="/sign-up" className="text-[#00e5cc] hover:underline hover:text-white transition-colors">
          INITIALIZE_REGISTRATION {">"}
        </a>
      </footer>
    </div>
  );
}

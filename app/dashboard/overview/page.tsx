"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { gamesList } from "@/lib/gamesData";

const nodes = [
  { region: "US-East (N. Virginia)", ping: "4ms", load: "14%", status: "Optimal" },
  { region: "EU-Central (Frankfurt)", ping: "12ms", load: "28%", status: "Optimal" },
  { region: "AP-East (Tokyo)", ping: "18ms", load: "35%", status: "Good" },
];

export default function OverviewPage() {
  const { user, isLoaded } = useUser();
  const recentGames = gamesList.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-cyan/10 via-surface to-surface border border-line p-8 overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan">
              Cloud Node Ready
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-ink">
            Welcome back,{" "}
            <span className="text-cyan">
              {isLoaded ? user?.firstName || user?.username || "Gamer" : "Gamer"}
            </span>
          </h1>
          <p className="text-muted text-sm max-w-xl">
            Your Cloud GPU rig is pre-warmed and connected. Zero latency stream ready.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-line/60 font-mono text-xs">
          <div>
            <span className="text-muted block mb-1">Server Latency</span>
            <span className="text-cyan text-base font-semibold">4 ms</span>
          </div>
          <div>
            <span className="text-muted block mb-1">Stream Tier</span>
            <span className="text-ink text-base font-semibold">4K RTX Ultimate</span>
          </div>
          <div>
            <span className="text-muted block mb-1">Connected GPU</span>
            <span className="text-ink text-base font-semibold">NVIDIA H100 Node</span>
          </div>
          <div>
            <span className="text-muted block mb-1">Account Status</span>
            <span className="text-emerald-400 text-base font-semibold">● Active Pro</span>
          </div>
        </div>
      </section>

      {/* Cloud PC Status Quick Banner */}
      <section className="rounded-xl bg-surface border border-line p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-cyan px-2 py-0.5 rounded bg-cyan/10 border border-cyan/30">
              Personal Windows Rig
            </span>
            <span className="text-xs font-mono text-emerald-400">● VM Running</span>
          </div>
          <h2 className="text-xl font-display font-bold text-ink">
            Titan RTX 4090 Cloud PC
          </h2>
          <p className="text-xs text-muted font-mono">
            64GB RAM • 2TB NVMe SSD • Parsec / WebRTC Low Latency Stream
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/dashboard/cloud-pc"
            className="w-full md:w-auto px-6 py-3 rounded-lg bg-cyan text-void font-mono font-bold text-xs shadow-glow hover:opacity-90 transition-opacity text-center"
          >
            🖥️ LAUNCH CLOUD DESKTOP
          </Link>
        </div>
      </section>

      {/* Recent Games / Library Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-ink">
            Featured Cloud Titles
          </h2>
          <Link
            href="/dashboard/library"
            className="text-xs text-cyan hover:underline font-mono"
          >
            Browse Full Library →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {recentGames.map((game) => (
            <Link
              key={game.id}
              href={`/dashboard/games/${game.id}`}
              className="group relative rounded-xl bg-surface border border-line overflow-hidden hover:border-cyan/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="h-44 relative overflow-hidden bg-void">
                <img
                  src={game.banner}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                {game.rtx && (
                  <span className="absolute top-3 left-3 bg-void/80 backdrop-blur-md text-cyan text-[10px] font-mono px-2 py-0.5 rounded border border-cyan/30">
                    RAY TRACING ON
                  </span>
                )}
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-muted">{game.genre}</span>
                  <h3 className="font-display font-semibold text-ink text-lg line-clamp-1 group-hover:text-cyan transition-colors">
                    {game.title}
                  </h3>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-xs font-mono text-muted">
                    <span>{game.resolution}</span>
                    <span>{game.size}</span>
                  </div>

                  <div className="w-full py-2.5 rounded-lg text-xs font-mono font-bold text-center bg-cyan/10 border border-cyan/40 text-cyan group-hover:bg-cyan group-hover:text-void transition-all">
                    ⚡ UPGRADE TO START PLAYING
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Datacenter Nodes */}
      <section className="rounded-xl bg-surface border border-line p-6 space-y-4">
        <h2 className="text-lg font-display font-bold text-ink">
          Global Cloud Datacenter Nodes
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {nodes.map((node) => (
            <div
              key={node.region}
              className="p-4 rounded-lg bg-void/60 border border-line flex items-center justify-between font-mono text-xs"
            >
              <div>
                <span className="text-ink font-semibold block mb-0.5">{node.region}</span>
                <span className="text-muted">Load: {node.load}</span>
              </div>
              <div className="text-right">
                <span className="text-cyan font-bold block">{node.ping}</span>
                <span className="text-emerald-400">{node.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

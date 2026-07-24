"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const recentGames = [
  {
    id: "cyberpunk",
    title: "Cyberpunk 2077: Phantom Liberty",
    genre: "Action RPG",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
    resolution: "4K / 120 FPS",
    playtime: "48.5 hrs",
    rtx: true,
  },
  {
    id: "elden-ring",
    title: "Elden Ring: Shadow of the Erdtree",
    genre: "Action / Soulslike",
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80",
    resolution: "4K / 120 FPS",
    playtime: "112.0 hrs",
    rtx: false,
  },
  {
    id: "starfield",
    title: "Starfield Premium Edition",
    genre: "Sci-Fi RPG",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    resolution: "1440p / 120 FPS",
    playtime: "24.2 hrs",
    rtx: true,
  },
];

const nodes = [
  { region: "US-East (N. Virginia)", ping: "4ms", load: "14%", status: "Optimal" },
  { region: "EU-Central (Frankfurt)", ping: "12ms", load: "28%", status: "Optimal" },
  { region: "AP-East (Tokyo)", ping: "18ms", load: "35%", status: "Good" },
];

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [activeSession, setActiveSession] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-void text-ink font-body flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono text-muted">
            Checking cloud security authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void text-ink font-body">
      {/* Top Header */}
      <header className="border-b border-line bg-surface/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container-px flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan shadow-glow animate-flicker" />
              <span className="font-display font-semibold text-lg tracking-tight text-ink">
                NIMBUS
              </span>
            </Link>
            <span className="text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan/10 border border-cyan/30 text-cyan font-mono">
              Cloud Station
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-muted hover:text-ink transition-colors font-mono"
            >
              ← Back to Site
            </Link>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-px py-10 space-y-10 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <section className="relative rounded-2xl bg-gradient-to-r from-cyan/10 via-surface to-surface border border-line p-8 overflow-hidden">
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-ink">
              Welcome back,{" "}
              <span className="text-cyan">
                {isLoaded ? user?.firstName || user?.username || "Gamer" : "Gamer"}
              </span>
            </h1>
            <p className="text-muted text-sm max-w-xl">
              Your Cloud GPU node is pre-warmed and connected. Zero latency stream ready.
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
              <span className="text-emerald-400 text-base font-semibold">● Active</span>
            </div>
          </div>
        </section>

        {/* Recent Games / Library Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-ink">
              Ready to Launch
            </h2>
            <span className="text-xs text-muted font-mono">3 Titles synced</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recentGames.map((game) => (
              <div
                key={game.id}
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
                    <h3 className="font-display font-semibold text-ink text-lg line-clamp-1">
                      {game.title}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-xs font-mono text-muted">
                      <span>{game.resolution}</span>
                      <span>{game.playtime}</span>
                    </div>

                    <button
                      onClick={() =>
                        setActiveSession(activeSession === game.id ? null : game.id)
                      }
                      className={`w-full py-2.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                        activeSession === game.id
                          ? "bg-cyan text-void shadow-glow font-bold"
                          : "bg-ink text-void hover:bg-cyan hover:text-void"
                      }`}
                    >
                      {activeSession === game.id ? "⚡ SESSION ACTIVE - CONNECTING..." : "▶ LAUNCH INSTANT STREAM"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cloud Infrastructure Nodes */}
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
      </main>
    </div>
  );
}

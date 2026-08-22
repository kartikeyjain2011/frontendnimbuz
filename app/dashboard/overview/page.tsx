"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { type RawgGame } from "@/lib/rawg";
import GameStreamPlayer from "@/components/GameStreamPlayer";
import { fetchAvailableBackendGames } from "@/lib/backendApi";

const nodes = [
  { region: "US-East (N. Virginia)", ping: "4ms", load: "14%", status: "Optimal" },
  { region: "EU-Central (Frankfurt)", ping: "12ms", load: "28%", status: "Optimal" },
  { region: "AP-East (Tokyo)", ping: "18ms", load: "35%", status: "Good" },
];

function OverviewGameCard({
  game,
  onLaunchStream,
}: {
  game: RawgGame;
  onLaunchStream: (game: RawgGame) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const screenshots = game.short_screenshots?.map((s) => s.image) || [];

  // Autoplay continuous preview
  useEffect(() => {
    if (!screenshots || screenshots.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % screenshots.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [screenshots]);

  return (
    <div className="group relative rounded-xl bg-white border border-black/10 overflow-hidden hover:border-black/30 shadow-sm transition-all duration-300 flex flex-col justify-between">
      <div className="h-44 relative overflow-hidden bg-black">
        <img
          src={screenshots[currentIdx] || game.background_image}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/20 flex items-center gap-1.5 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE PREVIEW</span>
        </div>
        {game.rating > 0 && (
          <span className="absolute top-2 right-2 bg-black/70 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">
            ★ {game.rating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono text-dash-muted">{game.genres[0]?.name || "Action"}</span>
          <h3 className="font-display font-bold text-dash-ink text-base line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {game.name}
          </h3>
        </div>

        <div className="pt-2 border-t border-black/10 flex items-center justify-between font-mono text-xs">
          <span className="text-dash-muted">Metacritic: {game.metacritic || "N/A"}</span>
          <button
            onClick={() => onLaunchStream(game)}
            className="px-3.5 py-1.5 rounded-lg bg-dash-ink text-white font-bold text-[11px] hover:bg-black/80 transition-colors cursor-pointer"
          >
            ⚡ PLAY NOW
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const { user, isLoaded } = useUser();
  const [games, setGames] = useState<RawgGame[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [activeGameStream, setActiveGameStream] = useState<RawgGame | null>(null);

  useEffect(() => {
    fetchAvailableBackendGames()
      .then((data: any) => {
        setGames(data.slice(0, 6));
        setLoadingGames(false);
      })
      .catch(() => setLoadingGames(false));
  }, []);

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Banner */}
      <section className="relative rounded-2xl bg-white border border-black/10 p-8 shadow-sm overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-dash-ink font-semibold">
              Cloud Node Ready
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dash-ink">
            Welcome back,{" "}
            <span className="text-dash-ink underline decoration-black/20">
              {isLoaded ? user?.firstName || user?.username || "Gamer" : "Gamer"}
            </span>
          </h1>
          <p className="text-dash-muted text-sm max-w-xl font-mono">
            Your Cloud GPU rig is pre-warmed and connected. Zero latency stream ready.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-black/10 font-mono text-xs">
          <div>
            <span className="text-dash-muted block mb-1">Server Latency</span>
            <span className="text-dash-ink text-base font-semibold">4 ms</span>
          </div>
          <div>
            <span className="text-dash-muted block mb-1">Stream Tier</span>
            <span className="text-dash-ink text-base font-semibold">4K RTX Ultimate</span>
          </div>
          <div>
            <span className="text-dash-muted block mb-1">Catalog Sync</span>
            <span className="text-emerald-600 text-base font-semibold">● Connected</span>
          </div>
          <div>
            <span className="text-dash-muted block mb-1">Account Status</span>
            <span className="text-emerald-600 text-base font-semibold">● Active Pro</span>
          </div>
        </div>
      </section>

      {/* Cloud PC Status Quick Banner */}
      <section className="rounded-xl bg-white border border-black/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-dash-ink px-2 py-0.5 rounded bg-black/5 border border-black/15 font-semibold">
              Personal Windows Rig
            </span>
            <span className="text-xs font-mono text-emerald-600 font-semibold">● VM Running</span>
          </div>
          <h2 className="text-xl font-display font-bold text-dash-ink">
            Titan Cloud PC Instance
          </h2>
          <p className="text-xs text-dash-muted font-mono">
            Parsec & WebRTC Low-Latency Stream Active
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/dashboard/cloud-pc"
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-dash-ink text-white font-mono font-bold text-xs hover:bg-black/80 transition-all text-center"
          >
            🖥️ LAUNCH CLOUD DESKTOP
          </Link>
        </div>
      </section>

      {/* Live Catalog Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-emerald-600 font-bold">● LIVE REELS</span>
              <h2 className="text-xl font-display font-bold text-dash-ink">
                Featured Cloud Titles
              </h2>
            </div>
            <p className="text-xs font-mono text-dash-muted mt-0.5">
              Continuous live stream previews of ready-to-play cloud titles.
            </p>
          </div>
          <Link
            href="/dashboard/library"
            className="text-xs text-dash-ink hover:underline font-mono font-semibold"
          >
            Browse Full Library →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loadingGames
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-56 rounded-xl bg-black/5 animate-pulse" />
              ))
            : games.map((game) => (
                <OverviewGameCard
                  key={game.id}
                  game={game}
                  onLaunchStream={(g) => setActiveGameStream(g)}
                />
              ))}
        </div>
      </section>

      {/* Datacenter Nodes */}
      <section className="rounded-xl bg-white border border-black/10 p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-display font-bold text-dash-ink">
          Global Cloud Datacenter Nodes
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {nodes.map((node) => (
            <div
              key={node.region}
              className="p-4 rounded-lg bg-dash-subtle border border-black/10 flex items-center justify-between font-mono text-xs"
            >
              <div>
                <span className="text-dash-ink font-semibold block mb-0.5">{node.region}</span>
                <span className="text-dash-muted">Load: {node.load}</span>
              </div>
              <div className="text-right">
                <span className="text-dash-ink font-bold block">{node.ping}</span>
                <span className="text-emerald-600 font-semibold">{node.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live WebRTC Cloud Stream Player Modal */}
      {activeGameStream && (
        <GameStreamPlayer
          gameId={String(activeGameStream.id)}
          gameTitle={activeGameStream.name}
          bannerUrl={activeGameStream.background_image}
          resolution="1440p"
          onClose={() => setActiveGameStream(null)}
        />
      )}
    </div>
  );
}

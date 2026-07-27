"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { fetchNewReleases, type RawgGame } from "@/lib/rawg";

function TrailerCard({ game }: { game: RawgGame }) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const [currentIdx, setCurrentIdx] = useState(0);
  const screenshots = game.short_screenshots?.map((s) => s.image) || [];

  // Autoplay video preview reel continuously
  useEffect(() => {
    if (!screenshots || screenshots.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % screenshots.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [screenshots]);

  const handleCardClick = () => {
    if (isSignedIn) {
      router.push(`/dashboard/games/${game.id}`);
    } else {
      if (openSignIn) {
        openSignIn({
          forceRedirectUrl: `/dashboard/games/${game.id}`,
        });
      } else {
        router.push(`/sign-in?redirectUrl=/dashboard/games/${game.id}`);
      }
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-2xl bg-white border border-black/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Visual Showcase / Autoplay Video Reel */}
      <div className="relative aspect-video bg-black overflow-hidden">
        <img
          src={screenshots[currentIdx] || game.background_image}
          alt={game.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-black/70 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE REEL
          </span>
          {game.rating > 0 && (
            <span className="bg-amber-400 text-black font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
              ★ {game.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Progress indicator */}
        {screenshots.length > 1 && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono text-white">
            <span>PREVIEW REEL ({currentIdx + 1}/{screenshots.length})</span>
            <div className="flex gap-1">
              {screenshots.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === currentIdx ? "bg-white w-4" : "bg-white/30 w-1"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-muted mb-1">
            <span>{game.genres[0]?.name || "Featured Title"}</span>
            <span>Released: {game.released || "N/A"}</span>
          </div>
          <h3 className="font-display font-bold text-ink text-lg line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {game.name}
          </h3>
        </div>

        <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs font-mono">
          <span className="text-muted">Metacritic Score: <strong className="text-ink">{game.metacritic || "N/A"}</strong></span>
          <span className="text-ink font-semibold group-hover:translate-x-1 transition-transform">
            Watch Reel & Launch →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GameTrailers() {
  const [games, setGames] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewReleases(6)
      .then((res) => {
        setGames(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="relative py-20 border-t border-line bg-deep/30">
      <div className="container-px space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="section-label">AUTOPLAY REELS</span>
              <span className="signal-line flex-1 max-w-16" />
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-ink">
              Trending Gameplay Video Previews
            </h2>
          </div>
          <p className="text-muted text-xs font-mono max-w-md">
            Continuous video reels streaming in real-time. Click any title to launch or sign in to your account.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-video rounded-2xl bg-black/5 animate-pulse" />
              ))
            : games.map((game) => <TrailerCard key={game.id} game={game} />)}
        </div>
      </div>
    </section>
  );
}

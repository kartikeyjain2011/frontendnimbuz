"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { type RawgGame } from "@/lib/rawg";
import { fetchAvailableBackendGames } from "@/lib/backendApi";

// ── Auto-cycling preview image hook ───────────────────────────
function useAutoImageCycle(images: string[], intervalMs = 2000) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images, intervalMs]);

  return images[idx] ?? "";
}

// ── Game card with click auth check ────────────────────────────
function GameCard({ game }: { game: RawgGame }) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const screenshots = game.short_screenshots?.map((s) => s.image) || [];
  const currentImg = useAutoImageCycle(screenshots.length > 0 ? screenshots : [game.background_image], 2200);
  const genre = game.genres?.[0]?.name ?? "Action";

  const handleCardClick = () => {
    if (isSignedIn) {
      router.push(`/dashboard/games/${game.slug || game.id}`);
    } else {
      if (openSignIn) {
        openSignIn({
          forceRedirectUrl: `/dashboard/games/${game.slug || game.id}`,
        });
      } else {
        router.push(`/sign-in?redirectUrl=/dashboard/games/${game.slug || game.id}`);
      }
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer text-left"
    >
      <div className="aspect-[3/4] rounded-xl relative overflow-hidden border border-black/10 bg-deep transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-md group-hover:border-black/20">
        {/* Main image preview */}
        {currentImg ? (
          <img
            src={currentImg}
            alt={game.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-deep to-line" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

        {/* Rating badge */}
        {game.rating > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-md font-bold">
            ★ {game.rating.toFixed(1)}
          </div>
        )}

        {/* Autoplay Live Indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white text-[10px] font-mono font-semibold">CLOUD HOSTED</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm font-medium text-ink line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {game.name}
        </div>
        <div className="text-xs text-muted mt-0.5">{genre}</div>
      </div>
    </div>
  );
}

// ── Skeleton card ────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-xl bg-deep border border-black/5" />
      <div className="mt-3 space-y-1.5">
        <div className="h-3.5 bg-deep rounded w-3/4" />
        <div className="h-3 bg-deep rounded w-1/2" />
      </div>
    </div>
  );
}

// ── Section ──────────────────────────────────────────────────
export default function GameLibrary() {
  const [games, setGames] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAvailableBackendGames()
      .then((data: any) => {
        setGames(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <section id="library" className="relative py-24 md:py-32 border-t border-line">
      <div className="container-px">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="section-label">Library</span>
              <span className="signal-line flex-1 max-w-16" />
              {!loading && !error && (
                <span className="section-label text-emerald-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync Active
                </span>
              )}
            </div>
            <h2 className="font-display font-semibold text-3xl md:text-5xl tracking-tight max-w-xl text-balance">
              Top-rated games, already installed
            </h2>
          </div>
          <p className="text-muted max-w-sm">
            Continuous live video previews. Click any game to launch directly or sign in to your Nimbus account.
          </p>
        </div>

        {error ? (
          <div className="text-center py-12 text-muted font-mono text-sm">
            Unable to load games right now. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
              : games.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        )}

        <div className="mt-10">
          <a
            href="#pricing"
            className="text-sm text-ink hover:text-muted transition-colors inline-flex items-center gap-1.5 underline underline-offset-2"
          >
            Start streaming the full catalog →
          </a>
        </div>
      </div>
    </section>
  );
}

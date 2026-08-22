"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { type RawgGame } from "@/lib/rawg";
import GameStreamPlayer from "@/components/GameStreamPlayer";
import { fetchAvailableBackendGames } from "@/lib/backendApi";

function MyGameCard({
  game,
  isFavorite,
  onToggleFavorite,
  onLaunchStream,
}: {
  game: RawgGame;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onLaunchStream: (game: RawgGame) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const screenshots = game.short_screenshots?.map((s) => s.image) || [];

  // Autoplay continuous stream preview
  useEffect(() => {
    if (!screenshots || screenshots.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % screenshots.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [screenshots]);

  const genreName = game.genres?.[0]?.name || "Action";

  return (
    <div className="rounded-2xl bg-white border border-black/10 p-5 flex flex-col sm:flex-row gap-5 hover:border-black/30 hover:shadow-md transition-all duration-300">
      {/* Thumbnail with Autoplay Preview & Link to Individual Page */}
      <Link href={`/dashboard/games/${game.slug || game.id}`} className="w-full sm:w-44 h-40 rounded-xl overflow-hidden relative bg-black shrink-0 group block">
        <img
          src={screenshots[currentIdx] || game.background_image}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isFavorite
              ? "bg-dash-ink text-white shadow-sm"
              : "bg-black/60 text-white/70 hover:text-white border border-white/10"
          }`}
        >
          ★
        </button>

        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white text-[10px] font-mono font-semibold">CLOUD HOSTED</span>
        </div>
      </Link>

      {/* Content & Details */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-[11px] font-mono text-dash-muted">{genreName}</span>
            <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Backend Synced
            </span>
          </div>
          <Link href={`/dashboard/games/${game.slug || game.id}`}>
            <h3 className="font-display font-bold text-dash-ink text-lg line-clamp-1 hover:text-emerald-600 transition-colors">
              {game.name}
            </h3>
          </Link>
        </div>

        {/* Stats detail */}
        <div className="space-y-1.5 font-mono text-xs text-dash-muted pt-1">
          <div className="flex justify-between">
            <span>Platform Sync:</span>
            <span className="text-dash-ink font-semibold">{game.parent_platforms?.[0]?.platform?.name || "PC Cloud"}</span>
          </div>
          <div className="flex justify-between">
            <span>Rating:</span>
            <span className="text-amber-500 font-bold">★ {game.rating?.toFixed(1) || "4.5"}</span>
          </div>
          <div className="flex justify-between">
            <span>Stream Quality:</span>
            <span className="text-dash-ink font-semibold">4K @ 120 FPS</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/dashboard/games/${game.slug || game.id}`}
            className="flex-1 py-2 rounded-xl text-xs font-mono font-bold text-center bg-dash-subtle border border-black/10 text-dash-ink hover:bg-black/5 transition-all block"
          >
            Game Details
          </Link>
          <button
            onClick={() => onLaunchStream(game)}
            className="flex-1 py-2 rounded-xl text-xs font-mono font-bold text-center bg-dash-ink text-white hover:bg-black/80 shadow-sm transition-all cursor-pointer"
          >
            ⚡ LAUNCH STREAM
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyGamesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [games, setGames] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeGameStream, setActiveGameStream] = useState<RawgGame | null>(null);

  useEffect(() => {
    fetchAvailableBackendGames()
      .then((res: any) => {
        setGames(res);
        if (res.length > 1) {
          setFavorites([res[0].id, res[1].id]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filteredGames = games.filter((game) => {
    if (activeTab === "favorites") return favorites.includes(game.id);
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-dash-ink">
            My Games & Cloud Saves
          </h1>
          <p className="text-dash-muted text-sm font-mono mt-1">
            Manage your personal game collection, save states, and continuous stream feeds.
          </p>
        </div>

        {/* Cloud Save Storage Stat Card */}
        <div className="flex items-center gap-4 bg-white border border-black/10 p-3.5 rounded-2xl font-mono text-xs shadow-sm">
          <div>
            <span className="text-dash-muted block text-[10px]">Cloud Storage Used</span>
            <span className="text-dash-ink font-bold text-sm">6.8 GB / 50 GB</span>
          </div>
          <div className="w-24 bg-dash-subtle h-2 rounded-full overflow-hidden border border-black/10">
            <div className="bg-dash-ink h-full w-[13.6%]" />
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-black/10 pb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "all"
              ? "bg-dash-ink text-white font-bold shadow-sm"
              : "text-dash-muted hover:text-dash-ink hover:bg-black/5"
          }`}
        >
          All Owned ({games.length})
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "favorites"
              ? "bg-dash-ink text-white font-bold shadow-sm"
              : "text-dash-muted hover:text-dash-ink hover:bg-black/5"
          }`}
        >
          ★ Favorites ({favorites.length})
        </button>
      </div>

      {/* Games List Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-black/5 animate-pulse" />
          ))}
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-black/10 space-y-4 font-mono shadow-sm">
          <p className="text-dash-muted text-xs">No games found in this category.</p>
          <Link
            href="/dashboard/store"
            className="inline-block px-4 py-2 bg-dash-ink text-white rounded-xl font-bold text-xs shadow-sm hover:bg-black/80"
          >
            🛒 Browse Game Store
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredGames.map((game) => (
            <MyGameCard
              key={game.id}
              game={game}
              isFavorite={favorites.includes(game.id)}
              onToggleFavorite={toggleFavorite}
              onLaunchStream={(g) => setActiveGameStream(g)}
            />
          ))}
        </div>
      )}

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

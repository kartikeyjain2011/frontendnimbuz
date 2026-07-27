"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { fetchTrendingGames, type RawgGame } from "@/lib/rawg";
import { getPurchasedGameIds } from "@/lib/gamesData";

const genres = ["All", "Action", "RPG", "Adventure", "Strategy", "Shooter", "Indie"];

function LibraryCard({ game, isPurchased }: { game: RawgGame; isPurchased: boolean }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const screenshots = game.short_screenshots?.map((s) => s.image) || [];

  // Autoplay stream preview
  useEffect(() => {
    if (!screenshots || screenshots.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % screenshots.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [screenshots]);

  const priceUSD = (19.99 + (game.id % 40)).toFixed(2);
  const priceINR = Math.round(parseFloat(priceUSD) * 83).toLocaleString();
  const genreName = game.genres?.[0]?.name || "Action";

  return (
    <Link
      href={`/dashboard/games/${game.id}`}
      className="group relative rounded-xl bg-white border border-black/10 overflow-hidden hover:border-black/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      <div className="h-48 relative overflow-hidden bg-black">
        <img
          src={screenshots[currentIdx] || game.background_image}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
            {game.parent_platforms?.[0]?.platform?.name || "PC Cloud"}
          </span>
          {isPurchased ? (
            <span className="bg-emerald-500 text-white font-bold text-[10px] font-mono px-2 py-0.5 rounded">
              ✓ OWNED
            </span>
          ) : (
            <span className="bg-black/70 backdrop-blur-md text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-400/30">
              RTX READY
            </span>
          )}
        </div>

        {game.rating > 0 && (
          <span className="absolute top-3 right-3 bg-black/70 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">
            ★ {game.rating.toFixed(1)}
          </span>
        )}

        <div className="absolute bottom-2 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white text-[10px] font-mono font-semibold">STREAM PREVIEW</span>
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-mono text-muted">
            <span>{genreName}</span>
            <span>Released: {game.released?.split("-")[0] || "2024"}</span>
          </div>
          <h3 className="font-display font-semibold text-ink text-lg line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {game.name}
          </h3>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-xs font-mono text-muted">
            <span>4K @ 120 FPS</span>
            <span>Metacritic: {game.metacritic || "N/A"}</span>
          </div>

          {isPurchased ? (
            <div className="w-full py-2.5 rounded-lg text-xs font-mono font-bold text-center bg-ink text-white group-hover:bg-black/80 transition-all">
              🖥️ LAUNCH ON CLOUD PC
            </div>
          ) : (
            <div className="w-full py-2.5 rounded-lg text-xs font-mono font-bold text-center bg-black/5 border border-black/15 text-ink group-hover:bg-ink group-hover:text-white transition-all">
              ⚡ BUY & PLAY (₹{priceINR})
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function LibraryPage() {
  const [games, setGames] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);

  useEffect(() => {
    setPurchasedIds(getPurchasedGameIds());
    fetchTrendingGames(24)
      .then((res) => {
        setGames(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch =
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.genres.some((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesGenre =
        selectedGenre === "All" ||
        game.genres.some((g) => g.name.toLowerCase() === selectedGenre.toLowerCase());
      return matchesSearch && matchesGenre;
    });
  }, [games, searchQuery, selectedGenre]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-ink">
            Cloud Game Library
          </h1>
          <p className="text-muted text-sm font-mono mt-1">
            Browse 2,500+ cloud-ready titles with continuous stream previews.
          </p>
        </div>

        {/* Linked Accounts */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted hidden sm:inline">Linked Accounts:</span>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-white border border-black/10 text-xs font-mono text-ink flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Steam
            </span>
            <span className="px-2.5 py-1 rounded bg-white border border-black/10 text-xs font-mono text-ink flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Epic Games
            </span>
            <span className="px-2.5 py-1 rounded bg-deep border border-black/10 text-xs font-mono text-muted flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-black/20" /> Xbox
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 rounded-xl bg-white border border-black/10 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <svg
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by game title, genre, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-deep border border-black/10 rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono text-ink placeholder:text-muted focus:border-black/40 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Genre Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                selectedGenre === genre
                  ? "bg-ink text-white font-semibold shadow-sm"
                  : "bg-deep text-muted hover:text-ink border border-black/10"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-black/5 animate-pulse" />
          ))}
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-16 rounded-xl bg-white border border-black/10 space-y-3 shadow-sm">
          <p className="text-sm font-mono text-muted">
            No games found matching your search parameters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre("All");
            }}
            className="text-xs text-ink hover:underline font-mono cursor-pointer font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <LibraryCard
              key={game.id}
              game={game}
              isPurchased={purchasedIds.includes(String(game.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

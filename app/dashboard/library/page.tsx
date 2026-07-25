"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { gamesList, getPurchasedGameIds } from "@/lib/gamesData";

const genres = ["All", "Action RPG", "Soulslike", "Sci-Fi RPG", "Racing", "Horror / FPS", "Strategy / RPG"];
const stores = ["All Stores", "Steam", "Epic", "Xbox", "GOG"];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedStore, setSelectedStore] = useState("All Stores");
  const [myGameIds, setMyGameIds] = useState<string[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);

  useEffect(() => {
    const pIds = getPurchasedGameIds();
    setPurchasedIds(pIds);
    setMyGameIds(pIds);
  }, []);

  const toggleMyGame = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMyGameIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const filteredGames = gamesList.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All" || game.genre.includes(selectedGenre);
    const matchesStore = selectedStore === "All Stores" || game.store === selectedStore;
    return matchesSearch && matchesGenre && matchesStore;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-ink">
            Cloud Game Library
          </h1>
          <p className="text-muted text-sm font-mono mt-1">
            Browse 2,500+ cloud-ready titles. Purchased store games sync automatically to your library.
          </p>
        </div>

        {/* Sync accounts button */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted hidden sm:inline">Linked Accounts:</span>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-surface border border-line text-xs font-mono text-cyan flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Steam
            </span>
            <span className="px-2.5 py-1 rounded bg-surface border border-line text-xs font-mono text-cyan flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Epic Games
            </span>
            <span className="px-2.5 py-1 rounded bg-surface border border-line text-xs font-mono text-muted flex items-center gap-1.5 opacity-60">
              <span className="w-2 h-2 rounded-full bg-line" /> Xbox
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 rounded-xl bg-surface border border-line p-5">
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
              className="w-full bg-void/80 border border-line rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono text-ink placeholder:text-muted focus:border-cyan focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="bg-void/80 border border-line rounded-lg px-3 py-2.5 text-xs font-mono text-ink focus:border-cyan focus:outline-none transition-colors cursor-pointer w-full md:w-auto"
            >
              {stores.map((s) => (
                <option key={s} value={s} className="bg-panel text-ink">
                  {s}
                </option>
              ))}
            </select>
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
                  ? "bg-cyan text-void font-semibold"
                  : "bg-void/60 text-muted hover:text-ink hover:bg-surface border border-line"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => {
          const inMyGames = myGameIds.includes(game.id);
          const isOwned = purchasedIds.includes(game.id);

          return (
            <Link
              key={game.id}
              href={`/dashboard/games/${game.id}`}
              className="group relative rounded-xl bg-surface border border-line overflow-hidden hover:border-cyan/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="h-48 relative overflow-hidden bg-void">
                <img
                  src={game.banner}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                />

                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-void/80 backdrop-blur-md text-ink text-[10px] font-mono px-2 py-0.5 rounded border border-line">
                    {game.store}
                  </span>
                  {isOwned ? (
                    <span className="bg-emerald-400/90 text-void font-bold text-[10px] font-mono px-2 py-0.5 rounded shadow-glow">
                      ✓ OWNED
                    </span>
                  ) : (
                    game.rtx && (
                      <span className="bg-void/80 backdrop-blur-md text-cyan text-[10px] font-mono px-2 py-0.5 rounded border border-cyan/30">
                        RTX ON
                      </span>
                    )
                  )}
                </div>

                <button
                  onClick={(e) => toggleMyGame(e, game.id)}
                  title={inMyGames ? "Remove from My Games" : "Add to My Games"}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                    inMyGames
                      ? "bg-cyan text-void"
                      : "bg-void/80 text-muted hover:text-ink border border-line"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill={inMyGames ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono text-muted">
                    <span>{game.genre}</span>
                    <span className="text-amber-400">★ {game.rating}</span>
                  </div>
                  <h3 className="font-display font-semibold text-ink text-lg line-clamp-1 group-hover:text-cyan transition-colors">
                    {game.title}
                  </h3>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-xs font-mono text-muted">
                    <span>{game.resolution}</span>
                    <span>{game.size}</span>
                  </div>

                  {isOwned ? (
                    <div className="w-full py-2.5 rounded-lg text-xs font-mono font-bold text-center bg-cyan text-void shadow-glow group-hover:opacity-90 transition-all">
                      🖥️ LAUNCH ON CLOUD PC
                    </div>
                  ) : (
                    <div className="w-full py-2.5 rounded-lg text-xs font-mono font-bold text-center bg-cyan/10 border border-cyan/40 text-cyan group-hover:bg-cyan group-hover:text-void transition-all">
                      ⚡ BUY & PLAY (₹{Math.round(game.price * 83).toLocaleString()})
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-16 rounded-xl bg-surface border border-line space-y-3">
          <p className="text-sm font-mono text-muted">
            No games found matching your search parameters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre("All");
              setSelectedStore("All Stores");
            }}
            className="text-xs text-cyan hover:underline font-mono cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

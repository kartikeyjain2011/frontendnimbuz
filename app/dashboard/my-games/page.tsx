"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { gamesList, getPurchasedGameIds } from "@/lib/gamesData";

export default function MyGamesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "installed">("all");
  const [favorites, setFavorites] = useState<string[]>(["cyberpunk", "elden-ring"]);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);

  useEffect(() => {
    setPurchasedIds(getPurchasedGameIds());
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Filter all games that are purchased/owned by user
  const myGamesList = gamesList.filter((g) => purchasedIds.includes(g.id));

  const filteredGames = myGamesList.filter((game) => {
    if (activeTab === "favorites") return favorites.includes(game.id);
    if (activeTab === "installed") return game.id === "cyberpunk" || game.id === "elden-ring" || game.id === "wukong";
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-ink">
            My Games & Cloud Saves
          </h1>
          <p className="text-muted text-sm font-mono mt-1">
            Manage your personal game collection, save states, and cloud sync across nodes.
          </p>
        </div>

        {/* Cloud Save Storage Stat Card */}
        <div className="flex items-center gap-4 bg-surface border border-line p-3.5 rounded-xl font-mono text-xs">
          <div>
            <span className="text-muted block text-[10px]">Cloud Storage Used</span>
            <span className="text-cyan font-bold text-sm">6.8 GB / 50 GB</span>
          </div>
          <div className="w-24 bg-void h-2 rounded-full overflow-hidden border border-line">
            <div className="bg-cyan h-full w-[13.6%]" />
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "all"
              ? "bg-cyan text-void font-bold shadow-glow"
              : "text-muted hover:text-ink hover:bg-surface"
          }`}
        >
          All Owned ({myGamesList.length})
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "favorites"
              ? "bg-cyan text-void font-bold shadow-glow"
              : "text-muted hover:text-ink hover:bg-surface"
          }`}
        >
          ★ Favorites ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab("installed")}
          className={`px-4 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "installed"
              ? "bg-cyan text-void font-bold shadow-glow"
              : "text-muted hover:text-ink hover:bg-surface"
          }`}
        >
          🖥️ Pre-Installed on Cloud PC ({myGamesList.filter((g) => g.id === "cyberpunk" || g.id === "elden-ring" || g.id === "wukong").length})
        </button>
      </div>

      {/* Games List Grid */}
      {filteredGames.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-surface border border-line space-y-4 font-mono">
          <p className="text-muted text-xs">No games found in this category.</p>
          <Link
            href="/dashboard/store"
            className="inline-block px-4 py-2 bg-cyan text-void rounded-xl font-bold text-xs shadow-glow"
          >
            🛒 Browse Game Store
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredGames.map((game) => {
            const isFav = favorites.includes(game.id);

            return (
              <div
                key={game.id}
                className="rounded-xl bg-surface border border-line p-5 flex flex-col sm:flex-row gap-5 hover:border-cyan/40 transition-all duration-300"
              >
                {/* Thumbnail */}
                <Link href={`/dashboard/games/${game.id}`} className="w-full sm:w-40 h-36 rounded-lg overflow-hidden relative bg-void shrink-0 group">
                  <img
                    src={game.banner}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(game.id);
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isFav
                        ? "bg-cyan text-void"
                        : "bg-void/80 text-muted hover:text-ink border border-line"
                    }`}
                  >
                    ★
                  </button>
                </Link>

                {/* Content & Stats */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[11px] font-mono text-muted">{game.genre}</span>
                      <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Cloud Synced
                      </span>
                    </div>
                    <Link href={`/dashboard/games/${game.id}`}>
                      <h3 className="font-display font-semibold text-ink text-base line-clamp-1 hover:text-cyan transition-colors">
                        {game.title}
                      </h3>
                    </Link>
                  </div>

                  {/* Stats detail */}
                  <div className="space-y-1.5 font-mono text-xs text-muted">
                    <div className="flex justify-between">
                      <span>Store Platform:</span>
                      <span className="text-ink font-medium">{game.store}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stream Target:</span>
                      <span className="text-cyan font-medium">{game.resolution}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href="/dashboard/cloud-pc"
                    className="w-full py-2.5 rounded-lg text-xs font-mono font-bold text-center bg-cyan text-void shadow-glow hover:opacity-90 transition-all"
                  >
                    🖥️ LAUNCH ON CLOUD PC
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { gamesList } from "@/lib/gamesData";
import Link from "next/link";

export default function GameSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 0
    ? gamesList
        .filter((g) =>
          g.title.toLowerCase().includes(query.toLowerCase()) ||
          g.genre.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapRef} className="relative max-w-md">
      <div className="flex items-center gap-2.5 rounded-xl border border-line bg-panel px-4 py-2.5 focus-within:border-aqua/50 transition-colors">
        <Search className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.5} />
        <input
          type="search"
          placeholder="Search 4,500+ games…"
          value={query}
          aria-label="Search games"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-faint outline-none"
        />
        {query && (
          <button
            aria-label="Clear search"
            onClick={() => { setQuery(""); setOpen(false); }}
            className="text-muted hover:text-ink transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-40 mt-1.5 overflow-hidden rounded-xl border border-line bg-surface shadow-glow">
          {results.map((game) => (
            <li key={game.id}>
              <Link
                href={`/dashboard/games/${game.id}`}
                onClick={() => { setQuery(""); setOpen(false); }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-panel"
              >
                {/* Thumbnail */}
                <img
                  src={game.banner}
                  alt=""
                  className="h-10 w-8 shrink-0 rounded-md object-cover grayscale"
                />
                <div className="min-w-0">
                  <p className="font-medium text-ink line-clamp-1">{game.title}</p>
                  <p className="text-xs text-muted">{game.genre} · {game.store}</p>
                </div>
                {game.rtx && (
                  <span className="ml-auto shrink-0 rounded bg-plasma/20 px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-wider text-plasma-bright">
                    RTX
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute inset-x-0 top-full z-40 mt-1.5 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          No games found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}

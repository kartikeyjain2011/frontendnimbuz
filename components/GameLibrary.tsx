"use client";

import { useRef, useState } from "react";
import { gamesList } from "@/lib/gamesData";
import GameSearch from "./GameSearch";
import { STOREFRONTS } from "./StoreIcons";
import { brandFor } from "@/lib/storeBrand";

const FILTERS = ["All", "Action RPG", "Shooter", "Racing", "Strategy"] as const;

export default function GameLibrary() {
  const [active, setActive] = useState<string>("All");
  const railRef = useRef<HTMLDivElement>(null);

  const games =
    active === "All"
      ? gamesList
      : gamesList.filter((g) => g.genre === active);

  const scroll = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 620, behavior: "smooth" });
  };

  return (
    <section
      id="library"
      className="relative overflow-hidden border-t border-line py-24 md:py-28"
    >
      <div className="container-px">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="section-label">The catalogue</span>
              <span className="signal-line w-16" />
            </div>
            <h2 className="font-display text-[clamp(1.9rem,4vw,3.1rem)] font-semibold leading-[1.08] tracking-tight text-balance text-ink">
              Play Your PC Games.
              <span className="gradient-text"> Discover More.</span>
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              Connect your supported game stores and subscriptions — like Steam,
              Epic, GOG, PC Game Pass and Ubisoft Connect — and stream the titles
              you already own with RTX performance. Thousands of games are ready
              to play instantly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <RailButton dir={-1} onClick={() => scroll(-1)} />
            <RailButton dir={1} onClick={() => scroll(1)} />
          </div>
        </div>

        {/* Search */}
        <div className="mt-9">
          <GameSearch />
        </div>

        {/* Genre filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              aria-pressed={active === f}
              className={`rounded-full border px-4 py-2 text-sm transition-all cursor-pointer ${
                active === f
                  ? "border-plasma bg-plasma/15 text-plasma-bright shadow-glow"
                  : "border-line text-muted hover:border-plasma/50 hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Poster rail */}
        <div
          ref={railRef}
          className="no-scrollbar edge-fade-r mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        >
          {games.map((game) => (
            <article
              key={game.id}
              className="group relative w-[262px] shrink-0 snap-start"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-panel transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/30 group-hover:shadow-glow-aqua">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={game.banner}
                  alt={`${game.title} key art`}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.06] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/25 to-transparent" />

                {game.rtx && (
                  <span className="absolute left-3 top-3 rounded-md bg-plasma/85 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-white backdrop-blur">
                    RTX ON
                  </span>
                )}

                <span className="absolute right-3 top-3 rounded-md border border-white/15 bg-black/50 px-2 py-1 font-mono text-[0.6rem] text-ink backdrop-blur">
                  {game.store}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-[0.98rem] font-semibold leading-snug text-ink">
                    {game.title}
                  </h3>
                  <p className="mt-1 font-mono text-[0.68rem] text-muted">
                    {game.genre} · {game.resolution}
                  </p>

                  <a
                    href={`/dashboard/games/${game.id}`}
                    className="mt-3 flex translate-y-2 items-center justify-center gap-1.5 rounded-full bg-plasma-sweep py-2.5 text-xs font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
                  >
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M3 1.5v9l7-4.5-7-4.5z" />
                    </svg>
                    Play now
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Store strip */}
        <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-3 rounded-2xl border border-line bg-panel/40 px-6 py-5 backdrop-blur">
          <span className="section-label mr-3">Connect your library</span>
          {STOREFRONTS.map(({ name, Mark }) => {
            const brand = brandFor(name);
            return (
              <span
                key={name}
                className="group/store flex items-center gap-2.5 rounded-xl border border-transparent px-3 py-2 text-muted transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = brand?.hex ?? "";
                  e.currentTarget.style.backgroundColor = brand?.tint ?? "";
                  e.currentTarget.style.borderColor = brand?.border ?? "";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <Mark className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover/store:scale-110" />
                <span className="font-display text-sm">{name}</span>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RailButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 1 ? "Scroll right" : "Scroll left"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-plasma/60 hover:text-plasma-bright cursor-pointer"
    >
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d={dir === 1 ? "M6 3l5 5-5 5" : "M10 3L5 8l5 5"}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

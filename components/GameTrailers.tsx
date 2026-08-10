"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Pause,
} from "lucide-react";
import { FEATURED, headerUrl, trailerMp4 } from "@/lib/steamMedia";
import { STOREFRONTS } from "./StoreIcons";
import { brandFor } from "@/lib/storeBrand";
import { useFeaturedTitle } from "./FeaturedTitleContext";

/**
 * Trailer carousel.
 *
 * Monochrome chrome, colour supplied by the artwork and video.
 * Advances on a timer, pauses on hover/focus, honours prefers-reduced-motion.
 * Shares the selected index with HeroBanner via FeaturedTitleContext.
 */

const ADVANCE_MS = 9000;

export default function GameTrailers() {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [auto, setAuto] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { index, title: game, setIndex } = useFeaturedTitle();
  const store = STOREFRONTS.find((s) => s.name === game.store);

  const go = useCallback(
    (next: number) => {
      setIndex(next);
    },
    [setIndex],
  );

  // Pause carousel when section is off-screen
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoswipe
  useEffect(() => {
    if (!auto || !inView) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;
    const id = setInterval(() => go(index + 1), ADVANCE_MS);
    return () => clearInterval(id);
  }, [auto, inView, index, go]);

  // Load selected trailer
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (!inView) {
      v.pause();
      return;
    }

    setPlaying(false);
    v.src = trailerMp4(game.trailerId);
    v.load();
    void v.play().catch(() => setPlaying(false));
  }, [game.trailerId, inView]);

  // Keep active thumbnail centred in the filmstrip
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const el = rail.children[index] as HTMLElement | undefined;
    if (!el) return;
    const target =
      el.offsetLeft - rail.clientWidth / 2 + el.offsetWidth / 2;
    rail.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [index]);

  return (
    <section
      ref={sectionRef}
      id="trailers"
      className="relative overflow-hidden border-t border-line bg-void py-24 md:py-28"
      onMouseEnter={() => setAuto(false)}
      onMouseLeave={() => setAuto(true)}
    >
      <div className="noise-overlay" />

      <div className="container-px relative">
        {/* Section header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="section-label">In the spotlight</span>
              <span className="signal-line w-16" />
            </div>
            <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-tight text-ink text-balance">
              Gameplay trailers,
              <span className="gradient-text"> streaming now.</span>
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAuto((a) => !a)}
              aria-pressed={auto}
              aria-label={auto ? "Pause auto-advance" : "Resume auto-advance"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-plasma/60 hover:text-plasma-bright cursor-pointer"
            >
              {auto ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous trailer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-plasma/60 hover:text-plasma-bright cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next trailer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-plasma/60 hover:text-plasma-bright cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMuted((m) => !m)}
              aria-pressed={!muted}
              className="ml-1 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-plasma/60 hover:text-plasma-bright cursor-pointer"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              {muted ? "Sound off" : "Sound on"}
            </button>
          </div>
        </div>

        {/* Main video + detail panel */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          {/* Video player */}
          <div className="group relative overflow-hidden rounded-2xl border border-line transition-all duration-300 hover:border-plasma/60 hover:shadow-glow">
            <div className="relative aspect-video bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={headerUrl(game.appId)}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  playing ? "opacity-0" : "opacity-100"
                }`}
              />
              <video
                ref={videoRef}
                muted={muted}
                loop
                playsInline
                preload="metadata"
                aria-label={`${game.title} gameplay trailer`}
                onPlaying={() => setPlaying(true)}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  playing ? "opacity-100" : "opacity-0"
                }`}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/25 to-transparent" />

              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                {game.rtx && (
                  <span className="rounded-md bg-plasma px-2.5 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-white">
                    RTX ON
                  </span>
                )}
                <span className="rounded-md border border-line bg-black/70 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-ink backdrop-blur">
                  {game.maxSpec}
                </span>
              </div>

              {/* Auto-advance progress bar */}
              {auto && (
                <motion.div
                  key={`bar-${index}`}
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-plasma"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: ADVANCE_MS / 1000, ease: "linear" }}
                />
              )}
            </div>
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col justify-center rounded-2xl border border-line bg-panel/60 p-6 backdrop-blur md:p-7"
            >
              <div className="flex items-center gap-2">
                {store && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1"
                    style={{
                      color: brandFor(store.name)?.hex,
                      backgroundColor: brandFor(store.name)?.tint,
                      borderColor: brandFor(store.name)?.border,
                    }}
                  >
                    <store.Mark className="h-3 w-3" />
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider">
                      {store.name}
                    </span>
                  </span>
                )}
                <span className="font-mono text-[0.6rem] uppercase tracking-wider text-faint">
                  {game.genre}
                </span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-semibold leading-snug text-ink">
                {game.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted">
                Available to stream instantly on all your devices. Connect your
                library and start playing at up to {game.maxSpec} with no
                downloads required.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-line bg-void/60 p-3">
                  <p className="font-mono text-[0.6rem] uppercase tracking-wider text-faint">
                    Max spec
                  </p>
                  <p className="mt-1 font-display text-sm font-semibold text-ink">
                    {game.maxSpec}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-void/60 p-3">
                  <p className="font-mono text-[0.6rem] uppercase tracking-wider text-faint">
                    Ray tracing
                  </p>
                  <p
                    className={`mt-1 font-display text-sm font-semibold ${
                      game.rtx ? "text-plasma-bright" : "text-muted"
                    }`}
                  >
                    {game.rtx ? "RTX ON" : "—"}
                  </p>
                </div>
              </div>

              <a
                href="/sign-up"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-plasma-sweep py-3 text-sm font-semibold text-white transition-shadow hover:shadow-glow"
              >
                <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                Stream {game.title}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Filmstrip */}
        <div
          ref={railRef}
          className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-1"
        >
          {FEATURED.map((t, i) => (
            <button
              key={t.id}
              onClick={() => go(i)}
              aria-label={`Select ${t.title}`}
              aria-pressed={i === index}
              className={`relative shrink-0 overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer ${
                i === index
                  ? "border-plasma shadow-glow"
                  : "border-line opacity-50 hover:opacity-80"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={headerUrl(t.appId)}
                alt={t.title}
                className="h-16 w-28 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute inset-x-0 bottom-1.5 px-2 font-mono text-[0.55rem] uppercase tracking-wide text-white/80 line-clamp-1 text-center">
                {t.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

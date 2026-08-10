"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Play, Zap, MonitorSmartphone, HardDriveDownload } from "lucide-react";
import { heroBackdrop, trailerMp4 } from "@/lib/steamMedia";
import { STOREFRONTS } from "./StoreIcons";
import { brandFor } from "@/lib/storeBrand";
import { useFeaturedTitle } from "./FeaturedTitleContext";

const STATS = [
  {
    Icon: Zap,
    value: "4,500+",
    label: "games supported",
    sub: "Steam · Epic · GOG · Ubisoft · Rockstar",
  },
  {
    Icon: MonitorSmartphone,
    value: "5K · 360 FPS",
    label: "on Ultimate",
    sub: "Ray tracing and DLSS enabled",
  },
  {
    Icon: HardDriveDownload,
    value: "0 GB",
    label: "to download",
    sub: "Patches handled in the cloud",
  },
];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const { title: backdrop } = useFeaturedTitle();

  /**
   * Swap the backdrop footage whenever the featured title changes.
   * We set .src imperatively — React swapping <source> children does NOT
   * cause the element to reload its stream.
   */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    setPlaying(false);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    v.src = trailerMp4(backdrop.trailerId);
    v.load();

    void v.play().catch(() => {
      setPlaying(false);
    });
  }, [backdrop.trailerId]);

  return (
    <section id="top" className="relative overflow-hidden">
      {/* ── Gameplay backdrop ── */}
      <div aria-hidden="true" className="absolute inset-0">
        {/* Still key art — visible while video loads / autoplay blocked */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={`art-${backdrop.appId}`}
          src={heroBackdrop(backdrop.appId)}
          alt=""
          loading="eager"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-0" : "opacity-100"
          }`}
        />
        {/* src is set imperatively in the effect above */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
          onCanPlay={(e) => {
            void e.currentTarget.play().catch(() => undefined);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />

        {/*
          Left-to-right legibility scrim — opaque under the copy column,
          fully clear past the midpoint so the footage shows through.
          Stacking additional full-bleed washes here darkens the video edge.
        */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 via-45% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
        <div className="noise-overlay opacity-[0.03]" />
      </div>

      {/* ── Message ──
          Cap at ~60% width on large screens so the right-hand side of the
          trailer stays visible instead of sitting behind text. */}
      <div className="container-px relative pt-36 pb-20 md:pt-44 md:pb-28">
        <motion.div
          className="max-w-2xl lg:max-w-[60%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/70 px-4 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-white/90 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-plasma" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-plasma" />
            </span>
            Now streaming in India
          </span>

          <h1 className="mt-7 max-w-3xl font-display text-[clamp(2.5rem,6.2vw,4.8rem)] font-semibold leading-[1.02] tracking-tight text-white text-balance">
            Your games.
            <br />
            <span className="gradient-text">Any screen. No wait.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
            Connect the stores you already buy from and start playing in
            seconds &mdash; at up to 5K and 360&nbsp;FPS, on the laptop, phone
            or TV you already own.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#pricing"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-black transition-all hover:scale-[1.03] hover:bg-plasma hover:text-white hover:shadow-glow"
            >
              Join Today
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#trailers"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 font-medium text-white/90 transition-all hover:border-plasma/70 hover:text-plasma-bright"
            >
              <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              Watch gameplay
            </a>
          </div>

          {/* Storefronts */}
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/60">
              Works with
            </span>
            {STOREFRONTS.map(({ name, Mark }) => (
              <span
                key={name}
                title={name}
                className="text-white/60 transition-all duration-300 hover:scale-110"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = brandFor(name)?.hex ?? "";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                }}
              >
                <Mark className="h-5 w-5" />
              </span>
            ))}
          </div>

          {/* Proof-point stats */}
          <dl className="mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {STATS.map(({ Icon, value, label, sub }) => (
              <div
                key={label}
                className="group rounded-xl border border-white/15 bg-black/70 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-plasma/60"
              >
                <Icon
                  className="h-4 w-4 text-white/60 transition-colors group-hover:text-plasma-bright"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <dd className="mt-3 font-display text-xl font-semibold leading-none text-white">
                  {value}
                </dd>
                <dt className="mt-1.5 text-xs text-white/70">{label}</dt>
                <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-wider text-white/45">
                  {sub}
                </p>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

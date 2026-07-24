"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [ping, setPing] = useState(11);

  useEffect(() => {
    const id = setInterval(() => {
      setPing(8 + Math.round(Math.random() * 6));
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
      <div className="absolute inset-0 bg-aurora-1" />
      <div className="absolute inset-0 bg-aurora-2" />
      <div className="noise-overlay" />

      <div className="container-px relative grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div>
          <div className="flex items-center gap-2 mb-7">
            <span className="section-label">Signal status</span>
            <span className="signal-line flex-1 max-w-16" />
            <span className="section-label text-cyan">live</span>
          </div>

          <h1 className="font-display font-semibold text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.03] tracking-tight text-balance">
            Your games,
            <br />
            rendered in the cloud,
            <br />
            <span className="gradient-text">felt in real time.</span>
          </h1>

          <p className="mt-7 text-lg text-muted max-w-xl leading-relaxed">
            Nimbus runs your library on data-center-grade GPUs and streams the
            picture to whatever screen is in front of you. No console, no
            upgrade cycle, no install bar to watch. Just press play.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#pricing"
              className="inline-flex items-center rounded-full bg-cyan text-void font-medium px-7 py-3.5 hover:shadow-glow transition-shadow"
            >
              Start streaming free
            </a>
            <a
              href="#library"
              className="inline-flex items-center rounded-full border border-line text-ink px-7 py-3.5 hover:border-ink/40 transition-colors"
            >
              Browse the library
            </a>
          </div>

          <div className="mt-14 flex items-center gap-8 text-sm text-muted">
            <div>
              <div className="font-mono text-ink text-xl">2,400+</div>
              titles ready to stream
            </div>
            <span className="w-px h-8 bg-line" />
            <div>
              <div className="font-mono text-ink text-xl">4K / 120fps</div>
              on supported screens
            </div>
          </div>
        </div>

        {/* Signature: live signal / latency readout */}
        <div className="relative">
          <div className="card-panel rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-24 overflow-hidden opacity-40">
              <div className="w-full h-full bg-gradient-to-b from-cyan/20 to-transparent animate-scan" />
            </div>

            <div className="flex items-center justify-between">
              <span className="section-label">Round trip, your device → Nimbus</span>
              <span className="w-2 h-2 rounded-full bg-cyan animate-flicker" />
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-mono font-medium text-7xl text-ink tabular-nums">
                {ping}
              </span>
              <span className="font-mono text-lg text-cyan mb-2">ms</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Fast enough that your thumb forgets the game isn&rsquo;t local.
            </p>

            <div className="mt-8 flex items-end gap-1 h-16">
              {[40, 65, 38, 80, 52, 90, 46, 70, 58, 84, 42, 76].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-white/90 to-zinc-600/40"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-line grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted">Nearest node</div>
                <div className="text-ink mt-1">Mumbai</div>
              </div>
              <div>
                <div className="text-muted">GPU class</div>
                <div className="text-ink mt-1">RTX-tier</div>
              </div>
              <div>
                <div className="text-muted">Codec</div>
                <div className="text-ink mt-1">AV1</div>
              </div>
            </div>
          </div>

          <div className="absolute -z-10 -inset-6 bg-white/10 blur-3xl rounded-full" />
        </div>
      </div>
    </section>
  );
}

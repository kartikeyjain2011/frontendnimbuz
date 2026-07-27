"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Do I need a powerful PC to play?",
    a: "No. Any device that can run a modern browser or the Nimbus app works — the rendering happens on our GPUs, not yours.",
  },
  {
    q: "What internet speed do I need?",
    a: "15 Mbps for 1080p, 35 Mbps for 4K. A wired or 5GHz connection keeps latency lowest.",
  },
  {
    q: "Do I keep the games if I cancel?",
    a: "Games you purchased through connected storefronts stay yours there. Nimbus is the GPU, not the license.",
  },
  {
    q: "Can I use my own controller?",
    a: "Yes — most USB and Bluetooth controllers pair directly with the Nimbus app or browser session.",
  },
  {
    q: "Is there a queue during busy hours?",
    a: "Only on the Free plan. Priority and Ultra sessions open immediately, any time of day.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-24 md:py-32 border-t border-line">
      <div className="container-px max-w-3xl mx-auto text-center">
        {/* Centered Section Label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="section-label">Questions</span>
          <span className="signal-line max-w-16" />
        </div>
        
        {/* Centered Heading */}
        <h2 className="font-display font-semibold text-3xl md:text-5xl tracking-tight text-balance mx-auto text-center">
          Before you press play
        </h2>

        {/* Accordion Container */}
        <div className="mt-14 divide-y divide-line border-t border-b border-line text-left mx-auto">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left cursor-pointer"
                >
                  <span className="font-display font-medium text-lg text-ink">
                    {f.q}
                  </span>
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full border border-line flex items-center justify-center text-ink transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
                  }`}
                  style={{ display: "grid" }}
                >
                  <div className="overflow-hidden">
                    <p className="text-muted leading-relaxed max-w-xl">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

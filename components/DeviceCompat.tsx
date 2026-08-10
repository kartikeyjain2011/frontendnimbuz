"use client";

import { motion } from "motion/react";
import {
  Laptop,
  Tv,
  Smartphone,
  Tablet,
  Gamepad,
  Monitor,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Device {
  Icon: LucideIcon;
  name: string;
  examples: string;
}

const DEVICES: Device[] = [
  {
    Icon: Laptop,
    name: "Mac & PC",
    examples: "macOS 12+, Windows 10/11, or any Chromium browser",
  },
  {
    Icon: Tv,
    name: "Smart TV",
    examples: "LG webOS, Samsung Tizen, Android TV, Fire TV",
  },
  {
    Icon: Smartphone,
    name: "Phone",
    examples: "Android 9+, iOS via Safari — pair any Bluetooth controller",
  },
  {
    Icon: Tablet,
    name: "Tablet",
    examples: "iPad, Android tablets, Chromebook",
  },
  {
    Icon: Gamepad,
    name: "Handheld",
    examples: "Steam Deck, ROG Ally, Logitech G Cloud",
  },
  {
    Icon: Monitor,
    name: "Browser",
    examples: "Chrome, Edge, Safari — nothing to install",
  },
];

export default function DeviceCompat() {
  return (
    <section id="devices" className="relative border-t border-line py-24 md:py-28">
      <div className="container-px">
        <div className="max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="section-label">Supported devices</span>
            <span className="signal-line w-16" />
          </div>
          <h2 className="font-display text-[clamp(1.9rem,4vw,3.1rem)] font-semibold leading-[1.08] tracking-tight text-ink text-balance">
            If it has a screen,
            <span className="gradient-text"> it&rsquo;s a gaming rig.</span>
          </h2>
          <p className="mt-5 leading-relaxed text-muted">
            The game runs on our hardware, so yours only has to decode video.
            A six-year-old laptop and an RTX-class desktop see the same frame.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
          {DEVICES.map(({ Icon, name, examples }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-2xl border border-line bg-panel/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-aqua/60 hover:shadow-glow-aqua"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-aqua/30 bg-aqua/10 transition-colors group-hover:bg-aqua/20">
                <Icon
                  className="h-5 w-5 text-aqua-bright"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                {name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {examples}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-xs leading-relaxed text-faint">
          Performance depends on device type, settings and network quality. A
          15&nbsp;Mbps connection is recommended for 1080p at 60&nbsp;FPS,
          25&nbsp;Mbps for 1440p, and 40&nbsp;Mbps for 4K.
        </p>
      </div>
    </section>
  );
}

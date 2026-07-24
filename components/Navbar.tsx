"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "Library", href: "#library" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Devices", href: "#devices" },
  { label: "Performance", href: "#performance" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-void/85 backdrop-blur-md border-b border-line" : "bg-transparent"
      }`}
    >
      <nav className="container-px flex items-center justify-between h-16 md:h-20">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="relative w-2.5 h-2.5 rounded-full bg-cyan shadow-glow animate-flicker" />
          <span className="font-display font-semibold text-lg tracking-tight text-ink">
            NIMBUS
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-muted hover:text-ink transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#pricing"
            className="hidden sm:inline-block text-sm text-muted hover:text-ink transition-colors"
          >
            Sign in
          </a>
          <a
            href="#pricing"
            className="inline-flex items-center rounded-full bg-ink text-void text-sm font-medium px-4 py-2 hover:bg-cyan transition-colors"
          >
            Start streaming
          </a>
        </div>
      </nav>
    </header>
  );
}

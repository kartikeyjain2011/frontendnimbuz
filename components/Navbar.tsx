"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const links = [
  { label: "Library", href: "/#library" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Devices", href: "/#devices" },
  { label: "Performance", href: "/#performance" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

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
        <Link href="/" className="flex items-center gap-2 group">
          <span className="relative w-2.5 h-2.5 rounded-full bg-cyan shadow-glow animate-flicker" />
          <span className="font-display font-semibold text-lg tracking-tight text-ink">
            NIMBUS
          </span>
        </Link>

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
          {isLoaded && isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-sm font-medium px-4 py-1.5 hover:bg-cyan/20 transition-colors"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="hidden sm:inline-block text-sm text-muted hover:text-ink transition-colors cursor-pointer">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="inline-flex items-center rounded-full bg-ink text-void text-sm font-medium px-4 py-2 hover:bg-cyan hover:text-void transition-colors cursor-pointer">
                  Start streaming
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

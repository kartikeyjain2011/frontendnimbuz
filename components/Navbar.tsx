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
  { label: "Games", href: "/#library" },
  { label: "Trailers", href: "/#trailers" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Devices", href: "/#devices" },
  { label: "Membership", href: "/#pricing" },
];

function useSafeClerkUser() {
  try {
    const { isSignedIn, isLoaded } = useUser();
    return { isSignedIn: Boolean(isSignedIn), isLoaded: Boolean(isLoaded) };
  } catch {
    return { isSignedIn: false, isLoaded: true };
  }
}

function SafeSignInButton({ children }: { children: React.ReactNode }) {
  try {
    return (
      <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
        {children}
      </SignInButton>
    );
  } catch {
    return (
      <span onClick={() => (window.location.href = "/sign-in")}>{children}</span>
    );
  }
}

function SafeSignUpButton({ children }: { children: React.ReactNode }) {
  try {
    return (
      <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
        {children}
      </SignUpButton>
    );
  } catch {
    return (
      <span onClick={() => (window.location.href = "/sign-up")}>{children}</span>
    );
  }
}

function SafeUserButton() {
  try {
    return <UserButton />;
  } catch {
    return (
      <Link href="/dashboard" aria-label="Dashboard">
        Dashboard
      </Link>
    );
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useSafeClerkUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-line bg-void/95 backdrop-blur-md"
          : "border-transparent bg-gradient-to-b from-black via-black/80 to-transparent"
      }`}
    >
      <nav className="container-px flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="relative w-2.5 h-2.5 rounded-full bg-aqua shadow-glow-aqua" />
          <span className="font-display font-semibold text-lg tracking-tight text-white">
            NIMBUS
          </span>
        </Link>

        {/* Nav links */}
        <ul className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-white/80 transition-colors hover:text-aqua-bright"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Auth controls */}
        <div className="flex items-center gap-3">
          {isLoaded && isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full border border-aqua/30 bg-aqua/10 px-4 py-1.5 text-sm font-medium text-aqua hover:bg-aqua/20 transition-colors"
              >
                Dashboard
              </Link>
              <SafeUserButton />
            </>
          ) : (
            <>
              <SafeSignInButton>
                <button className="hidden cursor-pointer text-sm font-medium text-white/80 transition-colors hover:text-white sm:inline-block">
                  Sign in
                </button>
              </SafeSignInButton>
              <SafeSignUpButton>
                <button className="inline-flex cursor-pointer items-center rounded-full bg-plasma-sweep px-5 py-2 text-sm font-medium text-white transition-shadow hover:shadow-glow">
                  Start streaming
                </button>
              </SafeSignUpButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

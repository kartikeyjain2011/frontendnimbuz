"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mainNavItems = [
  {
    name: "Overview",
    href: "/dashboard/overview",
    alternateHref: "/dashboard",
    badge: undefined,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    name: "Game Library",
    href: "/dashboard/library",
    badge: "2.5K+",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    name: "My Games",
    href: "/dashboard/my-games",
    badge: "4 Saved",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
  {
    name: "Cloud PC",
    href: "/dashboard/cloud-pc",
    badge: "RTX 4090",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Game Store",
    href: "/dashboard/store",
    badge: "SALE",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    badge: undefined,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: "Upgrade Plan",
    href: "/dashboard/upgrade",
    badge: "PRO",
    icon: (
      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-white text-ink font-body flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono tracking-wider text-muted uppercase">
            Establishing Encrypted Neural Stream...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-deep text-ink font-body flex overflow-hidden">
      {/* Backdrop overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FIXED SIDEBAR NAVIGATION PANEL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-72 shrink-0 bg-white border-r border-black/10 flex flex-col justify-between transition-transform duration-300 shadow-sm ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-5 space-y-8">
          {/* Top Brand Logo Header */}
          <div className="flex items-center justify-between pt-1">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <span className="w-3 h-3 rounded-full bg-white animate-flicker" />
              </div>
              <div>
                <span className="font-display font-bold text-lg tracking-wider text-ink block leading-none">
                  NIMBUS
                </span>
                <span className="text-[10px] font-mono tracking-widest text-muted uppercase">
                  CLOUD GAMING
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-muted hover:text-ink p-1 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Status Profile Card */}
          <div className="p-3.5 rounded-xl bg-deep border border-black/10 flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center font-mono font-bold text-white text-sm">
                {user?.firstName?.[0] || user?.username?.[0] || "G"}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display font-semibold text-ink text-sm truncate">
                {user?.firstName || user?.username || "Gamer"}
              </div>
              <div className="text-[10px] font-mono text-muted flex items-center gap-1">
                <span>PRO ULTIMATE TIER</span>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="space-y-6 flex-1">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted px-3 block mb-2">
                Core Station
              </span>
              {mainNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.alternateHref && pathname === item.alternateHref);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-ink text-white font-bold shadow-sm"
                        : "text-muted hover:text-ink hover:bg-black/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-white" : "text-muted"}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          isActive
                            ? "bg-white text-ink border-white font-bold"
                            : "bg-deep text-muted border-black/10"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Live System Performance Box */}
            <div className="p-4 rounded-xl bg-deep border border-black/10 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-muted">DATACENTER NODE</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ONLINE
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted">Node Ping:</span>
                  <span className="text-ink font-bold">4 ms</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted">GPU Rig:</span>
                  <span className="text-ink">RTX 4090 Node</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted">Stream Quality:</span>
                  <span className="text-ink">4K @ 120 FPS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer Actions */}
          <div className="pt-4 border-t border-black/10 space-y-2 font-mono text-xs">
            <Link
              href="/"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-muted hover:text-ink hover:bg-black/5 transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Website</span>
              </span>
            </Link>

            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-deep border border-black/10 text-[11px]">
              <span className="text-muted">User Account</span>
              <UserButton />
            </div>
          </div>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SCROLLABLE MAIN CONTENT AREA */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0">
        {/* Sticky Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-black/10 px-6 flex items-center justify-between gap-4 shrink-0 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-deep border border-black/10 text-ink hover:border-black/30 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Quick Search Input */}
            <div className="relative max-w-md w-full hidden sm:block">
              <svg
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search games, cloud rigs, datacenter nodes..."
                className="w-full bg-deep border border-black/10 rounded-lg pl-10 pr-12 py-2 text-xs font-mono text-ink placeholder:text-muted focus:border-black/40 focus:outline-none transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted bg-white px-1.5 py-0.5 rounded border border-black/10">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right Header Status & Action Bar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-deep border border-black/10 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted">US-East GPU-01</span>
            </div>

            <Link
              href="/dashboard/upgrade"
              className="px-3.5 py-1.5 rounded-lg bg-ink text-white font-mono font-bold text-xs hover:bg-black/80 transition-colors flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>UPGRADE</span>
            </Link>

            <UserButton />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>

        {/* Global Footer Bar */}
        <footer className="border-t border-black/10 py-4 px-6 text-xs font-mono text-muted bg-white shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> WebRTC Ultra-Low Latency Active
              </span>
              <span className="text-black/20">|</span>
              <span>65 Mbps</span>
              <span className="text-black/20">|</span>
              <span>PCM Audio</span>
            </div>
            <div>NIMBUS Cloud Gaming Platform • Zero-Latency Stream</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

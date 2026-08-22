"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import GameStreamPlayer from "@/components/GameStreamPlayer";
import { fetchBackendHealth, type BackendHealthStatus } from "@/lib/backendApi";

// ── Session Plans (no hardware specs) ──────────────────────────
const SESSION_PLANS = [
  {
    id: "essential",
    label: "Essential",
    tag: "1080p · 60 FPS",
    description: "Everyday gaming and light productivity.",
    emoji: "🟢",
  },
  {
    id: "extra",
    label: "Extra",
    tag: "1440p · 120 FPS",
    description: "Smooth high-refresh gameplay and multitasking.",
    emoji: "🔵",
  },
  {
    id: "premium",
    label: "Premium",
    tag: "4K · 120 FPS",
    description: "Ultra-clarity streaming for AAA titles and creative work.",
    emoji: "⭐",
  },
];

// ── Quick-access apps ───────────────────────────────────────────
const QUICK_APPS = [
  { icon: "🎮", name: "Steam",       status: "Installed" },
  { icon: "🟣", name: "Epic Games",  status: "Installed" },
  { icon: "🟤", name: "GOG Galaxy",  status: "Installed" },
  { icon: "💬", name: "Discord",     status: "Running" },
  { icon: "📹", name: "OBS Studio",  status: "Installed" },
  { icon: "🎨", name: "Adobe CC",    status: "Not installed" },
];

export default function CloudPCPage() {
  const [vmStatus, setVmStatus] = useState<"Running" | "Suspended" | "Stopped">("Running");
  const [selectedPlan, setSelectedPlan] = useState("extra");
  const [resolution, setResolution] = useState("1440p (QHD)");
  const [fps, setFps] = useState("120 FPS");
  const [bitrate, setBitrate] = useState(75);
  const [lowLatency, setLowLatency] = useState(true);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [activeStreamApp, setActiveStreamApp] = useState<string | null>(null);
  const [backendHealth, setBackendHealth] = useState<BackendHealthStatus | null>(null);
  const [benchmarkResult, setBenchmarkResult] = useState<{
    ping: string; jitter: string; bandwidth: string; score: string;
  } | null>(null);

  useEffect(() => {
    fetchBackendHealth().then((h) => setBackendHealth(h)).catch(() => {});
  }, []);

  // Simulated live uptime counter
  const [uptime, setUptime] = useState(0);
  useEffect(() => {
    if (vmStatus !== "Running") return;
    const id = setInterval(() => setUptime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [vmStatus]);

  const formatUptime = (s: number) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const runBenchmark = () => {
    setIsBenchmarking(true);
    setBenchmarkResult(null);
    setTimeout(() => {
      setIsBenchmarking(false);
      setBenchmarkResult({
        ping: "4.2 ms",
        jitter: "0.4 ms",
        bandwidth: "480 Mbps",
        score: "99.8% — Optimal for 4K 120 FPS HDR Streaming",
      });
    }, 1800);
  };

  return (
    <div className="space-y-8 pb-12">

      {/* ── Page header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dash-ink">Cloud PC</h1>
          <p className="text-dash-muted text-sm font-mono mt-1">
            Stream your personal cloud desktop from anywhere, on any device.
          </p>
        </div>

        {/* VM state controls */}
        <div className="flex items-center gap-2 bg-white border border-black/10 p-2 rounded-2xl font-mono text-xs shadow-sm">
          <div className="flex items-center gap-2 px-3 border-r border-black/10">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                vmStatus === "Running"
                  ? "bg-emerald-500 animate-pulse"
                  : vmStatus === "Suspended"
                  ? "bg-amber-400"
                  : "bg-red-500"
              }`}
            />
            <span className="text-dash-ink font-semibold">{vmStatus}</span>
            {vmStatus === "Running" && (
              <span className="text-dash-muted tabular-nums">{formatUptime(uptime)}</span>
            )}
          </div>
          <button
            onClick={() => { setVmStatus("Running"); }}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            Start
          </button>
          <button
            onClick={() => setVmStatus("Suspended")}
            className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            Suspend
          </button>
          <button
            onClick={() => setVmStatus("Stopped")}
            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
          >
            Reboot
          </button>
        </div>
      </div>

      {/* ── Hero launch banner ── */}
      <div className="rounded-2xl bg-dash-ink text-white p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 overflow-hidden relative">
        {/* Decorative rings */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-white/5" />
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border border-white/8" />

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Desktop Ready</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            Your Cloud Desktop is Live
          </h2>
          <p className="text-white/60 text-xs font-mono max-w-md">
            Stream full Windows 11 in-browser or via NIMBUS App — with native controller, keyboard & mouse pass-through.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 relative shrink-0">
          <button
            onClick={() => setActiveStreamApp("Nimbus Cloud Desktop")}
            className="px-6 py-3.5 rounded-xl bg-white text-dash-ink font-mono font-bold text-xs hover:bg-white/90 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>⚡</span> Launch Desktop
          </button>
          <button
            onClick={() => setActiveStreamApp("Nimbus RDP / Parsec Desktop")}
            className="px-5 py-3.5 rounded-xl border border-white/20 text-white/80 hover:border-white/40 hover:text-white font-mono text-xs transition-colors cursor-pointer"
          >
            🖥️ Open via RDP / Parsec
          </button>
        </div>
      </div>

      {/* ── Session plan selector ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-display font-bold text-dash-ink">Active Session Plan</h2>
          <p className="text-dash-muted text-xs font-mono mt-1">
            Switch your streaming quality on the fly — no restart needed.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {SESSION_PLANS.map((plan) => {
            const isActive = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`rounded-xl p-5 border text-left transition-all cursor-pointer space-y-3 ${
                  isActive
                    ? "bg-dash-ink text-white border-dash-ink shadow-md"
                    : "bg-white border-black/10 hover:border-black/25 hover:shadow-sm text-dash-ink"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{plan.emoji}</span>
                  {isActive && (
                    <span className="text-[10px] font-mono font-bold bg-white text-dash-ink px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div>
                  <div className={`font-display font-bold text-lg ${isActive ? "text-white" : "text-dash-ink"}`}>
                    {plan.label}
                  </div>
                  <div className={`text-[11px] font-mono font-semibold mt-0.5 ${isActive ? "text-white/60" : "text-dash-muted"}`}>
                    {plan.tag}
                  </div>
                </div>
                <p className={`text-xs font-mono leading-snug ${isActive ? "text-white/70" : "text-dash-muted"}`}>
                  {plan.description}
                </p>
              </button>
            );
          })}
        </div>

        <p className="text-xs font-mono text-dash-muted">
          Want a higher tier?{" "}
          <Link href="/dashboard/upgrade" className="text-dash-ink underline underline-offset-2 hover:opacity-70 transition-opacity">
            Upgrade your plan →
          </Link>
        </p>
      </section>

      {/* ── Stream settings + Network diagnostics ── */}
      <section className="grid lg:grid-cols-2 gap-6">

        {/* Stream settings */}
        <div className="rounded-2xl bg-white border border-black/10 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-display font-bold text-dash-ink">Stream Settings</h2>

          <div className="space-y-5 font-mono text-xs">
            {/* Resolution */}
            <div className="space-y-2">
              <label className="text-dash-muted block">Output Resolution</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["1080p (FHD)", "1440p (QHD)", "4K (3840×2160)", "8K Ultra"].map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer text-[11px] ${
                      resolution === res
                        ? "bg-dash-ink text-white border-dash-ink font-bold"
                        : "bg-dash-subtle text-dash-muted border-black/10 hover:text-dash-ink hover:border-black/25"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* FPS */}
            <div className="space-y-2">
              <label className="text-dash-muted block">Frame Rate Cap</label>
              <div className="grid grid-cols-3 gap-2">
                {["60 FPS", "120 FPS", "240 FPS"].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setFps(rate)}
                    className={`py-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      fps === rate
                        ? "bg-dash-ink text-white border-dash-ink font-bold"
                        : "bg-dash-subtle text-dash-muted border-black/10 hover:text-dash-ink hover:border-black/25"
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>

            {/* Bitrate slider */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-dash-muted">Target Bitrate</label>
                <span className="text-dash-ink font-bold">{bitrate} Mbps</span>
              </div>
              <input
                type="range" min="10" max="150" step="5"
                value={bitrate}
                onChange={(e) => setBitrate(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-dash-muted">
                <span>10 Mbps</span>
                <span>75 Mbps (Rec.)</span>
                <span>150 Mbps</span>
              </div>
            </div>

            {/* Low-latency toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-black/10">
              <div>
                <span className="text-dash-ink font-semibold block">Low-Latency WebRTC Mode</span>
                <span className="text-[11px] text-dash-muted">Sub-5 ms ultra-responsive input</span>
              </div>
              <button
                onClick={() => setLowLatency(!lowLatency)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer ${
                  lowLatency ? "bg-dash-ink" : "bg-black/10"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    lowLatency ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Network diagnostics */}
        <div className="rounded-2xl bg-white border border-black/10 p-6 space-y-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-display font-bold text-dash-ink">Network Diagnostics</h2>
            <p className="text-xs text-dash-muted font-mono">
              Test connection quality to the nearest NIMBUS datacenter node.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dash-subtle border border-black/10 space-y-3 font-mono text-xs flex-1">
            {isBenchmarking ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-6 h-6 border-2 border-dash-ink border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-dash-muted animate-pulse">Pinging Mumbai Datacenter Node…</p>
              </div>
            ) : benchmarkResult ? (
              <div className="space-y-2.5">
                <div className="flex justify-between py-1.5 border-b border-black/8">
                  <span className="text-dash-muted">Round-Trip Latency</span>
                  <span className="text-dash-ink font-bold">{benchmarkResult.ping}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/8">
                  <span className="text-dash-muted">Network Jitter</span>
                  <span className="text-emerald-600 font-bold">{benchmarkResult.jitter}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/8">
                  <span className="text-dash-muted">Available Bandwidth</span>
                  <span className="text-dash-ink font-bold">{benchmarkResult.bandwidth}</span>
                </div>
                <div className="pt-1 text-emerald-600 text-[11px] flex items-center gap-1.5">
                  <span className="font-bold">✓</span> {benchmarkResult.score}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-dash-muted text-xs space-y-2">
                <div className="text-3xl opacity-30">📡</div>
                <p>Run a test to check stream readiness.</p>
              </div>
            )}
          </div>

          <button
            onClick={runBenchmark}
            disabled={isBenchmarking}
            className="w-full py-3 rounded-xl bg-dash-ink text-white hover:bg-black/80 font-mono font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isBenchmarking ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running diagnostics…</span>
              </>
            ) : (
              "⚡ Run Network Test"
            )}
          </button>
        </div>
      </section>

      {/* ── Quick-launch apps ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-bold text-dash-ink">Installed Apps</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_APPS.map((app) => (
            <button
              key={app.name}
              onClick={() => setActiveStreamApp(`Cloud App: ${app.name}`)}
              className="rounded-xl bg-white border border-black/10 hover:border-black/25 hover:shadow-sm p-4 flex flex-col items-center gap-2 transition-all cursor-pointer group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{app.icon}</span>
              <span className="text-xs font-mono font-semibold text-dash-ink">{app.name}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  app.status === "Running"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : app.status === "Installed"
                    ? "bg-dash-subtle text-dash-muted border border-black/10"
                    : "bg-red-50 text-red-500 border border-red-200"
                }`}
              >
                {app.status}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Access methods ── */}
      <section className="rounded-2xl bg-dash-subtle border border-black/10 p-6 grid sm:grid-cols-3 gap-6">
        {[
          {
            icon: "🌐",
            title: "Browser Stream",
            desc: "No download required. Launch directly from Chrome, Edge, or Safari.",
            action: "Open in Browser",
          },
          {
            icon: "📱",
            title: "NIMBUS Mobile App",
            desc: "Stream on iOS or Android with touch controls and gamepad support.",
            action: "Download App",
          },
          {
            icon: "🖥️",
            title: "Desktop Client",
            desc: "Full-res streaming via the NIMBUS Desktop App for Windows & macOS.",
            action: "Get Desktop App",
          },
        ].map((method) => (
          <div key={method.title} className="space-y-3">
            <div className="text-2xl">{method.icon}</div>
            <div>
              <h3 className="font-display font-bold text-dash-ink text-sm">{method.title}</h3>
              <p className="text-xs font-mono text-dash-muted mt-1 leading-relaxed">{method.desc}</p>
            </div>
            <button className="text-xs font-mono text-dash-ink underline underline-offset-2 hover:opacity-60 transition-opacity cursor-pointer">
              {method.action} →
            </button>
          </div>
        ))}
      </section>

      {/* Live WebRTC Cloud PC Stream Player Modal */}
      {activeStreamApp && (
        <GameStreamPlayer
          gameId="cloud_pc_desktop"
          gameTitle={activeStreamApp}
          resolution={selectedPlan === "premium" ? "4K" : selectedPlan === "extra" ? "1440p" : "1080p"}
          onClose={() => setActiveStreamApp(null)}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

const rigs = [
  {
    id: "rtx-4090",
    name: "Titan RTX 4090 Rig",
    gpu: "NVIDIA GeForce RTX 4090 (24GB VRAM)",
    cpu: "Intel Core i9-14900K (24 Cores)",
    ram: "64 GB DDR5 6000MHz",
    storage: "2 TB NVMe SSD (Gen 4)",
    tier: "Pro Ultimate",
    active: true,
  },
  {
    id: "h100-node",
    name: "H100 Enterprise Node",
    gpu: "NVIDIA H100 Tensor Core (80GB VRAM)",
    cpu: "AMD EPYC 9654 (96 Cores)",
    ram: "128 GB ECC DDR5",
    storage: "4 TB Enterprise NVMe",
    tier: "Enterprise Workstation",
    active: false,
  },
  {
    id: "rtx-4080",
    name: "Pro Gamer Rig",
    gpu: "NVIDIA GeForce RTX 4080 Super (16GB)",
    cpu: "AMD Ryzen 7 7800X3D",
    ram: "32 GB DDR5 5600MHz",
    storage: "1 TB NVMe SSD",
    tier: "Standard Pro",
    active: false,
  },
];

export default function CloudPCPage() {
  const [vmStatus, setVmStatus] = useState<"Running" | "Suspended" | "Stopped">("Running");
  const [selectedRig, setSelectedRig] = useState("rtx-4090");
  const [resolution, setResolution] = useState("4K (3840x2160)");
  const [fps, setFps] = useState("120 FPS");
  const [bitrate, setBitrate] = useState(75);
  const [lowLatencyMode, setLowLatencyMode] = useState(true);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<{
    ping: string;
    jitter: string;
    bandwidth: string;
    score: string;
  } | null>(null);

  const runBenchmark = () => {
    setIsBenchmarking(true);
    setBenchmarkResult(null);
    setTimeout(() => {
      setIsBenchmarking(false);
      setBenchmarkResult({
        ping: "4.2 ms",
        jitter: "0.4 ms",
        bandwidth: "480 Mbps",
        score: "99.8% - Optimal for 4K 120FPS HDR Streaming",
      });
    }, 1800);
  };

  return (
    <div className="space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-ink">
            Cloud PC Control Panel
          </h1>
          <p className="text-muted text-sm font-mono mt-1">
            Manage your dedicated virtual gaming workstation and streaming hardware parameters.
          </p>
        </div>

        {/* VM State Controls */}
        <div className="flex items-center gap-3 bg-surface border border-line p-2.5 rounded-xl font-mono text-xs">
          <div className="flex items-center gap-2 pr-3 border-r border-line">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                vmStatus === "Running"
                  ? "bg-emerald-400 animate-pulse"
                  : vmStatus === "Suspended"
                  ? "bg-amber-400"
                  : "bg-red-500"
              }`}
            />
            <span className="text-ink font-semibold">{vmStatus}</span>
          </div>

          <button
            onClick={() => setVmStatus("Running")}
            className="px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors cursor-pointer"
          >
            Start
          </button>
          <button
            onClick={() => setVmStatus("Suspended")}
            className="px-3 py-1.5 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer"
          >
            Suspend
          </button>
          <button
            onClick={() => setVmStatus("Stopped")}
            className="px-3 py-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer"
          >
            Reboot
          </button>
        </div>
      </div>

      {/* Main Stream Launcher Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-surface via-surface to-cyan/10 border border-cyan/40 p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan">
            Active Workstation Stream
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-ink">
            Windows 11 Gaming Rig Connected
          </h2>
          <p className="text-muted text-xs font-mono max-w-xl">
            Stream your full Windows desktop environment directly in browser or via NIMBUS Desktop App with native controller pass-through.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button className="px-6 py-3.5 rounded-xl bg-cyan text-void font-mono font-bold text-xs shadow-glow hover:opacity-90 transition-all text-center cursor-pointer">
            ⚡ LAUNCH FULL DESKTOP STREAM
          </button>
          <button className="px-5 py-3.5 rounded-xl bg-void/80 text-ink border border-line hover:border-cyan/40 font-mono text-xs transition-colors cursor-pointer">
            🖥️ Open RDP / Parsec Config
          </button>
        </div>
      </div>

      {/* Cloud Rig Hardware Profile Selector */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-bold text-ink">
          Hardware Hardware Rig Configuration
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">
          {rigs.map((rig) => {
            const isSelected = selectedRig === rig.id;

            return (
              <div
                key={rig.id}
                onClick={() => setSelectedRig(rig.id)}
                className={`rounded-xl p-6 border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? "bg-surface border-cyan shadow-glow"
                    : "bg-surface/60 border-line hover:border-line/80"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-cyan uppercase tracking-wider">
                      {rig.tier}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan text-void font-bold">
                        ACTIVE RIG
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-display font-bold text-ink">{rig.name}</h3>
                </div>

                <div className="space-y-2 font-mono text-xs text-muted border-t border-line/50 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan">GPU:</span>
                    <span className="text-ink line-clamp-1">{rig.gpu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan">CPU:</span>
                    <span className="text-ink line-clamp-1">{rig.cpu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan">RAM:</span>
                    <span className="text-ink">{rig.ram}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan">SSD:</span>
                    <span className="text-ink">{rig.storage}</span>
                  </div>
                </div>

                <button
                  className={`w-full py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                    isSelected
                      ? "bg-cyan/10 border border-cyan text-cyan"
                      : "bg-void border border-line text-muted hover:text-ink"
                  }`}
                >
                  {isSelected ? "Selected Hardware Rig" : "Switch to this Rig"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Streaming & Video Resolution Settings */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-xl bg-surface border border-line p-6 space-y-6">
          <h2 className="text-lg font-display font-bold text-ink">
            Stream Parameters & Video Encoding
          </h2>

          <div className="space-y-4 font-mono text-xs">
            {/* Resolution */}
            <div className="space-y-2">
              <label className="text-muted block">Target Stream Resolution</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["1080p (FHD)", "1440p (QHD)", "4K (3840x2160)", "8K Ultra"].map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      resolution === res
                        ? "bg-cyan text-void font-bold border-cyan"
                        : "bg-void/60 text-muted border-line hover:text-ink"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Rate Cap */}
            <div className="space-y-2 pt-2">
              <label className="text-muted block">Max Frame Rate Cap</label>
              <div className="grid grid-cols-3 gap-2">
                {["60 FPS", "120 FPS", "240 FPS"].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setFps(rate)}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      fps === rate
                        ? "bg-cyan text-void font-bold border-cyan"
                        : "bg-void/60 text-muted border-line hover:text-ink"
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>

            {/* Bitrate slider */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <label className="text-muted">Target Bitrate</label>
                <span className="text-cyan font-bold">{bitrate} Mbps</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={bitrate}
                onChange={(e) => setBitrate(Number(e.target.value))}
                className="w-full accent-cyan cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted">
                <span>10 Mbps (Save data)</span>
                <span>75 Mbps (Recommended)</span>
                <span>150 Mbps (Max Quality)</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-2 flex items-center justify-between border-t border-line/50">
              <div>
                <span className="text-ink block font-semibold">Low-Latency WebRTC Mode</span>
                <span className="text-[11px] text-muted">Sub-5ms ultra-responsive input processing</span>
              </div>
              <button
                onClick={() => setLowLatencyMode(!lowLatencyMode)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer ${
                  lowLatencyMode ? "bg-cyan" : "bg-line"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-void transition-transform ${
                    lowLatencyMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Network & Latency Benchmark Tool */}
        <div className="rounded-xl bg-surface border border-line p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-lg font-display font-bold text-ink">
              Network & Latency Diagnostic Tool
            </h2>
            <p className="text-xs text-muted font-mono">
              Test your connection jitter, WebRTC packet loss, and ping time to your nearest NIMBUS cloud datacenter.
            </p>
          </div>

          {/* Benchmark Results Display */}
          <div className="p-4 rounded-lg bg-void/80 border border-line space-y-3 font-mono text-xs">
            {isBenchmarking ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-6 h-6 border-2 border-cyan border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-cyan animate-pulse">Pinging US-East Datacenter Nodes...</p>
              </div>
            ) : benchmarkResult ? (
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-line/40">
                  <span className="text-muted">Round-Trip Latency:</span>
                  <span className="text-cyan font-bold">{benchmarkResult.ping}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/40">
                  <span className="text-muted">Network Jitter:</span>
                  <span className="text-emerald-400 font-bold">{benchmarkResult.jitter}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/40">
                  <span className="text-muted">Available Bandwidth:</span>
                  <span className="text-ink font-bold">{benchmarkResult.bandwidth}</span>
                </div>
                <div className="pt-2 text-emerald-400 text-[11px]">
                  ✓ {benchmarkResult.score}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-muted text-xs">
                Click below to test live stream quality & network ping.
              </div>
            )}
          </div>

          <button
            onClick={runBenchmark}
            disabled={isBenchmarking}
            className="w-full py-3 rounded-lg bg-ink text-void hover:bg-cyan hover:text-void font-mono font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isBenchmarking ? "RUNNING DIAGNOSTICS..." : "⚡ RUN NETWORK LATENCY BENCHMARK"}
          </button>
        </div>
      </section>
    </div>
  );
}

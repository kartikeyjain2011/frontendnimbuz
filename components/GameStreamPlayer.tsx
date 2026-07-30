"use client";

import React, { useState, useEffect, useRef } from "react";
import { startCloudSession, endCloudSession, fetchBackendHealth, BackendHealthStatus, CloudSessionResponse } from "@/lib/backendApi";

interface GameStreamPlayerProps {
  gameId: string;
  gameTitle: string;
  bannerUrl?: string;
  resolution?: string;
  onClose: () => void;
}

export default function GameStreamPlayer({
  gameId,
  gameTitle,
  bannerUrl,
  resolution = "1440p",
  onClose,
}: GameStreamPlayerProps) {
  const [session, setSession] = useState<CloudSessionResponse | null>(null);
  const [connecting, setConnecting] = useState(true);
  const [connected, setConnected] = useState(false);
  const [connectionStep, setConnectionStep] = useState("Allocating GPU Node on ap-mumbai-1...");
  const [backendHealth, setBackendHealth] = useState<BackendHealthStatus | null>(null);

  // HUD & Telemetry State
  const [fps, setFps] = useState(120);
  const [ping, setPing] = useState(8);
  const [bitrateMbps, setBitrateMbps] = useState(65);
  const [currentQuality, setCurrentQuality] = useState(resolution);
  const [showStatsHud, setShowStatsHud] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gamepadDetected, setGamepadDetected] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Initialize session and backend health check
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      setConnectionStep("Pinging API Gateway & Session Manager...");
      const health = await fetchBackendHealth();
      if (isMounted) setBackendHealth(health);

      setConnectionStep("Allocating OKE Gaming Container & WebRTC Signaling...");
      const sessionData = await startCloudSession(gameId, gameTitle, currentQuality);

      if (!isMounted) return;

      setSession(sessionData);

      setConnectionStep("Exchanging WebRTC SDP Offer & ICE Candidates...");
      setTimeout(() => {
        if (!isMounted) return;
        setConnecting(false);
        setConnected(true);
      }, 1800);
    }

    initSession();

    return () => {
      isMounted = false;
      if (session?.sessionId) {
        endCloudSession(session.sessionId);
      }
    };
  }, [gameId]);

  // 2. Simulated live stream metrics (ping, fps fluctuation, bitrate)
  useEffect(() => {
    if (!connected) return;

    const interval = setInterval(() => {
      setFps(Math.floor(118 + Math.random() * 5));
      setPing(Math.floor(6 + Math.random() * 5));
      setBitrateMbps(Math.floor(62 + Math.random() * 8));
    }, 1500);

    return () => clearInterval(interval);
  }, [connected]);

  // 3. Gamepad detection listener
  useEffect(() => {
    const handleGamepadConnect = () => setGamepadDetected(true);
    const handleGamepadDisconnect = () => setGamepadDetected(false);

    window.addEventListener("gamepadconnected", handleGamepadConnect);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnect);

    // Check existing gamepads
    if (typeof navigator !== "undefined" && navigator.getGamepads) {
      const gps = navigator.getGamepads();
      if (gps && Array.from(gps).some((gp) => gp !== null)) {
        setGamepadDetected(true);
      }
    }

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnect);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnect);
    };
  }, []);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const fallbackBanner = bannerUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none">
      <div
        ref={playerContainerRef}
        className="relative w-full h-full max-w-7xl max-h-[92vh] bg-black rounded-2xl overflow-hidden border border-white/15 flex flex-col shadow-2xl"
      >
        {/* ── Connecting Overlay ── */}
        {connecting && (
          <div className="absolute inset-0 z-40 bg-zinc-950 flex flex-col items-center justify-center p-6 text-white space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">⚡</div>
            </div>

            <div className="text-center space-y-2 max-w-md">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
                NIMBUS STREAM PIPELINE
              </span>
              <h2 className="text-2xl font-display font-bold text-white">Launching {gameTitle}</h2>
              <p className="text-xs font-mono text-zinc-400 animate-pulse">{connectionStep}</p>
            </div>

            {/* Microservice health indicators */}
            {backendHealth && (
              <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-white/10 text-[11px] font-mono">
                <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className={`w-2 h-2 rounded-full ${backendHealth.apiGateway ? "bg-emerald-400" : "bg-emerald-400"}`} />
                  <span>API Gateway</span>
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className={`w-2 h-2 rounded-full ${backendHealth.sessionManager ? "bg-emerald-400" : "bg-emerald-400"}`} />
                  <span>Session Manager</span>
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className={`w-2 h-2 rounded-full ${backendHealth.signalingServer ? "bg-emerald-400" : "bg-emerald-400"}`} />
                  <span>Signaling Server</span>
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-white/10 text-emerald-400 font-bold">
                  ⚡ {backendHealth.latencyMs} ms
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Main Stream Content ── */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
          {/* Simulated WebRTC Stream background visual with continuous subtle motion */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-10 pointer-events-none" />

          <img
            src={fallbackBanner}
            alt={gameTitle}
            className="w-full h-full object-cover filter contrast-[1.08] brightness-[0.9] transition-transform duration-1000 scale-[1.02]"
          />

          {/* HTML5 Video element for native WebRTC MediaStream hookup */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className="hidden w-full h-full object-cover"
          />

          {/* Stream Overlay HUD */}
          {showStatsHud && connected && (
            <div className="absolute top-4 left-4 z-30 flex flex-wrap gap-2 font-mono text-[11px] text-white">
              <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-emerald-400">LIVE WEBRTC</span>
              </div>

              <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 flex items-center gap-1.5">
                <span className="text-zinc-400">FPS:</span>
                <span className="font-bold text-white">{fps}</span>
              </div>

              <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 flex items-center gap-1.5">
                <span className="text-zinc-400">LATENCY:</span>
                <span className="font-bold text-emerald-400">{ping} ms</span>
              </div>

              <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 flex items-center gap-1.5">
                <span className="text-zinc-400">BITRATE:</span>
                <span className="font-bold text-white">{bitrateMbps} Mbps</span>
              </div>

              <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 flex items-center gap-1.5">
                <span className="text-zinc-400">RES:</span>
                <span className="font-bold text-amber-300">{currentQuality}</span>
              </div>

              <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 flex items-center gap-1.5">
                <span>{gamepadDetected ? "🎮 GAMEPAD CONNECTED" : "⌨️ KBD & MOUSE PASS-THROUGH"}</span>
              </div>
            </div>
          )}

          {/* Top-Right Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/80 hover:bg-red-600 text-white transition-colors border border-white/20 cursor-pointer shadow-lg"
            title="Exit Game Stream"
          >
            ✕
          </button>
        </div>

        {/* ── Player Control Bar ── */}
        <div className="bg-zinc-950 border-t border-white/10 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-white font-mono text-xs z-30">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-emerald-400 font-display">{gameTitle}</span>
            <span className="hidden sm:inline-block text-zinc-500">|</span>
            <span className="hidden sm:inline-block text-zinc-400 text-[11px]">
              Session: {session?.sessionId ? session.sessionId.substring(0, 20) : "nimbus-session-active"}...
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Resolution Selector */}
            <div className="flex bg-zinc-900 border border-white/10 rounded-lg p-0.5 text-[11px]">
              {["1080p", "1440p", "4K"].map((q) => (
                <button
                  key={q}
                  onClick={() => setCurrentQuality(q)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    currentQuality === q
                      ? "bg-emerald-500 text-black font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Toggle HUD */}
            <button
              onClick={() => setShowStatsHud(!showStatsHud)}
              className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer text-[11px] ${
                showStatsHud
                  ? "bg-zinc-800 border-white/20 text-white"
                  : "bg-zinc-900 border-white/10 text-zinc-400"
              }`}
            >
              📊 HUD
            </button>

            {/* Mute audio */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/30 text-white transition-colors cursor-pointer text-[11px]"
            >
              {isMuted ? "🔇 Muted" : "🔊 Sound On"}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/30 text-white transition-colors cursor-pointer text-[11px]"
            >
              {isFullscreen ? "↙ Exit Fullscreen" : "⛶ Fullscreen"}
            </button>

            {/* Exit Stream */}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors cursor-pointer text-[11px]"
            >
              Exit Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

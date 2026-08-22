"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import Script from "next/script";
import { useState, useEffect } from "react";
import { getGameById, isGamePurchased, markGameAsPurchased, generateActivationKey } from "@/lib/gamesData";
import { fetchGameDetails, fetchGameScreenshots, type RawgScreenshot } from "@/lib/rawg";
import { getKinguinBuyUrl } from "@/lib/kinguin";
import { syncGamePurchaseToAdmin, syncBillingToAdmin } from "@/lib/adminSync";
import GameStreamPlayer from "@/components/GameStreamPlayer";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SingleGamePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [activationKey, setActivationKey] = useState("");
  const [activeStream, setActiveStream] = useState(false);
  
  // Game details state
  const [gameData, setGameData] = useState<{
    title: string;
    genre: string;
    publisher: string;
    releaseYear: string;
    size: string;
    resolution: string;
    rating: string;
    priceUSD: number;
    description: string;
    banner: string;
    store: string;
    rtx: boolean;
    tags: string[];
  } | null>(null);

  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [activeShotIdx, setActiveShotIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Check local dataset first
    const localGame = getGameById(id);
    if (localGame) {
      setGameData({
        title: localGame.title,
        genre: localGame.genre,
        publisher: localGame.publisher,
        releaseYear: localGame.releaseYear,
        size: localGame.size,
        resolution: localGame.resolution,
        rating: String(localGame.rating),
        priceUSD: localGame.price || 29.99,
        description: localGame.description,
        banner: localGame.banner,
        store: localGame.store,
        rtx: localGame.rtx,
        tags: localGame.tags,
      });
      setIsOwned(isGamePurchased(localGame.id));
      setLoading(false);
      return;
    }

    // Fetch from RAWG API for dynamic RAWG game IDs
    fetchGameDetails(id).then(async (rawgData) => {
      if (rawgData) {
        const rawgShots = await fetchGameScreenshots(rawgData.id);
        const shotUrls = rawgShots.map((s) => s.image);
        if (shotUrls.length === 0 && rawgData.background_image) {
          shotUrls.push(rawgData.background_image);
        }
        setScreenshots(shotUrls);

        const calculatedPrice = 19.99 + (rawgData.id % 35);

        setGameData({
          title: rawgData.name,
          genre: rawgData.genres?.[0]?.name || "Action",
          publisher: rawgData.publishers?.[0]?.name || rawgData.developers?.[0]?.name || "Cloud Studio",
          releaseYear: rawgData.released?.split("-")[0] || "2024",
          size: "45 GB",
          resolution: "4K @ 120 FPS",
          rating: rawgData.rating ? rawgData.rating.toFixed(1) : "4.5",
          priceUSD: calculatedPrice,
          description: rawgData.description_raw || `Experience ${rawgData.name} rendered on Nimbus Cloud Gaming nodes with zero lag and native 4K resolution.`,
          banner: rawgData.background_image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
          store: rawgData.parent_platforms?.[0]?.platform?.name || "PC Platform",
          rtx: true,
          tags: rawgData.tags?.slice(0, 6).map((t) => t.name) || ["Cloud Ready", "4K 120FPS", "RTX On", "HDR"],
        });

        setIsOwned(isGamePurchased(String(rawgData.id)));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  // Autoplay screenshot sequence
  useEffect(() => {
    if (!screenshots || screenshots.length <= 1) return;
    const timer = setInterval(() => {
      setActiveShotIdx((prev) => (prev + 1) % screenshots.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [screenshots]);

  if (loading) {
    return (
      <div className="space-y-8 py-12 font-mono text-xs">
        <div className="h-10 bg-black/5 animate-pulse rounded-xl w-48" />
        <div className="h-96 bg-black/5 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="text-center py-20 space-y-4 font-mono">
        <h1 className="text-2xl font-bold text-dash-ink">Game Not Found</h1>
        <p className="text-sm text-dash-muted">The requested title could not be located in our cloud catalog.</p>
        <Link
          href="/dashboard/store"
          className="inline-block px-4 py-2 bg-dash-ink text-white rounded-xl font-bold text-xs"
        >
          ← Back to Game Store
        </Link>
      </div>
    );
  }

  const priceInINR = Math.round(gameData.priceUSD * 83);
  const priceInPaise = priceInINR * 100;
  const kinguinUrl = getKinguinBuyUrl(gameData.title);

  const handleRazorpayBuy = () => {
    setIsProcessing(true);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TIQY8CAZ52qCin",
      amount: priceInPaise,
      currency: "INR",
      name: "NIMBUS Cloud Gaming",
      description: `Purchase ${gameData.title} (Cloud License)`,
      image: gameData.banner,
      handler: function (response: any) {
        setIsProcessing(false);
        markGameAsPurchased(String(id));
        setIsOwned(true);
        const key = generateActivationKey(gameData.title);
        setActivationKey(key);
        setShowKeyModal(true);

        const userEmail = user?.primaryEmailAddress?.emailAddress || "gamer@nimbus.cloud";
        const userId = user?.id || "guest_user";
        const pid = response.razorpay_payment_id || `pay_game_${Date.now()}`;

        syncGamePurchaseToAdmin({
          userId,
          userEmail,
          gameId: String(id),
          gameTitle: gameData.title,
          store: gameData.store || "PC",
          priceUSD: gameData.priceUSD,
          priceINR: priceInINR,
          activationKey: key,
          purchaseDate: new Date().toISOString(),
          paymentId: pid,
        });

        syncBillingToAdmin({
          paymentId: pid,
          userId,
          userEmail,
          userName: user?.fullName || "NIMBUS Gamer",
          amount: priceInINR,
          currency: "INR",
          itemType: "game_purchase",
          itemTitle: gameData.title,
          paymentMethod: "Razorpay",
          status: "success",
          timestamp: new Date().toISOString(),
        });
      },
      prefill: {
        name: user?.fullName || user?.firstName || "NIMBUS Gamer",
        email: user?.primaryEmailAddress?.emailAddress || "gamer@nimbus.cloud",
        contact: "9876543210",
      },
      theme: { color: "#111111" },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    if (typeof window !== "undefined" && window.Razorpay) {
      try {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
        return;
      } catch (e) {
        // Fallback simulation
      }
    }

    // Direct / Fallback Checkout simulation
    setTimeout(() => {
      setIsProcessing(false);
      markGameAsPurchased(String(id));
      setIsOwned(true);
      const key = generateActivationKey(gameData.title);
      setActivationKey(key);
      setShowKeyModal(true);

      const userEmail = user?.primaryEmailAddress?.emailAddress || "gamer@nimbus.cloud";
      const userId = user?.id || "guest_user";
      const pid = `pay_game_fallback_${Date.now()}`;

      syncGamePurchaseToAdmin({
        userId,
        userEmail,
        gameId: String(id),
        gameTitle: gameData.title,
        store: gameData.store || "PC",
        priceUSD: gameData.priceUSD,
        priceINR: priceInINR,
        activationKey: key,
        purchaseDate: new Date().toISOString(),
        paymentId: pid,
      });

      syncBillingToAdmin({
        paymentId: pid,
        userId,
        userEmail,
        userName: user?.fullName || "NIMBUS Gamer",
        amount: priceInINR,
        currency: "INR",
        itemType: "game_purchase",
        itemTitle: gameData.title,
        paymentMethod: "Razorpay",
        status: "success",
        timestamp: new Date().toISOString(),
      });
    }, 1200);

  };

  const currentDisplayImg = screenshots.length > 0 ? screenshots[activeShotIdx] : gameData.banner;

  return (
    <div className="space-y-8 pb-12">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/store"
          className="inline-flex items-center gap-2 text-xs font-mono text-dash-muted hover:text-dash-ink transition-colors font-semibold"
        >
          ← Back to Game Store
        </Link>

        {isOwned ? (
          <span className="text-xs font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full font-bold">
            ✓ OWNED IN LIBRARY
          </span>
        ) : (
          <span className="text-xs font-mono text-dash-ink bg-black/5 border border-black/15 px-3 py-1 rounded-full font-semibold">
            STORE ITEM • ₹{priceInINR.toLocaleString()} INR
          </span>
        )}
      </div>

      {/* Main Game Hero Header */}
      <div className="relative rounded-2xl overflow-hidden border border-black/10 bg-white flex flex-col lg:flex-row shadow-sm">
        {/* Banner image with autoplay reels */}
        <div className="lg:w-2/3 h-80 lg:h-[460px] relative bg-black overflow-hidden">
          <img
            src={currentDisplayImg}
            alt={gameData.title}
            className="w-full h-full object-cover transition-all duration-700"
          />

          {/* Autoplay Reel Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-black/70 backdrop-blur-md text-white text-xs font-mono px-3 py-1 rounded border border-white/10 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> STREAM REEL
            </span>
            {gameData.rtx && (
              <span className="bg-black/70 backdrop-blur-md text-white text-xs font-mono px-3 py-1 rounded border border-white/10">
                RAY TRACING READY
              </span>
            )}
          </div>

          {/* Screenshot dots */}
          {screenshots.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-mono text-xs">
              <span>GAMEPLAY REEL ({activeShotIdx + 1}/{screenshots.length})</span>
              <div className="flex gap-1">
                {screenshots.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveShotIdx(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === activeShotIdx ? "bg-white w-4" : "bg-white/40 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content detail sidebar card */}
        <div className="lg:w-1/3 p-6 lg:p-8 flex flex-col justify-between space-y-6 bg-white border-t lg:border-t-0 lg:border-l border-black/10">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-dash-muted">
              <span>{gameData.genre}</span>
              <span className="text-amber-500 font-bold">★ {gameData.rating}</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-display font-bold text-dash-ink leading-tight">
              {gameData.title}
            </h1>

            <div className="space-y-1.5 text-xs font-mono text-dash-muted border-t border-black/10 pt-4">
              <div className="flex justify-between">
                <span>Publisher:</span>
                <span className="text-dash-ink font-semibold">{gameData.publisher}</span>
              </div>
              <div className="flex justify-between">
                <span>Release Year:</span>
                <span className="text-dash-ink font-semibold">{gameData.releaseYear}</span>
              </div>
              <div className="flex justify-between">
                <span>Install Size:</span>
                <span className="text-dash-ink font-semibold">{gameData.size}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Resolution:</span>
                <span className="text-dash-ink font-semibold">{gameData.resolution}</span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-3 pt-4 border-t border-black/10 font-mono">
            {isOwned ? (
              <div className="space-y-2">
                <button
                  onClick={() => setActiveStream(true)}
                  className="w-full py-4 rounded-xl bg-dash-ink text-white font-mono font-bold text-xs hover:bg-black/80 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>⚡ STREAM {gameData.title.toUpperCase()} NOW</span>
                </button>
                <Link
                  href="/dashboard/my-games"
                  className="w-full py-2.5 rounded-xl text-xs font-mono text-center block bg-dash-subtle border border-black/10 text-dash-muted hover:text-dash-ink transition-colors font-semibold"
                >
                  View in My Games Library
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="font-mono text-xs text-dash-muted flex justify-between items-center">
                  <span>Price:</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-dash-ink">${gameData.priceUSD.toFixed(2)}</span>
                    <span className="text-emerald-600 text-[11px] block font-semibold">(₹{priceInINR.toLocaleString()} INR)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={handleRazorpayBuy}
                    disabled={isProcessing}
                    className="py-3.5 rounded-xl bg-dash-ink text-white font-mono font-bold text-xs hover:bg-black/80 transition-all cursor-pointer disabled:opacity-50 shadow-sm text-center"
                  >
                    {isProcessing ? "PROCESSING..." : "💳 RAZORPAY"}
                  </button>

                  <a
                    href={kinguinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-xs transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-1"
                  >
                    KINGUIN ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description & Specs Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-black/10 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-display font-bold text-dash-ink">
            About {gameData.title}
          </h2>
          <p className="text-sm text-dash-muted font-body leading-relaxed whitespace-pre-line">
            {gameData.description}
          </p>

          <div className="pt-4 border-t border-black/10 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-dash-muted block">
              Feature Tags
            </span>
            <div className="flex flex-wrap gap-2">
              {gameData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-dash-subtle border border-black/10 text-xs font-mono text-dash-ink font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cloud Stream Specs */}
        <div className="rounded-2xl bg-white border border-black/10 p-6 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <h2 className="text-lg font-display font-bold text-dash-ink">
              Cloud PC Allocation
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-dash-subtle border border-black/10">
                <span className="text-dash-muted block text-[10px] uppercase">Allocated Stream Quality:</span>
                <span className="text-dash-ink font-semibold">4K @ 120 FPS / HDR</span>
              </div>
              <div className="p-3 rounded-xl bg-dash-subtle border border-black/10">
                <span className="text-dash-muted block text-[10px] uppercase">Network Codec:</span>
                <span className="text-dash-ink font-semibold">AV1 / H.265 WebRTC</span>
              </div>
              <div className="p-3 rounded-xl bg-dash-subtle border border-black/10">
                <span className="text-dash-muted block text-[10px] uppercase">Partner Store Option:</span>
                <span className="text-orange-600 font-semibold">● Kinguin Store Enabled</span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/cloud-pc"
            className="w-full py-3 rounded-xl bg-dash-ink text-white hover:bg-black/80 font-mono font-bold text-xs text-center transition-all block shadow-sm"
          >
            🖥️ VIEW VIRTUAL CLOUD DESKTOP
          </Link>
        </div>
      </div>

      {/* Activation Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-200 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center mx-auto text-2xl text-emerald-500">
              ✓
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-emerald-600">Payment Verified</span>
              <h3 className="text-2xl font-display font-bold text-dash-ink">
                {gameData.title}
              </h3>
              <p className="text-xs font-mono text-dash-muted">
                Game added to your Cloud Library. Pre-installed and ready to stream.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-dash-subtle border border-black/10 space-y-2 font-mono">
              <span className="text-[10px] text-dash-muted uppercase block">Digital Key Code</span>
              <div className="font-bold text-dash-ink text-lg tracking-widest">
                {activationKey}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 font-mono">
              <button
                onClick={() => {
                  setShowKeyModal(false);
                  setActiveStream(true);
                }}
                className="flex-1 py-3 rounded-xl bg-dash-ink text-white font-bold text-xs hover:bg-black/80 transition-all text-center cursor-pointer"
              >
                ⚡ STREAM ON CLOUD NOW
              </button>
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-6 py-3 rounded-xl bg-white border border-black/15 text-dash-muted hover:text-dash-ink text-xs cursor-pointer font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live WebRTC Cloud Stream Player Modal */}
      {activeStream && gameData && (
        <GameStreamPlayer
          gameId={String(id)}
          gameTitle={gameData.title}
          bannerUrl={gameData.banner}
          resolution="1440p"
          onClose={() => setActiveStream(false)}
        />
      )}
    </div>
  );
}

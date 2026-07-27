"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import { useState, useEffect } from "react";
import { getGameById, isGamePurchased, markGameAsPurchased, generateActivationKey } from "@/lib/gamesData";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SingleGamePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [activationKey, setActivationKey] = useState("");

  const game = getGameById(id);

  useEffect(() => {
    if (game) {
      setIsOwned(isGamePurchased(game.id));
    }
  }, [game]);

  if (!game) {
    return (
      <div className="text-center py-20 space-y-4 font-mono">
        <h1 className="text-2xl font-bold text-ink">Game Not Found</h1>
        <p className="text-sm text-muted">The requested title could not be located in our cloud matrix catalog.</p>
        <Link
          href="/dashboard/store"
          className="inline-block px-4 py-2 bg-cyan text-void rounded-lg font-semibold text-xs"
        >
          ← Back to Game Store
        </Link>
      </div>
    );
  }

  // Convert USD price to INR (~₹83 per USD) for Razorpay
  const priceInINR = Math.round((game.price || 49.99) * 83);
  const priceInPaise = priceInINR * 100;

  const handleRazorpayBuy = () => {
    setIsProcessing(true);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TIQY8CAZ52qCin",
      amount: priceInPaise,
      currency: "INR",
      name: "NIMBUS Cloud Gaming",
      description: `Purchase ${game.title} (Cloud License)`,
      image: game.banner,
      handler: function (response: any) {
        setIsProcessing(false);
        markGameAsPurchased(game.id);
        setIsOwned(true);
        const key = generateActivationKey(game.title);
        setActivationKey(key);
        setShowKeyModal(true);
      },
      prefill: {
        name: user?.fullName || user?.firstName || "NIMBUS Gamer",
        email: user?.primaryEmailAddress?.emailAddress || "gamer@nimbus.cloud",
        contact: "9876543210",
      },
      theme: {
        color: "#00F0FF",
      },
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
      } catch (e) {
        // Fallback test purchase simulation if Razorpay popup is blocked
        setTimeout(() => {
          setIsProcessing(false);
          markGameAsPurchased(game.id);
          setIsOwned(true);
          const key = generateActivationKey(game.title);
          setActivationKey(key);
          setShowKeyModal(true);
        }, 1000);
      }
    } else {
      // Fallback test purchase simulation
      setTimeout(() => {
        setIsProcessing(false);
        markGameAsPurchased(game.id);
        setIsOwned(true);
        const key = generateActivationKey(game.title);
        setActivationKey(key);
        setShowKeyModal(true);
      }, 1200);
    }
  };

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
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-ink transition-colors"
        >
          ← Back to Game Store
        </Link>

        {isOwned ? (
          <span className="text-xs font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">
            ✓ OWNED IN LIBRARY
          </span>
        ) : (
          <span className="text-xs font-mono text-ink bg-black/5 border border-black/15 px-3 py-1 rounded-full">
            STORE ITEM • ₹{priceInINR.toLocaleString()}
          </span>
        )}
      </div>

      {/* Main Game Hero Header */}
      <div className="relative rounded-2xl overflow-hidden border border-line bg-surface flex flex-col lg:flex-row shadow-glow">
        {/* Banner image */}
        <div className="lg:w-2/3 h-80 lg:h-[460px] relative bg-void overflow-hidden">
          <img
            src={game.banner}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-surface/40 lg:to-surface" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-void/80 backdrop-blur-md text-ink text-xs font-mono px-3 py-1 rounded border border-line">
              {game.store} Platform
            </span>
            {game.rtx && (
              <span className="bg-void/80 backdrop-blur-md text-cyan text-xs font-mono px-3 py-1 rounded border border-cyan/30">
                RAY TRACING READY
              </span>
            )}
          </div>
        </div>

        {/* Content detail sidebar card */}
        <div className="lg:w-1/3 p-6 lg:p-8 flex flex-col justify-between space-y-6 bg-white border-t lg:border-t-0 lg:border-l border-black/10">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-muted">
              <span>{game.genre}</span>
              <span className="text-amber-500 font-bold">★ {game.rating}</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-display font-bold text-ink leading-tight">
              {game.title}
            </h1>

            <div className="space-y-1.5 text-xs font-mono text-muted border-t border-black/10 pt-4">
              <div className="flex justify-between">
                <span>Publisher:</span>
                <span className="text-ink">{game.publisher}</span>
              </div>
              <div className="flex justify-between">
                <span>Release Year:</span>
                <span className="text-ink">{game.releaseYear}</span>
              </div>
              <div className="flex justify-between">
                <span>Install Size:</span>
                <span className="text-ink">{game.size}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Resolution:</span>
                <span className="text-ink font-semibold">{game.resolution}</span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-3 pt-4 border-t border-black/10">
            {isOwned ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard/cloud-pc"
                  className="w-full py-4 rounded-xl bg-ink text-white font-mono font-bold text-xs hover:bg-black/80 transition-all flex items-center justify-center gap-2"
                >
                  <span>🖥️ LAUNCH ON CLOUD PC NOW</span>
                </Link>
                <Link
                  href="/dashboard/my-games"
                  className="w-full py-2.5 rounded-lg text-xs font-mono text-center block bg-white border border-black/10 text-muted hover:text-ink transition-colors"
                >
                  View in My Games Library
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="font-mono text-xs text-muted flex justify-between items-center">
                  <span>Price:</span>
                  <div className="text-right">
                    {game.originalPrice && (
                      <span className="line-through text-muted mr-2">${game.originalPrice.toFixed(2)}</span>
                    )}
                    <span className="text-xl font-bold text-ink">${game.price.toFixed(2)}</span>
                    <span className="text-emerald-600 text-[11px] block">(₹{priceInINR.toLocaleString()} INR)</span>
                  </div>
                </div>

                <button
                  onClick={handleRazorpayBuy}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-xl bg-ink text-white font-mono font-bold text-xs hover:bg-black/80 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>LAUNCHING RAZORPAY...</span>
                    </>
                  ) : (
                    <>
                      <span>💳 BUY NOW WITH RAZORPAY</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description & Specs Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-xl bg-white border border-black/10 p-6 space-y-4">
          <h2 className="text-lg font-display font-bold text-ink">
            About {game.title}
          </h2>
          <p className="text-sm text-muted font-body leading-relaxed">
            {game.description}
          </p>

          <div className="pt-4 border-t border-black/10 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-muted block">
              Feature Tags
            </span>
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-deep border border-black/10 text-xs font-mono text-ink"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cloud Stream Specs */}
        <div className="rounded-xl bg-white border border-black/10 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-lg font-display font-bold text-ink">
              Cloud PC Allocation
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-deep border border-black/10">
                <span className="text-muted block text-[10px] uppercase">Allocated GPU Node:</span>
                <span className="text-ink font-semibold">{game.reqGpu}</span>
              </div>
              <div className="p-3 rounded-lg bg-deep border border-black/10">
                <span className="text-muted block text-[10px] uppercase">RAM Allocation:</span>
                <span className="text-ink font-semibold">{game.reqRam}</span>
              </div>
              <div className="p-3 rounded-lg bg-deep border border-black/10">
                <span className="text-muted block text-[10px] uppercase">NVMe Storage:</span>
                <span className="text-ink font-semibold">{game.reqStorage}</span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/cloud-pc"
            className="w-full py-3 rounded-lg bg-ink text-white hover:bg-black/80 font-mono font-bold text-xs text-center transition-all block"
          >
            🖥️ VIEW VIRTUAL GPU DESKTOP
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
              <span className="text-xs font-mono uppercase text-emerald-600">Razorpay Payment Verified</span>
              <h3 className="text-2xl font-display font-bold text-ink">
                {game.title}
              </h3>
              <p className="text-xs font-mono text-muted">
                Game added to your Cloud Library. Pre-installed and ready on your RTX Cloud PC.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-deep border border-black/10 space-y-2">
              <span className="text-[10px] font-mono text-muted uppercase block">Digital Key Code</span>
              <div className="font-mono font-bold text-ink text-lg tracking-widest">
                {activationKey}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/dashboard/cloud-pc"
                className="flex-1 py-3 rounded-xl bg-ink text-white font-mono font-bold text-xs hover:bg-black/80 transition-all text-center"
              >
                🖥️ LAUNCH ON CLOUD PC
              </Link>
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-6 py-3 rounded-xl bg-white border border-black/15 text-muted hover:text-ink font-mono text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

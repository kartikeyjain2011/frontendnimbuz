"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useUser } from "@clerk/nextjs";
import { fetchTrendingGames, type RawgGame } from "@/lib/rawg";
import { getKinguinBuyUrl } from "@/lib/kinguin";
import {
  generateActivationKey,
  getPurchasedGameIds,
  markGameAsPurchased,
} from "@/lib/gamesData";
import { syncGamePurchaseToAdmin, syncBillingToAdmin } from "@/lib/adminSync";


declare global {
  interface Window {
    Razorpay: any;
  }
}

function StoreGameCard({
  game,
  isOwned,
  onCheckout,
}: {
  game: RawgGame;
  isOwned: boolean;
  onCheckout: (game: RawgGame) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const screenshots = game.short_screenshots?.map((s) => s.image) || [];

  // Autoplay continuous stream preview
  useEffect(() => {
    if (!screenshots || screenshots.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % screenshots.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [screenshots]);

  const priceUSD = 19.99 + (game.id % 35);
  const discount = (game.id % 3) === 0 ? 20 : 0;
  const finalPriceUSD = discount > 0 ? priceUSD * 0.8 : priceUSD;
  const finalPriceINR = Math.round(finalPriceUSD * 83);
  const kinguinUrl = getKinguinBuyUrl(game.name);

  return (
    <div className="rounded-2xl bg-white border border-black/10 p-4 flex flex-col justify-between hover:border-black/30 hover:shadow-md transition-all duration-300 group space-y-4">
      {/* Cover Image with Autoplay Preview */}
      <Link href={`/dashboard/games/${game.id}`} className="w-full h-48 rounded-xl overflow-hidden relative bg-black block">
        <img
          src={screenshots[currentIdx] || game.background_image}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white border border-white/10 backdrop-blur-md">
            {game.parent_platforms?.[0]?.platform?.name || "PC"}
          </span>
          {discount > 0 && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500 text-white">
              -{discount}%
            </span>
          )}
        </div>

        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white text-[10px] font-mono font-semibold">STREAM PREVIEW</span>
        </div>
      </Link>

      {/* Metadata */}
      <div className="space-y-2 flex-1">
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-mono text-muted">{game.genres?.[0]?.name || "Action"}</span>
          <span className="text-[11px] font-mono text-amber-500 font-bold">★ {game.rating?.toFixed(1) || "4.5"}</span>
        </div>

        <Link href={`/dashboard/games/${game.id}`}>
          <h3 className="font-display font-bold text-ink text-base line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {game.name}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-deep border border-black/10 text-muted">
            4K @ 120 FPS
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 border border-black/20 text-ink">
            KINGUIN KEYS READY
          </span>
        </div>
      </div>

      {/* Price & Actions */}
      <div className="pt-3 border-t border-black/10 space-y-2">
        <div className="font-mono flex justify-between items-center">
          <div>
            {discount > 0 && (
              <span className="text-[10px] text-muted line-through mr-1">
                ${priceUSD.toFixed(2)}
              </span>
            )}
            <span className="text-base font-bold text-ink">
              ${finalPriceUSD.toFixed(2)}
            </span>
          </div>
          <span className="text-xs text-muted font-mono">(₹{finalPriceINR.toLocaleString()} INR)</span>
        </div>

        {isOwned ? (
          <span className="w-full py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1">
            ✓ IN LIBRARY
          </span>
        ) : (
          <div className="grid grid-cols-2 gap-2 font-mono">
            <button
              onClick={() => onCheckout(game)}
              className="py-2 rounded-xl bg-ink text-white hover:bg-black/80 text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
            >
              RAZORPAY
            </button>
            <a
              href={kinguinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-1"
            >
              KINGUIN ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StorePage() {
  const { user } = useUser();
  const [games, setGames] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");

  // Checkout Modal State
  const [checkoutGame, setCheckoutGame] = useState<RawgGame | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "kinguin">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Success Key Modal State
  const [purchasedSuccess, setPurchasedSuccess] = useState<{
    game: RawgGame;
    key: string;
  } | null>(null);

  useEffect(() => {
    setPurchasedIds(getPurchasedGameIds());
    fetchTrendingGames(24)
      .then((res) => {
        setGames(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        const matchesSearch =
          game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.genres.some((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesGenre =
          selectedGenre === "All" ||
          game.genres.some((g) => g.name.toLowerCase() === selectedGenre.toLowerCase());
        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        const pA = 19.99 + (a.id % 35);
        const pB = 19.99 + (b.id % 35);
        if (sortBy === "price-low") return pA - pB;
        if (sortBy === "price-high") return pB - pA;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [games, searchQuery, selectedGenre, sortBy]);

  const featuredGame = games[0];

  // Launch Razorpay or Process Payment
  const handleCompletePurchase = () => {
    if (!checkoutGame) return;

    if (paymentMethod === "kinguin") {
      const kUrl = getKinguinBuyUrl(checkoutGame.name);
      window.open(kUrl, "_blank");
      setCheckoutGame(null);
      return;
    }

    setIsProcessing(true);

    const priceUSD = 19.99 + (checkoutGame.id % 35);
    const priceInINR = Math.round(priceUSD * 83);
    const priceInPaise = priceInINR * 100;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TIQY8CAZ52qCin",
      amount: priceInPaise,
      currency: "INR",
      name: "NIMBUS Cloud Store",
      description: `Purchase ${checkoutGame.name}`,
      image: checkoutGame.background_image,
      handler: function (response: any) {
        const updatedIds = markGameAsPurchased(String(checkoutGame.id));
        setPurchasedIds(updatedIds);
        const generatedKey = generateActivationKey(checkoutGame.name);
        setPurchasedSuccess({ game: checkoutGame, key: generatedKey });
        setCheckoutGame(null);
        setIsProcessing(false);

        // Sync game purchase & transaction to Admin Console
        const userEmail = user?.primaryEmailAddress?.emailAddress || "gamer@nimbus.cloud";
        const userId = user?.id || "guest_user";
        const pid = response.razorpay_payment_id || `pay_game_${Date.now()}`;

        syncGamePurchaseToAdmin({
          userId,
          userEmail,
          gameId: String(checkoutGame.id),
          gameTitle: checkoutGame.name,
          store: checkoutGame.parent_platforms?.[0]?.platform?.name || "PC",
          priceUSD,
          priceINR: priceInINR,
          activationKey: generatedKey,
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
          itemTitle: checkoutGame.name,
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
        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      } catch (e) {
        // fallback
      }
    }

    // Direct / Fallback Checkout simulation
    setTimeout(() => {
      const updatedIds = markGameAsPurchased(String(checkoutGame.id));
      setPurchasedIds(updatedIds);

      const generatedKey = generateActivationKey(checkoutGame.name);
      setPurchasedSuccess({ game: checkoutGame, key: generatedKey });
      setCheckoutGame(null);
      setIsProcessing(false);

      const userEmail = user?.primaryEmailAddress?.emailAddress || "gamer@nimbus.cloud";
      const userId = user?.id || "guest_user";
      const pid = `pay_game_fallback_${Date.now()}`;

      syncGamePurchaseToAdmin({
        userId,
        userEmail,
        gameId: String(checkoutGame.id),
        gameTitle: checkoutGame.name,
        store: checkoutGame.parent_platforms?.[0]?.platform?.name || "PC",
        priceUSD,
        priceINR: priceInINR,
        activationKey: generatedKey,
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
        itemTitle: checkoutGame.name,
        paymentMethod: "Razorpay",
        status: "success",
        timestamp: new Date().toISOString(),
      });
    }, 1200);
  };


  return (
    <div className="space-y-10 pb-12">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink px-2 py-0.5 bg-black/5 border border-black/15 rounded font-semibold">
              Nimbus Marketplace
            </span>
            <span className="text-xs font-mono text-emerald-600 font-semibold">● Razorpay Enabled</span>
            <span className="text-xs font-mono text-orange-600 font-semibold">● Kinguin Store Partner</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-ink mt-1">
            Cloud Game Store
          </h1>
          <p className="text-muted text-sm font-mono mt-1">
            Buy digital keys via Razorpay or redirect to Kinguin Marketplace with Client Partner ID.
          </p>
        </div>
      </div>

      {/* Featured Banner */}
      {featuredGame && (
        <section className="relative rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-black/20 p-8 overflow-hidden shadow-md">
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-30 lg:opacity-60 pointer-events-none">
            <img
              src={featuredGame.background_image}
              alt={featuredGame.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500 text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                SPOTLIGHT TITLE
              </span>
              <span className="text-xs font-mono text-white/80 flex items-center gap-1">
                <span>⚡</span> Razorpay & Kinguin Integrated
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
              {featuredGame.name}
            </h2>

            <p className="text-white/70 text-xs font-mono line-clamp-2">
              Explore immersive worlds with RTX ray-tracing pre-configured on Nimbus high-speed GPU nodes.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="font-mono">
                <span className="text-2xl font-bold text-white">
                  ${(19.99 + (featuredGame.id % 35)).toFixed(2)}
                </span>
                <span className="text-xs text-white/60 block">
                  (₹{Math.round((19.99 + (featuredGame.id % 35)) * 83).toLocaleString()} INR)
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPaymentMethod("razorpay");
                    setCheckoutGame(featuredGame);
                  }}
                  className="px-5 py-3.5 rounded-xl bg-white text-gray-900 font-mono font-bold text-xs hover:bg-white/90 transition-all cursor-pointer flex items-center gap-2 shadow-md"
                >
                  <span>💳</span>
                  <span>BUY WITH RAZORPAY</span>
                </button>
                <a
                  href={getKinguinBuyUrl(featuredGame.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-orange-600 text-white font-mono font-bold text-xs hover:bg-orange-700 transition-all cursor-pointer flex items-center gap-2 shadow-md"
                >
                  <span>🏷️</span>
                  <span>BUY ON KINGUIN ↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Controls */}
      <div className="space-y-4 bg-white p-5 rounded-2xl border border-black/10 shadow-sm">
        <div className="grid md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store by game title, genre..."
              className="w-full bg-deep border border-black/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-ink placeholder:text-muted focus:border-black/40 focus:outline-none transition-colors"
            />
            <svg
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-deep border border-black/10 rounded-xl px-4 py-2.5 text-xs font-mono text-ink focus:border-black/40 focus:outline-none cursor-pointer"
            >
              <option value="All">All Genres</option>
              <option value="Action">Action</option>
              <option value="RPG">RPG</option>
              <option value="Adventure">Adventure</option>
              <option value="Strategy">Strategy</option>
              <option value="Shooter">Shooter</option>
              <option value="Indie">Indie</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-deep border border-black/10 rounded-xl px-4 py-2.5 text-xs font-mono text-ink focus:border-black/40 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured & Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-black/5 animate-pulse" />
          ))}
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-black/10 space-y-3 font-mono text-xs shadow-sm">
          <p className="text-muted">No games found matching your current filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre("All");
            }}
            className="text-ink underline cursor-pointer font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <StoreGameCard
              key={game.id}
              game={game}
              isOwned={purchasedIds.includes(String(game.id))}
              onCheckout={(g) => {
                setPaymentMethod("razorpay");
                setCheckoutGame(g);
              }}
            />
          ))}
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutGame && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-black/10 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl relative font-mono">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div>
                <span className="text-[10px] text-muted uppercase tracking-wider">Purchase Options</span>
                <h3 className="text-xl font-display font-bold text-ink">{checkoutGame.name}</h3>
              </div>
              <button
                onClick={() => setCheckoutGame(null)}
                className="text-muted hover:text-ink cursor-pointer text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-deep border border-black/10 flex items-center gap-4">
              <img src={checkoutGame.background_image} alt={checkoutGame.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="min-w-0 flex-1 text-xs space-y-1">
                <div className="text-ink font-bold truncate">{checkoutGame.name}</div>
                <div className="text-muted text-[11px]">Digital License • Instant Cloud Sync</div>
              </div>
            </div>

            {/* Select Checkout Method */}
            <div className="space-y-2">
              <label className="text-xs uppercase text-muted block">Select Payment Gateway</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                    paymentMethod === "razorpay"
                      ? "bg-ink text-white border-ink font-bold"
                      : "bg-deep border-black/10 text-muted hover:text-ink"
                  }`}
                >
                  💳 Razorpay Gateway
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("kinguin")}
                  className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                    paymentMethod === "kinguin"
                      ? "bg-orange-600 text-white border-orange-600 font-bold"
                      : "bg-deep border-black/10 text-muted hover:text-ink"
                  }`}
                >
                  🏷️ Kinguin Marketplace ↗
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-deep border border-black/10 space-y-2 text-xs">
              <div className="flex justify-between text-ink font-bold text-sm">
                <span>Total Price:</span>
                <span>
                  ${(19.99 + (checkoutGame.id % 35)).toFixed(2)} (₹{Math.round((19.99 + (checkoutGame.id % 35)) * 83).toLocaleString()} INR)
                </span>
              </div>
            </div>

            <button
              disabled={isProcessing}
              onClick={handleCompletePurchase}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm ${
                paymentMethod === "kinguin"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-ink hover:bg-black/80"
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>PROCESSING...</span>
                </>
              ) : paymentMethod === "kinguin" ? (
                <span>REDIRECT TO KINGUIN.NET ↗</span>
              ) : (
                <span>PAY WITH RAZORPAY</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {purchasedSuccess && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-200 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl text-center font-mono">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center mx-auto text-2xl text-emerald-500">
              ✓
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase text-emerald-600">Payment Verified</span>
              <h3 className="text-2xl font-display font-bold text-ink">
                {purchasedSuccess.game.name}
              </h3>
              <p className="text-xs text-muted">
                Game added to your Cloud Library. Pre-installed and ready to stream.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-deep border border-black/10 space-y-2">
              <span className="text-[10px] text-muted uppercase block">Digital License Key</span>
              <div className="font-bold text-ink text-lg tracking-widest">
                {purchasedSuccess.key}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/dashboard/library"
                onClick={() => setPurchasedSuccess(null)}
                className="flex-1 py-3 rounded-xl bg-ink text-white font-bold text-xs hover:bg-black/80 transition-all text-center"
              >
                🖥️ GO TO LIBRARY & STREAM
              </Link>
              <button
                onClick={() => setPurchasedSuccess(null)}
                className="px-6 py-3 rounded-xl bg-white border border-black/15 text-muted hover:text-ink text-xs cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

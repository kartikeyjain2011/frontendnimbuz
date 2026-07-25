"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useUser } from "@clerk/nextjs";
import {
  gamesList,
  GameDetail,
  generateActivationKey,
  getPurchasedGameIds,
  markGameAsPurchased,
} from "@/lib/gamesData";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function StorePage() {
  const { user } = useUser();
  const [games, setGames] = useState<GameDetail[]>(gamesList);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedStore, setSelectedStore] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating" | "discount">("featured");
  const [showOnlyOnSale, setShowOnlyOnSale] = useState(false);
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);

  // Store Credits
  const [cloudCredits, setCloudCredits] = useState(120.00);

  // Checkout Modal State
  const [checkoutGame, setCheckoutGame] = useState<GameDetail | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "credits" | "card" | "paypal">("razorpay");
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Success Key Modal State
  const [purchasedSuccess, setPurchasedSuccess] = useState<{
    game: GameDetail;
    key: string;
  } | null>(null);

  useEffect(() => {
    setPurchasedIds(getPurchasedGameIds());
  }, []);

  const toggleWishlist = (id: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, inWishlist: !g.inWishlist } : g))
    );
  };

  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        const matchesSearch =
          game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.publisher.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === "All" || game.genre.includes(selectedGenre);
        const matchesStore = selectedStore === "All" || game.store === selectedStore;
        const matchesSale = !showOnlyOnSale || (game.isOnSale && (game.discount ?? 0) > 0);
        const matchesWishlist = !showOnlyWishlist || game.inWishlist;

        return matchesSearch && matchesGenre && matchesStore && matchesSale && matchesWishlist;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "discount") return (b.discount || 0) - (a.discount || 0);
        if (sortBy === "rating") return parseFloat(b.rating) - parseFloat(a.rating);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [games, searchQuery, selectedGenre, selectedStore, sortBy, showOnlyOnSale, showOnlyWishlist]);

  const wishlistCount = games.filter((g) => g.inWishlist).length;
  const featuredGame = games.find((g) => g.id === "cyberpunk") || games[0];

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "NIMBUS20") {
      setAppliedDiscount(0.20);
    } else {
      alert("Invalid promo code. Use NIMBUS20 for 20% OFF!");
    }
  };

  // Launch Razorpay or Process Payment
  const handleCompletePurchase = () => {
    if (!checkoutGame) return;
    setIsProcessing(true);

    const finalUSD = checkoutGame.price * (1 - appliedDiscount);
    const priceInINR = Math.round(finalUSD * 83);
    const priceInPaise = priceInINR * 100;

    if (paymentMethod === "razorpay") {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_nimbus_demo_key",
        amount: priceInPaise,
        currency: "INR",
        name: "NIMBUS Cloud Gaming Store",
        description: `Purchase ${checkoutGame.title}`,
        image: checkoutGame.banner,
        handler: function (response: any) {
          const updatedIds = markGameAsPurchased(checkoutGame.id);
          setPurchasedIds(updatedIds);
          const generatedKey = generateActivationKey(checkoutGame.title);
          setPurchasedSuccess({ game: checkoutGame, key: generatedKey });
          setCheckoutGame(null);
          setIsProcessing(false);
          setPromoCode("");
          setAppliedDiscount(0);
        },
        prefill: {
          name: user?.fullName || user?.firstName || "NIMBUS Gamer",
          email: user?.primaryEmailAddress?.emailAddress || "gamer@nimbus.cloud",
          contact: "9876543210",
        },
        theme: { color: "#00F0FF" },
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
    }

    // Direct / Fallback Checkout simulation
    setTimeout(() => {
      if (paymentMethod === "credits") {
        setCloudCredits((prev) => Math.max(0, prev - finalUSD));
      }
      const updatedIds = markGameAsPurchased(checkoutGame.id);
      setPurchasedIds(updatedIds);

      const generatedKey = generateActivationKey(checkoutGame.title);
      setPurchasedSuccess({ game: checkoutGame, key: generatedKey });
      setCheckoutGame(null);
      setIsProcessing(false);
      setPromoCode("");
      setAppliedDiscount(0);
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
            <span className="text-xs font-mono uppercase tracking-wider text-cyan px-2 py-0.5 bg-cyan/10 border border-cyan/30 rounded">
              Nimbus Digital Marketplace
            </span>
            <span className="text-xs font-mono text-emerald-400">● Razorpay Enabled</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-ink mt-1">
            Cloud Game Store
          </h1>
          <p className="text-muted text-sm font-mono mt-1">
            Click any title to view game specs & buy via Razorpay for instant cloud sync.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-surface border border-line p-3.5 rounded-2xl font-mono text-xs shrink-0">
          <div className="px-3 border-r border-line/60">
            <span className="text-muted block text-[10px]">NIMBUS CREDITS</span>
            <span className="text-emerald-400 font-bold text-sm">
              ${cloudCredits.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => setShowOnlyWishlist(!showOnlyWishlist)}
            className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              showOnlyWishlist
                ? "bg-cyan text-void font-bold border-cyan shadow-glow"
                : "bg-void/60 text-muted hover:text-ink border-line"
            }`}
          >
            ★ Wishlist ({wishlistCount})
          </button>
        </div>
      </div>

      {/* Featured Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-deep via-surface to-panel border border-cyan/30 p-8 overflow-hidden shadow-glow">
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-25 lg:opacity-50 pointer-events-none">
          <img
            src={featuredGame.banner}
            alt={featuredGame.title}
            className="w-full h-full object-cover mask-gradient"
          />
        </div>

        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="bg-red-500 text-ink text-[11px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider animate-pulse">
              FLASH SALE -{featuredGame.discount}% OFF
            </span>
            <span className="text-xs font-mono text-cyan flex items-center gap-1">
              <span>⏱️</span> Razorpay Instant Checkout
            </span>
          </div>

          <Link href={`/dashboard/games/${featuredGame.id}`} className="block group">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink leading-tight group-hover:text-cyan transition-colors">
              {featuredGame.title}
            </h2>
          </Link>

          <p className="text-muted text-xs font-mono line-clamp-2">
            {featuredGame.description}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <div className="font-mono">
              <span className="text-xs text-muted line-through mr-2">
                ${featuredGame.originalPrice?.toFixed(2)}
              </span>
              <span className="text-2xl font-bold text-cyan">
                ${featuredGame.price.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/dashboard/games/${featuredGame.id}`}
                className="px-4 py-3 rounded-xl bg-surface border border-line text-ink font-mono font-bold text-xs hover:border-cyan transition-all"
              >
                Inspect Game Page →
              </Link>
              <button
                onClick={() => setCheckoutGame(featuredGame)}
                className="px-6 py-3 rounded-xl bg-cyan text-void font-mono font-bold text-xs shadow-glow hover:opacity-90 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>💳</span>
                <span>BUY NOW</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <div className="space-y-4">
        <div className="grid md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store by game title, genre, publisher..."
              className="w-full bg-surface border border-line rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-ink placeholder:text-muted focus:border-cyan focus:outline-none transition-colors"
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
              className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-xs font-mono text-ink focus:border-cyan focus:outline-none cursor-pointer"
            >
              <option value="All">All Genres</option>
              <option value="Action RPG">Action RPG</option>
              <option value="Soulslike">Soulslike</option>
              <option value="Racing">Racing</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Horror">Horror</option>
              <option value="FPS">FPS / Shooter</option>
              <option value="Strategy">Strategy</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-xs font-mono text-ink focus:border-cyan focus:outline-none cursor-pointer"
            >
              <option value="featured">Sort by: Featured & Popular</option>
              <option value="discount">Sort by: Highest Discount</option>
              <option value="price-low">Sort by: Price (Low to High)</option>
              <option value="price-high">Sort by: Price (High to Low)</option>
              <option value="rating">Sort by: Top Rating</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-line/40">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-mono text-muted uppercase mr-1">Platform:</span>
            {["All", "Steam", "Epic", "Xbox", "GOG"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStore(st)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  selectedStore === st
                    ? "bg-cyan/20 border border-cyan text-cyan font-bold"
                    : "bg-surface border border-line text-muted hover:text-ink"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <label className="flex items-center gap-2 text-muted cursor-pointer hover:text-ink">
              <input
                type="checkbox"
                checked={showOnlyOnSale}
                onChange={(e) => setShowOnlyOnSale(e.target.checked)}
                className="rounded border-line bg-void text-cyan focus:ring-0"
              />
              <span>On Sale Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredGames.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-surface border border-line space-y-3 font-mono text-xs">
          <p className="text-muted">No games found matching your current filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre("All");
              setSelectedStore("All");
              setShowOnlyOnSale(false);
              setShowOnlyWishlist(false);
            }}
            className="text-cyan underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => {
            const isOwned = purchasedIds.includes(game.id);

            return (
              <div
                key={game.id}
                className="rounded-2xl bg-surface border border-line p-4 flex flex-col justify-between hover:border-cyan/50 transition-all duration-300 group space-y-4"
              >
                {/* Game Cover Image -> Links to Individual Page */}
                <Link href={`/dashboard/games/${game.id}`} className="w-full h-48 rounded-xl overflow-hidden relative bg-void block">
                  <img
                    src={game.banner}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-void/80 text-cyan border border-line backdrop-blur-md">
                      {game.store}
                    </span>
                    {game.discount && game.discount > 0 ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500 text-ink">
                        -{game.discount}%
                      </span>
                    ) : null}
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(game.id);
                    }}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      game.inWishlist
                        ? "bg-cyan text-void shadow-glow"
                        : "bg-void/80 text-muted hover:text-ink border border-line"
                    }`}
                  >
                    ★
                  </button>
                </Link>

                {/* Metadata */}
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-mono text-muted">{game.genre}</span>
                    <span className="text-[11px] font-mono text-amber-400">★ {game.rating}</span>
                  </div>

                  <Link href={`/dashboard/games/${game.id}`}>
                    <h3 className="font-display font-bold text-ink text-base line-clamp-1 group-hover:text-cyan transition-colors">
                      {game.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-muted font-mono line-clamp-2">
                    {game.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-void border border-line text-muted">
                      {game.resolution}
                    </span>
                    {game.rtx && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan/10 border border-cyan/30 text-cyan">
                        RTX READY
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-line/60 flex items-center justify-between gap-3 font-mono">
                  <div>
                    {game.originalPrice && game.discount ? (
                      <div className="text-[10px] text-muted line-through">
                        ${game.originalPrice.toFixed(2)}
                      </div>
                    ) : null}
                    <div className="text-lg font-bold text-ink">
                      ${game.price.toFixed(2)}
                    </div>
                  </div>

                  {isOwned ? (
                    <Link
                      href={`/dashboard/games/${game.id}`}
                      className="px-4 py-2 rounded-xl bg-surface border border-emerald-400/50 text-emerald-400 text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>✓ IN LIBRARY</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => setCheckoutGame(game)}
                      className="px-4 py-2 rounded-xl bg-cyan/10 border border-cyan/40 text-cyan hover:bg-cyan hover:text-void text-xs font-bold transition-all cursor-pointer"
                    >
                      BUY NOW
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutGame && (
        <div className="fixed inset-0 z-50 bg-void/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-cyan/40 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-glow relative animate-in fade-in">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan uppercase tracking-wider">Razorpay Checkout</span>
                <h3 className="text-xl font-display font-bold text-ink">{checkoutGame.title}</h3>
              </div>
              <button
                onClick={() => setCheckoutGame(null)}
                className="text-muted hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-void border border-line flex items-center gap-4">
              <img src={checkoutGame.banner} alt={checkoutGame.title} className="w-16 h-16 rounded-lg object-cover" />
              <div className="min-w-0 flex-1 font-mono text-xs space-y-1">
                <div className="text-ink font-bold truncate">{checkoutGame.title}</div>
                <div className="text-muted text-[11px]">{checkoutGame.store} Digital Key • Cloud Ready</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-muted uppercase block">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "razorpay", label: "💳 Razorpay Gateway" },
                  { id: "credits", label: `Nimbus Credits ($${cloudCredits.toFixed(2)})` },
                  { id: "card", label: "Credit / Debit Card" },
                  { id: "paypal", label: "PayPal Express" },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer ${
                      paymentMethod === pm.id
                        ? "bg-cyan/20 border-cyan text-cyan font-bold"
                        : "bg-void border-line text-muted hover:text-ink"
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <label className="text-muted uppercase block text-[10px]">Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Try 'NIMBUS20'"
                  className="flex-1 bg-void border border-line rounded-lg px-3 py-2 text-ink placeholder:text-muted focus:border-cyan focus:outline-none"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-surface border border-line text-ink hover:border-cyan rounded-lg text-xs font-bold cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-void border border-line space-y-2 font-mono text-xs">
              <div className="flex justify-between text-muted">
                <span>Game Price:</span>
                <span>${checkoutGame.price.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount (20%):</span>
                  <span>-${(checkoutGame.price * appliedDiscount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink font-bold text-sm pt-2 border-t border-line">
                <span>Total Amount:</span>
                <span className="text-cyan">
                  ${(checkoutGame.price * (1 - appliedDiscount)).toFixed(2)} (₹{Math.round(checkoutGame.price * (1 - appliedDiscount) * 83).toLocaleString()} INR)
                </span>
              </div>
            </div>

            <button
              disabled={isProcessing}
              onClick={handleCompletePurchase}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan to-emerald-400 text-void font-mono font-bold text-xs shadow-glow hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin" />
                  <span>LAUNCHING PAYMENT GATEWAY...</span>
                </>
              ) : (
                <span>PAY WITH {paymentMethod.toUpperCase()}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {purchasedSuccess && (
        <div className="fixed inset-0 z-50 bg-void/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface border border-emerald-400/60 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-glow text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-400/20 border border-emerald-400 flex items-center justify-center mx-auto text-2xl text-emerald-400">
              ✓
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-emerald-400">Razorpay Payment Verified</span>
              <h3 className="text-2xl font-display font-bold text-ink">
                {purchasedSuccess.game.title}
              </h3>
              <p className="text-xs font-mono text-muted">
                Game added to your Cloud Library. Pre-installed and synced to your Cloud PC.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-void border border-emerald-400/30 space-y-2">
              <span className="text-[10px] font-mono text-muted uppercase block">Digital Key Code</span>
              <div className="font-mono font-bold text-cyan text-lg tracking-widest">
                {purchasedSuccess.key}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/dashboard/games/${purchasedSuccess.game.id}`}
                onClick={() => setPurchasedSuccess(null)}
                className="flex-1 py-3 rounded-xl bg-cyan text-void font-mono font-bold text-xs shadow-glow hover:opacity-90 transition-all text-center"
              >
                🖥️ VIEW GAME PAGE & LAUNCH
              </Link>
              <button
                onClick={() => setPurchasedSuccess(null)}
                className="px-6 py-3 rounded-xl bg-surface border border-line text-muted hover:text-ink font-mono text-xs cursor-pointer"
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

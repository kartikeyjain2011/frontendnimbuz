"use client";


import Script from "next/script";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// ─── Billing cycles ────────────────────────────────────────────
type CycleKey = "1mo" | "3mo" | "6mo" | "12mo";

const CYCLES: {
  key: CycleKey;
  label: string;
  months: number;
  discount: number;
  savingsBadge?: string;
}[] = [
  { key: "1mo",  label: "Monthly",   months: 1,  discount: 0 },
  { key: "3mo",  label: "3 Months",  months: 3,  discount: 0.05, savingsBadge: "−5%" },
  { key: "6mo",  label: "6 Months",  months: 6,  discount: 0.10, savingsBadge: "−10%" },
  { key: "12mo", label: "Annual",    months: 12, discount: 0.15, savingsBadge: "−15%" },
];

/** Paise-precise total: round(monthly × months × (1 − discount)) */
function recurringPrice(monthly: number, months: number, discount: number): number {
  return Math.round(monthly * months * (1 - discount) * 100) / 100;
}

function fmt(n: number): string {
  return "₹" + n.toLocaleString("en-IN", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

// ─── Plans ─────────────────────────────────────────────────────
interface Plan {
  id: string;
  name: string;
  subtitle: string;
  monthlyBase: number;
  badge?: string;
  blurb: string;
  gpuSpec: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

const GAMING: Plan[] = [
  {
    id: "basic",
    name: "BASIC",
    subtitle: "Essential",
    monthlyBase: 799,
    blurb: "Jump into cloud gaming with no hardware.",
    gpuSpec: "RTX 3060 / 8 GB VRAM",
    features: [
      "3-Hour Max Session",
      "1080p @ 60 FPS",
      "Standard Queue Priority",
      "10 GB Cloud Save",
      "Basic Game Library",
    ],
    cta: "Get BASIC",
  },
  {
    id: "pro",
    name: "PRO",
    subtitle: "Extra",
    monthlyBase: 1499,
    blurb: "High frame-rates, zero queue wait.",
    gpuSpec: "RTX 4070 Ti / 16 GB VRAM",
    features: [
      "Unlimited Sessions",
      "1440p QHD @ 120 FPS",
      "Ray Tracing",
      "Skip-the-Queue Access",
      "50 GB Cloud NVMe",
      "5.1 Surround Sound",
    ],
    cta: "Get PRO",
  },
  {
    id: "premium",
    name: "PREMIUM",
    subtitle: "Premium",
    monthlyBase: 2499,
    badge: "BEST VALUE",
    isPopular: true,
    blurb: "4K / 120 FPS with full path-tracing.",
    gpuSpec: "RTX 4090 / 24 GB VRAM",
    features: [
      "Unlimited Sessions",
      "4K Ultra HD @ 120 FPS",
      "Path Tracing + DLSS 3.5",
      "VIP Fast-Track Server",
      "250 GB Personal NVMe",
      "7.1 PCM Audio",
      "WebRTC Ultra-Low Latency",
    ],
    cta: "Get PREMIUM",
  },
  {
    id: "ultimate",
    name: "ULTIMATE",
    subtitle: "Ultimate",
    monthlyBase: 2999,
    blurb: "Dedicated bare-metal node at 240 FPS.",
    gpuSpec: "RTX 4090 Ti / 24 GB VRAM",
    features: [
      "Unlimited Sessions",
      "4K @ 240 FPS / 8K Preview",
      "Path Tracing + DLSS 3.5 + FG",
      "Dedicated Bare-Metal Node",
      "500 GB Personal NVMe",
      "Dolby Atmos Audio",
      "5 ms WebRTC Mode",
    ],
    cta: "Get ULTIMATE",
  },
];

const CLOUD_PC: Plan[] = [
  {
    id: "essential-pc",
    name: "ESSENTIAL",
    subtitle: "Essential PC",
    monthlyBase: 1999,
    blurb: "Dedicated Windows 11 cloud desktop.",
    gpuSpec: "RTX 4070 / 16 GB / 32 GB RAM",
    features: [
      "Full Windows 11 Admin",
      "500 GB Gen4 NVMe",
      "1440p @ 120 FPS",
      "Always-On (No Timeout)",
      "Steam, Epic & Discord",
    ],
    cta: "Deploy ESSENTIAL",
  },
  {
    id: "extra-pc",
    name: "EXTRA",
    subtitle: "Professional PC",
    monthlyBase: 3499,
    badge: "POPULAR",
    isPopular: true,
    blurb: "4K gaming + 3D render & video editing.",
    gpuSpec: "RTX 4090 / 24 GB / 64 GB DDR5",
    features: [
      "Dedicated RTX 4090 Node",
      "2 TB High-Speed NVMe",
      "4K @ 120 FPS / 8K Support",
      "Parsec Pro & RDP Access",
      "10 Gbps Network",
      "Custom Drivers & CUDA 12",
    ],
    cta: "Deploy EXTRA",
  },
  {
    id: "premium-pc",
    name: "PREMIUM",
    subtitle: "Creator PC",
    monthlyBase: 4999,
    blurb: "AI workloads, 8K editing & extreme gaming.",
    gpuSpec: "RTX 4090 ×2 / 96 GB / 128 GB RAM",
    features: [
      "Dual RTX 4090 SLI Node",
      "4 TB Enterprise NVMe",
      "8K @ 60 FPS / 4K @ 240 FPS",
      "PyTorch & TensorFlow ready",
      "Dedicated Static IP",
      "25 Gbps Uplink",
    ],
    cta: "Deploy PREMIUM",
  },
];

// ─── Component ─────────────────────────────────────────────────
export default function Pricing() {
  const [category, setCategory] = useState<"gaming" | "cloud-pc">("gaming");
  const [cycle, setCycle] = useState<CycleKey>("1mo");
  const [loading, setLoading] = useState<string | null>(null);

  const plans = category === "gaming" ? GAMING : CLOUD_PC;
  const activeCycle = CYCLES.find((c) => c.key === cycle)!;

  const getTotal = (plan: Plan) =>
    recurringPrice(plan.monthlyBase, activeCycle.months, activeCycle.discount);

  const handlePay = (plan: Plan) => {
    const totalINR = getTotal(plan);
    const paise = Math.round(totalINR * 100);

    setLoading(plan.id);

    const cycleLabel =
      activeCycle.months === 1
        ? "Monthly"
        : `${activeCycle.months}-Month (${Math.round(activeCycle.discount * 100)}% off)`;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TIQY8CAZ52qCin",
      amount: paise,
      currency: "INR",
      name: "NIMBUS Cloud Gaming",
      description: `${plan.name} — ${plan.subtitle} · ${cycleLabel}`,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80",
      handler: function (response: any) {
        setLoading(null);
        alert(
          `✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\n\nWelcome to ${plan.name}! Redirecting to your dashboard…`
        );
        window.location.href = "/dashboard";
      },
      prefill: { name: "NIMBUS Gamer", email: "gamer@nimbus.cloud", contact: "9876543210" },
      notes: { plan_id: plan.id, billing_cycle: cycle, months: activeCycle.months },
      theme: { color: "#111111" },
      modal: { ondismiss: () => setLoading(null) },
    };

    if (typeof window !== "undefined" && window.Razorpay) {
      new window.Razorpay(options).open();
    } else {
      alert("Razorpay is still loading — please try again in a second.");
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="relative py-24 md:py-32 border-t border-line">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="container-px space-y-14">

        {/* ── Section header ── */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="section-label">Pricing</span>
            <span className="signal-line flex-1 max-w-16" />
          </div>
          <h2 className="font-display font-semibold text-3xl md:text-5xl tracking-tight max-w-2xl text-balance">
            Rent the GPU, keep the games
          </h2>
          <p className="mt-4 text-muted text-base max-w-xl leading-relaxed">
            Pay per billing cycle via Razorpay — UPI, Cards, NetBanking & Wallets accepted. Cancel anytime.
          </p>
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 flex-wrap">
          {/* Category tabs */}
          <div className="flex items-center gap-1 bg-deep border border-line p-1.5 rounded-2xl">
            <button
              onClick={() => setCategory("gaming")}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                category === "gaming"
                  ? "bg-ink text-void shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              🎮 Cloud Gaming
            </button>
            <button
              onClick={() => setCategory("cloud-pc")}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                category === "cloud-pc"
                  ? "bg-ink text-void shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              🖥️ Cloud PC Rigs
            </button>
          </div>

          {/* Billing cycle tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {CYCLES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCycle(c.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                  cycle === c.key
                    ? "bg-ink text-void border-ink shadow-sm"
                    : "bg-void border-line text-muted hover:text-ink hover:border-ink/30"
                }`}
              >
                <span>{c.label}</span>
                {c.savingsBadge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      cycle === c.key
                        ? "bg-white/20 text-void"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {c.savingsBadge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {activeCycle.discount > 0 && (
          <p className="text-xs font-mono text-muted -mt-8">
            Committing to {activeCycle.months} months saves you{" "}
            <span className="text-emerald-600 font-bold">{Math.round(activeCycle.discount * 100)}%</span>{" "}
            — charged as a single payment.
          </p>
        )}

        {/* ── Plan cards ── */}
        <div
          className={`grid gap-5 items-stretch ${
            plans.length === 4
              ? "sm:grid-cols-2 xl:grid-cols-4"
              : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {plans.map((plan) => {
            const total = getTotal(plan);
            const isLoading = loading === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 ${
                  plan.isPopular
                    ? "bg-ink text-void border-ink shadow-glow lg:-translate-y-2"
                    : "card-panel border-line hover:border-ink/20 hover:shadow-glow"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className={`absolute top-0 right-0 text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl ${
                      plan.isPopular ? "bg-white text-ink" : "bg-ink text-void"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1 space-y-5">
                  {/* Name */}
                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${plan.isPopular ? "text-void/50" : "text-muted"}`}>
                      {plan.subtitle}
                    </span>
                    <h3 className={`font-display font-bold text-2xl mt-0.5 ${plan.isPopular ? "text-void" : "text-ink"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-xs font-mono mt-1 leading-snug ${plan.isPopular ? "text-void/60" : "text-muted"}`}>
                      {plan.blurb}
                    </p>
                  </div>

                  {/* Price */}
                  <div className={`py-4 border-y space-y-1 ${plan.isPopular ? "border-white/15" : "border-line"}`}>
                    <div className={`font-mono font-bold text-3xl ${plan.isPopular ? "text-void" : "text-ink"}`}>
                      {fmt(total)}
                    </div>
                    <div className={`text-[11px] font-mono ${plan.isPopular ? "text-void/50" : "text-muted"}`}>
                      {activeCycle.months === 1
                        ? "/ month"
                        : `for ${activeCycle.months} months · ${fmt(plan.monthlyBase)}/mo base`}
                    </div>
                    {activeCycle.discount > 0 && (
                      <div className={`text-[11px] font-mono ${plan.isPopular ? "text-emerald-300" : "text-emerald-600"}`}>
                        Save {fmt(plan.monthlyBase * activeCycle.months * activeCycle.discount)} vs monthly
                      </div>
                    )}
                  </div>

                  {/* GPU spec */}
                  <div className={`p-2.5 rounded-lg border text-xs font-mono ${plan.isPopular ? "bg-white/10 border-white/15" : "bg-deep border-line"}`}>
                    <span className={`block text-[10px] uppercase tracking-wider mb-0.5 ${plan.isPopular ? "text-void/40" : "text-muted"}`}>
                      Hardware Node
                    </span>
                    <span className={`font-semibold ${plan.isPopular ? "text-void" : "text-ink"}`}>{plan.gpuSpec}</span>
                  </div>

                  {/* Features */}
                  <ul className="flex-1 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs font-mono">
                        <span className={`shrink-0 mt-px font-bold ${plan.isPopular ? "text-void" : "text-ink"}`}>✓</span>
                        <span className={plan.isPopular ? "text-void/80" : "text-ink"}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handlePay(plan)}
                    disabled={isLoading}
                    className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 ${
                      plan.isPopular
                        ? "bg-void text-ink hover:bg-void/90"
                        : "bg-ink text-void hover:bg-ink/80"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <span className={`w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin ${plan.isPopular ? "border-ink" : "border-void"}`} />
                        <span>Opening Razorpay…</span>
                      </>
                    ) : (
                      <span>⚡ {plan.cta}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>



        {/* ── Footer note ── */}
        <p className="text-xs text-muted font-mono">
          Payments processed securely via Razorpay (UPI · Cards · NetBanking · Wallets). Cancel any cycle before renewal.
        </p>

      </div>
    </section>
  );
}

"use client";

import { useUser } from "@clerk/nextjs";
import Script from "next/script";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// ─────────────────────────────────────────────
// Billing cycle config
// ─────────────────────────────────────────────
type CycleKey = "1mo" | "3mo" | "6mo" | "12mo";

const CYCLES: { key: CycleKey; label: string; months: number; discount: number; badge?: string }[] = [
  { key: "1mo",  label: "1 Month",   months: 1,  discount: 0    },
  { key: "3mo",  label: "3 Months",  months: 3,  discount: 0.05, badge: "−5%"  },
  { key: "6mo",  label: "6 Months",  months: 6,  discount: 0.10, badge: "−10%" },
  { key: "12mo", label: "12 Months", months: 12, discount: 0.15, badge: "−15%" },
];

/**
 * Returns paise-precise total for the chosen billing cycle.
 * Formula: round(monthly × months × (1 − discount))
 * Multiply by 100 before passing to Razorpay.
 */
function recurringPriceForMonths(monthly: number, months: number, discount: number): number {
  return Math.round(monthly * months * (1 - discount) * 100) / 100;
}

// ─────────────────────────────────────────────
// Plan definitions
// ─────────────────────────────────────────────
interface Plan {
  id: string;
  name: string;
  subtitle: string;
  monthlyBase: number;   // base monthly price in INR (integer)
  badge?: string;
  tagline: string;
  gpuSpec: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

const gamingPlans: Plan[] = [
  {
    id: "basic",
    name: "BASIC",
    subtitle: "Essential",
    monthlyBase: 799,
    tagline: "Jump into cloud gaming with no hardware.",
    gpuSpec: "RTX 3060 / 8 GB VRAM",
    features: [
      "3-Hour Session Length",
      "1080p @ 60 FPS",
      "Standard Queue Priority",
      "Stereo Audio",
      "10 GB Cloud Save Storage",
      "Basic Game Library Access",
    ],
    cta: "Subscribe — BASIC",
  },
  {
    id: "pro",
    name: "PRO",
    subtitle: "Extra",
    monthlyBase: 1499,
    tagline: "High frame rates, zero queue wait times.",
    gpuSpec: "RTX 4070 Ti / 16 GB VRAM",
    features: [
      "Unlimited Session Duration",
      "1440p QHD @ 120 FPS",
      "Ray Tracing Enabled",
      "Zero Queue Priority",
      "50 GB Cloud Save NVMe",
      "5.1 Surround Sound",
      "Full Game Library Access",
    ],
    cta: "Subscribe — PRO",
  },
  {
    id: "premium",
    name: "PREMIUM",
    subtitle: "Premium",
    monthlyBase: 2499,
    badge: "BEST VALUE",
    isPopular: true,
    tagline: "4K / 120 FPS with path-tracing on RTX 4090.",
    gpuSpec: "RTX 4090 / 24 GB VRAM",
    features: [
      "Unlimited Session Duration",
      "4K Ultra HD @ 120 FPS",
      "Full Path Tracing + DLSS 3.5",
      "VIP Fast-Track Server Access",
      "250 GB Personal NVMe SSD",
      "7.1 Uncompressed PCM Audio",
      "WebRTC Ultra-Low Latency",
      "Priority Support",
    ],
    cta: "Subscribe — PREMIUM",
  },
  {
    id: "ultimate",
    name: "ULTIMATE",
    subtitle: "Ultimate",
    monthlyBase: 2999,
    tagline: "Max-spec node — 240 FPS, 8K-ready.",
    gpuSpec: "RTX 4090 Ti / 24 GB VRAM",
    features: [
      "Unlimited Session Duration",
      "4K @ 240 FPS / 8K Preview",
      "Full Path Tracing + DLSS 3.5 + FG",
      "Dedicated Bare-Metal Node",
      "500 GB Personal NVMe SSD",
      "Dolby Atmos Spatial Audio",
      "WebRTC 5 ms Latency Mode",
      "24/7 Dedicated Support",
    ],
    cta: "Subscribe — ULTIMATE",
  },
];

const cloudPcPlans: Plan[] = [
  {
    id: "essential-pc",
    name: "ESSENTIAL",
    subtitle: "Essential PC",
    monthlyBase: 1999,
    tagline: "Dedicated Windows 11 cloud desktop.",
    gpuSpec: "RTX 4070 / 16 GB VRAM / 32 GB RAM",
    features: [
      "Full Windows 11 Admin Access",
      "500 GB Gen4 NVMe Storage",
      "1440p @ 120 FPS Stream",
      "Always-On (No Session Timeout)",
      "Steam, Epic & Discord preinstalled",
      "5 Gbps Network Interface",
    ],
    cta: "Deploy — ESSENTIAL",
  },
  {
    id: "extra-pc",
    name: "EXTRA",
    subtitle: "Professional PC",
    monthlyBase: 3499,
    badge: "POPULAR",
    isPopular: true,
    tagline: "4K gaming + 3D rendering & video editing.",
    gpuSpec: "RTX 4090 / 24 GB VRAM / 64 GB DDR5",
    features: [
      "Dedicated RTX 4090 GPU Node",
      "2 TB High-Speed NVMe Storage",
      "4K @ 120 FPS / 8K Support",
      "Parsec Pro & RDP Remote Access",
      "10 Gbps Unrestricted Network",
      "Custom Drivers & CUDA 12",
      "24/7 Priority Support",
    ],
    cta: "Deploy — EXTRA",
  },
  {
    id: "premium-pc",
    name: "PREMIUM",
    subtitle: "Creator PC",
    monthlyBase: 4999,
    tagline: "AI workloads, 8K editing & extreme gaming.",
    gpuSpec: "RTX 4090 × 2 / 96 GB VRAM / 128 GB RAM",
    features: [
      "Dual RTX 4090 SLI Node",
      "4 TB Enterprise NVMe SSD",
      "8K @ 60 FPS / 4K @ 240 FPS",
      "PyTorch, TensorFlow, CUDA pre-installed",
      "Dedicated Static IP & VPN Subnet",
      "25 Gbps Dedicated Uplink",
      "SLA Guarantee & VIP Hotline",
    ],
    cta: "Deploy — PREMIUM",
  },
];

// ─────────────────────────────────────────────
// Savings badge helper
// ─────────────────────────────────────────────
function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: amount % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 });
}

// ─────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────
export default function UpgradePage() {
  const { user } = useUser();
  const [category, setCategory] = useState<"gaming" | "cloud-pc">("gaming");
  const [billingCycle, setBillingCycle] = useState<CycleKey>("1mo");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<{
    paymentId: string;
    planName: string;
    amount: number;
  } | null>(null);

  const activePlans = category === "gaming" ? gamingPlans : cloudPcPlans;
  const selectedCycle = CYCLES.find((c) => c.key === billingCycle)!;

  const getPrice = (plan: Plan): number =>
    recurringPriceForMonths(plan.monthlyBase, selectedCycle.months, selectedCycle.discount);

  const handleRazorpayCheckout = (plan: Plan) => {
    const totalINR = getPrice(plan);
    const totalPaise = Math.round(totalINR * 100);

    setIsProcessing(plan.id);

    const cycleLabel =
      selectedCycle.months === 1
        ? "Monthly"
        : `${selectedCycle.months}-Month (${Math.round(selectedCycle.discount * 100)}% off)`;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TIQY8CAZ52qCin",
      amount: totalPaise,
      currency: "INR",
      name: "NIMBUS Cloud Gaming",
      description: `${plan.name} — ${plan.subtitle} · ${cycleLabel}`,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80",
      handler: function (response: any) {
        setIsProcessing(null);
        setPaymentSuccess({
          paymentId: response.razorpay_payment_id,
          planName: `${plan.name} (${plan.subtitle})`,
          amount: totalINR,
        });
      },
      prefill: {
        name: user?.fullName || user?.firstName || "NIMBUS Gamer",
        email: user?.primaryEmailAddress?.emailAddress || "gamer@nimbus.cloud",
        contact: "9876543210",
      },
      notes: {
        plan_id: plan.id,
        billing_cycle: billingCycle,
        months: selectedCycle.months,
        discount_pct: Math.round(selectedCycle.discount * 100),
      },
      theme: { color: "#111111" },
      modal: {
        ondismiss: function () {
          setIsProcessing(null);
        },
      },
    };

    if (typeof window !== "undefined" && window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Razorpay is loading… please try again in a second.");
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* ── Payment Success Banner ── */}
      {paymentSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <div>
              <span className="font-bold text-sm block">⚡ Payment Successful! Plan Activated.</span>
              <span>
                Payment ID: <code className="text-ink">{paymentSuccess.paymentId}</code> •{" "}
                <span className="font-bold text-ink">{paymentSuccess.planName}</span> •{" "}
                Charged: <span className="font-bold text-ink">{formatINR(paymentSuccess.amount)}</span>
              </span>
            </div>
          </div>
          <button onClick={() => setPaymentSuccess(null)} className="text-muted hover:text-ink text-xs underline cursor-pointer shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/5 border border-black/15 text-ink font-mono text-xs uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-ink animate-pulse" />
          <span>Razorpay Secure Payment Gateway</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-ink tracking-tight">
          Choose Your Plan
        </h1>
        <p className="text-muted text-sm font-mono leading-relaxed">
          Pay once per billing cycle — UPI, Cards, NetBanking & Wallets accepted via Razorpay.
        </p>
      </div>

      {/* ── Category + Billing Controls ── */}
      <div className="flex flex-col gap-4">
        {/* Category tabs */}
        <div className="flex items-center gap-2 bg-white border border-black/10 p-1.5 rounded-2xl shadow-sm w-fit mx-auto">
          <button
            onClick={() => setCategory("gaming")}
            className={`px-6 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              category === "gaming" ? "bg-ink text-white shadow-sm" : "text-muted hover:text-ink hover:bg-black/5"
            }`}
          >
            🎮 Cloud Gaming
          </button>
          <button
            onClick={() => setCategory("cloud-pc")}
            className={`px-6 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              category === "cloud-pc" ? "bg-ink text-white shadow-sm" : "text-muted hover:text-ink hover:bg-black/5"
            }`}
          >
            🖥️ Cloud PC Rigs
          </button>
        </div>

        {/* Billing cycle tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {CYCLES.map((cycle) => {
            const isActive = billingCycle === cycle.key;
            return (
              <button
                key={cycle.key}
                onClick={() => setBillingCycle(cycle.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-ink text-white border-ink shadow-sm"
                    : "bg-white text-muted border-black/10 hover:text-ink hover:border-black/25"
                }`}
              >
                <span>{cycle.label}</span>
                {cycle.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {cycle.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Savings info strip */}
        {selectedCycle.discount > 0 && (
          <p className="text-center text-xs font-mono text-muted">
            You save{" "}
            <span className="text-emerald-600 font-bold">{Math.round(selectedCycle.discount * 100)}%</span>{" "}
            by committing to {selectedCycle.months} months — billed as one payment.
          </p>
        )}
      </div>

      {/* ── Pricing Cards Grid ── */}
      <div className={`grid gap-5 items-stretch ${
        activePlans.length === 4
          ? "sm:grid-cols-2 xl:grid-cols-4"
          : "sm:grid-cols-2 lg:grid-cols-3"
      }`}>
        {activePlans.map((plan) => {
          const totalPrice = getPrice(plan);
          const isActive = isProcessing === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                plan.isPopular
                  ? "bg-ink text-white border-ink shadow-xl"
                  : "bg-white border-black/10 hover:border-black/25 hover:shadow-md"
              }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div
                  className={`absolute top-0 right-0 text-[10px] font-mono font-bold px-3 py-1 rounded-bl-xl ${
                    plan.isPopular ? "bg-white text-ink" : "bg-ink text-white"
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="p-6 space-y-5">
                {/* Plan name */}
                <div>
                  <span className={`text-[10px] font-mono uppercase tracking-widest ${plan.isPopular ? "text-white/50" : "text-muted"}`}>
                    {plan.subtitle}
                  </span>
                  <h3 className={`font-display font-bold text-2xl mt-0.5 ${plan.isPopular ? "text-white" : "text-ink"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs font-mono mt-1 leading-snug ${plan.isPopular ? "text-white/60" : "text-muted"}`}>
                    {plan.tagline}
                  </p>
                </div>

                {/* Price block */}
                <div className={`py-4 border-y space-y-1 ${plan.isPopular ? "border-white/15" : "border-black/10"}`}>
                  <div className={`font-mono font-bold text-3xl ${plan.isPopular ? "text-white" : "text-ink"}`}>
                    {formatINR(totalPrice)}
                  </div>
                  <div className={`text-[11px] font-mono ${plan.isPopular ? "text-white/50" : "text-muted"}`}>
                    {selectedCycle.months === 1
                      ? "/ month"
                      : `total for ${selectedCycle.months} months · ${formatINR(plan.monthlyBase)}/mo base`}
                  </div>
                  {selectedCycle.discount > 0 && (
                    <div className={`text-[11px] font-mono ${plan.isPopular ? "text-emerald-300" : "text-emerald-600"}`}>
                      You save {formatINR(plan.monthlyBase * selectedCycle.months * selectedCycle.discount)} vs monthly
                    </div>
                  )}
                </div>

                {/* GPU Spec */}
                <div className={`p-2.5 rounded-lg border text-xs font-mono ${plan.isPopular ? "bg-white/10 border-white/15" : "bg-deep border-black/10"}`}>
                  <span className={`block text-[10px] uppercase tracking-wider mb-0.5 ${plan.isPopular ? "text-white/40" : "text-muted"}`}>
                    Hardware Node
                  </span>
                  <span className={`font-semibold ${plan.isPopular ? "text-white" : "text-ink"}`}>{plan.gpuSpec}</span>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${plan.isPopular ? "text-white/40" : "text-muted"}`}>
                    Included
                  </span>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2 text-xs font-mono">
                      <span className={`font-bold shrink-0 mt-px ${plan.isPopular ? "text-white" : "text-ink"}`}>✓</span>
                      <span className={plan.isPopular ? "text-white/80" : "text-ink"}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handleRazorpayCheckout(plan)}
                  disabled={isActive}
                  className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 ${
                    plan.isPopular
                      ? "bg-white text-ink hover:bg-white/90"
                      : "bg-ink text-white hover:bg-black/80"
                  }`}
                >
                  {isActive ? (
                    <>
                      <div className={`w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin ${plan.isPopular ? "border-ink" : "border-white"}`} />
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

      {/* ── Pricing Reference Table ── */}
      <div className="rounded-2xl bg-white border border-black/10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-black/10 flex items-center gap-3">
          <span className="font-display font-bold text-ink text-sm">
            {category === "gaming" ? "🎮 Gaming" : "🖥️ Cloud PC"} — Full Pricing Table
          </span>
          <span className="text-[10px] font-mono text-muted px-2 py-0.5 border border-black/10 rounded bg-deep">
            All amounts in INR (₹)
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="bg-deep border-b border-black/10">
                <th className="text-left px-6 py-3 text-muted uppercase tracking-wider text-[10px] font-bold">Tier</th>
                <th className="text-right px-4 py-3 text-muted uppercase tracking-wider text-[10px] font-bold">1 Month</th>
                <th className="text-right px-4 py-3 text-muted uppercase tracking-wider text-[10px] font-bold">3 Months <span className="text-emerald-600">−5%</span></th>
                <th className="text-right px-4 py-3 text-muted uppercase tracking-wider text-[10px] font-bold">6 Months <span className="text-emerald-600">−10%</span></th>
                <th className="text-right px-4 py-3 text-muted uppercase tracking-wider text-[10px] font-bold">12 Months <span className="text-emerald-600">−15%</span></th>
              </tr>
            </thead>
            <tbody>
              {activePlans.map((plan, i) => (
                <tr
                  key={plan.id}
                  className={`border-b border-black/5 transition-colors hover:bg-deep/50 ${plan.isPopular ? "bg-ink/[0.03]" : ""}`}
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink">{plan.name}</span>
                      {plan.isPopular && (
                        <span className="text-[9px] font-bold bg-ink text-white px-1.5 py-0.5 rounded">{plan.badge}</span>
                      )}
                      <span className="text-muted">({plan.subtitle})</span>
                    </div>
                    <div className="text-muted text-[10px] mt-0.5">{formatINR(plan.monthlyBase)}/mo base</div>
                  </td>
                  {CYCLES.map((cycle) => {
                    const amt = recurringPriceForMonths(plan.monthlyBase, cycle.months, cycle.discount);
                    const isSelected = billingCycle === cycle.key;
                    return (
                      <td key={cycle.key} className={`text-right px-4 py-3.5 ${isSelected ? "font-bold text-ink" : "text-muted"}`}>
                        {formatINR(amt)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-deep/50 text-[10px] font-mono text-muted">
          Formula: <code className="text-ink">round(monthly × months × (1 − discount))</code> — paise-precise via <code className="text-ink">recurringPriceForMonths()</code>
        </div>
      </div>

      {/* ── Razorpay Payment Methods Banner ── */}
      <div className="rounded-xl bg-white border border-black/10 p-5 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-muted shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black/5 border border-black/10 flex items-center justify-center text-lg">💳</div>
          <div>
            <span className="text-ink font-bold block text-sm mb-0.5">Supported Payment Methods</span>
            <span>UPI (GPay, PhonePe, Paytm) • Visa / Mastercard / RuPay • NetBanking • Wallets</span>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-emerald-600 font-semibold">🔒 256-Bit SSL</span>
          <span className="text-muted">|</span>
          <span className="text-ink font-semibold">Powered by Razorpay</span>
        </div>
      </div>
    </div>
  );
}

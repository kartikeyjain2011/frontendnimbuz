"use client";

import { useState } from "react";
import Script from "next/script";
import { coverUrl } from "@/lib/steamMedia";
import { syncSubscriptionToAdmin, syncBillingToAdmin } from "@/lib/adminSync";

declare global {
  interface Window {
    Razorpay: any;
  }
}

/** Key art tiled behind the pricing block. */
const PRICING_ART = [
  1091500, 1245620, 1086940, 2358720, 1174180, 990080, 1551360, 1593500,
];

type TierId = "free" | "performance" | "ultimate";

interface Tier {
  id: TierId;
  name: string;
  monthly: number;
  sixMonth: number;
  featured?: boolean;
  rig: string;
  specs: {
    resolution: string;
    fps: string;
    session: string;
    rayTracing: string;
    queue: string;
    vram: string;
  };
  perks: string[];
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    sixMonth: 0,
    rig: "Basic Rig",
    specs: {
      resolution: "Up to 1080p",
      fps: "Up to 60 FPS",
      session: "1-hour sessions",
      rayTracing: "—",
      queue: "No priority · >2 min wait",
      vram: "Shared",
    },
    perks: [
      "Access 2,000+ games",
      "Ready-to-Play games",
      "1-hour gaming sessions",
      "Up to 1080p at 60 FPS",
    ],
  },
  {
    id: "performance",
    name: "Performance",
    monthly: 999,
    sixMonth: 5094,
    featured: true,
    rig: "Nimbus RTX",
    specs: {
      resolution: "Up to 1440p",
      fps: "Up to 60 FPS",
      session: "6-hour sessions",
      rayTracing: "RTX ON",
      queue: "Priority · <1 min wait",
      vram: "16 GB",
    },
    perks: [
      "Access 4,500+ games",
      "Ready-to-Play + Install-to-Play",
      "6-hour gaming sessions",
      "Up to 1440p at 60 FPS",
      "Priority access to queue",
    ],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    monthly: 1999,
    sixMonth: 10194,
    rig: "Nimbus RTX 5090",
    specs: {
      resolution: "Up to 5K",
      fps: "Up to 360 FPS",
      session: "8-hour sessions",
      rayTracing: "Full path tracing",
      queue: "First priority · no wait",
      vram: "32 GB",
    },
    perks: [
      "Access 4,500+ games",
      "Ready-to-Play + Install-to-Play",
      "8-hour gaming sessions",
      "Up to 5K at 360 FPS",
      "First priority access to queue",
    ],
  },
];

const MATRIX_ROWS: { key: keyof Tier["specs"]; label: string }[] = [
  { key: "resolution", label: "Max resolution" },
  { key: "fps", label: "Frame rate" },
  { key: "rayTracing", label: "Ray tracing" },
  { key: "session", label: "Session length" },
  { key: "queue", label: "Queue priority" },
  { key: "vram", label: "GPU memory" },
];

function fmt(n: number) {
  return n.toLocaleString("en-IN");
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handlePay = (tier: Tier) => {
    if (tier.id === "free") {
      window.location.href = "/sign-up";
      return;
    }

    const price = annual ? tier.sixMonth : tier.monthly;
    const paise = Math.round(price * 100);
    const cycleLabel = annual ? "6 months" : "Monthly";

    setLoading(tier.id);

    const options = {
      key:
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TIQY8CAZ52qCin",
      amount: paise,
      currency: "INR",
      name: "NIMBUS Cloud Gaming",
      description: `${tier.name} — ${tier.rig} · ${cycleLabel}`,
      handler: function (response: any) {
        setLoading(null);
        const pid = response.razorpay_payment_id;

        syncSubscriptionToAdmin({
          userId: "landing_user",
          userEmail: "gamer@nimbus.cloud",
          userName: "NIMBUS Gamer",
          planId: tier.id,
          planName: `${tier.name} (${tier.rig})`,
          billingCycle: annual ? "6mo" : "1mo",
          price,
          currency: "INR",
          paymentId: pid,
          status: "active",
          startDate: new Date().toISOString(),
        });

        syncBillingToAdmin({
          paymentId: pid,
          userId: "landing_user",
          userEmail: "gamer@nimbus.cloud",
          userName: "NIMBUS Gamer",
          amount: price,
          currency: "INR",
          itemType: "subscription",
          itemTitle: `${tier.name} (${tier.rig})`,
          paymentMethod: "Razorpay",
          status: "success",
          timestamp: new Date().toISOString(),
        });

        alert(
          `✅ Payment Successful!\nPayment ID: ${pid}\n\nWelcome to ${tier.name}! Redirecting to your dashboard…`,
        );
        window.location.href = "/dashboard";
      },
      prefill: {
        name: "NIMBUS Gamer",
        email: "gamer@nimbus.cloud",
        contact: "9876543210",
      },
      notes: { tier_id: tier.id, billing_cycle: annual ? "6mo" : "1mo" },
      theme: { color: "#7C3AED" },
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
    <section id="pricing" className="relative py-24 md:py-28 overflow-hidden">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {/* Key-art backdrop */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="grid h-full grid-cols-4 gap-2 opacity-[0.14] md:grid-cols-8">
          {PRICING_ART.map((appId, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${appId}-${i}`}
              src={coverUrl(appId)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover grayscale"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/95 to-void" />
      </div>
      <div className="absolute inset-0 bg-aurora-3" />
      <div className="noise-overlay" />

      <div className="container-px relative">
        {/* Heading */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="section-label">Select your membership</span>
            <span className="signal-line flex-1 max-w-20" />
          </div>
          <h2 className="font-display font-semibold text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.06] tracking-tight text-ink text-balance">
            Pick your GPU.
            <span className="gradient-text"> Cancel whenever.</span>
          </h2>
          <p className="mt-6 text-muted text-lg leading-relaxed">
            Every tier streams the same library you already own. Paying more
            buys you a faster card, a longer session and a shorter queue —
            never a bigger catalogue paywall.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center gap-1 rounded-full border border-line bg-panel/70 p-1 backdrop-blur">
            <button
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                !annual ? "bg-white text-black" : "text-muted hover:text-ink"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                annual ? "bg-white text-black" : "text-muted hover:text-ink"
              }`}
            >
              6 months
            </button>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/40 bg-ember/10 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-ember">
            Save 15% on 6 months
          </span>
        </div>

        {/* Tier cards */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => {
            const price = annual ? tier.sixMonth : tier.monthly;
            const unit = annual ? "/6 mo" : "/mo";
            const isLoading = loading === tier.id;

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${
                  tier.featured
                    ? "ring-gradient bg-surface shadow-glow lg:scale-[1.02]"
                    : "border border-line bg-panel/60 backdrop-blur hover:border-plasma/40"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-plasma-sweep px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-white">
                    Most popular
                  </span>
                )}

                <h3 className="font-display text-2xl font-semibold text-ink">
                  {tier.name}
                </h3>
                <p className="mt-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-muted">
                  {tier.rig}
                  {tier.id === "free" ? " · ad-supported" : " · no ads"}
                </p>

                <div className="mt-6 flex items-end gap-1">
                  {price === 0 ? (
                    <span className="font-display text-4xl font-semibold text-ink">
                      Free
                    </span>
                  ) : (
                    <>
                      <span className="mb-1 text-lg text-muted">₹</span>
                      <span className="font-display text-4xl font-semibold tabular-nums text-ink">
                        {fmt(price)}
                      </span>
                      <span className="mb-1.5 text-sm text-muted">{unit}</span>
                    </>
                  )}
                </div>

                <p className="mt-1.5 h-4 font-mono text-[0.62rem] text-faint">
                  {price > 0 &&
                    (annual
                      ? `₹${Math.round(price / 6).toLocaleString("en-IN")}/mo equivalent`
                      : `₹${fmt(tier.sixMonth)} for 6 months`)}
                </p>

                <button
                  onClick={() => handlePay(tier)}
                  disabled={isLoading}
                  className={`mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all disabled:opacity-60 ${
                    tier.featured
                      ? "bg-plasma-sweep text-white hover:shadow-glow"
                      : "border border-line-strong text-ink hover:border-plasma hover:bg-plasma/15 hover:text-plasma-bright"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent border-white" />
                      Opening Razorpay…
                    </>
                  ) : tier.id === "free" ? (
                    "Join Free"
                  ) : tier.id === "performance" ? (
                    "Get Performance"
                  ) : (
                    "Go Ultimate"
                  )}
                </button>

                <ul className="mt-8 space-y-3">
                  {tier.perks.map((perk) => (
                    <li
                      key={perk}
                      className={`flex items-start gap-3 text-sm ${
                        tier.featured ? "text-ink/85" : "text-muted"
                      }`}
                    >
                      <svg
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          tier.featured ? "text-plasma-bright" : "text-faint"
                        }`}
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 8.5l3.2 3.2L13 5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Spec comparison matrix */}
        <div className="mt-16 rounded-2xl border border-line bg-panel/40 backdrop-blur">
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-6 py-5 font-normal text-faint">
                    <span className="section-label">Compare</span>
                  </th>
                  {TIERS.map((t) => (
                    <th
                      key={t.id}
                      className="px-6 py-5 font-display text-base font-semibold text-ink"
                    >
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX_ROWS.map((row, i) => (
                  <tr key={row.key} className={i % 2 ? "bg-white/[0.015]" : undefined}>
                    <td className="px-6 py-4 text-muted">{row.label}</td>
                    {TIERS.map((t) => (
                      <td
                        key={t.id}
                        className={`px-6 py-4 font-mono text-[0.82rem] ${
                          t.specs[row.key] === "—"
                            ? "text-faint"
                            : t.featured
                              ? "text-ink"
                              : "text-muted"
                        }`}
                      >
                        {t.specs[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-center font-mono text-[0.6rem] uppercase tracking-widest text-faint lg:hidden">
          Swipe the table to compare →
        </p>

        <p className="mt-6 text-center text-xs text-faint">
          Prices in INR. Payments processed via Razorpay (UPI · Cards ·
          NetBanking · Wallets). Cancel any time — no lock-in, no hardware to
          return.
        </p>
      </div>
    </section>
  );
}

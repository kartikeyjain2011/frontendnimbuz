"use client";

import Script from "next/script";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    numericPrice: 0,
    cadence: "forever",
    blurb: "See what the loop feels like.",
    features: [
      "1 hour sessions",
      "Standard tier GPU",
      "1080p / 60fps",
      "Queue during peak hours",
    ],
    cta: "Start free",
  },
  {
    id: "priority",
    name: "Priority",
    price: "₹699",
    numericPrice: 699,
    cadence: "/ month",
    blurb: "For a regular library, no waiting.",
    features: [
      "Unlimited session length",
      "Priority tier GPU",
      "1440p / 120fps + ray tracing",
      "Skip the queue",
    ],
    cta: "Go Priority",
    featured: true,
  },
  {
    id: "ultra",
    name: "Ultra",
    price: "₹1,199",
    numericPrice: 1199,
    cadence: "/ month",
    blurb: "For the sharpest picture Nimbus renders.",
    features: [
      "Unlimited session length",
      "Ultra tier GPU",
      "4K / 120fps, path traced",
      "Skip the queue",
    ],
    cta: "Go Ultra",
  },
];

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleRazorpayPayment = (plan: typeof plans[0]) => {
    if (plan.numericPrice === 0) {
      window.location.href = "/dashboard";
      return;
    }

    setLoadingPlan(plan.id);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_nimbus_demo_key",
      amount: plan.numericPrice * 100,
      currency: "INR",
      name: "NIMBUS Cloud Gaming",
      description: `${plan.name} Plan Subscription`,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80",
      handler: function (response: any) {
        setLoadingPlan(null);
        alert(`Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\nRedirecting to your dashboard...`);
        window.location.href = "/dashboard";
      },
      prefill: {
        name: "NIMBUS Gamer",
        email: "gamer@nimbus.cloud",
        contact: "9876543210",
      },
      theme: {
        color: "#00F0FF",
      },
      modal: {
        ondismiss: function () {
          setLoadingPlan(null);
        },
      },
    };

    if (typeof window !== "undefined" && window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Razorpay checkout SDK loading... Please try again in a moment.");
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="relative py-24 md:py-32 border-t border-line">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="container-px">
        <div className="flex items-center gap-2 mb-6">
          <span className="section-label">Pricing</span>
          <span className="signal-line flex-1 max-w-16" />
        </div>
        <h2 className="font-display font-semibold text-3xl md:text-5xl tracking-tight max-w-xl text-balance">
          Rent the GPU, keep the games
        </h2>

        <div className="mt-16 grid lg:grid-cols-3 gap-5 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-2xl p-8 border ${
                p.featured
                  ? "border-cyan/40 bg-gradient-to-b from-cyan/10 to-transparent shadow-glow lg:-translate-y-3"
                  : "border-line card-panel"
              }`}
            >
              <h3 className="font-display font-medium text-xl">{p.name}</h3>
              <p className="text-sm text-muted mt-1">{p.blurb}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-mono text-4xl text-ink">{p.price}</span>
                <span className="text-sm text-muted">{p.cadence}</span>
              </div>

              <ul className="mt-7 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-cyan shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleRazorpayPayment(p)}
                disabled={loadingPlan === p.id}
                className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all cursor-pointer ${
                  p.featured
                    ? "bg-cyan text-void hover:shadow-glow"
                    : "border border-line text-ink hover:border-ink/40"
                }`}
              >
                {loadingPlan === p.id ? "Opening Razorpay..." : p.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted">
          Prices shown in INR via Razorpay gateway. Cancel anytime — zero installation required.
        </p>
      </div>
    </section>
  );
}

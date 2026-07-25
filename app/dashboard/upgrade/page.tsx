"use client";

import { useUser } from "@clerk/nextjs";
import Script from "next/script";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Plan {
  id: string;
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  numericMonthly: number;
  numericAnnual: number;
  badge?: string;
  tagline: string;
  gpuSpec: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

const gamingPlans: Plan[] = [
  {
    id: "free",
    name: "Free Tier",
    priceMonthly: "₹0",
    priceAnnual: "₹0",
    numericMonthly: 0,
    numericAnnual: 0,
    tagline: "Essential cloud gaming experience.",
    gpuSpec: "Standard RTX 3060 Node",
    features: [
      "1 Hour Maximum Session Length",
      "1080p Resolution @ 60 FPS",
      "Standard Queue Priority",
      "Standard Stereo Audio",
      "Basic Game Library Access",
    ],
    cta: "Current Plan",
  },
  {
    id: "priority",
    name: "Priority Gamer",
    priceMonthly: "₹699",
    priceAnnual: "₹559",
    numericMonthly: 699,
    numericAnnual: 559,
    tagline: "High frame rates with zero queue wait times.",
    gpuSpec: "RTX 4070 Ti / 16GB VRAM",
    features: [
      "Unlimited Session Duration",
      "1440p QHD @ 120 FPS",
      "Ray Tracing Enabled",
      "Zero Queue Priority Access",
      "50 GB Cloud Save NVMe Storage",
      "5.1 Surround Sound",
    ],
    cta: "Upgrade via Razorpay",
  },
  {
    id: "ultra",
    name: "Ultra RTX 4090",
    priceMonthly: "₹1,199",
    priceAnnual: "₹959",
    numericMonthly: 1199,
    numericAnnual: 959,
    badge: "MOST POPULAR",
    isPopular: true,
    tagline: "Peak 4K Path-Tracing performance.",
    gpuSpec: "NVIDIA RTX 4090 / 24GB VRAM",
    features: [
      "Unlimited Session Duration",
      "4K Ultra HD @ 120 FPS / 240 FPS",
      "Full Path Tracing & DLSS 3.5",
      "VIP Fast-Track Server Access",
      "250 GB Personal NVMe SSD Drive",
      "7.1 Uncompressed PCM Audio",
      "WebRTC Ultra-Low Latency Mode",
    ],
    cta: "Upgrade to Ultra 4K",
  },
];

const cloudPcPlans: Plan[] = [
  {
    id: "personal-pc",
    name: "Personal Cloud Rig",
    priceMonthly: "₹1,999",
    priceAnnual: "₹1,599",
    numericMonthly: 1999,
    numericAnnual: 1599,
    tagline: "Dedicated Windows 11 cloud desktop.",
    gpuSpec: "RTX 4080 Super / 32GB RAM",
    features: [
      "Full Windows 11 Administrator Access",
      "1 TB Gen4 NVMe Storage",
      "1440p @ 120 FPS Stream",
      "Always-On State (No Session Timeout)",
      "Steam, Epic, GOG & Discord preinstalled",
    ],
    cta: "Deploy via Razorpay",
  },
  {
    id: "creator-pc",
    name: "Pro Workstation Rig",
    priceMonthly: "₹3,499",
    priceAnnual: "₹2,799",
    numericMonthly: 3499,
    numericAnnual: 2799,
    badge: "PRO CHOICE",
    isPopular: true,
    tagline: "For heavy 3D rendering, video editing & 4K gaming.",
    gpuSpec: "RTX 4090 / 64GB DDR5 / 24 Cores",
    features: [
      "Dedicated RTX 4090 GPU Node",
      "2 TB High-Speed NVMe Storage",
      "4K @ 120 FPS / 8K Support",
      "Parsec Pro & RDP Remote Access",
      "Unrestricted 10 Gbps Network Interface",
      "Custom Drivers & CUDA Acceleration",
    ],
    cta: "Deploy Pro Workstation",
  },
  {
    id: "enterprise-h100",
    name: "H100 Enterprise Node",
    priceMonthly: "₹7,999",
    priceAnnual: "₹6,399",
    numericMonthly: 7999,
    numericAnnual: 6399,
    tagline: "Enterprise AI training & extreme computing.",
    gpuSpec: "NVIDIA H100 (80GB Tensor VRAM)",
    features: [
      "NVIDIA H100 80GB Enterprise GPU",
      "128 GB ECC RAM / 96 Core EPYC CPU",
      "4 TB Enterprise NVMe SSD Array",
      "Pre-configured PyTorch, TensorFlow & CUDA",
      "Dedicated Static IP & Private Subnet",
      "24/7 SLA Guarantee & VIP Support",
    ],
    cta: "Deploy Enterprise Node",
  },
];

export default function UpgradePage() {
  const { user } = useUser();
  const [category, setCategory] = useState<"gaming" | "cloud-pc">("gaming");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<{
    paymentId: string;
    planName: string;
  } | null>(null);

  const activePlans = category === "gaming" ? gamingPlans : cloudPcPlans;

  const handleRazorpayCheckout = (plan: Plan) => {
    const rawPrice = billingCycle === "monthly" ? plan.numericMonthly : plan.numericAnnual;

    if (rawPrice === 0) {
      alert("You are currently on the Free Starter Tier!");
      return;
    }

    setIsProcessing(plan.id);

    // Initialize Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_nimbus_demo_key",
      amount: rawPrice * 100, // Amount in paise
      currency: "INR",
      name: "NIMBUS Cloud Gaming",
      description: `${plan.name} (${billingCycle === "annual" ? "Annual Plan - 20% Off" : "Monthly Plan"})`,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80",
      handler: function (response: any) {
        setIsProcessing(null);
        setPaymentSuccess({
          paymentId: response.razorpay_payment_id,
          planName: plan.name,
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
      },
      theme: {
        color: "#00F0FF",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(null);
        },
      },
    };

    if (typeof window !== "undefined" && window.Razorpay) {
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } else {
      // Fallback if Razorpay SDK script hasn't loaded yet
      alert("Razorpay payment gateway script loading... Please click again in a second.");
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Load official Razorpay Checkout SDK Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {/* Payment Success Alert Banner */}
      {paymentSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div>
              <span className="font-bold text-sm block">⚡ Payment Successful! Tier Upgraded.</span>
              <span>
                Payment ID: <code className="text-ink">{paymentSuccess.paymentId}</code> • Activated:{" "}
                <span className="text-cyan font-bold">{paymentSuccess.planName}</span>
              </span>
            </div>
          </div>
          <button
            onClick={() => setPaymentSuccess(null)}
            className="text-muted hover:text-ink text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan/10 border border-cyan/40 text-cyan font-mono text-xs uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          <span>RAZORPAY SECURE PAYMENT GATEWAY</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-ink tracking-tight">
          Unlock Ultimate Cloud Power
        </h1>
        <p className="text-muted text-sm font-mono leading-relaxed">
          Upgrade your streaming rig instantly with Razorpay Checkout (UPI, Credit/Debit Cards, NetBanking, Wallets).
        </p>
      </div>

      {/* Category & Billing Toggles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-surface border border-line p-4 rounded-2xl">
        {/* Category selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setCategory("gaming")}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              category === "gaming"
                ? "bg-cyan text-void shadow-glow"
                : "text-muted hover:text-ink hover:bg-void"
            }`}
          >
            🎮 Cloud Gaming Tiers
          </button>
          <button
            onClick={() => setCategory("cloud-pc")}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              category === "cloud-pc"
                ? "bg-cyan text-void shadow-glow"
                : "text-muted hover:text-ink hover:bg-void"
            }`}
          >
            🖥️ Dedicated Cloud Rigs
          </button>
        </div>

        {/* Billing Cycle selector */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className={billingCycle === "monthly" ? "text-ink font-semibold" : "text-muted"}>
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")
            }
            className="w-12 h-6 rounded-full bg-void border border-line p-1 transition-colors cursor-pointer"
          >
            <div
              className={`w-4 h-4 rounded-full bg-cyan transition-transform ${
                billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={billingCycle === "annual" ? "text-ink font-semibold" : "text-muted"}>
            Annual <span className="text-emerald-400 font-bold">(Save 20%)</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid lg:grid-cols-3 gap-6 items-stretch">
        {activePlans.map((plan) => {
          const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceAnnual;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-7 border flex flex-col justify-between space-y-6 transition-all duration-300 relative ${
                plan.isPopular
                  ? "bg-gradient-to-b from-cyan/15 via-surface to-surface border-cyan/60 shadow-glow"
                  : "bg-surface/80 border-line hover:border-line/80"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan text-void text-[10px] font-mono font-bold px-3 py-0.5 rounded-full shadow-glow">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-display font-bold text-2xl text-ink">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-muted font-mono mt-1">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price display */}
                <div className="flex items-baseline gap-1 py-2 border-y border-line/50">
                  <span className="font-mono text-4xl font-bold text-ink">{price}</span>
                  <span className="text-xs font-mono text-muted">
                    {billingCycle === "annual" ? "/ mo (billed yearly)" : "/ month"}
                  </span>
                </div>

                {/* GPU Spec Highlight */}
                <div className="p-3 rounded-lg bg-void/80 border border-line text-xs font-mono">
                  <span className="text-cyan block text-[10px] uppercase tracking-wider">
                    HARDWARE SPEC:
                  </span>
                  <span className="text-ink font-semibold">{plan.gpuSpec}</span>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-mono uppercase text-muted tracking-wider block">
                    INCLUDED FEATURES:
                  </span>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs font-mono text-muted">
                      <span className="text-cyan font-bold">✓</span>
                      <span className="text-ink">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Razorpay Action button */}
              <button
                onClick={() => handleRazorpayCheckout(plan)}
                disabled={isProcessing === plan.id}
                className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  plan.isPopular
                    ? "bg-cyan text-void hover:opacity-90 shadow-glow"
                    : "bg-ink text-void hover:bg-cyan hover:text-void"
                }`}
              >
                {isProcessing === plan.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin" />
                    <span>OPENING RAZORPAY...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ {plan.cta}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Razorpay Supported Payment Methods Banner */}
      <div className="rounded-xl bg-surface border border-line p-6 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-muted">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan text-lg">
            💳
          </div>
          <div>
            <span className="text-ink font-bold block text-sm">Supported Razorpay Payment Methods</span>
            <span>UPI (GPay, PhonePe, Paytm), Credit / Debit Cards (Visa, MasterCard, RuPay), NetBanking & Wallets.</span>
          </div>
        </div>
        <div className="shrink-0">
          <span className="text-emerald-400 font-semibold">🔒 256-Bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
}

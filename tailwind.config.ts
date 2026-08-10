import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Backgrounds ──────────────────────────────────
        void:    "#07070A",   // page background — deep space black
        deep:    "#0D0D12",   // slightly lifted bg
        panel:   "#111116",   // card/panel surface
        surface: "#18181F",   // elevated surface (modals, raised cards)

        // ── Borders ──────────────────────────────────────
        line:         "rgba(255,255,255,0.08)",
        "line-strong": "rgba(255,255,255,0.14)",

        // ── Text ─────────────────────────────────────────
        ink:   "#E8E8F0",   // primary text
        muted: "#8888A0",   // secondary text
        faint: "#44445A",   // disabled / hint text

        // ── Aqua accent (cyan / teal) ─────────────────────
        aqua:        "#00C8C8",
        "aqua-bright": "#00E5E5",

        // ── Plasma accent (violet / purple) ───────────────
        plasma:        "#7C3AED",
        "plasma-bright": "#A855F7",

        // ── Ember accent (orange — savings badge) ─────────
        ember: "#F97316",
      },

      backgroundImage: {
        // Colour-wash overlays layered in sections
        "aurora-1": "radial-gradient(60% 60% at 20% 10%, rgba(0,200,200,0.06) 0%, rgba(0,0,0,0) 60%)",
        "aurora-2": "radial-gradient(50% 50% at 85% 30%, rgba(124,58,237,0.07) 0%, rgba(0,0,0,0) 60%)",
        "aurora-3": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.15) 0%, transparent 70%)",

        // Plasma CTA gradient
        "plasma-sweep": "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #7C3AED 100%)",
      },

      fontFamily: {
        display: ["var(--font-display)"],
        body:    ["var(--font-body)"],
        mono:    ["var(--font-mono)"],
      },

      boxShadow: {
        glow:           "0 0 32px rgba(124,58,237,0.35)",
        "glow-aqua":    "0 0 24px rgba(0,200,200,0.25)",
        "glow-magenta": "0 0 20px rgba(168,85,247,0.30)",
      },

      animation: {
        flicker:      "flicker 3.2s ease-in-out infinite",
        drift:        "drift 18s ease-in-out infinite",
        scan:         "scan 6s linear infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },

      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "45%":      { opacity: "1" },
          "47%":      { opacity: "0.4" },
          "49%":      { opacity: "1" },
          "72%":      { opacity: "1" },
          "73%":      { opacity: "0.6" },
          "75%":      { opacity: "1" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%":      { transform: "translate3d(-2%,2%,0)" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

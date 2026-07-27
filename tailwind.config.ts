import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme remap — white-dominant
        void: "#FFFFFF",           // was pure black → now pure white (backgrounds)
        deep: "#F8F8FA",           // was near-black → lightest off-white
        panel: "#F1F1F5",          // was dark panel → very light gray panel
        surface: "#FFFFFF",        // cards / surfaces = white
        line: "rgba(0,0,0,0.10)", // borders = subtle black lines
        ink: "#0A0A0C",            // primary text = near-black
        muted: "#6B6B80",          // secondary text = mid-gray
        cyan: {
          DEFAULT: "#111111",      // accent = almost black (was white)
          dim: "#888888",
        },
        magenta: {
          DEFAULT: "#222222",
          dim: "#AAAAAA",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "aurora-1":
          "radial-gradient(60% 60% at 20% 10%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 60%)",
        "aurora-2":
          "radial-gradient(50% 50% at 85% 30%, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 60%)",
        "grain-line":
          "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 100%)",
      },
      boxShadow: {
        glow: "0 2px 24px rgba(0,0,0,0.10)",
        "glow-magenta": "0 2px 20px rgba(0,0,0,0.08)",
      },
      animation: {
        flicker: "flicker 3.2s ease-in-out infinite",
        drift: "drift 18s ease-in-out infinite",
        scan: "scan 6s linear infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "45%": { opacity: "1" },
          "47%": { opacity: "0.4" },
          "49%": { opacity: "1" },
          "72%": { opacity: "1" },
          "73%": { opacity: "0.6" },
          "75%": { opacity: "1" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(-2%, 2%, 0)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

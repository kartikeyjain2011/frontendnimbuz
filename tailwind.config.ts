import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#000000",
        deep: "#0A0A0C",
        panel: "#141416",
        line: "rgba(255, 255, 255, 0.12)",
        ink: "#FFFFFF",
        muted: "#A1A1AA",
        cyan: {
          DEFAULT: "#FFFFFF",
          dim: "#71717A",
        },
        magenta: {
          DEFAULT: "#E4E4E7",
          dim: "#52525B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "aurora-1":
          "radial-gradient(60% 60% at 20% 10%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)",
        "aurora-2":
          "radial-gradient(50% 50% at 85% 30%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)",
        "grain-line":
          "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,255,255,0.25)",
        "glow-magenta": "0 0 30px rgba(255,255,255,0.18)",
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

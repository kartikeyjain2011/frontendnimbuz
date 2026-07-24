# Nimbus — Cloud Gaming Homepage

A stunning, production-ready Next.js 14 (App Router) homepage for a cloud
gaming service, in the spirit of GeForce NOW but with its own visual
identity: a deep indigo-violet base with a cyan/magenta signal accent,
Space Grotesk + Inter + JetBrains Mono type system, and a live "latency
readout" as the hero's signature moment.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The first `npm run build`/`npm run dev`
needs internet access once to fetch the Google Fonts (Space Grotesk, Inter,
JetBrains Mono) — after that they're cached locally by Next.js.

## Structure

```
app/
  layout.tsx     Root layout, fonts, metadata
  page.tsx       Assembles all homepage sections
  globals.css    Design tokens (colors via Tailwind config), utility classes
components/
  Navbar.tsx         Sticky nav, blurs on scroll
  Hero.tsx           Headline + live ping/latency signature widget
  HowItWorks.tsx     3-step render loop explainer
  GameLibrary.tsx    Game grid (fictional titles/covers — swap in real art)
  DeviceCompat.tsx   TV / laptop / phone / tablet cards
  Performance.tsx    GPU tier comparison (Standard / Priority / Ultra)
  Pricing.tsx        3-tier pricing cards
  Testimonials.tsx   Social proof quotes
  FAQ.tsx            Accordion
  Footer.tsx         CTA band + footer links
```

## Customizing

- **Colors, fonts, motion**: all defined as tokens in `tailwind.config.ts`
  (`cyan`, `magenta`, `void`, `deep`, `panel`, `ink`, `muted`) — change once,
  applies everywhere.
- **Game covers**: `components/GameLibrary.tsx` currently uses gradient
  placeholders with invented titles to avoid any copyright/trademark issues.
  Swap the `games` array for your real catalog and point `background` at
  actual cover images (e.g. `backgroundImage: url(...)`).
- **Copy**: every section's text lives in small arrays/JSX at the top of its
  component file — easy to find and edit.
- **Pricing**: amounts are in INR in `components/Pricing.tsx`; change the
  `price`/`cadence` fields for your currency and tiers.

## Deploying

Works out of the box on Vercel:

```bash
npx vercel
```

Or any Node host that supports `next build && next start`.

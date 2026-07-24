const plans = [
  {
    name: "Free",
    price: "₹0",
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
    name: "Priority",
    price: "₹699",
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
    name: "Ultra",
    price: "₹1,199",
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
  return (
    <section id="pricing" className="relative py-24 md:py-32 border-t border-line">
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

              <a
                href="#top"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors ${
                  p.featured
                    ? "bg-cyan text-void hover:shadow-glow"
                    : "border border-line text-ink hover:border-ink/40"
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted">
          Prices shown in INR. Cancel anytime — nothing is installed on your
          device, so there's nothing to uninstall either.
        </p>
      </div>
    </section>
  );
}

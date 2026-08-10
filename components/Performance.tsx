const tiers = [
  {
    name: "Standard",
    gpu: "12 GB class GPU",
    res: "1080p",
    fps: "60fps",
    ray: "off",
  },
  {
    name: "Priority",
    gpu: "16 GB class GPU",
    res: "1440p",
    fps: "120fps",
    ray: "on",
    featured: true,
  },
  {
    name: "Ultra",
    gpu: "24 GB class GPU",
    res: "4K",
    fps: "120fps",
    ray: "on, path traced",
  },
];

export default function Performance() {
  return (
    <section id="performance" className="relative py-24 md:py-32 border-t border-line">
      <div className="container-px">
        <div className="flex items-center gap-2 mb-6">
          <span className="section-label">Performance</span>
          <span className="signal-line flex-1 max-w-16" />
        </div>
        <h2 className="font-display font-semibold text-3xl md:text-5xl tracking-tight max-w-xl text-balance">
          Choose the horsepower, not the hardware
        </h2>
        <p className="mt-5 text-muted max-w-lg leading-relaxed">
          Every tier is a different class of GPU sitting in a rack, not a
          setting you have to configure. Switch tiers between sessions as
          your game — or your week — demands more.
        </p>

        <div className="mt-16 grid lg:grid-cols-3 gap-5">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl p-8 border ${
                t.featured
                  ? "border-aqua/40 bg-gradient-to-b from-aqua/10 to-transparent shadow-glow-aqua"
                  : "border-line bg-panel/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-medium text-2xl">{t.name}</h3>
                {t.featured && (
                  <span className="text-xs font-mono text-aqua border border-aqua/40 rounded-full px-2.5 py-1">
                    most popular
                  </span>
                )}
              </div>

              <dl className="mt-8 space-y-4 text-sm">
                <div className="flex justify-between border-b border-line pb-3">
                  <dt className="text-muted">GPU</dt>
                  <dd className="font-mono text-ink">{t.gpu}</dd>
                </div>
                <div className="flex justify-between border-b border-line pb-3">
                  <dt className="text-muted">Resolution</dt>
                  <dd className="font-mono text-ink">{t.res}</dd>
                </div>
                <div className="flex justify-between border-b border-line pb-3">
                  <dt className="text-muted">Frame rate</dt>
                  <dd className="font-mono text-ink">{t.fps}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Ray tracing</dt>
                  <dd className="font-mono text-ink">{t.ray}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    n: "01",
    title: "Pick a title",
    copy: "Connect the storefronts you already own, or grab something new from the Nimbus library. Your save files and settings travel with you.",
  },
  {
    n: "02",
    title: "We render it",
    copy: "The game boots on a dedicated GPU in the data center closest to you. It's your own instance, not a shared session, so nothing throttles mid-match.",
  },
  {
    n: "03",
    title: "You just watch and play",
    copy: "Video streams to your screen, your inputs stream back, and the loop repeats around sixty times a second. The hardware stays invisible.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-28 border-t border-line">
      <div className="container-px">
        <div className="flex items-center gap-2 mb-6">
          <span className="section-label">The loop</span>
          <span className="signal-line flex-1 max-w-16" />
        </div>
        <h2 className="font-display font-semibold text-[clamp(1.9rem,4vw,3.1rem)] tracking-tight max-w-2xl text-balance text-ink">
          Three steps, repeated sixty times a second
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-px bg-line rounded-2xl overflow-hidden">
          {steps.map((s) => (
            <div key={s.n} className="bg-void p-8 md:p-10">
              <span className="font-mono text-aqua text-sm">{s.n}</span>
              <h3 className="font-display font-medium text-2xl mt-4 mb-3 text-ink">
                {s.title}
              </h3>
              <p className="text-muted leading-relaxed">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

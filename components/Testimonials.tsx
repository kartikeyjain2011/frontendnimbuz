const quotes = [
  {
    quote:
      "I sold my desktop and didn't lose a single save file. My old GPU couldn't have run this at 1440p anyway.",
    name: "R. Sen",
    role: "Priority plan, 8 months",
  },
  {
    quote:
      "The queue on Free plan taught me to plan ahead, but Priority just opens straight in. Worth the switch.",
    name: "A. Fernandes",
    role: "Priority plan, 3 months",
  },
  {
    quote:
      "Started on my phone during a commute, finished the same fight on my TV that night. Didn't think about it once.",
    name: "K. Iyer",
    role: "Ultra plan, 1 year",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 md:py-32 border-t border-line">
      <div className="container-px">
        <div className="flex items-center gap-2 mb-6">
          <span className="section-label">Word of mouth</span>
          <span className="signal-line flex-1 max-w-16" />
        </div>
        <h2 className="font-display font-semibold text-3xl md:text-5xl tracking-tight max-w-xl text-balance">
          What playing without hardware feels like
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {quotes.map((q) => (
            <figure key={q.name} className="rounded-2xl border border-line bg-panel/60 p-8 flex flex-col">
              <blockquote className="text-ink leading-relaxed flex-1">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 pt-6 border-t border-line text-sm">
                <div className="text-ink">{q.name}</div>
                <div className="text-muted mt-0.5">{q.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

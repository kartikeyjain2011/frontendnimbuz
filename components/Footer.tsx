const columns = [
  {
    title: "Product",
    links: ["Library", "Devices", "Performance", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Contact"],
  },
  {
    title: "Support",
    links: ["Help center", "System check", "Status", "Community"],
  },
  {
    title: "Legal",
    links: ["Terms", "Privacy", "Refunds"],
  },
];

export default function Footer() {
  return (
    <>
      <section className="relative py-24 md:py-32 border-t border-line overflow-hidden">
        <div className="absolute inset-0 bg-aurora-1 opacity-70" />
        <div className="container-px relative text-center">
          <h2 className="font-display font-semibold text-3xl md:text-6xl tracking-tight text-balance max-w-3xl mx-auto">
            Your next session is <span className="gradient-text">11ms</span> away
          </h2>
          <p className="mt-6 text-muted max-w-md mx-auto">
            No install, no queue on paid plans, no hardware to outgrow.
          </p>
          <a
            href="#pricing"
            className="mt-10 inline-flex items-center rounded-full bg-cyan text-void font-medium px-8 py-4 hover:shadow-glow transition-shadow"
          >
            Start streaming free
          </a>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="container-px py-16 grid sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)] gap-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan" />
              <span className="font-display font-semibold text-lg text-ink">
                NIMBUS
              </span>
            </div>
            <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
              Cloud rendering for every screen you own. Built for the moment
              you want to play, not the moment your hardware is ready.
            </p>
          </div>

          {columns.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-medium text-ink mb-4">{c.title}</h4>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      className="text-sm text-muted hover:text-ink transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="container-px py-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <span>© {new Date().getFullYear()} Nimbus Cloud Gaming. All rights reserved.</span>
          <span className="font-mono">Nearest node: Mumbai · 11ms</span>
        </div>
      </footer>
    </>
  );
}

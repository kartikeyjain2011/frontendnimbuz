const games = [
  { title: "Aether Drift", genre: "Racing", from: "#FFFFFF", to: "#18181B" },
  { title: "Hollow Signal", genre: "Horror", from: "#D4D4D8", to: "#09090B" },
  { title: "Ferrous Dawn", genre: "Strategy", from: "#A1A1AA", to: "#000000" },
  { title: "Cinder Vale", genre: "RPG", from: "#E4E4E7", to: "#27272A" },
  { title: "Nightglass", genre: "Shooter", from: "#52525B", to: "#18181B" },
  { title: "Paperlung", genre: "Platformer", from: "#FFFFFF", to: "#3F3F46" },
];

export default function GameLibrary() {
  return (
    <section id="library" className="relative py-24 md:py-32 border-t border-line">
      <div className="container-px">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="section-label">Library</span>
              <span className="signal-line flex-1 max-w-16" />
            </div>
            <h2 className="font-display font-semibold text-3xl md:text-5xl tracking-tight max-w-xl text-balance">
              Over 2,400 titles, already installed
            </h2>
          </div>
          <p className="text-muted max-w-sm">
            Every game on Nimbus lives on the server, fully patched and ready.
            Close your laptop mid-boss-fight and pick it back up on your TV.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {games.map((g) => (
            <div key={g.title} className="group cursor-pointer">
              <div
                className="aspect-[3/4] rounded-xl relative overflow-hidden border border-line transition-transform duration-300 group-hover:-translate-y-1.5"
                style={{
                  background: `linear-gradient(155deg, ${g.from} 0%, ${g.to} 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-void/25 group-hover:bg-void/0 transition-colors" />
              </div>
              <div className="mt-3">
                <div className="text-sm font-medium text-ink">{g.title}</div>
                <div className="text-xs text-muted mt-0.5">{g.genre}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <a
            href="#pricing"
            className="text-sm text-cyan hover:text-ink transition-colors inline-flex items-center gap-1.5"
          >
            See the full catalog →
          </a>
        </div>
      </div>
    </section>
  );
}

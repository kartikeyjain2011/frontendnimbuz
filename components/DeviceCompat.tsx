const devices = [
  {
    name: "TV",
    detail: "4K HDR, up to 120fps with the Nimbus app or a browser-capable smart TV.",
  },
  {
    name: "Laptop",
    detail: "Play in any modern browser. No drivers, no downloads, no fans spinning up.",
  },
  {
    name: "Phone",
    detail: "Pair a controller over Bluetooth or use touch controls tuned per title.",
  },
  {
    name: "Tablet",
    detail: "The same save file, the same settings, picked up mid-scene.",
  },
];

export default function DeviceCompat() {
  return (
    <section id="devices" className="relative py-24 md:py-32 border-t border-line">
      <div className="container-px">
        <div className="flex items-center gap-2 mb-6">
          <span className="section-label">Everywhere</span>
          <span className="signal-line flex-1 max-w-16" />
        </div>
        <h2 className="font-display font-semibold text-3xl md:text-5xl tracking-tight max-w-xl text-balance">
          One screen, then another, without losing your place
        </h2>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {devices.map((d) => (
            <div
              key={d.name}
              className="card-panel rounded-2xl p-7 hover:border-cyan/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-full border border-line flex items-center justify-center mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
              </div>
              <h3 className="font-display font-medium text-xl mb-2">{d.name}</h3>
              <p className="text-sm text-muted leading-relaxed">{d.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

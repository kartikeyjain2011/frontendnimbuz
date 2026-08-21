import { Lock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { PAYMENT_BADGES } from "./PaymentBadges";

function InstagramMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

const columns = [
  {
    title: "Product",
    links: ["Library", "Devices", "How it works", "Pricing"],
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
      {/* CTA band */}
      <section className="relative py-24 md:py-32 border-t border-line overflow-hidden">
        <div className="absolute inset-0 bg-aurora-3 opacity-70" />
        <div className="noise-overlay" />
        <div className="container-px relative text-center">
          <h2 className="font-display font-semibold text-[clamp(2rem,5vw,3.8rem)] tracking-tight text-balance max-w-3xl mx-auto text-ink">
            Your next session is{" "}
            <span className="gradient-text">11ms</span> away
          </h2>
          <p className="mt-6 text-muted max-w-md mx-auto">
            No install, no queue on paid plans, no hardware to outgrow.
          </p>
          <a
            href="#pricing"
            className="mt-10 inline-flex items-center rounded-full bg-plasma-sweep text-white font-medium px-8 py-4 hover:shadow-glow transition-shadow"
          >
            Start streaming free
          </a>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="container-px py-16 grid sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)] gap-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-aqua shadow-glow-aqua" />
              <span className="font-display font-semibold text-lg text-ink">
                NIMBUS
              </span>
            </div>
            <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
              Cloud rendering for every screen you own. Built for the moment
              you want to play, not the moment your hardware is ready.
            </p>

            <a
              href="https://www.instagram.com/playnimbuzcom"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Nimbus on Instagram"
              className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] pl-3 pr-4 py-2 text-sm text-muted hover:text-ink hover:border-line-strong hover:shadow-glow-magenta transition-all"
            >
              <InstagramMark className="w-4 h-4 text-plasma-bright" />
              <span>@playnimbuzcom</span>
            </a>
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

        <div className="container-px py-8 border-t border-line grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-12">
          <div>
            <h4 className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              <MapPin className="w-3.5 h-3.5 text-aqua" />
              Registered office
            </h4>
            <address className="mt-3 not-italic text-sm leading-6">
              <span className="block font-medium text-ink">
                Lemonade Digital Media Technology Private Limited
              </span>
              <span className="block text-muted">
                91 Spring Board, Jhandewalan, Delhi&#8209;110055
              </span>
            </address>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              <Phone className="w-3.5 h-3.5 text-aqua" />
              Phone
            </h4>
            <a
              href="tel:+918588000993"
              className="mt-3 inline-block text-sm leading-6 text-ink hover:text-aqua transition-colors"
            >
              +91 85880 00993
            </a>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              <Mail className="w-3.5 h-3.5 text-aqua" />
              Email
            </h4>
            <a
              href="mailto:hi@playnimbuz.com"
              className="mt-3 inline-block text-sm leading-6 text-ink hover:text-aqua transition-colors"
            >
              hi@playnimbuz.com
            </a>
          </div>
        </div>

        <div className="container-px py-8 border-t border-line flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h4 className="text-xs font-medium text-ink mb-3">
              Secure payments accepted
            </h4>
            <ul className="flex flex-wrap items-center gap-2.5">
              {PAYMENT_BADGES.map(({ name, Mark }) => (
                <li
                  key={name}
                  title={name}
                  className="h-9 px-3 rounded-lg border border-line bg-white/[0.03] flex items-center gap-1.5 hover:border-line-strong transition-colors"
                >
                  <Mark />
                </li>
              ))}
            </ul>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
            <li className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-aqua" />
              256-bit SSL encrypted
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-aqua" />
              PCI DSS compliant gateway
            </li>
          </ul>
        </div>

        <div className="container-px py-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted text-center sm:text-left">
          <span>
            © {new Date().getFullYear()} Lemonade Digital Media Technology
            Private Limited. All rights reserved.
          </span>
          <span className="font-mono">Nearest node: Mumbai · 11ms</span>
        </div>
      </footer>
    </>
  );
}

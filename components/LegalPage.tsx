import type { ReactNode } from "react";
import {
  Building2,
  FileText,
  Mail,
  MapPin,
  Phone,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/** Shared body-copy classes so every legal page reads identically. */
export const P = "text-[15px] leading-7 text-muted";
export const STRONG = "font-medium text-ink";
export const LINK = "text-aqua hover:text-aqua-bright transition-colors";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-aqua" />
          <span className={P}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Highlighted box for the one clause on a page that must not be missed. */
export function Callout({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-plasma/40 bg-plasma/[0.07] p-5 sm:p-6">
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-plasma-bright">
        <Icon className="h-4 w-4" />
        {label}
      </p>
      <div className="mt-3 text-[15px] leading-7 text-ink">{children}</div>
    </div>
  );
}

const COMPANY = [
  {
    label: "Legal entity",
    value: "Lemonade Digital Media Technology Private Limited",
    Icon: Building2,
  },
  { label: "CIN", value: "U72900DL2021PTC388171", Icon: FileText, mono: true },
  { label: "GSTIN", value: "07AAECL7835P1ZT", Icon: Receipt, mono: true },
  {
    label: "Registered office",
    value: "91 Spring Board, Jhandewalan, Delhi-110055",
    Icon: MapPin,
  },
  {
    label: "Phone",
    value: "+91 85880 00993",
    href: "tel:+918588000993",
    Icon: Phone,
  },
  {
    label: "Email",
    value: "hi@playnimbuz.com",
    href: "mailto:hi@playnimbuz.com",
    Icon: Mail,
  },
];

/** Registered-entity details card, shared by every legal page. */
export function CompanyDetails() {
  return (
    <dl className="mt-6 grid gap-x-10 gap-y-5 rounded-2xl border border-line bg-panel/60 p-6 sm:grid-cols-2">
      {COMPANY.map(({ label, value, href, Icon, mono }) => (
        <div key={label}>
          <dt className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            <Icon className="h-3.5 w-3.5 text-aqua" />
            {label}
          </dt>
          <dd
            className={`mt-2 text-sm leading-6 text-ink ${mono ? "font-mono" : ""}`}
          >
            {href ? (
              <a href={href} className="hover:text-aqua transition-colors">
                {value}
              </a>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Page shell for legal documents: aurora header, sticky table of contents and
 * numbered sections. Section numbering is derived from the array order so the
 * contents list can never drift from the headings.
 */
export function LegalPage({
  label,
  heading,
  intro,
  lastUpdated,
  sections,
}: {
  label: string;
  heading: ReactNode;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <main className="bg-void text-ink">
      <Navbar />

      <section className="relative overflow-hidden border-b border-line pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 bg-aurora-3 opacity-70" />
        <div className="noise-overlay" />
        <div className="container-px relative">
          <p className="section-label">{label}</p>
          <h1 className="mt-4 font-display font-semibold tracking-tight text-balance text-[clamp(2.25rem,5vw,3.75rem)] text-ink">
            {heading}
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-7 text-muted">
            {intro}
          </p>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-2 font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua shadow-glow-aqua" />
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <div className="container-px grid gap-12 py-16 lg:grid-cols-[16rem_1fr] lg:gap-16 lg:py-20">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            On this page
          </h2>
          <nav className="mt-4">
            <ol className="space-y-2.5">
              {sections.map((s, i) => (
                <li key={s.id} className="flex gap-3">
                  <span className="font-mono text-xs leading-6 text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${s.id}`}
                    className="text-sm leading-6 text-muted transition-colors hover:text-aqua"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="max-w-3xl space-y-14">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-aqua">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  {s.title}
                </h2>
              </div>
              <span className="signal-line mt-5" />
              <div className="mt-5">{s.body}</div>
            </section>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}

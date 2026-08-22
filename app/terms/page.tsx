import type { Metadata } from "next";
import { Gamepad2 } from "lucide-react";
import {
  Bullets,
  Callout,
  CompanyDetails,
  LegalPage,
  LINK,
  P,
  STRONG,
  type LegalSection,
} from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — Nimbus Cloud Gaming",
  description:
    "The terms on which Lemonade Digital Media Technology Private Limited provides the Nimbus cloud gaming service, covering accounts, subscriptions, acceptable use and liability.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    body: (
      <>
        <p className={P}>
          These Terms &amp; Conditions form a binding agreement between you and{" "}
          <span className={STRONG}>
            Lemonade Digital Media Technology Private Limited
          </span>{" "}
          (&ldquo;Nimbus&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or
          &ldquo;our&rdquo;), the company that operates the Nimbus cloud gaming
          service. &ldquo;Service&rdquo; means our website, dashboard, streaming
          clients and the cloud rendering infrastructure behind them.
        </p>
        <p className={`${P} mt-4`}>
          By creating an account, purchasing a subscription or streaming a
          session, you confirm that you accept these terms, our{" "}
          <a href="/privacy" className={LINK}>
            Privacy Policy
          </a>{" "}
          and our{" "}
          <a href="/refunds" className={LINK}>
            Refund Policy
          </a>
          , which are incorporated into this agreement by reference. If you do
          not accept them, please do not use the Service.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility",
    body: (
      <p className={P}>
        You must be at least 18 years old and legally capable of entering into a
        contract under Indian law to hold a Nimbus account. If you are under 18,
        you may use the Service only through an account held by a parent or
        lawful guardian who accepts these terms on your behalf and remains
        responsible for all activity on it. You must also ensure that using the
        Service is lawful in the place you are streaming from.
      </p>
    ),
  },
  {
    id: "your-account",
    title: "Your account",
    body: (
      <Bullets
        items={[
          "You must register with accurate details and keep them up to date. Accounts created with false information may be suspended.",
          "One account per person. Your credentials are personal to you and must be kept confidential.",
          "You are responsible for all activity that takes place under your account, including purchases and renewals.",
          "Tell us immediately if you suspect unauthorised access, and change your password. We may reset credentials or lock an account where we believe it has been compromised.",
          "Accounts are not transferable and cannot be sold, gifted or inherited, although unused gift card credit may be applied to another Nimbus account as described in the Refund Policy.",
        ]}
      />
    ),
  },
  {
    id: "what-we-provide",
    title: "What Nimbus provides",
    body: (
      <>
        <p className={P}>
          Nimbus renders games on server-grade hardware in a data centre and
          streams the video and audio to your device while sending your input
          back. A subscription buys you access to that rendering capacity for the
          duration of your billing cycle, at the performance tier described on
          your plan.
        </p>
        <Callout icon={Gamepad2} label="What a subscription is not">
          A Nimbus subscription is access to streaming hardware, not a licence to
          the games themselves. Except for titles we expressly include in a
          plan, you need to already own a game, or buy it from the relevant
          storefront, before you can stream it.
        </Callout>
        <p className={`${P} mt-5`}>
          Resolution, frame rate and latency figures quoted on our website
          describe what the platform is capable of under good conditions. They
          are targets rather than guarantees, because the experience you actually
          get depends on your connection, your distance from the nearest node and
          your own hardware.
        </p>
      </>
    ),
  },
  {
    id: "games-and-licences",
    title: "Games, licences and third-party storefronts",
    body: (
      <Bullets
        items={[
          "You are responsible for holding a valid licence to every game you stream, and for complying with that publisher's own end-user licence agreement and terms of service.",
          "Where you link a storefront account such as Steam, Epic, GOG, Ubisoft, Xbox or Rockstar, you authorise us to use that link solely to verify your entitlement and launch titles you own.",
          "Publishers add and withdraw titles from cloud streaming at their discretion. A game being playable today is not a promise that it will remain in the catalogue, and its removal is not a defect in the Service.",
          "Purchases you make on a third-party storefront are contracts between you and that storefront. Their pricing, refund and support policies apply, not ours.",
          "Some publishers restrict cloud streaming or apply region locks. We are not able to override those restrictions.",
        ]}
      />
    ),
  },
  {
    id: "billing",
    title: "Subscriptions, billing and auto-renewal",
    body: (
      <Bullets
        items={[
          <>
            Plans are sold in Indian Rupees and are inclusive of applicable GST
            unless stated otherwise. Payments are processed by{" "}
            <span className={STRONG}>Razorpay</span> using UPI, cards, net
            banking or wallets.
          </>,
          "Subscriptions renew automatically at the end of each billing cycle using your selected payment method, until you cancel. You can cancel at any time from your dashboard.",
          "Multi-month plans are billed as a single upfront payment for the whole committed term, at the discounted rate shown at checkout.",
          "If a renewal payment fails, we may retry it and may suspend access until payment succeeds.",
          "We may change plan pricing or composition. Changes take effect from your next billing cycle and we will give you notice beforehand so you can cancel if you disagree.",
          "You are responsible for keeping your billing details current and for any bank or gateway charges levied by your own provider.",
        ]}
      />
    ),
  },
  {
    id: "refunds",
    title: "Refunds, cancellation and gift card credit",
    body: (
      <p className={P}>
        Cancellation stops your next renewal and your access continues to the end
        of the cycle you have paid for. Where we approve a refund, it is issued as
        Nimbus gift card credit for the full value paid rather than a reversal to
        your bank, card or UPI handle, except for failed, duplicated or
        unauthorised charges, which are returned to the original payment method.
        The eligibility rules, request window, timelines and gift card terms are
        set out in full in our{" "}
        <a href="/refunds" className={LINK}>
          Refund Policy
        </a>
        , which forms part of these terms.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p className={P}>You agree not to:</p>
        <Bullets
          items={[
            "Share, sell, rent or transfer your account or credentials, or allow anyone outside your household to stream on your subscription.",
            "Use cheats, aimbots, trainers, memory editors or unauthorised modifications, or otherwise gain an unfair advantage in multiplayer games.",
            "Resell, sublicense or commercially redistribute access to the Service, including operating it as a paid gaming café or shared terminal, without our written agreement.",
            "Attempt to access the underlying virtual machines, storage, networks or administrative interfaces, or escape the sandbox your session runs in.",
            "Reverse engineer, decompile, scrape or benchmark the Service for a competing product, or use bots and automation to reserve or hold capacity.",
            "Interfere with the Service or place a disproportionate load on it, including running mining, rendering, training or other non-gaming compute workloads on our hardware.",
            "Upload, stream or store unlawful, infringing, malicious or abusive content, or harass other users and our staff.",
            "Circumvent region locks, entitlement checks, usage limits or payment controls.",
          ]}
        />
        <p className={`${P} mt-5`}>
          You are responsible for everything that happens on your account. If you
          become aware of a breach of these rules involving your account, tell us
          promptly.
        </p>
      </>
    ),
  },
  {
    id: "availability",
    title: "Service availability, maintenance and support",
    body: (
      <>
        <p className={P}>
          We work hard to keep Nimbus available, but we do not commit to a
          specific uptime figure unless we have agreed one with you in writing.
          Capacity is finite, and on free plans you may be placed in a queue
          during periods of heavy demand.
        </p>
        <p className={`${P} mt-4`}>
          We may carry out planned maintenance, and will try to schedule it
          outside peak hours and give notice where practical. We may also need to
          suspend the Service at short notice to deal with a security incident,
          a fault or an instruction from a supplier or authority. Support is
          provided by email and phone during business hours; response targets for
          refund requests are set out in the Refund Policy.
        </p>
        <p className={`${P} mt-4`}>
          Neither party is liable for failure to perform caused by events beyond
          reasonable control, including internet or power failure, network
          congestion at your ISP, data centre outage, natural disaster, strike,
          war, epidemic, or a change in law or government direction.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <>
        <p className={P}>
          The Nimbus name, logo, website, software, interfaces and the design and
          arrangement of the Service are owned by us or licensed to us, and are
          protected by Indian and international intellectual property law. We
          grant you a limited, personal, non-exclusive, non-transferable and
          revocable licence to use the Service for your own non-commercial
          gaming, for as long as you comply with these terms.
        </p>
        <p className={`${P} mt-4`}>
          Nothing in these terms transfers ownership of our intellectual property
          to you. Game titles, artwork, trailers and trade marks remain the
          property of their respective publishers. If you send us suggestions or
          feedback, you allow us to use them to improve the Service without
          obligation or payment to you.
        </p>
      </>
    ),
  },
  {
    id: "your-content",
    title: "Your content and saved game data",
    body: (
      <p className={P}>
        You keep ownership of your saved games, screenshots, recordings and other
        content you create through the Service. You grant us the limited licence
        we need to host, copy, transmit and back that content up in order to
        provide the Service to you. We are not a backup provider: while we take
        reasonable care of save data, you should not rely on Nimbus as the only
        copy of anything you cannot afford to lose. Content that breaches these
        terms or the law may be removed.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Suspension and termination",
    body: (
      <>
        <p className={P}>
          You can stop using the Service and close your account at any time.
          Closing your account does not automatically refund amounts already
          paid; the Refund Policy governs that.
        </p>
        <p className={`${P} mt-4`}>
          We may suspend or terminate your account, with notice where reasonably
          practical, if you breach these terms, if your payment method fails
          repeatedly, if we detect fraud, chargeback abuse or credential sharing,
          if required by law, or if we discontinue the Service. Where we
          terminate for a reason that is not your fault, we will issue gift card
          credit for the unused portion of your billing cycle. On termination,
          your licence to use the Service ends immediately, and we may delete
          your save data after a reasonable retention period.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: (
      <p className={P}>
        Except as expressly stated in these terms and as required by applicable
        law, the Service is provided on an &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; basis. We do not warrant that the Service will be
        uninterrupted, error free or free of latency, that any particular game or
        performance tier will always be available, or that it will be compatible
        with every device, browser, controller or network configuration. Any
        performance figures we publish are indicative. Nothing in this section
        excludes liability that cannot lawfully be excluded, including for death
        or personal injury caused by negligence, or for fraud.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <>
        <p className={P}>
          To the maximum extent permitted by law, we are not liable for indirect,
          incidental, special or consequential loss, or for loss of profits,
          revenue, goodwill, data, save files, in-game progress, ranking or
          competitive standing, however caused.
        </p>
        <p className={`${P} mt-4`}>
          Our total aggregate liability arising out of or in connection with the
          Service is limited to the amounts you actually paid us in the three
          months immediately before the event giving rise to the claim. This
          limitation does not affect your rights as a consumer under the Consumer
          Protection Act, 2019 or any other liability that cannot lawfully be
          limited.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    body: (
      <p className={P}>
        You agree to indemnify and hold us harmless against claims, damages,
        losses and reasonable legal costs arising from your breach of these terms,
        your misuse of the Service, your infringement of a third party&rsquo;s
        intellectual property or other rights, or content you upload or stream
        through the Service.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Privacy and data protection",
    body: (
      <p className={P}>
        We process personal data in line with our{" "}
        <a href="/privacy" className={LINK}>
          Privacy Policy
        </a>
        , which explains what we collect, why, how long we keep it and the rights
        available to you under the Digital Personal Data Protection Act, 2023. By
        using the Service you consent to that processing. Please read the Privacy
        Policy alongside these terms.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to the Service and these terms",
    body: (
      <p className={P}>
        We may add, change or withdraw features as the Service develops, and we
        may update these terms to reflect those changes or a change in law. The
        revised version will be posted on this page with a new effective date, and
        we will notify you of material changes by email or an in-service notice
        before they take effect. Continuing to use Nimbus after a change takes
        effect means you accept the updated terms. If you do not accept them, you
        may cancel your subscription.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law and dispute resolution",
    body: (
      <p className={P}>
        These terms are governed by the laws of India. Before starting formal
        proceedings, please raise the matter with our Grievance Officer so we have
        a chance to resolve it. Subject to that, the courts at New Delhi have
        exclusive jurisdiction over any dispute arising out of these terms or the
        Service. If any provision of these terms is held unenforceable, the rest
        continues in force. Our failure to enforce a provision is not a waiver of
        it.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Grievance redressal and contact",
    body: (
      <>
        <p className={P}>
          For questions about these terms, or to raise a complaint about the
          Service, contact our Grievance Officer using the details below. We
          acknowledge every grievance and aim to resolve it within thirty days.
        </p>
        <CompanyDetails />
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      label="Legal"
      heading={
        <>
          Terms &amp; <span className="gradient-text">Conditions</span>
        </>
      }
      intro="The rules of the road for using Nimbus: what your subscription buys, what we expect from you, and where each side's responsibility ends."
      lastUpdated="22 August 2026"
      sections={SECTIONS}
    />
  );
}

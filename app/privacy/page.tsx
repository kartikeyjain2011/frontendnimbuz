import type { Metadata } from "next";
import {
  Bullets,
  CompanyDetails,
  LegalPage,
  LINK,
  P,
  STRONG,
  type LegalSection,
} from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Nimbus Cloud Gaming",
  description:
    "How Lemonade Digital Media Technology Private Limited collects, uses, stores and protects your personal data when you use the Nimbus cloud gaming service.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: (
      <>
        <p className={P}>
          Nimbus is a cloud gaming service operated by{" "}
          <span className={STRONG}>
            Lemonade Digital Media Technology Private Limited
          </span>{" "}
          (&ldquo;Nimbus&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or
          &ldquo;our&rdquo;), a company incorporated in India. This Privacy
          Policy explains what personal data we collect when you visit our
          website or stream games through Nimbus, why we collect it, who we share
          it with, and the choices and rights available to you.
        </p>
        <p className={`${P} mt-4`}>
          We handle personal data in accordance with the Digital Personal Data
          Protection Act, 2023, the Information Technology Act, 2000 and the
          rules made under them. By creating an account or using the service you
          confirm that you have read and understood this policy.
        </p>
      </>
    ),
  },
  {
    id: "data-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p className={P}>
          We collect only what we need to run the service, bill you correctly and
          keep your sessions stable.
        </p>
        <Bullets
          items={[
            <>
              <span className={STRONG}>Account information.</span> Your name,
              email address, phone number and password credentials, collected
              when you register or sign in. Authentication is handled by our
              identity provider, and we never see your raw password.
            </>,
            <>
              <span className={STRONG}>Billing information.</span> Your
              subscription plan, billing cycle, transaction amounts, payment
              identifiers and invoice history. Card numbers, UPI PINs and
              net-banking credentials are entered directly with our payment
              gateway and are never stored on our servers.
            </>,
            <>
              <span className={STRONG}>Service usage data.</span> Games launched,
              session start and end times, session duration, saved game data,
              entitlements and the storefront accounts you choose to link.
            </>,
            <>
              <span className={STRONG}>Device and network data.</span> IP
              address, approximate location derived from it, device and operating
              system type, browser version, screen resolution, connected
              controllers, bandwidth, latency, packet loss and frame-rate
              telemetry. We use this to route you to the nearest node and to
              diagnose streaming quality.
            </>,
            <>
              <span className={STRONG}>Support communications.</span> Messages,
              attachments and diagnostic reports you send us when you contact
              support.
            </>,
            <>
              <span className={STRONG}>Cookies and similar technologies.</span>{" "}
              Small files used to keep you signed in, remember preferences and
              measure aggregate site performance.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "how-we-use-data",
    title: "How we use your information",
    body: (
      <Bullets
        items={[
          "To create and administer your account and authenticate you at sign-in.",
          "To deliver the streaming service, allocate cloud rendering capacity and preserve your saved games and settings between sessions.",
          "To process payments, activate or renew subscriptions, issue invoices and handle refunds.",
          "To monitor and improve streaming quality, measure latency and capacity planning, and investigate technical faults.",
          "To provide customer support and respond to your queries and grievances.",
          "To detect, prevent and investigate fraud, account sharing, abuse and breaches of our terms.",
          "To send service-related notices such as billing confirmations, security alerts and changes to our terms. Marketing messages are sent only with your consent and can be turned off at any time.",
          "To comply with applicable law, including tax, accounting and law-enforcement obligations.",
        ]}
      />
    ),
  },
  {
    id: "legal-basis",
    title: "Consent and legal basis",
    body: (
      <>
        <p className={P}>
          We process your personal data on the basis of the consent you give when
          you create an account and accept this policy, and where processing is
          necessary to perform our contract with you or to comply with a legal
          obligation.
        </p>
        <p className={`${P} mt-4`}>
          You may withdraw your consent at any time by writing to{" "}
          <a href="mailto:hi@playnimbuz.com" className={LINK}>
            hi@playnimbuz.com
          </a>
          . Withdrawing consent does not affect processing already carried out,
          and it may mean we can no longer provide the service to you.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments and financial data",
    body: (
      <>
        <p className={P}>
          Subscription payments are processed by{" "}
          <span className={STRONG}>Razorpay</span>, a PCI DSS compliant payment
          gateway, over a 256-bit SSL encrypted connection. Supported methods
          include UPI, Visa, Mastercard and RuPay cards, net banking and wallets.
        </p>
        <p className={`${P} mt-4`}>
          Your full card number, CVV and UPI PIN are captured by the gateway and
          are never transmitted to or stored by Nimbus. We retain only the
          payment reference identifier, the amount, the currency, the method type
          and the status of the transaction, which we need for invoicing,
          reconciliation, refunds and statutory record-keeping.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and tracking",
    body: (
      <>
        <p className={P}>
          We use strictly necessary cookies to maintain your signed-in session
          and to protect against cross-site request forgery. These cannot be
          disabled without breaking the service.
        </p>
        <p className={`${P} mt-4`}>
          We also use limited analytics cookies to understand which features are
          used and where sessions fail, always in aggregate. You can block or
          delete cookies through your browser settings; doing so may require you
          to sign in again and may affect some functionality.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "How we share your information",
    body: (
      <>
        <p className={P}>
          We do not sell your personal data. We share it only in the following
          circumstances, and only to the extent necessary:
        </p>
        <Bullets
          items={[
            <>
              <span className={STRONG}>Payment gateway.</span> To authorise and
              settle transactions, issue refunds and resolve chargebacks.
            </>,
            <>
              <span className={STRONG}>
                Identity and authentication provider.
              </span>{" "}
              To register accounts, verify sign-ins and manage sessions.
            </>,
            <>
              <span className={STRONG}>Cloud infrastructure providers.</span> To
              host our platform and run the rendering nodes that stream your
              games.
            </>,
            <>
              <span className={STRONG}>Game publishers and storefronts.</span>{" "}
              Where you choose to link a storefront account, to verify your
              entitlement to play a title you own.
            </>,
            <>
              <span className={STRONG}>Professional advisers.</span> Our
              auditors, accountants and legal advisers, under duties of
              confidentiality.
            </>,
            <>
              <span className={STRONG}>Authorities.</span> Where disclosure is
              required by law, a court order or a lawful request from a
              government or law-enforcement agency, or to protect our rights and
              the safety of our users.
            </>,
            <>
              <span className={STRONG}>Business transfers.</span> In connection
              with a merger, acquisition or restructuring, subject to the
              recipient honouring this policy.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "retention",
    title: "Data retention",
    body: (
      <>
        <p className={P}>
          We keep your personal data only for as long as your account is active
          or as needed to provide the service. When you close your account we
          delete or anonymise your profile, telemetry and saved game data within
          a reasonable period.
        </p>
        <p className={`${P} mt-4`}>
          Invoices, transaction records and tax documents are retained for the
          period required by Indian tax and company law, currently up to eight
          financial years, even after your account is closed.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect your data",
    body: (
      <>
        <p className={P}>
          We apply reasonable security safeguards appropriate to the sensitivity
          of the data we hold, including encryption of traffic in transit,
          encryption of data at rest, role-based access controls, least-privilege
          administrative access, activity logging and periodic review of our
          systems and dependencies.
        </p>
        <p className={`${P} mt-4`}>
          No method of transmission or storage is completely secure. Please keep
          your credentials confidential, use a unique password and notify us
          immediately if you suspect unauthorised access to your account. In the
          event of a personal data breach we will notify you and the Data
          Protection Board of India as required by law.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p className={P}>Subject to applicable law, you have the right to:</p>
        <Bullets
          items={[
            "Access a summary of the personal data we hold about you and how we process it.",
            "Correct or complete personal data that is inaccurate or out of date.",
            "Request erasure of your personal data where we no longer need it for the purpose it was collected and no legal obligation requires us to keep it.",
            "Withdraw your consent to processing at any time.",
            "Nominate another individual to exercise your rights on your behalf in the event of your death or incapacity.",
            "Raise a grievance with us and, if unresolved, escalate it to the Data Protection Board of India.",
          ]}
        />
        <p className={`${P} mt-5`}>
          You can exercise most of these rights from your account settings, or by
          writing to us using the contact details below. We will respond within
          the timelines prescribed by law and may ask you to verify your identity
          before we act on a request.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's privacy",
    body: (
      <p className={P}>
        Nimbus is not directed at children under 18. Where a user is a child or a
        person with a lawful guardian, we process personal data only with
        verifiable consent from a parent or guardian, and we do not carry out
        behavioural advertising or tracking directed at children. If you believe a
        child has provided us personal data without such consent, contact us and
        we will delete it.
      </p>
    ),
  },
  {
    id: "transfers",
    title: "International data transfers",
    body: (
      <p className={P}>
        Our rendering nodes and service providers may be located outside India.
        Where personal data is transferred abroad, we do so only to jurisdictions
        permitted under Indian law and require the recipient to apply protections
        no less stringent than those described in this policy.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p className={P}>
        We may update this policy to reflect changes in our service, technology or
        legal obligations. The revised version will be posted on this page with a
        new effective date, and material changes will be notified to you by email
        or an in-service notice before they take effect. Continuing to use Nimbus
        after a change takes effect means you accept the updated policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact and grievance redressal",
    body: (
      <>
        <p className={P}>
          For any question about this policy, to exercise your rights, or to
          raise a grievance about how your personal data has been handled, please
          contact our Grievance Officer. We acknowledge every grievance and aim
          to resolve it within thirty days.
        </p>
        <CompanyDetails />
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      label="Legal"
      heading={
        <>
          Privacy <span className="gradient-text">Policy</span>
        </>
      }
      intro="What we collect when you stream on Nimbus, why we collect it, and the control you have over it. Written to be read, not to be skimmed past."
      lastUpdated="22 August 2026"
      sections={SECTIONS}
    />
  );
}

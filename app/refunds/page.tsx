import type { Metadata } from "next";
import { Gift } from "lucide-react";
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
  title: "Refund Policy — Nimbus Cloud Gaming",
  description:
    "How refunds work on Nimbus: approved refunds are issued as a Nimbus gift card for the full value of your original payment rather than a reversal to your bank, card or UPI.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "overview",
    title: "Overview",
    body: (
      <>
        <p className={P}>
          This Refund Policy explains when you can ask for a refund on a Nimbus
          subscription or add-on, how we assess the request, and what you receive
          if we approve it. It applies to every purchase made through the Nimbus
          website or dashboard from{" "}
          <span className={STRONG}>
            Lemonade Digital Media Technology Private Limited
          </span>
          .
        </p>
        <Callout icon={Gift} label="The rule that matters most">
          Approved refunds are issued as a{" "}
          <span className="font-medium">Nimbus gift card</span> for the full
          value of what you paid. We do not send money back to your bank account,
          card or UPI handle.
        </Callout>
        <p className={`${P} mt-5`}>
          Gift card credit never expires unused without notice, carries the full
          value including tax, and can be spent on any plan, renewal or upgrade
          we offer. The narrow set of cases where money is instead returned to
          your original payment method is described in section 09.
        </p>
      </>
    ),
  },
  {
    id: "how-refunds-are-issued",
    title: "How refunds are issued",
    body: (
      <>
        <p className={P}>
          When we approve a refund request, we issue Nimbus gift card credit
          rather than reversing the transaction. In practice this means:
        </p>
        <Bullets
          items={[
            <>
              <span className={STRONG}>Equal value.</span> The gift card is
              issued for the exact amount you paid, in Indian Rupees, inclusive
              of any GST charged on the original invoice. You are not charged a
              processing fee and the value is not discounted.
            </>,
            <>
              <span className={STRONG}>Delivered two ways.</span> The credit is
              added to your Nimbus account balance automatically, and a gift card
              code is emailed to your registered address so you can apply it
              yourself or pass it to another Nimbus account.
            </>,
            <>
              <span className={STRONG}>Spendable immediately.</span> Credit can
              be applied at checkout against a new subscription, a renewal, an
              upgrade to a higher tier or a Cloud PC add-on.
            </>,
            <>
              <span className={STRONG}>No partial loss.</span> If your purchase
              costs less than your balance, the remainder stays on your account
              for the next purchase. If it costs more, you pay only the
              difference using any supported payment method.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "gift-card-terms",
    title: "Nimbus gift card terms",
    body: (
      <Bullets
        items={[
          "Gift card credit is valid for 12 months from the date of issue. We send a reminder to your registered email before it lapses.",
          "Credit is redeemable only against Nimbus products and services. It is not a prepaid payment instrument and cannot be spent anywhere else.",
          "Credit cannot be exchanged for cash, transferred to a bank account, or sold, and it does not earn interest.",
          "A gift card code may be applied to only one Nimbus account. Once applied, the balance belongs to that account.",
          "Balances from multiple gift cards stack, and partial redemptions are allowed until the balance is exhausted.",
          "Gift cards are themselves non-refundable. Where you pay using gift card credit and later qualify for a refund, the amount returns to your gift card balance.",
          "We may void credit that was obtained through fraud, error, or a breach of our terms of service.",
        ]}
      />
    ),
  },
  {
    id: "eligible",
    title: "What qualifies for a refund",
    body: (
      <>
        <p className={P}>
          You can request gift card credit in any of the following situations:
        </p>
        <Bullets
          items={[
            "A persistent technical fault attributable to Nimbus prevented you from streaming, and our support team could not resolve it within a reasonable period.",
            "The service was unavailable for a prolonged or repeated stretch during your paid billing cycle.",
            "You were billed for the wrong plan, the wrong billing cycle, or an amount that does not match the plan you selected.",
            "You accidentally purchased the same subscription twice, or purchased a second plan while an active one was still running.",
            "You were charged for a renewal after you had already cancelled the subscription.",
          ]}
        />
        <p className={`${P} mt-5`}>
          Requests should reach us within{" "}
          <span className={STRONG}>7 days</span> of the charge appearing on your
          statement, and we generally expect fewer than{" "}
          <span className={STRONG}>2 hours</span> of streaming time to have been
          used in that billing cycle.
        </p>
      </>
    ),
  },
  {
    id: "not-eligible",
    title: "What does not qualify",
    body: (
      <Bullets
        items={[
          "Substantial use of the service during the billing cycle, which we treat as the plan having been delivered.",
          "A change of mind after the 7 day request window has closed.",
          "Streaming quality problems caused by your own internet connection, ISP throttling, Wi-Fi conditions, or a device that does not meet our minimum requirements.",
          "Games, downloadable content or currency you bought from a third-party storefront such as Steam, Epic or Ubisoft. Those purchases follow that storefront's own refund policy, not ours.",
          "Free plans, trial periods and promotional credit, none of which involve a payment to refund.",
          "Accounts suspended or terminated for breach of our terms of service, fraud, payment-credential abuse or credential sharing.",
          "Titles becoming unavailable because a publisher withdrew them from the catalogue, where the rest of the service continues to work.",
        ]}
      />
    ),
  },
  {
    id: "how-to-request",
    title: "How to request a refund",
    body: (
      <>
        <p className={P}>
          Email{" "}
          <a href="mailto:hi@playnimbuz.com" className={LINK}>
            hi@playnimbuz.com
          </a>{" "}
          from the address registered to your Nimbus account, or call us on{" "}
          <a href="tel:+918588000993" className={LINK}>
            +91 85880 00993
          </a>
          . Please include:
        </p>
        <Bullets
          items={[
            "The email address on your Nimbus account.",
            "The payment reference identifier from your invoice or payment confirmation.",
            "The date and amount of the charge.",
            "The plan you purchased, and a short description of what went wrong.",
            "Any screenshots, error messages or session timestamps that help us reproduce a technical fault.",
          ]}
        />
        <p className={`${P} mt-5`}>
          We may ask for additional detail to verify the account and the
          transaction before we make a decision.
        </p>
      </>
    ),
  },
  {
    id: "timelines",
    title: "Timelines",
    body: (
      <Bullets
        items={[
          "We acknowledge every refund request within 48 hours of receiving it.",
          "We assess the request and tell you our decision within 7 business days.",
          "Where approved, gift card credit is added to your account and the code emailed to you within 3 business days of the decision.",
          "Where we decline, we explain why and how to escalate the matter to our Grievance Officer.",
        ]}
      />
    ),
  },
  {
    id: "cancellation",
    title: "Cancellation and auto-renewal",
    body: (
      <>
        <p className={P}>
          You can cancel a subscription at any time from your dashboard. There is
          no lock-in and no cancellation fee. Cancelling stops the next renewal;
          your access continues until the end of the cycle you have already paid
          for.
        </p>
        <p className={`${P} mt-4`}>
          Cancelling partway through a cycle does not by itself trigger a refund
          for the unused remainder. If you cancel a long multi-month plan
          significantly early because of a genuine problem with the service, write
          to us and we will consider pro-rata gift card credit for the unused
          months.
        </p>
      </>
    ),
  },
  {
    id: "payment-failures",
    title: "Duplicate, failed and unauthorised payments",
    body: (
      <>
        <p className={P}>
          Gift card credit is how we handle refunds. It is not how we handle
          money that should never have left your account in the first place. In
          the following cases the amount is reversed to your{" "}
          <span className={STRONG}>original payment method</span>, as required by
          Reserve Bank of India directions and our payment gateway&rsquo;s rules:
        </p>
        <Bullets
          items={[
            "A payment was debited but the transaction failed and no subscription was activated.",
            "The gateway or a technical error charged you more than once for the same purchase.",
            "A transaction on your account was unauthorised or fraudulent.",
          ]}
        />
        <p className={`${P} mt-5`}>
          Reversals of this kind are processed through Razorpay to the source
          account, card or UPI handle, and typically settle within 5 to 7
          business days depending on your bank. Nothing in this policy limits any
          right you have under the Consumer Protection Act, 2019 or other
          applicable law.
        </p>
      </>
    ),
  },
  {
    id: "chargebacks",
    title: "Chargebacks",
    body: (
      <p className={P}>
        Please contact us before raising a chargeback or payment dispute with your
        bank. Chargebacks take weeks to resolve and we can almost always settle
        the matter faster. Where a chargeback is raised on an account we believe
        has used the service as purchased, we may suspend that account until the
        dispute is closed, and we may recover any gift card credit already issued
        for the same transaction.
      </p>
    ),
  },
  {
    id: "taxes",
    title: "Taxes and invoices",
    body: (
      <p className={P}>
        GST is charged on your original purchase at the applicable rate and shown
        on your tax invoice. Where we issue gift card credit as a refund, the
        credit covers the full invoice value including the tax component, and we
        raise a credit note against the original invoice where required. Both the
        invoice and the credit note remain available in your dashboard.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p className={P}>
        We may update this policy as our plans and payment options change. The
        revised version will be posted on this page with a new effective date, and
        material changes will be notified to you by email or an in-service notice
        before they take effect. The policy in force on the date of your purchase
        is the one that governs that purchase.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact and grievance redressal",
    body: (
      <>
        <p className={P}>
          If you are unhappy with a refund decision, write to our Grievance
          Officer using the details below. We acknowledge every grievance and aim
          to resolve it within thirty days.
        </p>
        <CompanyDetails />
      </>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPage
      label="Legal"
      heading={
        <>
          Refund <span className="gradient-text">Policy</span>
        </>
      }
      intro="When you can ask for your money back, how quickly we decide, and why what you get back is gift card credit rather than a bank reversal."
      lastUpdated="22 August 2026"
      sections={SECTIONS}
    />
  );
}

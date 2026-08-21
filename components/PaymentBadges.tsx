import type { ReactElement } from "react";

export interface PaymentBadge {
  name: string;
  Mark: () => ReactElement;
}

// ── Brand marks ───────────────────────────────────────────────────────────

function RazorpayMark() {
  return (
    <>
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden="true">
        <path
          fill="#3395FF"
          d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24zM14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902z"
        />
      </svg>
      <span className="text-[11px] font-semibold tracking-tight text-ink">
        Razorpay
      </span>
    </>
  );
}

function UpiMark() {
  return (
    <>
      <svg viewBox="0 0 12 16" className="w-2.5 h-4" aria-hidden="true">
        <path fill="#097939" d="M0 0h4L2.2 16H0z" />
        <path fill="#ED752E" d="M5 0h4L7.2 16h-4z" />
      </svg>
      <span className="text-[11px] font-semibold tracking-wide text-ink">
        UPI
      </span>
    </>
  );
}

function VisaMark() {
  return (
    <span className="text-[13px] font-semibold italic tracking-wider text-[#F7F7FF]">
      VISA
    </span>
  );
}

function MastercardMark() {
  return (
    <>
      <svg viewBox="0 0 30 18" className="w-6 h-4" aria-hidden="true">
        <circle cx="11" cy="9" r="8" fill="#EB001B" />
        <circle cx="19" cy="9" r="8" fill="#F79E1B" fillOpacity="0.85" />
      </svg>
      <span className="text-[11px] font-medium tracking-tight text-ink">
        mastercard
      </span>
    </>
  );
}

function RupayMark() {
  return (
    <span className="text-[12px] font-bold tracking-tight">
      <span className="text-[#0F75BC]">Ru</span>
      <span className="text-[#F58220]">Pay</span>
    </span>
  );
}

function NetBankingMark() {
  return (
    <span className="text-[11px] font-medium tracking-tight text-ink">
      NetBanking
    </span>
  );
}

// ── Exported list ─────────────────────────────────────────────────────────

export const PAYMENT_BADGES: PaymentBadge[] = [
  { name: "Razorpay", Mark: RazorpayMark },
  { name: "UPI", Mark: UpiMark },
  { name: "Visa", Mark: VisaMark },
  { name: "Mastercard", Mark: MastercardMark },
  { name: "RuPay", Mark: RupayMark },
  { name: "NetBanking", Mark: NetBankingMark },
];

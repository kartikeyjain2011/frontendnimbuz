"use client";

import type { SVGProps, ReactElement } from "react";

/** Generic SVG Mark component type */
export type IconMark = (props: SVGProps<SVGSVGElement>) => ReactElement;

export interface Storefront {
  name: string;
  Mark: IconMark;
}

// ── SVG marks ─────────────────────────────────────────────────────────────

function SteamMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.918 4.296 10.852 10.003 11.776l3.587-5.41a3.5 3.5 0 0 1-2.09-4.533l-3.41-1.41a3.999 3.999 0 1 0 5.226-5.226l1.41 3.41a3.5 3.5 0 1 1 4.65 4.65L24 12C24 5.373 18.627 0 12 0z" />
    </svg>
  );
}

function EpicMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 2h18v2h-7v16h-4V4H3V2z" />
    </svg>
  );
}

function GogMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  );
}

function UbisoftMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.93V16h2v.93A7.001 7.001 0 0 0 19 10h1a8 8 0 0 1-9 7.93zM5 10h1a7.001 7.001 0 0 0 6 6.93V18h-2v-.07A8 8 0 0 1 4 10h1zm7-6.93A8 8 0 0 1 20 10h-1a7 7 0 0 0-6-6.93V2h-2v1.07A7 7 0 0 0 5 10H4a8 8 0 0 1 8-6.93z" />
    </svg>
  );
}

function XboxMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM7.246 6.11C8.363 5.265 9.636 4.7 11 4.52c-1.18 1.15-2.4 2.84-3.504 4.93-.3.56-.575 1.13-.82 1.7-.634-1.57-.6-3.4.57-5.04zm1.12 9.4c-1.7-2.12-2.636-4.23-2.9-5.95.8-1.83 1.86-3.5 3.19-4.9C9.714 5.87 10.85 6.1 12 6.1c1.154 0 2.288-.23 3.344-.44 1.33 1.4 2.39 3.07 3.19 4.9-.264 1.72-1.2 3.83-2.9 5.95C14.47 15.2 13.26 14.64 12 14.64c-1.26 0-2.47.56-3.634 1.87zm6.388 2.39C13.637 18.734 12.364 19.3 11 19.48c1.18-1.15 2.4-2.84 3.504-4.93.3-.56.575-1.13.82-1.7.634 1.57.6 3.4-.57 5.04zm.596-6.41a22.2 22.2 0 0 0-1.1-2.46c-.7-1.36-1.5-2.62-2.35-3.66C12.9 5.25 14.2 5.5 15.4 6.11c1.17 1.64 1.2 3.47.57 5.04a18.6 18.6 0 0 0-.62-1.66zM8.6 6.11c-.3.56-.575 1.13-.82 1.7a18.6 18.6 0 0 0-.62 1.66c-.63-1.57-.6-3.4.57-5.04 1.2-.61 2.5-.86 3.5-.74C10.4 4.73 9.5 5.37 8.6 6.11z" />
    </svg>
  );
}

function RockstarMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2 L14.5 9H22L16 13.5L18.5 20.5L12 16L5.5 20.5L8 13.5L2 9H9.5Z" />
    </svg>
  );
}

// ── Exported list ─────────────────────────────────────────────────────────

export const STOREFRONTS: Storefront[] = [
  { name: "Steam", Mark: SteamMark },
  { name: "Epic", Mark: EpicMark },
  { name: "GOG", Mark: GogMark },
  { name: "Ubisoft", Mark: UbisoftMark },
  { name: "Xbox", Mark: XboxMark },
  { name: "Rockstar", Mark: RockstarMark },
];

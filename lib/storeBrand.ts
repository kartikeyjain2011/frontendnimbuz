/**
 * Brand colour data for each storefront.
 * Returns hex, a translucent tint (for backgrounds), and a border colour.
 */

export interface BrandColour {
  hex: string;
  tint: string;
  border: string;
}

const BRANDS: Record<string, BrandColour> = {
  Steam: {
    hex: "#1b9bdb",
    tint: "rgba(27,155,219,0.12)",
    border: "rgba(27,155,219,0.35)",
  },
  Epic: {
    hex: "#e0e0e0",
    tint: "rgba(224,224,224,0.08)",
    border: "rgba(224,224,224,0.25)",
  },
  GOG: {
    hex: "#8a59c4",
    tint: "rgba(138,89,196,0.12)",
    border: "rgba(138,89,196,0.35)",
  },
  Ubisoft: {
    hex: "#0099ff",
    tint: "rgba(0,153,255,0.10)",
    border: "rgba(0,153,255,0.30)",
  },
  Xbox: {
    hex: "#52b043",
    tint: "rgba(82,176,67,0.10)",
    border: "rgba(82,176,67,0.30)",
  },
  "PC Game Pass": {
    hex: "#52b043",
    tint: "rgba(82,176,67,0.10)",
    border: "rgba(82,176,67,0.30)",
  },
  Rockstar: {
    hex: "#fcaf17",
    tint: "rgba(252,175,23,0.10)",
    border: "rgba(252,175,23,0.30)",
  },
};

export function brandFor(name: string): BrandColour | undefined {
  return BRANDS[name];
}

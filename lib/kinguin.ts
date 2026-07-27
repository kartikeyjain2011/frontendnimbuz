// ─── Kinguin Store API & Affiliate Redirect Utility ─────────────────────────
// Official Kinguin marketplace docs: https://www.kinguin.net

export const KINGUIN_CLIENT_ID =
  process.env.NEXT_PUBLIC_KINGUIN_CLIENT_ID || "nimbus_kinguin_partner";

/**
 * Returns a direct Kinguin store redirect URL for any given game title,
 * attaching the Kinguin partner/client ID.
 */
export function getKinguinBuyUrl(gameTitle: string): string {
  const query = encodeURIComponent(gameTitle.trim());
  return `https://www.kinguin.net/catalogsearch/result/index/?q=${query}&r=${KINGUIN_CLIENT_ID}`;
}

/**
 * Returns a direct Kinguin product page redirect if product ID is known
 */
export function getKinguinProductUrl(kinguinId: string | number): string {
  return `https://www.kinguin.net/category/${kinguinId}?r=${KINGUIN_CLIENT_ID}`;
}

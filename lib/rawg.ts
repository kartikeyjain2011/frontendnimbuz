// ─── RAWG API Utility ─────────────────────────────────────────────────────────
// Docs: https://rawg.io/apidocs

const BASE = "https://api.rawg.io/api";
const KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY || "eff2d0fa962b4061bd1a6fab810525d3";

export interface RawgScreenshot {
  id: number;
  image: string;
}

export type RawgGameScreenshot = RawgScreenshot;

export interface RawgGameDetail {
  id: number;
  slug: string;
  name: string;
  description_raw: string;
  released: string;
  background_image: string;
  background_image_additional?: string;
  rating: number;
  rating_top: number;
  metacritic: number | null;
  playtime: number;
  website: string;
  genres: { id: number; name: string; slug: string }[];
  parent_platforms: { platform: { id: number; name: string; slug: string } }[];
  developers: { id: number; name: string }[];
  publishers: { id: number; name: string }[];
  tags: { id: number; name: string; slug: string }[];
}

export interface RawgGame {
  id: number;
  slug: string;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  rating_top: number;
  metacritic: number | null;
  playtime: number;
  short_screenshots: RawgScreenshot[];
  genres: { id: number; name: string; slug: string }[];
  parent_platforms: { platform: { id: number; name: string; slug: string } }[];
  clip: { clip: string; clips: Record<string, string>; preview: string } | null;
}

export interface RawgGamesResponse {
  count: number;
  results: RawgGame[];
}

// Trending / highly-rated recent games
export async function fetchTrendingGames(count = 12): Promise<RawgGame[]> {
  const url = `${BASE}/games?key=${KEY}&ordering=-rating&page_size=${count}&metacritic=75,100&dates=2020-01-01,2025-12-31`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data: RawgGamesResponse = await res.json();
  return data.results;
}

// Latest released games
export async function fetchNewReleases(count = 8): Promise<RawgGame[]> {
  const today = new Date().toISOString().split("T")[0];
  const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const url = `${BASE}/games?key=${KEY}&ordering=-added&page_size=${count}&dates=${yearAgo},${today}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data: RawgGamesResponse = await res.json();
  return data.results;
}

// Games by genre
export async function fetchGamesByGenre(genre: string, count = 6): Promise<RawgGame[]> {
  const url = `${BASE}/games?key=${KEY}&genres=${genre}&ordering=-rating&page_size=${count}&metacritic=70,100`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data: RawgGamesResponse = await res.json();
  return data.results;
}

// Get all screenshots for a single game (for the gallery/video effect)
export async function fetchGameScreenshots(gameId: number | string): Promise<RawgScreenshot[]> {
  const url = `${BASE}/games/${gameId}/screenshots?key=${KEY}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

// Get full details for a single game by ID or slug
export async function fetchGameDetails(gameId: number | string): Promise<RawgGameDetail | null> {
  try {
    const url = `${BASE}/games/${gameId}?key=${KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

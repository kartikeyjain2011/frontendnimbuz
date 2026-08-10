/**
 * Steam CDN helpers + curated FEATURED titles.
 *
 * Steam's movie API returns both an MP4 and a WebM source. The WebM (VP9)
 * stream is served with headers that trigger Chromium's Opaque Response
 * Blocking (ERR_BLOCKED_BY_ORB / MEDIA_ERR_SRC_NOT_SUPPORTED) when loaded
 * cross-origin from a <video> element without CORS. The MP4 (H.264) loads
 * cleanly everywhere, so we use MP4 exclusively.
 */

// ── CDN helpers ─────────────────────────────────────────────────────────────

/** Full-bleed hero backdrop (16:9 header art). */
export const heroBackdrop = (appId: number) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;

/** Portrait cover art (600×900). Used in pricing backdrop tiles. */
export const coverUrl = (appId: number) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;

/** Wide landscape header (460×215). Used in the trailer detail panel. */
export const headerUrl = (appId: number) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;

/** SD MP4 gameplay trailer. maxRes=max gives the highest available quality. */
export const trailerMp4 = (trailerId: number) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${trailerId}/movie480_vp9.webm`;

/** VP9 WebM — kept for completeness but avoid using in <video> cross-origin. */
export const trailerWebm = (trailerId: number) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${trailerId}/movie_max.webm`;

// ── Featured titles ──────────────────────────────────────────────────────────

export interface FeaturedTitle {
  id: string;
  appId: number;
  trailerId: number;
  title: string;
  store: "Steam" | "Epic" | "GOG" | "Ubisoft" | "Xbox";
  genre: string;
  rtx: boolean;
  maxSpec: string;
}

/**
 * Curated list of titles shown in the trailer carousel and hero backdrop.
 * trailerId is the Steam movie ID (found in the Steam store page source).
 */
export const FEATURED: FeaturedTitle[] = [
  {
    id: "cyberpunk",
    appId: 1091500,
    trailerId: 256910947,
    title: "Cyberpunk 2077",
    store: "Steam",
    genre: "Action RPG",
    rtx: true,
    maxSpec: "5K · 360 FPS",
  },
  {
    id: "elden-ring",
    appId: 1245620,
    trailerId: 256841296,
    title: "Elden Ring",
    store: "Steam",
    genre: "Action RPG",
    rtx: false,
    maxSpec: "4K · 120 FPS",
  },
  {
    id: "wukong",
    appId: 2358720,
    trailerId: 256997188,
    title: "Black Myth: Wukong",
    store: "Steam",
    genre: "Action RPG",
    rtx: true,
    maxSpec: "4K · 60 FPS",
  },
  {
    id: "baldurs-gate",
    appId: 1086940,
    trailerId: 256982541,
    title: "Baldur's Gate 3",
    store: "GOG",
    genre: "RPG",
    rtx: false,
    maxSpec: "4K · 60 FPS",
  },
  {
    id: "helldivers",
    appId: 553850,
    trailerId: 256963698,
    title: "Helldivers 2",
    store: "Steam",
    genre: "Co-op Shooter",
    rtx: false,
    maxSpec: "1440p · 120 FPS",
  },
  {
    id: "alan-wake",
    appId: 1966720,
    trailerId: 256949989,
    title: "Alan Wake 2",
    store: "Epic",
    genre: "Survival Horror",
    rtx: true,
    maxSpec: "4K · 60 FPS",
  },
  {
    id: "hogwarts",
    appId: 990080,
    trailerId: 256913920,
    title: "Hogwarts Legacy",
    store: "Steam",
    genre: "Action RPG",
    rtx: true,
    maxSpec: "4K · 60 FPS",
  },
  {
    id: "starfield",
    appId: 1716740,
    trailerId: 256933980,
    title: "Starfield",
    store: "Xbox",
    genre: "Sci-Fi RPG",
    rtx: false,
    maxSpec: "1440p · 60 FPS",
  },
];

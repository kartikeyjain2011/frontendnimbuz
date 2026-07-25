export interface GameDetail {
  id: string;
  title: string;
  genre: string;
  store: "Steam" | "Epic" | "Xbox" | "GOG";
  banner: string;
  description: string;
  rating: string;
  releaseYear: string;
  publisher: string;
  resolution: string;
  rtx: boolean;
  size: string;
  reqGpu: string;
  reqRam: string;
  reqStorage: string;
  tags: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
  inWishlist?: boolean;
  isPurchased?: boolean;
}

export const gamesList: GameDetail[] = [
  {
    id: "cyberpunk",
    title: "Cyberpunk 2077: Phantom Liberty",
    genre: "Action RPG",
    store: "Steam",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=80",
    description: "Phantom Liberty is a new spy-thriller adventure for Cyberpunk 2077. When the orbital shuttle of the President of the NUSA is shot down over Night City, enter the shadows to save her.",
    rating: "9.5/10",
    releaseYear: "2023",
    publisher: "CD PROJEKT RED",
    resolution: "4K / 120 FPS",
    rtx: true,
    size: "70 GB",
    reqGpu: "NVIDIA RTX 4080 / RTX 4090 Cloud Node",
    reqRam: "32 GB DDR5",
    reqStorage: "70 GB NVMe SSD",
    tags: ["Ray Tracing Overdrive", "DLSS 3.5", "Cyberpunk", "Open World"],
    price: 38.99,
    originalPrice: 59.99,
    discount: 35,
    isFeatured: true,
    isOnSale: true,
    isPurchased: true,
  },
  {
    id: "elden-ring",
    title: "Elden Ring: Shadow of the Erdtree",
    genre: "Soulslike",
    store: "Steam",
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80",
    description: "Guided by Miquella, players are summoned to the Land of Shadow, a place obscured by the Erdtree where the goddess Marika first set foot.",
    rating: "9.8/10",
    releaseYear: "2024",
    publisher: "Bandai Namco / FromSoftware",
    resolution: "4K / 120 FPS",
    rtx: false,
    size: "60 GB",
    reqGpu: "NVIDIA RTX 4070 Ti Cloud Node",
    reqRam: "16 GB DDR5",
    reqStorage: "60 GB High-Speed NVMe",
    tags: ["Dark Fantasy", "Difficult", "Atmospheric", "Masterpiece"],
    price: 49.99,
    originalPrice: 59.99,
    discount: 16,
    isFeatured: true,
    isOnSale: true,
    isPurchased: true,
  },
  {
    id: "wukong",
    title: "Black Myth: Wukong",
    genre: "Action RPG",
    store: "Steam",
    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1400&q=80",
    description: "Black Myth: Wukong is an action RPG rooted in Chinese mythology. You shall set out as the Destined One to venture into the challenges ahead to uncover the obscured truth.",
    rating: "9.7/10",
    releaseYear: "2024",
    publisher: "Game Science",
    resolution: "4K / 120 FPS",
    rtx: true,
    size: "130 GB",
    reqGpu: "NVIDIA RTX 4080 Super Node",
    reqRam: "32 GB DDR5",
    reqStorage: "130 GB Gen4 NVMe",
    tags: ["Mythology", "Action", "Full Ray Tracing", "Boss Rush"],
    price: 53.99,
    originalPrice: 59.99,
    discount: 10,
    isFeatured: true,
    isOnSale: true,
    isPurchased: false,
  },
  {
    id: "starfield",
    title: "Starfield Premium Edition",
    genre: "Sci-Fi RPG",
    store: "Xbox",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80",
    description: "Starfield is the first new universe in over 25 years from Bethesda Game Studios. Explore with unparalleled freedom as you answer humanity's greatest mystery.",
    rating: "8.8/10",
    releaseYear: "2023",
    publisher: "Bethesda Softworks",
    resolution: "1440p / 120 FPS",
    rtx: true,
    size: "125 GB",
    reqGpu: "NVIDIA RTX 4080 Super Node",
    reqRam: "32 GB DDR5",
    reqStorage: "125 GB Gen4 NVMe",
    tags: ["Space Exploration", "Open World", "Sci-Fi"],
    price: 44.99,
    originalPrice: 69.99,
    discount: 36,
    isFeatured: false,
    isOnSale: true,
    isPurchased: false,
  },
  {
    id: "helldivers-2",
    title: "Helldivers 2: Super Citizen Edition",
    genre: "FPS",
    store: "Steam",
    banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80",
    description: "The Galaxy's Last Line of Offense. Enlist in the Helldivers and join the fight for Freedom across a hostile galaxy in a fast, frantic third-person shooter.",
    rating: "9.4/10",
    releaseYear: "2024",
    publisher: "PlayStation Publishing",
    resolution: "4K / 120 FPS",
    rtx: false,
    size: "70 GB",
    reqGpu: "NVIDIA RTX 4070 Ti Cloud Node",
    reqRam: "16 GB DDR5",
    reqStorage: "70 GB NVMe SSD",
    tags: ["Co-op", "Shooter", "Action", "Multiplayer"],
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    isFeatured: true,
    isOnSale: true,
    isPurchased: false,
  },
  {
    id: "forza-horizon",
    title: "Forza Horizon 5: Hot Wheels",
    genre: "Racing",
    store: "Xbox",
    banner: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1400&q=80",
    description: "Blast off to the visually stunning Hot Wheels Park in the clouds above Mexico. Experience extreme tracks with over 80 iconic cars.",
    rating: "9.2/10",
    releaseYear: "2022",
    publisher: "Xbox Game Studios",
    resolution: "4K / 120 FPS",
    rtx: true,
    size: "110 GB",
    reqGpu: "NVIDIA RTX 4070 Ti / 4090",
    reqRam: "16 GB DDR5",
    reqStorage: "110 GB NVMe SSD",
    tags: ["Racing", "Photorealism", "Multiplayer"],
    price: 29.99,
    originalPrice: 59.99,
    discount: 50,
    isFeatured: false,
    isOnSale: true,
    isPurchased: true,
  },
  {
    id: "alan-wake-2",
    title: "Alan Wake 2: Night Springs",
    genre: "Horror",
    store: "Epic",
    banner: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1400&q=80",
    description: "A string of ritualistic murders threatens Bright Falls. Saga Anderson, an accomplished FBI agent, arrives to investigate the murders.",
    rating: "9.6/10",
    releaseYear: "2023",
    publisher: "Epic Games Publishing",
    resolution: "4K / 120 FPS",
    rtx: true,
    size: "90 GB",
    reqGpu: "NVIDIA RTX 4090 Ultimate Node",
    reqRam: "32 GB DDR5",
    reqStorage: "90 GB NVMe SSD",
    tags: ["Survival Horror", "Path Tracing", "Psychological"],
    price: 34.99,
    originalPrice: 49.99,
    discount: 30,
    isFeatured: false,
    isOnSale: true,
    isPurchased: false,
  },
  {
    id: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    genre: "Strategy",
    store: "GOG",
    banner: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1400&q=80",
    description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and absolute power.",
    rating: "9.9/10",
    releaseYear: "2023",
    publisher: "Larian Studios",
    resolution: "4K / 60 FPS",
    rtx: false,
    size: "150 GB",
    reqGpu: "NVIDIA RTX 4070 Ti Node",
    reqRam: "32 GB DDR5",
    reqStorage: "150 GB NVMe SSD",
    tags: ["Tactical RPG", "Co-op", "Choices Matter"],
    price: 59.99,
    originalPrice: 59.99,
    discount: 0,
    isFeatured: false,
    isOnSale: false,
    isPurchased: true,
  },
  {
    id: "spiderman-2",
    title: "Marvel's Spider-Man 2: Cloud Edition",
    genre: "Action RPG",
    store: "Steam",
    banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1400&q=80",
    description: "Spider-Men Peter Parker and Miles Morales return for an exciting new adventure in the critically acclaimed Marvel's Spider-Man franchise for PC Cloud.",
    rating: "9.6/10",
    releaseYear: "2024",
    publisher: "PlayStation Publishing",
    resolution: "4K / 120 FPS",
    rtx: true,
    size: "85 GB",
    reqGpu: "NVIDIA RTX 4080 Cloud Node",
    reqRam: "32 GB DDR5",
    reqStorage: "85 GB High-Speed NVMe",
    tags: ["Open World", "Superhero", "Ray Tracing", "Action"],
    price: 49.99,
    originalPrice: 69.99,
    discount: 28,
    isFeatured: true,
    isOnSale: true,
    isPurchased: false,
  },
];

export function getGameById(id: string): GameDetail | undefined {
  return gamesList.find((g) => g.id === id);
}

export function generateActivationKey(gameTitle: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const part = () =>
    Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `NMBUS-${part()}-${part()}-${part()}`;
}

const DEFAULT_PURCHASED = ["cyberpunk", "elden-ring", "forza-horizon", "baldurs-gate-3"];

export function getPurchasedGameIds(): string[] {
  if (typeof window === "undefined") return DEFAULT_PURCHASED;
  try {
    const stored = localStorage.getItem("nimbus_purchased_games");
    if (!stored) {
      localStorage.setItem("nimbus_purchased_games", JSON.stringify(DEFAULT_PURCHASED));
      return DEFAULT_PURCHASED;
    }
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_PURCHASED;
  }
}

export function markGameAsPurchased(id: string): string[] {
  if (typeof window === "undefined") return DEFAULT_PURCHASED;
  try {
    const current = getPurchasedGameIds();
    if (!current.includes(id)) {
      const updated = [...current, id];
      localStorage.setItem("nimbus_purchased_games", JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch (e) {
    return DEFAULT_PURCHASED;
  }
}

export function isGamePurchased(id: string): boolean {
  return getPurchasedGameIds().includes(id);
}

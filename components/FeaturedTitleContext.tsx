"use client";

import { createContext, useContext, useState } from "react";
import { FEATURED, type FeaturedTitle } from "@/lib/steamMedia";

interface FeaturedTitleContextValue {
  index: number;
  title: FeaturedTitle;
  setIndex: (i: number) => void;
}

const FeaturedTitleContext = createContext<FeaturedTitleContextValue | null>(null);

export function FeaturedTitleProvider({ children }: { children: React.ReactNode }) {
  const [index, setIndexRaw] = useState(0);

  const setIndex = (i: number) => {
    const len = FEATURED.length;
    // Wrap around in both directions
    setIndexRaw(((i % len) + len) % len);
  };

  return (
    <FeaturedTitleContext.Provider
      value={{ index, title: FEATURED[index], setIndex }}
    >
      {children}
    </FeaturedTitleContext.Provider>
  );
}

export function useFeaturedTitle(): FeaturedTitleContextValue {
  const ctx = useContext(FeaturedTitleContext);
  if (!ctx) throw new Error("useFeaturedTitle must be used within FeaturedTitleProvider");
  return ctx;
}

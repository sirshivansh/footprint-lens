"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook for responsive breakpoint detection.
 * @param query - CSS media query string (e.g., "(min-width: 641px)")
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Convenience hook for tablet+ detection.
 */
export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 641px)");
}

/**
 * Convenience hook for desktop detection.
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1025px)");
}

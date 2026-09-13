"use client"

import { useEffect, useState } from "react"

type BreakpointMode = "min" | "max"

function getQuery(mode: BreakpointMode, breakpoint: number) {
  return mode === "min"
    ? `(min-width: ${breakpoint}px)`
    : `(max-width: ${breakpoint - 1}px)`
}

function getMatches(query: string) {
  return typeof window === "undefined" ? null : window.matchMedia(query).matches
}

/**
 * Hook to detect whether the current viewport matches a given breakpoint rule.
 * Example:
 *   useIsBreakpoint("max", 768)   // true when width < 768
 *   useIsBreakpoint("min", 1024)  // true when width >= 1024
 */
export function useIsBreakpoint(
  mode: BreakpointMode = "max",
  breakpoint = 768
) {
  const query = getQuery(mode, breakpoint)
  const [trackedQuery, setTrackedQuery] = useState(query)
  const [matches, setMatches] = useState<boolean | null>(() => getMatches(query))

  // Resync state during render when mode/breakpoint change, instead of in an effect
  if (query !== trackedQuery) {
    setTrackedQuery(query)
    setMatches(getMatches(query))
  }

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return !!matches
}

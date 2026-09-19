"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently crossing the middle of the
 * screen (or null when none of the given sections is there).
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const idsKey = ids.join(",");

  useEffect(() => {
    if (!idsKey) return;

    const sections = idsKey
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // A thin horizontal band just above the middle of the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) setActive(id);
          else setActive((current) => (current === id ? null : current));
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [idsKey]);

  return active;
}

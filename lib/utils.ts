import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about our custom tokens (app/globals.css) so that,
// e.g., `text-title` (a size) isn't mistaken for a colour and dropped.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "title", "heading", "lead", "label"],
      spacing: ["gutter", "section", "nav"],
      container: ["page", "narrow"],
      radius: ["card"],
      shadow: ["card", "lift"],
      ease: ["out-expo"],
      animate: ["pulse-soft"],
    },
  },
});

/** Combine class names, letting later Tailwind classes win conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

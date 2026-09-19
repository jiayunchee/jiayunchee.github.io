import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A page section with the site's standard vertical spacing.
 * Give it an `id` (e.g. "about") so the navbar can link to it.
 */
export function Section({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={cn("py-section", className)} {...props} />;
}

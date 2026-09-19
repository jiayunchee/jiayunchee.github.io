import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  /** "page" for most sections, "narrow" for reading-width text */
  size?: "page" | "narrow";
};

/** Centres content and keeps the same side padding at every screen size. */
export function Container({ size = "page", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-gutter",
        size === "page" ? "max-w-page" : "max-w-narrow",
        className,
      )}
      {...props}
    />
  );
}

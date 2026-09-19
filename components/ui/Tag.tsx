import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type TagProps = ComponentPropsWithoutRef<"span"> & {
  /** Tailwind background class for a small colour dot, e.g. "bg-ball-2" */
  dot?: string;
};

export function Tag({ dot, className, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-sm leading-none text-ink-2 transition duration-300 ease-out-expo hover:-translate-y-px hover:border-line-strong hover:text-ink",
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden className={cn("size-1.5 rounded-full", dot)} />}
      {children}
    </span>
  );
}

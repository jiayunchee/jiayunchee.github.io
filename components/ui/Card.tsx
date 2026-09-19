import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type CardProps = ComponentPropsWithoutRef<"div"> & {
  /** Gently lifts on hover. Use for cards you can click. */
  interactive?: boolean;
};

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-card p-6 shadow-card sm:p-7",
        interactive &&
          "transition duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:shadow-lift",
        className,
      )}
      {...props}
    />
  );
}

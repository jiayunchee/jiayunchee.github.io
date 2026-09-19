import { cn } from "@/lib/utils";

const rotation = { right: 0, down: 90, left: 180, "up-right": -45 } as const;

export type ArrowDirection = keyof typeof rotation;

/** A simple arrow icon that sizes itself to the surrounding text. */
export function Arrow({
  direction = "right",
  className,
}: {
  direction?: ArrowDirection;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn("size-[1em] shrink-0", className)}
      style={{ rotate: `${rotation[direction]}deg` }}
    >
      <path
        d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

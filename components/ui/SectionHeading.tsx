import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Small label above the title, e.g. "About" */
  eyebrow?: string;
  /** Optional number shown before the label, e.g. "01" */
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p className="eyebrow mb-5 flex items-center gap-3">
          {index && <span className="text-ink">{index}</span>}
          {index && <span aria-hidden className="h-px w-6 bg-line-strong" />}
          <span>{eyebrow}</span>
        </p>
      )}
      <h2 className="font-serif text-title text-ink">{title}</h2>
      {description && <p className="mt-5 text-lead text-ink-2">{description}</p>}
    </header>
  );
}

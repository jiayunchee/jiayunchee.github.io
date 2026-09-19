"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Tag } from "@/components/ui/Tag";
import type { TimelineEntry } from "@/data/timeline";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/** Year-by-year story: pick a year to read that chapter. */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const id = useId();
  const last = entries.length - 1;
  const nowAt = entries.findIndex((entry) => entry.now);
  const [active, setActive] = useState(nowAt === -1 ? 0 : nowAt);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const entry = entries[active];

  // The track runs from the centre of the first year to the centre of the last
  const inset = 50 / entries.length;
  const along = (index: number) => (last === 0 ? 0 : (index / last) * 100);
  const solidUntil = nowAt === -1 ? last : nowAt;

  const moveTo = (index: number) => {
    const next = (index + entries.length) % entries.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  // Arrow keys, Home and End move between years (standard tabs behaviour)
  const onKeyDown = (event: KeyboardEvent) => {
    const targets: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    moveTo(targets[event.key]);
  };

  return (
    <div>
      <div className="relative">
        {/* Solid line for the past, dashed for what's still ahead */}
        <div
          aria-hidden
          className="absolute top-[23px] h-px"
          style={{ left: `${inset}%`, right: `${inset}%` }}
        >
          <div
            className="absolute inset-y-0 left-0 bg-line-strong"
            style={{ width: `${along(solidUntil)}%` }}
          />
          <div
            className="absolute top-0 right-0 h-0 border-t border-dashed border-line-strong"
            style={{ left: `${along(solidUntil)}%` }}
          />
          <motion.div
            className="absolute inset-y-0 left-0 bg-ink"
            initial={false}
            animate={{ width: `${along(active)}%` }}
            transition={{ duration: 0.7, ease }}
          />
        </div>

        <div
          role="tablist"
          aria-label="My story so far, year by year"
          className="relative grid"
          style={{ gridTemplateColumns: `repeat(${entries.length}, minmax(0, 1fr))` }}
        >
          {entries.map((item, i) => {
            const selected = i === active;
            const reached = i <= active;
            return (
              <button
                key={item.year}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
                className="group flex flex-col items-center gap-2 rounded-xl px-1 pt-3 pb-2 transition-colors duration-300 hover:bg-paper-2/70"
              >
                <span className="relative grid size-[22px] place-items-center">
                  {item.now && (
                    <span
                      aria-hidden
                      className="absolute size-3 animate-ping-soft rounded-full bg-accent/50"
                    />
                  )}
                  <span
                    className={cn(
                      "relative size-3 rounded-full border-[1.5px] transition duration-500 ease-out-expo",
                      reached ? "border-ink bg-ink" : "border-line-strong bg-paper",
                      item.now && reached && "border-accent bg-accent",
                      selected ? "scale-[1.35]" : "group-hover:scale-125",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "font-mono text-[0.8125rem] transition-colors duration-300",
                    selected ? "text-ink" : "text-muted group-hover:text-ink",
                  )}
                >
                  {item.year}
                </span>
                {/* Same height on every year, so all the dots line up */}
                <span className="h-5 font-hand text-lg leading-5 text-accent">
                  {item.now ? "now" : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        className="mt-4"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={entry.year}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.45, ease }}
            className="grid gap-3 rounded-card border border-line bg-card p-6 shadow-card sm:p-8 md:grid-cols-[9rem_1fr] md:gap-10"
          >
            <p aria-hidden className="font-serif text-[3.25rem] leading-none text-line-strong md:text-[4rem]">
              {entry.year}
            </p>
            <div>
              <h3 className="font-serif text-heading">{entry.title}</h3>
              <p className="mt-3 max-w-xl text-ink-2">{entry.description}</p>
              {entry.highlights && (
                <ul aria-label="Highlights" className="mt-5 flex flex-wrap gap-2">
                  {entry.highlights.map((highlight) => (
                    <li key={highlight}>
                      <Tag>{highlight}</Tag>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}

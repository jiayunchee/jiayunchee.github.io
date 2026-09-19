"use client";

import { motion } from "motion/react";
import type { Experience } from "@/data/experience";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ease = [0.16, 1, 0.3, 1] as const;

type YearMonth = { year: number; month: number }; // month is 1–12
const parse = (value: string): YearMonth => {
  const [year, month] = value.split("-").map(Number);
  return { year, month: month || 1 };
};

/** "Jul – Sep 2026", "Dec 2025 – Feb 2026", "2021 – 2023" or "Ongoing" */
function dateLabel(item: Experience, now: YearMonth) {
  if (!item.start) return item.end === "now" ? "Ongoing" : item.end;
  const start = parse(item.start);
  const end = item.end === "now" ? now : parse(item.end);
  if (item.approximate) return `${start.year} – ${item.end === "now" ? "now" : end.year}`;
  const endText = item.end === "now" ? "now" : `${MONTHS[end.month - 1]} ${end.year}`;
  if (start.year === end.year && item.end !== "now") {
    return `${MONTHS[start.month - 1]} – ${endText}`;
  }
  return `${MONTHS[start.month - 1]} ${start.year} – ${endText}`;
}

function lengthLabel(months: number, approximate?: boolean) {
  if (approximate) {
    const years = Math.round(months / 12);
    return `About ${years} year${years === 1 ? "" : "s"}`;
  }
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return `${years} yr${rest ? ` ${rest} mo` : ""}`;
}

/**
 * Where I've worked as rows on a shared year axis, like a tiny Gantt chart.
 * Hover (or tab to) a bar for how long each one lasted.
 */
export function ExperienceTimeline({ items, now }: { items: Experience[]; now: string }) {
  const today = parse(now);
  const firstYear = Math.min(...items.flatMap((item) => (item.start ? [parse(item.start).year] : [])));
  const lastYear = today.year;
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i);
  const span = years.length * 12;
  // Position of the start of a month on the axis, in %
  const at = ({ year, month }: YearMonth) => (((year - firstYear) * 12 + month - 1) / span) * 100;

  return (
    <div>
      {/* Year axis, lined up with the bars */}
      <div aria-hidden className="grid lg:grid-cols-[minmax(0,1fr)_8rem_minmax(0,26rem)] lg:gap-x-8">
        <span className="hidden lg:block" />
        <span className="hidden lg:block" />
        <div className="relative h-6">
          {years.map((year) => (
            <span
              key={year}
              className="absolute top-0 -translate-x-1/2 font-mono text-[0.6875rem] text-muted"
              style={{ left: `${at({ year, month: 7 })}%` }}
            >
              {year}
            </span>
          ))}
        </div>
      </div>

      <ol className="border-t border-line">
        {items.map((item, i) => {
          const label = dateLabel(item, today);
          const start = item.start ? parse(item.start) : null;
          const end = item.end === "now" ? today : parse(item.end);
          const months = start ? (end.year - start.year) * 12 + end.month - start.month + 1 : 0;
          const length = start ? lengthLabel(months, item.approximate) : "Ongoing";
          const left = start ? at(start) : at(today);
          const right = at({ year: end.year, month: end.month + 1 });
          const onRightHalf = (left + right) / 2 > 55;

          const content = (
            <>
              <div className="min-w-0">
                <p className="font-serif text-2xl leading-tight text-ink">
                  {item.company}
                  {item.href && (
                    <span aria-hidden className="ml-2 font-sans text-base text-muted transition-colors group-hover:text-ink">
                      ↓
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-ink-2">{item.role}</p>
              </div>

              <p className="self-start pt-1.5 font-mono text-xs text-muted lg:self-center lg:pt-0 lg:text-right">
                {label}
              </p>

              <div className="relative col-span-2 h-9 lg:col-span-1">
                {years.map((year) => (
                  <span
                    key={year}
                    aria-hidden
                    className="absolute inset-y-0 w-px bg-line"
                    style={{ left: `${at({ year, month: 1 })}%` }}
                  />
                ))}

                {start ? (
                  <motion.span
                    role="img"
                    tabIndex={item.href ? undefined : 0}
                    aria-label={`${item.company}: ${label}, ${length.toLowerCase()}`}
                    className="absolute top-1/2 h-2.5 origin-left -translate-y-1/2 rounded-full bg-accent outline-offset-4 transition-colors duration-300 group-hover:bg-ink focus-visible:bg-ink"
                    style={{
                      left: `${left}%`,
                      width: `${right - left}%`,
                      maskImage: item.approximate
                        ? "linear-gradient(to right, transparent, #000 22%, #000 78%, transparent)"
                        : undefined,
                    }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.06 }}
                  />
                ) : (
                  // Still going: a pulsing "now" dot with a dashed line running on
                  <>
                    <span
                      aria-hidden
                      className="absolute top-1/2 right-0 h-0 border-t border-dashed border-accent"
                      style={{ left: `${left}%` }}
                    />
                    <span
                      role="img"
                      tabIndex={item.href ? undefined : 0}
                      aria-label={`${item.company}: ongoing`}
                      className="absolute top-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-offset-2"
                      style={{ left: `${left}%` }}
                    >
                      <span className="absolute size-3 animate-ping-soft rounded-full bg-accent" />
                      <span className="relative size-3 rounded-full bg-accent ring-2 ring-card" />
                    </span>
                  </>
                )}

                {/* Hover / focus card: the length leads, the dates follow */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute bottom-full mb-1 w-max rounded-lg bg-ink px-2.5 py-1.5 text-xs text-paper opacity-0 shadow-lift transition duration-200 group-focus-within:opacity-100 group-hover:opacity-100",
                    onRightHalf ? "-translate-x-full" : "",
                  )}
                  style={{ left: `${onRightHalf ? right : left}%` }}
                >
                  <span className="font-semibold">{length}</span>
                  {start && <span className="text-paper/70"> · {label}</span>}
                </span>
              </div>
            </>
          );

          const rowClasses =
            "group -mx-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-3 rounded-xl px-3 py-5 transition-colors duration-300 hover:bg-paper-2/70 lg:grid-cols-[minmax(0,1fr)_8rem_minmax(0,26rem)] lg:gap-x-8";

          return (
            <li key={item.company} className="border-b border-line">
              {item.href ? (
                <a href={item.href} className={rowClasses}>
                  {content}
                </a>
              ) : (
                <div className={rowClasses}>{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

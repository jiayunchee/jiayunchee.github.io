"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { fitness, shareWhoCanBench } from "@/data/fitness";
import { cn } from "@/lib/utils";

const BAR_KG = 20;
const MAX_PER_SIDE = 6;
const RAREST = 6; // the scale runs from "everyone" to 1 in 10^6

// Competition plate colours, borrowed from the site's pool-ball palette
const PLATES = [
  { kg: 25, colour: "bg-ball-3", bar: "h-24 w-4", face: "size-11 sm:size-12" },
  { kg: 20, colour: "bg-ball-2", bar: "h-24 w-3.5", face: "size-11 sm:size-12" },
  { kg: 15, colour: "bg-ball-1", bar: "h-20 w-3", face: "size-10 sm:size-11" },
  { kg: 10, colour: "bg-ball-6", bar: "h-16 w-3", face: "size-9 sm:size-10" },
  { kg: 5, colour: "bg-card ring-1 ring-inset ring-line-strong", bar: "h-12 w-2.5", face: "size-8 sm:size-9" },
  { kg: 2.5, colour: "bg-ink", bar: "h-9 w-2", face: "size-7 sm:size-8" },
] as const;

type Kg = (typeof PLATES)[number]["kg"];
type Loaded = { id: number; kg: Kg };

const spec = (kg: Kg) => PLATES.find((p) => p.kg === kg) ?? PLATES[0];
const heaviestFirst = (a: Loaded, b: Loaded) => b.kg - a.kg || a.id - b.id;

function formatShare(share: number) {
  const pct = share * 100;
  if (pct >= 10) return `${Math.round(pct)}%`;
  if (pct >= 1) return `${pct.toFixed(1)}%`;
  if (pct >= 0.1) return `${pct.toFixed(2)}%`;
  return `${Number(pct.toPrecision(1))}%`;
}

function oneIn(share: number) {
  const n = 1 / share;
  if (n < 1.5) return "almost everyone";
  if (n >= 1e6) return `about 1 in ${Number((n / 1e6).toPrecision(2))} million`;
  const rounded =
    n < 10 ? Math.round(n) : n < 1000 ? Number(n.toPrecision(2)) : Math.round(n / 100) * 100;
  return `about 1 in ${rounded.toLocaleString("en-US")}`;
}

// Where a share sits on the rarity scale (0 = everyone, 1 = one in a million)
const position = (share: number) => Math.min(1, Math.max(0, -Math.log10(share) / RAREST));

function message(total: number, full: boolean) {
  const pb = fitness.benchPB;
  if (full) return "The bar’s full. That’s a lot of plates.";
  if (total === BAR_KG) return "Just the bar. Everyone starts here.";
  if (total < pb) return `${pb - total} kg to go until my PB.`;
  if (total === pb) return "That’s my PB. Welcome to the 100 kg club 🎉";
  return "Heavier than my PB. Respect.";
}

/** Load plates onto a barbell and see roughly how rare that bench would be. */
export function BenchPress({ className }: { className?: string }) {
  const [plates, setPlates] = useState<Loaded[]>([]);
  const nextId = useRef(1);
  const total = BAR_KG + 2 * plates.reduce((sum, p) => sum + p.kg, 0);
  const share = shareWhoCanBench(total);
  const pbShare = shareWhoCanBench(fitness.benchPB);
  const full = plates.length >= MAX_PER_SIDE;

  const add = (kg: Kg) =>
    setPlates((current) =>
      current.length >= MAX_PER_SIDE
        ? current
        : [...current, { id: nextId.current++, kg }].sort(heaviestFirst),
    );
  const unload = () => setPlates((current) => current.slice(0, -1));
  const loadPB = () => {
    const pair: Kg[] = [20, 20]; // 20 kg bar + two 20 kg plates a side = 100 kg
    setPlates(pair.map((kg) => ({ id: nextId.current++, kg })));
  };

  return (
    <div className={cn("rounded-2xl bg-paper-2/70 p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-serif text-heading">Load the bar</p>
        <p className="text-sm text-muted">Tap a plate to add a pair</p>
      </div>

      {/* The barbell (a picture of the numbers below) */}
      <div aria-hidden className="relative mt-5 flex h-28 items-center">
        <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#9a968e]" />
        <Side plates={plates} side="left" />
        <span className="w-[30%] shrink-0 sm:w-[34%]" />
        <Side plates={plates} side="right" />
      </div>

      {/* Plates to add, seen face-on */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
        {PLATES.map((plate) => (
          <button
            key={plate.kg}
            type="button"
            onClick={() => add(plate.kg)}
            disabled={full}
            aria-label={`Add a pair of ${plate.kg} kg plates`}
            className={cn(
              "grid shrink-0 place-items-center rounded-full shadow-card transition duration-300 ease-out-expo hover:-translate-y-0.5 active:scale-95 disabled:pointer-events-none disabled:opacity-40",
              plate.colour,
              plate.face,
            )}
          >
            <span className="grid size-[64%] place-items-center rounded-full bg-card text-[0.625rem] font-semibold text-ink ring-1 ring-black/5 sm:text-[0.6875rem]">
              {plate.kg}
            </span>
          </button>
        ))}
      </div>

      {/* Readout */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <p className="text-sm text-muted">On the bar</p>
          <p className="text-5xl font-semibold tracking-tight text-ink">
            <Count value={total} /> kg
          </p>
        </div>
        <div className="sm:text-right" aria-live="polite">
          <p className="text-sm text-muted">Could probably lift it</p>
          <p className="text-2xl font-semibold tracking-tight text-ink">
            {formatShare(share)} <span className="text-base font-normal text-ink-2">of adults</span>
          </p>
          <p className="font-mono text-xs text-muted">{oneIn(share)}</p>
        </div>
      </div>

      <RarityScale share={share} pbShare={pbShare} />

      <p className="mt-4 min-h-7 font-hand text-2xl leading-7 text-accent">{message(total, full)}</p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="-ml-2 flex gap-1">
          <SmallButton onClick={unload} disabled={plates.length === 0}>
            Unload
          </SmallButton>
          <SmallButton onClick={() => setPlates([])} disabled={plates.length === 0}>
            Reset
          </SmallButton>
          <SmallButton onClick={loadPB}>Load my PB</SmallButton>
        </div>
        <p className="text-xs text-muted">
          Rough estimate for adults worldwide, most of whom don’t lift. Not official data.
        </p>
      </div>
    </div>
  );
}

/** One side of the bar: a collar, then plates from heaviest (inside) outwards */
function Side({ plates, side }: { plates: Loaded[]; side: "left" | "right" }) {
  const away = side === "left" ? -18 : 18;
  return (
    <div
      className={cn(
        "relative flex flex-1 items-center gap-[2px]",
        side === "left" ? "flex-row-reverse" : "flex-row",
      )}
    >
      <span className="h-5 w-2 shrink-0 rounded-[2px] bg-ink-2" />
      <AnimatePresence initial={false}>
        {plates.map((plate) => (
          <motion.span
            key={plate.id}
            layout
            initial={{ opacity: 0, x: away }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: away }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className={cn("block shrink-0 rounded-[3px]", spec(plate.kg).colour, spec(plate.kg).bar)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/** A log scale from "most adults" to "1 in a million", with my PB marked */
function RarityScale({ share, pbShare }: { share: number; pbShare: number }) {
  const at = position(share) * 100;
  const pbAt = position(pbShare) * 100;
  const spring = { type: "spring", bounce: 0.15, duration: 0.6 } as const;
  return (
    <div className="mt-6">
      <div
        role="img"
        aria-label={`Rarity scale: about ${formatShare(share)} of adults could lift this. My PB sits at ${formatShare(pbShare)}.`}
        className="relative h-9"
      >
        <span className="absolute inset-x-0 bottom-2 h-1.5 rounded-full bg-accent-soft" />
        <motion.span
          className="absolute bottom-2 left-0 h-1.5 rounded-full bg-accent"
          initial={false}
          animate={{ width: `${at}%` }}
          transition={spring}
        />
        {/* My PB */}
        <span className="absolute bottom-0.5 flex -translate-x-1/2 flex-col items-center" style={{ left: `${pbAt}%` }}>
          <span className="text-[0.6875rem] leading-none whitespace-nowrap text-ink-2">my PB</span>
          <span className="mt-1 h-4 w-0.5 rounded-full bg-ink" />
        </span>
        <motion.span
          className="absolute bottom-[0.3125rem] size-3.5 -translate-x-1/2 rounded-full bg-accent ring-2 ring-card"
          initial={false}
          animate={{ left: `${at}%` }}
          transition={spring}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>most adults</span>
        <span>1 in a million</span>
      </div>
    </div>
  );
}

/** The total, counting up or down smoothly */
function Count({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const current = useMotionValue(value);
  const text = useTransform(current, (v) => String(Math.round(v * 2) / 2));
  useEffect(() => {
    const controls = animate(current, value, {
      duration: reduceMotion ? 0 : 0.5,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [current, value, reduceMotion]);
  return <motion.span>{text}</motion.span>;
}

function SmallButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-9 rounded-full px-3 text-sm font-medium text-ink-2 transition-colors hover:bg-card hover:text-ink disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

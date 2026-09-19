"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Everything is measured in "table units": the felt is 100 wide and 54 tall.
const W = 100;
const H = 54;
const R = 2.3; // ball radius

// `capture`: how close a ball's centre must get to drop in. `size`: the hole you see.
type Pocket = { x: number; y: number; capture: number; size: number };
const POCKETS: Pocket[] = [
  { x: 0, y: 0, capture: 6.8, size: 4.6 },
  { x: W / 2, y: -1.2, capture: 5.4, size: 4.2 },
  { x: W, y: 0, capture: 6.8, size: 4.6 },
  { x: 0, y: H, capture: 6.8, size: 4.6 },
  { x: W / 2, y: H + 1.2, capture: 5.4, size: 4.2 },
  { x: W, y: H, capture: 6.8, size: 4.6 },
];

// The little sight markers on the rails, as % positions around the felt
const DIAMONDS = [
  ...[12.5, 25, 37.5, 62.5, 75, 87.5].flatMap((x) => [
    { left: x, top: -3.2 },
    { left: x, top: 103.2 },
  ]),
  ...[25, 50, 75].flatMap((y) => [
    { left: -1.7, top: y },
    { left: 101.7, top: y },
  ]),
];

// Physics tuning
const STEP = 1 / 240; // seconds per physics step
const ROLLING = 11; // constant slow-down (units/s²)
const DRAG = 0.8; // speed-dependent slow-down (per second)
const BALL_BOUNCE = 0.95;
const CUSHION_BOUNCE = 0.75;
const MAX_SPEED = 185; // a full-power shot (units/s)
const STOP_SPEED = 1;

type Ball = { n: number; x: number; y: number; vx: number; vy: number; potted: boolean };
type Sunk = { index: number; pocket: Pocket };

const HEAD_SPOT = { x: W * 0.25, y: H / 2 };
const FOOT_SPOT = { x: W * 0.7, y: H / 2 };
const RACK = [[1], [3, 2], [5, 8, 4]]; // the triangle, apex first
const OBJECT_BALLS = RACK.flat().length;
const HINT = "Click or tap the felt to take a shot.";

const BALL_COLOUR: Record<number, string> = {
  0: "bg-[#f7f4ea]",
  1: "bg-ball-1",
  2: "bg-ball-2",
  3: "bg-ball-3",
  4: "bg-ball-4",
  5: "bg-ball-5",
  8: "bg-ink",
};

function rack(): Ball[] {
  const balls: Ball[] = [{ n: 0, ...HEAD_SPOT, vx: 0, vy: 0, potted: false }];
  RACK.forEach((row, r) =>
    row.forEach((n, i) =>
      balls.push({
        n,
        x: FOOT_SPOT.x + r * (Math.sqrt(3) * R + 0.05),
        y: FOOT_SPOT.y + (i - (row.length - 1) / 2) * (2 * R + 0.05),
        vx: 0,
        vy: 0,
        potted: false,
      }),
    ),
  );
  return balls;
}

const START = rack();

// Translate percentages are relative to the ball's own size, so this works at any table width
const place = (x: number, y: number) =>
  `translate(${((x - R) / (2 * R)) * 100}%, ${((y - R) / (2 * R)) * 100}%)`;

const isMoving = (balls: Ball[]) => balls.some((b) => !b.potted && (b.vx !== 0 || b.vy !== 0));

/** Advance the table by one small time step. Newly potted balls are added to `sunk`. */
function step(balls: Ball[], sunk: Sunk[]) {
  balls.forEach((b, index) => {
    if (b.potted) return;

    const speed = Math.hypot(b.vx, b.vy);
    if (speed > 0) {
      const slower = speed - (ROLLING + DRAG * speed) * STEP;
      if (slower < STOP_SPEED) {
        b.vx = 0;
        b.vy = 0;
      } else {
        b.vx *= slower / speed;
        b.vy *= slower / speed;
      }
    }
    b.x += b.vx * STEP;
    b.y += b.vy * STEP;

    const pocket = POCKETS.find((p) => Math.hypot(b.x - p.x, b.y - p.y) < p.capture);
    if (pocket) {
      b.potted = true;
      b.vx = 0;
      b.vy = 0;
      sunk.push({ index, pocket });
      return;
    }

    // Bounce off the cushions
    if (b.x < R) {
      b.x = R;
      b.vx = Math.abs(b.vx) * CUSHION_BOUNCE;
    } else if (b.x > W - R) {
      b.x = W - R;
      b.vx = -Math.abs(b.vx) * CUSHION_BOUNCE;
    }
    if (b.y < R) {
      b.y = R;
      b.vy = Math.abs(b.vy) * CUSHION_BOUNCE;
    } else if (b.y > H - R) {
      b.y = H - R;
      b.vy = -Math.abs(b.vy) * CUSHION_BOUNCE;
    }
  });

  // Ball-to-ball collisions (all balls weigh the same)
  for (let i = 0; i < balls.length; i++) {
    const a = balls[i];
    if (a.potted) continue;
    for (let j = i + 1; j < balls.length; j++) {
      const b = balls[j];
      if (b.potted) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      if (dist === 0 || dist >= 2 * R) continue;

      const nx = dx / dist;
      const ny = dy / dist;
      const push = (2 * R - dist) / 2;
      a.x -= nx * push;
      a.y -= ny * push;
      b.x += nx * push;
      b.y += ny * push;

      const closing = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (closing < 0) {
        const impulse = (-(1 + BALL_BOUNCE) * closing) / 2;
        a.vx -= impulse * nx;
        a.vy -= impulse * ny;
        b.vx += impulse * nx;
        b.vy += impulse * ny;
      }
    }
  }
}

/** A tiny, genuinely playable pool table. It only animates while balls are rolling. */
export function PoolTable({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const balls = useRef<Ball[]>(rack());
  const ballEls = useRef<(HTMLDivElement | null)[]>([]);
  const aimLine = useRef<SVGLineElement>(null);
  const loop = useRef({ frame: 0 });
  const [rolling, setRolling] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [message, setMessage] = useState(HINT);

  useEffect(() => {
    const current = loop.current;
    return () => cancelAnimationFrame(current.frame);
  }, []);

  const draw = () => {
    balls.current.forEach((b, i) => {
      const el = ballEls.current[i];
      if (el && !b.potted) el.style.transform = place(b.x, b.y);
    });
  };

  // Slide a potted ball into its pocket and fade it out
  const sink = ({ index, pocket }: Sunk) => {
    const el = ballEls.current[index];
    if (!el) return;
    el.style.transition = reduceMotion ? "none" : "transform 0.35s ease-in, opacity 0.35s ease-in";
    el.style.transform = `${place(pocket.x, pocket.y)} scale(0.4)`;
    el.style.opacity = "0";
  };

  // After a scratch, put the cue ball back on the first free spot near the head spot
  const respawnCue = () => {
    const table = balls.current;
    const cue = table[0];
    const y =
      [0, 1, -1, 2, -2, 3, -3]
        .map((k) => HEAD_SPOT.y + k * (2 * R + 0.3))
        .find((spotY) =>
          table.every(
            (b) => b === cue || b.potted || Math.hypot(b.x - HEAD_SPOT.x, b.y - spotY) > 2 * R + 0.1,
          ),
        ) ?? HEAD_SPOT.y;
    Object.assign(cue, { x: HEAD_SPOT.x, y, vx: 0, vy: 0, potted: false });
    const el = ballEls.current[0];
    if (el) {
      el.style.transition = "none";
      el.style.transform = place(cue.x, cue.y);
      el.style.opacity = "1";
    }
  };

  const settle = (sunk: Sunk[]) => {
    setRolling(false);
    const table = balls.current;
    const sunkNumbers = sunk.map((s) => table[s.index].n);
    const left = table.filter((b) => b.n > 0 && !b.potted).length;
    setCleared(left === 0);

    if (table[0].potted) {
      respawnCue();
      setMessage("Scratch! The cue ball’s back on its spot.");
    } else if (sunkNumbers.includes(8) && left > 0) {
      setMessage("Sank the 8-ball early. In a real game, that’s a loss.");
    } else if (left === 0) {
      setMessage("Table cleared. Very professional.");
    } else if (sunkNumbers.length > 0) {
      setMessage(`${OBJECT_BALLS - left} of ${OBJECT_BALLS} potted. Keep going?`);
    } else {
      setMessage("Nothing dropped. Go again?");
    }
  };

  const run = () => {
    const sunk: Sunk[] = [];

    // With reduced motion, skip the animation and jump straight to where everything stops
    if (reduceMotion) {
      for (let i = 0; i < 40000 && isMoving(balls.current); i++) step(balls.current, sunk);
      draw();
      sunk.forEach(sink);
      settle(sunk);
      return;
    }

    setRolling(true);
    let last = performance.now();
    let pending = 0;
    const tick = (now: number) => {
      pending += Math.min(0.05, (now - last) / 1000);
      last = now;
      const before = sunk.length;
      while (pending >= STEP) {
        step(balls.current, sunk);
        pending -= STEP;
      }
      draw();
      sunk.slice(before).forEach(sink);
      if (isMoving(balls.current)) loop.current.frame = requestAnimationFrame(tick);
      else settle(sunk);
    };
    loop.current.frame = requestAnimationFrame(tick);
  };

  const shoot = (targetX: number, targetY: number, power: number) => {
    const cue = balls.current[0];
    if (isMoving(balls.current) || cue.potted) return;
    const dx = targetX - cue.x;
    const dy = targetY - cue.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.5) return;
    cue.vx = (dx / dist) * power * MAX_SPEED;
    cue.vy = (dy / dist) * power * MAX_SPEED;
    hideAim();
    run();
  };

  const toTable = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * W,
      y: ((event.clientY - rect.top) / rect.height) * H,
    };
  };

  // The further from the cue ball you click, the harder the shot
  const onFeltClick = (event: MouseEvent<HTMLDivElement>) => {
    const { x, y } = toTable(event);
    const cue = balls.current[0];
    const power = Math.min(1, Math.max(0.3, Math.hypot(x - cue.x, y - cue.y) / 45));
    shoot(x, y, power);
  };

  const hideAim = () => {
    if (aimLine.current) aimLine.current.style.opacity = "0";
  };

  // A dashed aiming line that follows the mouse (not shown for touch)
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const line = aimLine.current;
    const cue = balls.current[0];
    if (!line || event.pointerType !== "mouse" || isMoving(balls.current) || cue.potted) {
      hideAim();
      return;
    }
    const { x, y } = toTable(event);
    const dist = Math.hypot(x - cue.x, y - cue.y);
    if (dist < 0.5) {
      hideAim();
      return;
    }
    const length = Math.min(dist, 45);
    line.setAttribute("x1", String(cue.x));
    line.setAttribute("y1", String(cue.y));
    line.setAttribute("x2", String(cue.x + ((x - cue.x) / dist) * length));
    line.setAttribute("y2", String(cue.y + ((y - cue.y) / dist) * length));
    line.style.opacity = "1";
  };

  // Keyboard- and thumb-friendly: aim at a random ball that's still on the table
  const takeShot = () => {
    const targets = balls.current.filter((b) => b.n > 0 && !b.potted);
    if (targets.length === 0) return;
    const target = targets[Math.floor(Math.random() * targets.length)];
    shoot(target.x, target.y + (Math.random() - 0.5) * 1.5, 0.85 + Math.random() * 0.15);
  };

  const reRack = () => {
    cancelAnimationFrame(loop.current.frame);
    balls.current = rack();
    balls.current.forEach((b, i) => {
      const el = ballEls.current[i];
      if (!el) return;
      el.style.transition = "none";
      el.style.opacity = "1";
      el.style.transform = place(b.x, b.y);
    });
    setRolling(false);
    setCleared(false);
    setMessage(HINT);
  };

  return (
    <div className={className}>
      <p className="sr-only">
        A tiny playable pool table. Use the Take a shot button to play, and Re-rack to start over.
      </p>

      {/* Rails */}
      <div className="overflow-hidden rounded-2xl bg-[#3b2b22] p-[3.2%] shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_18px_32px_-18px_rgb(22_21_19/0.6)]">
        {/* Felt */}
        <div
          aria-hidden
          onClick={onFeltClick}
          onPointerMove={onPointerMove}
          onPointerLeave={hideAim}
          className={cn(
            "@container relative aspect-[100/54] rounded-md bg-accent shadow-[inset_0_0_2.5rem_rgb(0_0_0/0.3)] select-none",
            rolling ? "cursor-progress" : "cursor-crosshair",
          )}
        >
          {DIAMONDS.map((d) => (
            <span
              key={`${d.left}-${d.top}`}
              className="absolute aspect-square w-[0.8%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/60"
              style={{ left: `${d.left}%`, top: `${d.top}%` }}
            />
          ))}

          {POCKETS.map((p) => (
            <span
              key={`${p.x}-${p.y}`}
              className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0d0c0b]"
              style={{
                left: `${(p.x / W) * 100}%`,
                top: `${(p.y / H) * 100}%`,
                width: `${((p.size * 2) / W) * 100}%`,
              }}
            />
          ))}

          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
          >
            <line
              ref={aimLine}
              stroke="rgb(255 255 255 / 0.6)"
              strokeWidth={1.5}
              strokeDasharray="4 5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="opacity-0 transition-opacity duration-200"
            />
          </svg>

          {START.map((b, i) => (
            <div
              key={b.n}
              ref={(el) => {
                ballEls.current[i] = el;
              }}
              className={cn(
                "absolute top-0 left-0 grid aspect-square place-items-center rounded-full text-[2.1cqw] shadow-[inset_-0.2em_-0.25em_0.45em_rgb(0_0_0/0.3),0_0.15em_0.3em_rgb(0_0_0/0.35)]",
                BALL_COLOUR[b.n],
              )}
              style={{ width: `${((2 * R) / W) * 100}%`, transform: place(b.x, b.y) }}
            >
              {b.n > 0 && (
                <span className="grid aspect-square w-[58%] place-items-center rounded-full bg-[#f7f4ea] text-[0.8em] leading-none font-semibold text-ink">
                  {b.n}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p aria-live="polite" className="text-sm text-muted">
          {message}
        </p>
        <div className="-mr-2 flex gap-1">
          <Button
            variant="ghost"
            onClick={takeShot}
            disabled={rolling || cleared}
            className="h-9 px-3.5 text-sm disabled:opacity-40"
          >
            Take a shot
          </Button>
          <Button variant="ghost" onClick={reRack} className="h-9 px-3.5 text-sm">
            Re-rack
          </Button>
        </div>
      </div>
    </div>
  );
}

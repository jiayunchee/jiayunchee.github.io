import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { PoolTable } from "@/components/PoolTable";
import { Arrow } from "@/components/ui/Arrow";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

const cardClasses =
  "group flex h-full flex-col rounded-card border border-line bg-card p-6 shadow-card sm:p-7";

export function Interests() {
  return (
    <Section id="life" className="border-t border-line">
      <Container>
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow="Life"
            title="When I’m not analysing data…"
            description="The things that fill up the rest of my week."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-12">
          <Reveal className="md:col-span-2 lg:col-span-7">
            <PoolCard />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5">
            <FitnessCard />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5">
            <FriendsCard />
          </Reveal>
          <Reveal delay={0.16} className="md:col-span-2 lg:col-span-7">
            <TravelCard />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/** Title, copy and a little emoji sticker that wiggles when the card is hovered */
function CardIntro({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-5">
      <div>
        <h3 className="font-serif text-heading">{title}</h3>
        <div className="mt-2 space-y-2 text-ink-2">{children}</div>
      </div>
      <span
        aria-hidden
        className="grid size-12 shrink-0 place-items-center rounded-full bg-paper-2 text-2xl transition duration-500 ease-out-expo group-hover:scale-110 group-hover:-rotate-12"
      >
        {emoji}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- Pool */

function PoolCard() {
  return (
    <article className={cardClasses}>
      <CardIntro emoji="🎱" title="Pool">
        <p>Probably my favourite way to waste several hours.</p>
        <p className="font-hand text-xl leading-none text-accent">
          (yes, the table below actually works)
        </p>
      </CardIntro>
      <PoolTable className="mt-6" />
    </article>
  );
}

/* ---------------------------------------------------------------- Fitness */

// 3 workouts, 1 "maybe", 3 rest days
const week = ["done", "done", "done", "maybe", "rest", "rest", "rest"] as const;

function FitnessCard() {
  return (
    <article className={cardClasses}>
      <CardIntro emoji="🏋️" title="Health & fitness">
        <p>
          I love working out, 3–4 times a week. But I’m a strong advocate of not wasting
          money, so I train at ActiveSG, which is coincidentally only a 5-minute walk away.
        </p>
        <p>Plus swimming, staying active, and generally trying to keep the body functioning.</p>
      </CardIntro>

      <div className="mt-auto pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Workouts a week</p>
            <div
              role="img"
              aria-label="3 to 4 workouts a week"
              className="mt-3 flex items-center gap-1.5"
            >
              {week.map((day, i) => (
                <span
                  key={`${day}-${i}`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                  className={cn(
                    "size-4 rounded-full transition duration-500 ease-out-expo group-hover:-translate-y-0.5",
                    day === "done" && "bg-ink group-hover:bg-accent",
                    day === "maybe" && "border-[1.5px] border-dashed border-ink",
                    day === "rest" && "border border-line-strong",
                  )}
                />
              ))}
              <span className="ml-2 font-mono text-sm text-ink">3–4×</span>
            </div>
          </div>
          <p className="-rotate-3 font-hand text-xl leading-tight text-accent">
            cheap + close
            <br />= no excuses
          </p>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          <li>
            <Tag dot="bg-accent">ActiveSG · 5 min walk</Tag>
          </li>
          {["Gym", "Swimming", "Staying active", "Wellness"].map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------- Friends */

const chat = [
  { from: "friend", text: "anyone free tonight?" },
  { from: "friend", text: "dinner, then supper?" },
  { from: "me", text: "only if it ends at the pool table 🎱" },
] as const;

function FriendsCard() {
  return (
    <article className={cardClasses}>
      <CardIntro emoji="🥂" title="Friends & social life">
        <p>Good food, random plans, late nights, and people who make life more interesting.</p>
      </CardIntro>

      <ol aria-label="A very typical group chat" className="mt-auto flex flex-col gap-2 pt-8">
        {chat.map((message, i) => (
          <li
            key={message.text}
            className={cn("max-w-[85%]", message.from === "me" && "self-end")}
          >
            <Reveal delay={0.2 + i * 0.25} y={8}>
              <p
                className={cn(
                  "w-fit rounded-2xl px-3.5 py-2 text-sm",
                  message.from === "me"
                    ? "rounded-br-md bg-ink text-paper"
                    : "rounded-bl-md bg-paper-2 text-ink",
                )}
              >
                {message.text}
              </p>
            </Reveal>
          </li>
        ))}
        <li aria-hidden>
          <Reveal delay={0.2 + chat.length * 0.25} y={8}>
            <span className="inline-flex gap-1 rounded-2xl rounded-bl-md bg-paper-2 px-3.5 py-3">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="size-1.5 rounded-full bg-muted group-hover:animate-bounce"
                  style={{ animationDelay: `${dot * 150}ms` }}
                />
              ))}
            </span>
          </Reveal>
        </li>
      </ol>
    </article>
  );
}

/* ---------------------------------------------------------------- Travel */

// Passport-style stamps. The map in the Travels section has the full list of places.
const stamps = [
  { label: "Japan", colour: "text-ball-3", round: true, tilt: -8 },
  { label: "USA", colour: "text-ball-2", round: false, tilt: 5 },
  { label: "South Korea", colour: "text-ball-4", round: false, tilt: -4 },
  { label: "Taiwan", colour: "text-ball-6", round: true, tilt: 7 },
  { label: "Hong Kong", colour: "text-ball-7", round: false, tilt: -6 },
  { label: "UK", colour: "text-ball-2", round: true, tilt: 4 },
  { label: "Australia", colour: "text-ball-6", round: false, tilt: -3 },
  { label: "Indonesia", colour: "text-ball-3", round: false, tilt: 6 },
  { label: "Malaysia", colour: "text-ball-4", round: true, tilt: -7 },
  { label: "Thailand", colour: "text-ball-7", round: false, tilt: 3 },
];

function TravelCard() {
  return (
    <Link
      href="#travels"
      className={cn(
        cardClasses,
        "transition duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:shadow-lift",
      )}
    >
      <CardIntro emoji="✈️" title="Travelling">
        <p>
          I like seeing new places, eating whatever looks interesting, and collecting stories
          along the way.
        </p>
      </CardIntro>

      <ul aria-label="Countries so far" className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-4">
        {stamps.map((stamp) => (
          <li
            key={stamp.label}
            style={{ "--tilt": `${stamp.tilt}deg` } as CSSProperties}
            className={cn(
              "rotate-(--tilt) font-mono text-[0.6875rem] font-medium tracking-[0.12em] uppercase opacity-85 transition duration-500 ease-out-expo group-hover:rotate-0",
              stamp.colour,
              stamp.round
                ? "grid size-[4.75rem] place-items-center rounded-full border-[1.5px] border-current p-2 text-center leading-tight outline outline-offset-[3px] outline-current"
                : "rounded-md border-[1.5px] border-current px-2.5 py-1.5",
            )}
          >
            {stamp.label}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-8">
        <p className="font-mono text-[0.8125rem] text-muted">24+ places · 10 countries</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap text-ink">
          Open the map
          <Arrow className="transition duration-500 ease-out-expo group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

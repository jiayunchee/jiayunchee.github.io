import { Fragment, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { now, site } from "@/data/site";

// Each phrase gets a tiny sticker that pops up on hover
const phrases = [
  { text: "Data science student.", emoji: "📊" },
  { text: "Builder.", emoji: "🛠️" },
  { text: "Traveller.", emoji: "✈️" },
  { text: "Pool addict.", emoji: "🎱" },
  { text: "Health enthusiast.", emoji: "🏋️" },
];

// Staggers the page-load entrance (pure CSS, so text shows even before JS loads)
const rise = (step: number): CSSProperties => ({ animationDelay: `${step * 90}ms` });

export function Hero() {
  return (
    <section className="pt-[calc(var(--spacing-nav)_+_var(--spacing-section))] pb-section">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h1 className="animate-rise font-serif text-display" style={rise(0)}>
              Hi, I’m{" "}
              <span className="relative inline-block whitespace-nowrap">
                Jia Yun
                <PenUnderline />
              </span>
              .
            </h1>

            <p
              className="mt-6 max-w-2xl animate-rise font-serif text-heading text-muted italic"
              style={rise(1)}
            >
              {phrases.map((phrase) => (
                <Fragment key={phrase.text}>
                  <span className="group relative inline-block cursor-default transition-colors duration-300 hover:text-ink">
                    {phrase.text}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 grid size-9 -translate-x-1/2 translate-y-1 scale-50 -rotate-12 place-items-center rounded-full bg-card text-lg not-italic opacity-0 shadow-lift ring-1 ring-line transition duration-500 ease-out-expo group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
                    >
                      {phrase.emoji}
                    </span>
                  </span>{" "}
                </Fragment>
              ))}
            </p>

            <p className="mt-6 max-w-xl animate-rise text-lead text-ink-2" style={rise(2)}>
              I’m a Data Science & Analytics student at NUS who enjoys building things,
              analysing problems, staying active, travelling, and spending way too much
              time with good friends.
            </p>

            <div className="mt-9 flex animate-rise flex-wrap gap-3" style={rise(3)}>
              <Button href="#about" arrow="down">
                Explore my life
              </Button>
              <Button href={site.linkedin} variant="secondary" arrow="up-right">
                Let’s connect
              </Button>
            </div>
          </div>

          <aside
            aria-label="Right now"
            className="animate-rise lg:col-span-5 lg:justify-self-end"
            style={rise(5)}
          >
            <p className="eyebrow flex items-center gap-2.5">
              <span aria-hidden className="relative flex size-1.5">
                <span className="absolute size-full animate-ping-soft rounded-full bg-accent" />
                <span className="relative size-1.5 rounded-full bg-accent" />
              </span>
              Right now
            </p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-[0.8125rem] leading-relaxed">
              {now.map((item) => (
                <div key={item.label} className="contents">
                  <dt className="text-muted">{item.label}</dt>
                  <dd className="text-ink">
                    <span aria-hidden className="mr-2 text-muted">
                      →
                    </span>
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </Container>
    </section>
  );
}

/** A hand-drawn pen stroke that draws itself under the name, once */
function PenUnderline() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      fill="none"
      className="absolute -bottom-[0.06em] left-0 h-[0.2em] w-full overflow-visible text-accent"
    >
      <path
        d="M3 9.5C38 4 76 12.5 112 7.5S176 3.5 197 8"
        pathLength={1}
        strokeDasharray={1}
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        className="animate-draw"
        style={{ animationDelay: "650ms" }}
      />
    </svg>
  );
}

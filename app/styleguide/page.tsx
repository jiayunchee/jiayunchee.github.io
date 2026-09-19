import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

// A living reference of the design system. Not linked in the navbar
// and hidden from search engines.
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const typeScale = [
  {
    token: "text-display",
    font: "Instrument Serif",
    sample: <p className="font-serif text-display">Hi, I’m Jia Yun.</p>,
  },
  {
    token: "text-title",
    font: "Instrument Serif",
    sample: <p className="font-serif text-title">Places I’ve been</p>,
  },
  {
    token: "text-heading",
    font: "Instrument Serif",
    sample: (
      <p className="font-serif text-heading">
        Seoul, <em>in the rain</em>
      </p>
    ),
  },
  {
    token: "text-lead",
    font: "Instrument Sans",
    sample: (
      <p className="max-w-xl text-lead text-ink-2">
        I like seeing new places, eating whatever looks interesting, and collecting
        stories along the way.
      </p>
    ),
  },
  {
    token: "text-base",
    font: "Instrument Sans",
    sample: (
      <p className="max-w-xl text-ink-2">
        Good food, random plans, late nights, and people who make life more
        interesting. Body text sits at 16px with generous line height so longer
        stories stay easy to read.
      </p>
    ),
  },
  { token: "eyebrow", font: "DM Mono", sample: <p className="eyebrow">03 — Travels</p> },
  {
    token: "font-hand",
    font: "Caveat",
    sample: <p className="font-hand text-2xl text-accent">← a photo goes here one day</p>,
  },
];

const neutrals = [
  { name: "paper", hex: "#f7f6f2", swatch: "bg-paper" },
  { name: "paper-2", hex: "#efede7", swatch: "bg-paper-2" },
  { name: "card", hex: "#fcfbf8", swatch: "bg-card" },
  { name: "line", hex: "#e5e2da", swatch: "bg-line" },
  { name: "muted", hex: "#6f6b64", swatch: "bg-muted" },
  { name: "ink-2", hex: "#4a4741", swatch: "bg-ink-2" },
  { name: "ink", hex: "#161513", swatch: "bg-ink" },
];

const balls = [
  { n: 1, name: "yellow", swatch: "bg-ball-1" },
  { n: 2, name: "blue", swatch: "bg-ball-2" },
  { n: 3, name: "red", swatch: "bg-ball-3" },
  { n: 4, name: "purple", swatch: "bg-ball-4" },
  { n: 5, name: "orange", swatch: "bg-ball-5" },
  { n: 6, name: "felt · accent", swatch: "bg-ball-6" },
  { n: 7, name: "maroon", swatch: "bg-ball-7" },
  { n: 8, name: "ink", swatch: "bg-ink" },
];

const spacing = [
  { token: "gutter", value: "20 → 48px", bar: "w-gutter", note: "Side padding on every page" },
  { token: "section", value: "64 → 112px", bar: "w-section", note: "Space above and below each section" },
  { token: "nav", value: "80 → 56px", bar: "w-20", note: "Navbar height, compact once you scroll" },
];

const tags = [
  { label: "Python", dot: "bg-ball-2" },
  { label: "SQL", dot: "bg-ball-1" },
  { label: "Pandas", dot: "bg-ball-4" },
  { label: "Tableau", dot: "bg-ball-5" },
  { label: "Streamlit", dot: "bg-ball-3" },
];

const status = [
  ["Currently", "Singapore"],
  ["Studying", "Data Science & Analytics @ NUS"],
  ["Working", "TikTok"],
];

const cards = [
  { title: "Pool", text: "Probably my favourite way to waste several hours.", dot: "bg-ball-6" },
  { title: "Travel", text: "Collecting stories along the way.", dot: "bg-ball-2" },
  { title: "Friends", text: "Good food, random plans, late nights.", dot: "bg-ball-5" },
];

export default function StyleguidePage() {
  return (
    <Section className="pt-[calc(var(--spacing-nav)_+_var(--spacing-section))]">
      <Container>
        <header className="max-w-2xl pb-14">
          <p className="eyebrow">Step 1 · Design system</p>
          <h1 className="mt-5 font-serif text-title">The little rulebook behind the site</h1>
          <p className="mt-5 text-lead text-ink-2">
            Fonts, colours, spacing and building blocks, so every section we build
            next feels like it belongs in the same notebook.
          </p>
          <Button href="/" variant="ghost" className="mt-6 -ml-3">
            ← Back to the homepage
          </Button>
        </header>

        <Block
          title="Typography"
          note="Instrument Serif for headings, Instrument Sans for reading, DM Mono for little labels, Caveat for the odd handwritten note."
        >
          <ul className="divide-y divide-line">
            {typeScale.map((row) => (
              <li
                key={row.token}
                className="grid gap-3 py-6 first:pt-0 sm:grid-cols-[9rem_1fr] sm:gap-6"
              >
                <div className="font-mono text-xs leading-relaxed">
                  <p className="text-ink">{row.token}</p>
                  <p className="text-muted">{row.font}</p>
                </div>
                <div className="min-w-0">{row.sample}</div>
              </li>
            ))}
          </ul>
        </Block>

        <Block
          title="Colour"
          note="Warm paper and ink as the base. The accents are quietly borrowed from pool balls, and used sparingly."
        >
          <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4 lg:grid-cols-7">
            {neutrals.map((color) => (
              <li key={color.name}>
                <div className={cn("h-16 rounded-xl border border-line", color.swatch)} />
                <p className="mt-2 font-mono text-xs text-ink">{color.name}</p>
                <p className="font-mono text-xs text-muted">{color.hex}</p>
              </li>
            ))}
          </ul>

          <p className="eyebrow mt-12 mb-5">The pool-ball accents</p>
          <ul className="flex flex-wrap gap-x-2 gap-y-5">
            {balls.map((ball) => (
              <li key={ball.n} className="group flex w-[4.5rem] flex-col items-center gap-2">
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-full shadow-card transition duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:rotate-[24deg]",
                    ball.swatch,
                  )}
                >
                  <span className="grid size-6 place-items-center rounded-full bg-paper text-[0.6875rem] font-semibold text-ink">
                    {ball.n}
                  </span>
                </span>
                <span className="text-center font-mono text-[0.6875rem] leading-tight text-muted">
                  {ball.name}
                </span>
              </li>
            ))}
          </ul>
        </Block>

        <Block
          title="Spacing"
          note="Fluid values that grow with the screen, so phones feel roomy and desktops never feel empty. Content maxes out at 1152px wide."
        >
          <ul className="space-y-6">
            {spacing.map((item) => (
              <li
                key={item.token}
                className="grid items-center gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6"
              >
                <div className="font-mono text-xs leading-relaxed">
                  <p className="text-ink">{item.token}</p>
                  <p className="text-muted">{item.value}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn("h-3 shrink-0 rounded-full bg-accent/80", item.bar)} />
                  <span className="text-sm text-ink-2">{item.note}</span>
                </div>
              </li>
            ))}
          </ul>
        </Block>

        <Block
          title="Building blocks"
          note="Reusable pieces from components/ui. Hover them: everything moves a little, nothing moves a lot."
        >
          <div className="space-y-12">
            <Specimen label="Buttons">
              <div className="flex flex-wrap gap-3">
                <Button arrow="down">Explore my life</Button>
                <Button variant="secondary" arrow="up-right">
                  Let’s connect
                </Button>
                <Button variant="ghost" arrow="right">
                  Read story
                </Button>
              </div>
            </Specimen>

            <Specimen label="Tags">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Tag key={tag.label} dot={tag.dot}>
                    {tag.label}
                  </Tag>
                ))}
              </div>
            </Specimen>

            <Specimen label="Status line">
              <dl className="space-y-1.5 font-mono text-[0.8125rem]">
                {status.map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <dt className="text-muted">{key}</dt>
                    <dd className="text-ink">
                      <span aria-hidden className="mr-2 text-muted">
                        →
                      </span>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Specimen>

            <Specimen label="Links">
              <p className="text-ink-2">
                Say hi at{" "}
                <a href={`mailto:${site.email}`} className="link-underline text-ink">
                  {site.email}
                </a>{" "}
                or find me on{" "}
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-ink"
                >
                  LinkedIn
                </a>
                .
              </p>
            </Specimen>

            <Specimen label="Cards · fade in on scroll, lift on hover">
              <div className="grid gap-4 sm:grid-cols-3">
                {cards.map((card, i) => (
                  <Reveal key={card.title} delay={i * 0.08} className="h-full">
                    <Card interactive className="h-full">
                      <span aria-hidden className={cn("block size-2.5 rounded-full", card.dot)} />
                      <h3 className="mt-6 font-serif text-2xl">{card.title}</h3>
                      <p className="mt-2 text-sm text-ink-2">{card.text}</p>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </Specimen>
          </div>
        </Block>
      </Container>
    </Section>
  );
}

function Block({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="grid gap-8 border-t border-line py-14 md:grid-cols-[14rem_1fr] md:gap-12">
      <div>
        <h2 className="font-serif text-heading">{title}</h2>
        <p className="mt-3 text-sm text-muted">{note}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-4">{label}</p>
      {children}
    </div>
  );
}

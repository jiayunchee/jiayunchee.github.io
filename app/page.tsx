import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Temporary skeleton for Step 1. Each block gets replaced by a real
// section in a later step, keeping the same `id` so the navbar still works.
const upcoming = [
  { id: "about", eyebrow: "About", title: "A little about me", step: 2 },
  { id: "life", eyebrow: "Life", title: "When I’m not analysing data…", step: 3 },
  { id: "travels", eyebrow: "Travels", title: "Places I’ve been", step: 4 },
  { id: "experience", eyebrow: "Experience", title: "What I’ve been up to", step: 6 },
  { id: "projects", eyebrow: "Projects", title: "Things I’ve built", step: 7 },
  { id: "contact", eyebrow: "Contact", title: "Let’s talk.", step: 9 },
];

export default function Home() {
  return (
    <>
      <Section className="pt-[calc(var(--spacing-nav)_+_var(--spacing-section))]">
        <Container>
          <p className="eyebrow flex items-center gap-2.5">
            <span aria-hidden className="size-1.5 animate-pulse-soft rounded-full bg-accent" />
            Step 1 of 11 · Foundations
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-display">
            The scaffolding is up. <em className="text-muted">The story comes next.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-ink-2">
            This page is a temporary skeleton. The navbar, fonts, colours and spacing
            are real; each dashed box below becomes a proper section in a later step.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/styleguide" arrow="right">
              See the design system
            </Button>
            <Button href="#about" variant="secondary" arrow="down">
              Try the navigation
            </Button>
          </div>
        </Container>
      </Section>

      {upcoming.map((section, i) => (
        <Section key={section.id} id={section.id} className="border-t border-line">
          <Container>
            <SectionHeading
              index={String(i + 1).padStart(2, "0")}
              eyebrow={section.eyebrow}
              title={section.title}
            />
            <div className="mt-10 grid min-h-64 place-items-center rounded-card border border-dashed border-line-strong bg-dots px-6 sm:min-h-80">
              <p className="eyebrow rounded-full bg-paper px-3 py-1.5">
                Coming in step {section.step}
              </p>
            </div>
          </Container>
        </Section>
      ))}
    </>
  );
}

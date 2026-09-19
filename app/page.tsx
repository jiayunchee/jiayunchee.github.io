import { About } from "@/components/About";
import { Hero } from "@/components/Hero";
import { Interests } from "@/components/Interests";
import { Travels } from "@/components/Travels";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Sections still to come. Each placeholder gets replaced in a later step,
// keeping the same `id` so the navbar links keep working.
const upcoming = [
  { id: "experience", index: "04", eyebrow: "Experience", title: "What I’ve been up to", step: 6 },
  { id: "projects", index: "05", eyebrow: "Projects", title: "Things I’ve built", step: 7 },
  { id: "contact", index: "06", eyebrow: "Contact", title: "Let’s talk.", step: 9 },
];

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Interests />
      <Travels />

      {upcoming.map((section) => (
        <Section key={section.id} id={section.id} className="border-t border-line">
          <Container>
            <SectionHeading
              index={section.index}
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

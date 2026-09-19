import { About } from "@/components/About";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Interests } from "@/components/Interests";
import { NationalService } from "@/components/NationalService";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Travels } from "@/components/Travels";
import { Volunteering } from "@/components/Volunteering";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Interests />
      <Travels />
      <Experience />
      <NationalService />
      <Projects />
      <Volunteering />
      <Skills />
      <Education />

      {/* Placeholder until step 9, keeping the id so the navbar link works */}
      <Section id="contact" className="border-t border-line">
        <Container>
          <SectionHeading index="06" eyebrow="Contact" title="Let’s talk." />
          <div className="mt-10 grid min-h-64 place-items-center rounded-card border border-dashed border-line-strong bg-dots px-6 sm:min-h-80">
            <p className="eyebrow rounded-full bg-paper px-3 py-1.5">Coming in step 9</p>
          </div>
        </Container>
      </Section>
    </>
  );
}

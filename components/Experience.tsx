import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";
import { site } from "@/data/site";

export function Experience() {
  // "Now" for anything still ongoing; refreshed every time the site is built
  const today = new Date();
  const now = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  return (
    <Section id="experience" className="border-t border-line">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading
              index="04"
              eyebrow="Experience"
              title="What I’ve been up to"
              description="Where I’ve interned so far, plus two years as a 995 medic."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <Button href={site.linkedin} variant="secondary" arrow="up-right">
              View full experience on LinkedIn
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12">
          <ExperienceTimeline items={experience} now={now} />
        </Reveal>
      </Container>
    </Section>
  );
}

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { HeartDataIcon, HomeHeartIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { volunteering } from "@/data/volunteering";

const icons = {
  "heart-data": HeartDataIcon,
  "home-heart": HomeHeartIcon,
};

export function Volunteering() {
  return (
    <Section id="volunteering" className="border-t border-line">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Volunteering"
            title="Giving back"
            description="I’ve loved volunteering alongside everything else."
          />
        </Reveal>

        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {volunteering.map((item, i) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.role}>
                <Reveal delay={i * 0.08} className="h-full">
                  <Card className="flex h-full gap-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                      <Icon className="size-6" />
                    </span>
                    <div>
                      <h3 className="font-serif text-heading">{item.role}</h3>
                      <p className="mt-1 text-sm text-ink-2">{item.organisation}</p>
                      {item.dates && <p className="text-sm text-muted">{item.dates}</p>}
                      <p className="mt-3 text-ink-2">{item.note}</p>
                    </div>
                  </Card>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

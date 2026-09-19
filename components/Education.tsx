import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { CapIcon, GlobeIcon, HouseIcon, PinIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { earlierSchools, university } from "@/data/education";

const icons = { globe: GlobeIcon, pin: PinIcon, house: HouseIcon };

export function Education() {
  return (
    <Section id="education" className="border-t border-line">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Education" title="Currently learning" />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <Reveal delay={0.06} className="lg:col-span-8">
            <Card className="h-full sm:p-8">
              <p className="eyebrow flex items-center gap-2">
                <CapIcon className="size-4 text-accent" />
                {university.years}
              </p>
              <h3 className="mt-3 font-serif text-heading">{university.school}</h3>
              <p className="mt-1.5 text-ink-2">{university.degree}</p>

              <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-5">
                <div>
                  <dt className="eyebrow">Specialisation</dt>
                  <dd className="mt-1.5 text-ink">{university.specialisation}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Expected graduation</dt>
                  <dd className="mt-1.5 text-ink">{university.graduation}</dd>
                </div>
              </dl>

              <p className="eyebrow mt-6">Along the way</p>
              <ul className="mt-2 divide-y divide-line">
                {university.alongTheWay.map((item) => {
                  const Icon = icons[item.icon];
                  return (
                    <li key={item.name} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3.5">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                        <Icon className="size-[1.125rem]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-ink">{item.name}</p>
                        <p className="text-sm text-muted">{item.detail}</p>
                      </div>
                      <p className="basis-full pl-13 font-mono text-xs text-muted sm:basis-auto sm:pl-0 sm:text-right">
                        {item.when}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-4">
            <Card className="sm:p-8">
              <p className="eyebrow">Before that</p>
              <ul className="mt-5 space-y-6">
                {earlierSchools.map((school) => (
                  <li key={school.school}>
                    <p className="font-serif text-2xl leading-tight text-ink">{school.school}</p>
                    <p className="mt-1 font-mono text-xs text-muted">{school.years}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

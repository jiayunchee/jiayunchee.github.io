import { TravelMap } from "@/components/TravelMap";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/data/site";
import { places, visitedCountries } from "@/data/travel";

export function Travels() {
  return (
    <Section id="travels" className="border-t border-line">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading
              index="03"
              eyebrow="Travels"
              title="Places I’ve been"
              description="A growing collection of places, memories, and stories."
            />
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="grid grid-cols-2 gap-x-10 gap-y-6 sm:flex sm:gap-12">
              <Stat label="Places explored" value={`${places.length}+`} />
              <Stat label="Countries" value={String(visitedCountries.length)} />
              <div className="col-span-2 sm:col-span-1">
                <dt className="eyebrow">Next destination</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent("An idea for your next destination")}`}
                    className="group inline-flex items-baseline gap-3 text-4xl font-semibold tracking-tight text-ink"
                  >
                    → ?
                    <span className="font-hand text-lg font-normal tracking-normal text-accent opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100">
                      suggestions welcome
                    </span>
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12">
          <TravelMap />
        </Reveal>
      </Container>
    </Section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-2 text-4xl font-semibold tracking-tight text-ink">{value}</dd>
    </div>
  );
}

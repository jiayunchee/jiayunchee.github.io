import { Container } from "@/components/ui/Container";
import { Polaroid } from "@/components/ui/Polaroid";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Kept deliberately understated: the facts do the talking
const honours = [
  { title: "COVID-19 Resilience Medal", note: "National award", icon: <MedalIcon /> },
  {
    title: "First place in theory",
    note: "EMT training, in my batch",
    icon: <span className="font-mono text-[0.6875rem] font-medium text-ink">1st</span>,
  },
];

export function NationalService() {
  return (
    <Section id="service" className="border-t border-line bg-paper-2/50">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="mx-auto w-full max-w-[20rem] lg:col-span-5 lg:mx-0 lg:max-w-[23rem]">
            <Polaroid
              src="/images/ns/scdf-995-medic.webp"
              alt="Jia Yun in SCDF uniform, standing in front of an SCDF ambulance"
              caption="995 medic, SCDF"
              tilt={-2}
              sizes="(min-width: 1024px) 23rem, 80vw"
            />
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeading
                eyebrow="National Service · 2021 – 2023"
                title="Before all this, I was a 995 medic"
              />
            </Reveal>

            <Reveal delay={0.08} className="mt-6 max-w-xl space-y-4 text-lead text-ink-2">
              <p>
                From 2021 to 2023, I served my National Service as a 995 medic with the
                Singapore Civil Defence Force, in the batch that was on the frontline
                through COVID-19.
              </p>
              <p>Definitely one of the more memorable chapters so far.</p>
            </Reveal>

            <Reveal delay={0.14}>
              <ul className="mt-10 max-w-xl divide-y divide-line border-y border-line">
                {honours.map((honour) => (
                  <li key={honour.title} className="flex items-center gap-4 py-4">
                    <span
                      aria-hidden
                      className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-card"
                    >
                      {honour.icon}
                    </span>
                    <div>
                      <p className="font-medium text-ink">{honour.title}</p>
                      <p className="text-sm text-muted">{honour.note}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5 text-ink">
      <path
        d="M8 3h3l1 5M16 3h-3l-1 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="14.5" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="m12 12 .8 1.6 1.7.2-1.3 1.2.3 1.7-1.5-.8-1.5.8.3-1.7-1.3-1.2 1.7-.2L12 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

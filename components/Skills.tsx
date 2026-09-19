import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { skills } from "@/data/skills";
import { cn } from "@/lib/utils";

// Each row's dots light up in its own colour when you hover the row
const rowColours = ["group-hover:bg-ball-2", "group-hover:bg-ball-5", "group-hover:bg-ball-6"];

export function Skills() {
  return (
    <Section id="skills" className="border-t border-line">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading eyebrow="Skills" title="Things I know my way around" />
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-8">
            <ul className="divide-y divide-line border-y border-line">
              {skills.map((row, i) => (
                <li
                  key={row.group}
                  className="group grid gap-3 py-6 sm:grid-cols-[8rem_1fr] sm:items-baseline sm:gap-6"
                >
                  <p className="eyebrow transition-colors duration-300 group-hover:text-ink">
                    {row.group}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {row.items.map((item) => (
                      <li key={item}>
                        <Tag
                          dot={cn(
                            "bg-line-strong transition-colors duration-300",
                            rowColours[i % rowColours.length],
                          )}
                        >
                          {item}
                        </Tag>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

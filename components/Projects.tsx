import Image from "next/image";
import { KayaVideo } from "@/components/KayaVideo";
import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { CalendarIcon, MoonIcon, PeopleIcon, TelegramIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { kaya, projects, type Project } from "@/data/projects";

export function Projects() {
  return (
    <Section id="projects" className="border-t border-line">
      <Container>
        <Reveal>
          <SectionHeading index="05" eyebrow="Projects" title="Things I’ve built" />
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <article className="grid gap-8 rounded-card border border-line bg-card p-5 shadow-card sm:p-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-14 lg:p-10">
            <KayaVideo
              src={kaya.video}
              poster={kaya.poster}
              className="mx-auto w-full max-w-[16rem] md:max-w-none"
            />

            <div className="flex flex-col">
              <p className="eyebrow">Side project · {kaya.years}</p>
              <h3 className="mt-3 font-serif text-title">{kaya.name}</h3>

              {/* Kept low-key on purpose */}
              <div className="mt-5 max-w-xl space-y-4 text-ink-2 sm:text-lead">
                <p>
                  A self-initiated dating app for university students, which I started at the
                  end of 2023 with my brother and his friend.
                </p>
                <p>
                  We realised dating was hard when everyone came from such different life
                  experiences, so Kaya was built around finding common ground. Its main idea
                  was intention matching: you pick what you’d actually like to do, like coffee,
                  a study date or sports, and the app reveals what you and your match have in
                  common.
                </p>
                <p>
                  The first phase went well, with around 400 sign-ups across the app and our
                  Telegram group. It ran from 2023 to 2024, and it’s hibernating for now while
                  we’re all busy.
                </p>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-2">
                <li className="inline-flex items-center gap-2">
                  <PeopleIcon className="text-accent" />
                  {kaya.signUps} sign-ups
                </li>
                <li className="inline-flex items-center gap-2">
                  <CalendarIcon className="text-accent" />
                  {kaya.years}
                </li>
                <li className="inline-flex items-center gap-2">
                  <MoonIcon className="text-accent" />
                  {kaya.status} for now
                </li>
              </ul>

              <div className="mt-8 md:mt-auto md:pt-8">
                <Button href={kaya.telegram} variant="secondary" arrow="up-right">
                  <TelegramIcon className="size-4" />
                  Our Telegram group
                </Button>
              </div>
            </div>
          </article>
        </Reveal>

        {projects.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.name} delay={i * 0.06}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.12}>
            <p className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-card border border-dashed border-line-strong px-6 py-5 text-sm text-muted">
              More projects are in the works. This space will fill up.
              <span className="font-hand text-xl text-accent">watch this space</span>
            </p>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

/** A smaller card for each extra project in data/projects.ts */
function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-paper-2">
        {project.image ? (
          <Image
            src={project.image}
            alt={`Screenshot of ${project.name}`}
            fill
            sizes="(min-width: 1024px) 22rem, (min-width: 768px) 45vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center bg-dots font-hand text-xl text-muted">
            screenshot coming soon
          </div>
        )}
      </div>
      <h3 className="mt-5 font-serif text-heading">{project.name}</h3>
      <p className="mt-2 text-sm text-ink-2">{project.description}</p>
      {project.tech && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>
      )}
      {(project.github || project.demo) && (
        <div className="mt-auto flex gap-5 pt-5 text-sm font-medium">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-ink">
              GitHub <Arrow direction="up-right" className="transition group-hover:-translate-y-0.5" />
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-ink">
              Live demo <Arrow direction="up-right" className="transition group-hover:-translate-y-0.5" />
            </a>
          )}
        </div>
      )}
    </Card>
  );
}

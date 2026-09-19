import { Timeline } from "@/components/Timeline";
import { Container } from "@/components/ui/Container";
import { Polaroid } from "@/components/ui/Polaroid";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/data/site";
import { timeline } from "@/data/timeline";

export function About() {
  return (
    <Section id="about" className="border-t border-line">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeading index="01" eyebrow="About" title="A little about me" />
            </Reveal>

            {/* Edit these paragraphs freely: they're the heart of the page */}
            <Reveal delay={0.08} className="mt-8 space-y-5 text-lead text-ink-2">
              <p>
                Right now I’m in my final year at NUS, doing a Bachelor of Science in{" "}
                <mark className="highlight">Data Science & Analytics (Honours)</mark> with a
                specialisation in <mark className="highlight">Operations Research</mark>.
                It’s a very official way of saying I like taking messy problems apart and
                working out how to make things run a little better.
              </p>
              <p>
                I’m happiest when I’m building something. In my first year I co-founded
                Project Kaya, a social discovery app for university students, because I
                thought meeting people on campus could be much easier. Since then I’ve
                picked up internships across tech, government, banking and healthcare, and
                learnt a lot about turning numbers into decisions.
              </p>
              <p>
                When I’m not in front of a spreadsheet, I’m probably at a pool table, in the
                gym or the pool, planning the next trip, or out with friends looking for
                somewhere good to eat. Graduation is pencilled in for{" "}
                <mark className="highlight">May 2027</mark>; until then, I’m collecting as
                many stories as I can.
              </p>
            </Reveal>
          </div>

          <Reveal
            delay={0.15}
            className="mx-auto w-full max-w-[20rem] lg:col-span-5 lg:mt-24 lg:mr-0 lg:max-w-[22rem]"
          >
            <Polaroid
              src={site.portrait}
              alt="A photo of Jia Yun"
              caption="me, probably thinking about pool"
              placeholder="photo of me, coming soon"
              tilt={3}
            />
          </Reveal>
        </div>

        <Reveal className="mt-20 sm:mt-24">
          <p className="eyebrow mb-6">The story so far</p>
          <Timeline entries={timeline} />
        </Reveal>
      </Container>
    </Section>
  );
}

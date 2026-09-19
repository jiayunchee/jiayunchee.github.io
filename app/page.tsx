import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Interests } from "@/components/Interests";
import { NationalService } from "@/components/NationalService";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Travels } from "@/components/Travels";
import { Volunteering } from "@/components/Volunteering";

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
      <Contact />
    </>
  );
}

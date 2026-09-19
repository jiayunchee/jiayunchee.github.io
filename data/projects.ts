// Things I've built. The featured project gets the big card; anything in
// `projects` becomes a smaller card underneath.

export type Project = {
  name: string;
  description: string;
  /** e.g. ["Python", "Streamlit"] */
  tech?: string[];
  /** Screenshot in /public, e.g. "/images/projects/my-app.png" */
  image?: string;
  github?: string;
  demo?: string;
};

export const kaya = {
  name: "Project Kaya",
  years: "2023 – 2024",
  status: "Hibernating",
  signUps: "~400",
  telegram: "https://t.me/projectkaya",
  video: "/videos/kaya-promo.mp4",
  poster: "/videos/kaya-promo-poster.webp",
};

// Add a project by copying this shape, e.g.
// { name: "…", description: "…", tech: ["Python"], github: "https://github.com/…" }
export const projects: Project[] = [];

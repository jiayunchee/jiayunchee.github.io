// Site-wide details. Change something here and it updates everywhere.

export const site = {
  name: "Chee Jia Yun",
  firstName: "Jia Yun",
  wordmark: "JIA YUN",
  description:
    "Data science student. Builder. Traveller. Pool addict. Health enthusiast.",
  tagline: "Building things. Going places. Staying curious.",
  email: "cheejiayun2405@gmail.com",
  linkedin: "https://www.linkedin.com/in/jia-yun-chee/",
} as const;

export type NavLink = {
  label: string;
  /** Matches the `id` of a section on the homepage */
  id: string;
};

export const navLinks: NavLink[] = [
  { label: "About", id: "about" },
  { label: "Life", id: "life" },
  { label: "Travels", id: "travels" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

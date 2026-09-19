// The "story so far" timeline in the About section.
// Add, remove or reword entries freely; the timeline adapts automatically.

export type TimelineEntry = {
  year: string;
  title: string;
  description: string;
  /** Small tags shown under the description */
  highlights?: string[];
  /** Marks the chapter you're in right now (only one entry) */
  now?: boolean;
};

export const timeline: TimelineEntry[] = [
  {
    year: "2023",
    title: "Started NUS",
    description:
      "Began my Data Science & Analytics degree after a summer interning in finance & investment, and co-founded Project Kaya that November.",
    highlights: ["NUS", "Advisor Alliance Group", "Project Kaya"],
  },
  {
    year: "2024",
    title: "Built things, travelled, explored",
    description:
      "Spent the summer as a business analyst intern at SlurpBros, kept growing Project Kaya, and headed to Jakarta for the NUS STEER winter programme.",
    highlights: ["SlurpBros", "Project Kaya", "STEER Jakarta"],
  },
  {
    year: "2025",
    title: "More internships + projects",
    description:
      "Business insights at MSD, volunteering as a data analyst with the Singapore Red Cross, and plenty of side projects in between.",
    highlights: ["MSD", "Singapore Red Cross"],
  },
  {
    year: "2026",
    title: "Exchange at UC San Diego + internships",
    description:
      "An exchange at UC San Diego, then internships at GovTech, Bank of Singapore and now TikTok.",
    highlights: ["UC San Diego", "GovTech", "Bank of Singapore", "TikTok"],
    now: true,
  },
  {
    year: "2027",
    title: "Graduation",
    description:
      "Graduating in May with my BSc in Data Science & Analytics (Honours). What comes next is still being written.",
  },
];

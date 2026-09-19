// Where I've worked, newest first: just the company, role and dates.
//
// Dates are "YYYY-MM", e.g. "2026-07".
// - end: "now" for something you're still doing (leave out `start` if you'd rather not show it)
// - approximate: true shows years only, and the bar gets soft ends

export type Experience = {
  company: string;
  role: string;
  start?: string;
  end: string;
  approximate?: boolean;
  /** Make the row a link, e.g. to a section further down */
  href?: string;
};

export const experience: Experience[] = [
  {
    company: "TikTok (ByteDance)",
    role: "Monetisation Strategy & Operations Intern",
    end: "now",
  },
  {
    company: "Bank of Singapore",
    role: "Business Risk & Governance Intern",
    start: "2026-07",
    end: "2026-09",
  },
  {
    company: "GovTech",
    role: "Digital Business Analyst Intern",
    start: "2026-01",
    end: "2026-06",
  },
  {
    company: "MSD (Merck & Co.)",
    role: "Business Insights & Activation Intern",
    start: "2025-07",
    end: "2025-09",
  },
  {
    company: "Advisors Alliance Group",
    role: "Financial Intern",
    start: "2023-06",
    end: "2023-08",
  },
  {
    company: "SCDF",
    role: "995 Medic · Full-time National Service",
    // Months are a guess between Foo Kon Tan and AAG; only the years are shown
    start: "2021-05",
    end: "2023-05",
    approximate: true,
    href: "#service",
  },
  {
    company: "Foo Kon Tan",
    role: "Quality Assurance Intern",
    start: "2021-01",
    end: "2021-04",
  },
];

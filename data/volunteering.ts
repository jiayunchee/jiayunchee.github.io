// Volunteering, newest first. `icon` picks one of the little drawings in
// components/ui/Icons.tsx.

export type Volunteering = {
  role: string;
  organisation: string;
  /** Leave out if you'd rather not show dates */
  dates?: string;
  note: string;
  icon: "heart-data" | "home-heart";
};

export const volunteering: Volunteering[] = [
  {
    role: "Data Analyst Volunteer",
    organisation: "Singapore Red Cross",
    dates: "Sep 2025 – present",
    note: "I wanted to use my skills to make an impact in society.",
    icon: "heart-data",
  },
  {
    role: "Silver Generation Ambassador",
    organisation: "Silver Generation Office",
    note: "Reaching out to seniors in the community.",
    icon: "home-heart",
  },
];

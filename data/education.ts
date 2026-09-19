// Where I've studied. `icon` picks one of the little drawings in components/ui/Icons.tsx.

export const university = {
  school: "National University of Singapore",
  degree: "Bachelor of Science, Data Science & Analytics (Honours)",
  years: "2023 – 2027",
  specialisation: "Operations Research",
  graduation: "May 2027",
  alongTheWay: [
    {
      name: "UC San Diego",
      detail: "NUS Student Exchange Programme",
      when: "Semester 1, 2025/26",
      icon: "globe",
    },
    {
      name: "STEER, Jakarta",
      detail: "NUS Winter Programme",
      when: "2024/25",
      icon: "pin",
    },
    {
      name: "Eusoff Hall",
      detail: "Hall of residence",
      when: "2023/24, 2024/25",
      icon: "house",
    },
  ],
} as const;

export const earlierSchools = [
  { school: "National Junior College", years: "2019 – 2020" },
  { school: "Maris Stella High School", years: "2015 – 2018" },
];

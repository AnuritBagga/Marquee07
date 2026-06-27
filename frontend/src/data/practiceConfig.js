// Interview type config used by Practice setup + session pages.

export const INTERVIEW_TYPES = [
  {
    id: "technical",
    label: "Technical (DSA + Coding)",
    icon: "⚡",
    desc: "Data structures, algorithms, LeetCode-style problems with live code execution in Java, Python, C++.",
    skills: ["DSA", "System Design", "Java", "Python", "C++", "JavaScript", "React", "SQL", "ML/AI"],
    tips: [
      "Walk through your approach before coding. Always explain time and space complexity.",
      "Consider edge cases: empty input, single element, negative numbers, integer overflow.",
      "If stuck, describe a brute-force approach first, then optimise step by step.",
    ],
  },
  {
    id: "domain",
    label: "Others",
    icon: "🏗️",
    desc: "CS fundamentals, Mechanical, Civil, Electrical, MBA, Commerce, DBMS, OS, Networks, System Design, based on your resume.",
    skills: ["CS Core", "DBMS", "OS", "Networks", "Mechanical", "Civil", "Electrical", "MBA", "Commerce", "Management"],
    tips: [
      "Use the STAR method — Situation, Task, Action, Result. Be specific.",
      "Cite real projects from your resume. Interviewers will probe you on them.",
      "It's okay to say 'I don't know' — follow up with how you'd find out.",
    ],
  },
  {
    id: "upsc",
    label: "UPSC Personality Test",
    icon: "🏛️",
    desc: "Ethics, governance, current affairs, personality probing by a senior UPSC Board Chairperson.",
    skills: ["Ethics", "Governance", "Current Affairs", "History", "Geography", "Polity", "Economy"],
    tips: [
      "Maintain composure. The board is evaluating your personality, not just knowledge.",
      "Back opinions with reasoning. Acknowledge multiple perspectives before giving yours.",
      "Draw on current affairs but connect them to deeper constitutional or ethical principles.",
    ],
  },
  {
    id: "defence",
    label: "NDA / CDS / SSB",
    icon: "🎖️",
    desc: "Defence services board interview — personality, leadership, situation reaction, GK.",
    skills: ["Leadership", "GK", "Military History", "Logical Reasoning", "Teamwork", "Communication"],
    tips: [
      "Speak with confidence and clarity. Hesitation is noted by the board.",
      "Show leadership thinking — how you'd handle team scenarios under pressure.",
      "Be honest about your background. They value integrity above everything else.",
    ],
  },
];

export const INTERVIEWERS = {
  technical: {
    name: "Riya Menon",
    title: "Senior Engineer · Northwind Labs",
    portrait: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&h=1200&q=85&crop=faces&facepad=3",
  },
  domain: {
    name: "Karan Iyer",
    title: "Staff Engineer · Helix & Co.",
    portrait: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1200&h=1200&q=85&crop=faces&facepad=3",
  },
  upsc: {
    name: "Dr. R. Mehta",
    title: "Board Chairperson · UPSC Panel",
    portrait: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=1200&h=1200&q=85&crop=faces&facepad=3",
  },
  defence: {
    name: "Col. Arjun Singh",
    title: "Selection Officer · SSB Board",
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&h=1200&q=85&crop=faces&facepad=3",
  },
};

export const getInterviewType = (id) =>
  INTERVIEW_TYPES.find((t) => t.id === id) || INTERVIEW_TYPES[0];
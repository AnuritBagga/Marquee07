// Interview type config used by Practice setup + session pages.

export const INTERVIEW_TYPES = [
  {
    id: "technical",
    label: "Technical (DSA + Coding)",
    icon: "⚡",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    desc: "Data structures, algorithms, LeetCode-style problems with live code execution in Java, Python, C++.",
    skills: ["DSA", "System Design", "Java", "Python", "C++", "JavaScript", "React", "SQL", "ML/AI"],
    tips: [
      "Walk through your approach before coding. Always explain time and space complexity.",
      "Consider edge cases: empty input, single element, negative numbers, integer overflow.",
      "If stuck, describe a brute-force approach first, then optimise step by step.",
    ],
  },
  {
    id: "engineering",
    label: "Engineering (Mechanical/Electrical/Civil)",
    icon: "⚙️",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
    desc: "Core engineering concepts, thermodynamics, circuits, structures, CAD, project work based on your discipline.",
    skills: ["Thermodynamics", "Fluid Mechanics", "Circuits", "Control Systems", "Structures", "CAD", "Manufacturing", "Power Systems"],
    tips: [
      "Be clear about fundamental principles. Use diagrams or flowcharts if explaining complex systems.",
      "Discuss your projects in detail — methodology, challenges faced, solutions implemented.",
      "Connect theoretical knowledge to practical applications you've worked on.",
    ],
  },
  {
    id: "mba",
    label: "MBA / Finance",
    icon: "💼",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    desc: "Management concepts, business strategy, finance, marketing, case analysis, leadership scenarios.",
    skills: ["Strategy", "Finance", "Marketing", "Operations", "Analytics", "Leadership", "Case Studies", "Business Models"],
    tips: [
      "Use frameworks like SWOT, Porter's 5 Forces, or 4Ps when analyzing situations.",
      "Quantify your achievements — revenue impact, cost savings, team size, project outcomes.",
      "Demonstrate business acumen by connecting academic concepts to real-world examples.",
    ],
  },
  {
    id: "law",
    label: "LLB (Law)",
    icon: "⚖️",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    desc: "Constitutional law, contracts, torts, criminal law, legal reasoning, case analysis, moot court experience.",
    skills: ["Constitutional Law", "Contracts", "Torts", "Criminal Law", "Legal Research", "Argumentation", "Case Analysis", "Jurisprudence"],
    tips: [
      "Cite landmark cases and judgments to support your arguments.",
      "Demonstrate logical reasoning and ability to analyze both sides of an issue.",
      "Be prepared to discuss current legal developments and reforms.",
    ],
  },
  {
    id: "upsc",
    label: "UPSC Personality Test",
    icon: "🏛️",
    image: "https://th.bing.com/th/id/OIP.WSGTwyWIQv3s53aVvhZw0QHaE8?w=259&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
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
    image: "https://th.bing.com/th/id/OIP.wtGgUc8swrb3CQ4L6F9c5QHaDj?w=316&h=168&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
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
  engineering: {
    name: "Dr. Vikram Patel",
    title: "Principal Engineer · Industrial Systems",
    portrait: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1200&h=1200&q=85&crop=faces&facepad=3",
  },
  mba: {
    name: "Priya Sharma",
    title: "Associate Director · Global Consulting",
    portrait: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&h=1200&q=85&crop=faces&facepad=3",
  },
  law: {
    name: "Adv. Rajesh Kumar",
    title: "Senior Advocate · High Court",
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&h=1200&q=85&crop=faces&facepad=3",
  },
  upsc: {
    name: "Dr. R. Mehta",
    title: "Board Chairperson · UPSC Panel",
    portrait: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=1200&h=1200&q=85&crop=faces&facepad=3",
  },
  defence: {
    name: "Col. Arjun Singh",
    title: "Selection Officer · SSB Board",
    portrait: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&h=1200&q=85&crop=faces&facepad=3",
  },
};

export const getInterviewType = (id) =>
  INTERVIEW_TYPES.find((t) => t.id === id) || INTERVIEW_TYPES[0];
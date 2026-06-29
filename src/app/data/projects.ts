export interface Project {
  name: string;
  location: string;
  budget: string;
  beneficiaries: number;
  startDate: string;
  statusKey: string;
  descKey: string;
  icon: string;
  statusColor: string;
  iconBg: string;
}

export const PROJECTS: Project[] = [
  {
    name: "Digital Skills Training Programme",
    location: "Kuala Lumpur",
    budget: "RM 45,000",
    beneficiaries: 127,
    startDate: "Jan 2026",
    statusKey: "projects.status.active",
    descKey: "projects.proj1.desc",
    icon: "🎓",
    statusColor: "text-[#1B5E38] bg-[#E8F5EE]",
    iconBg: "#E8F5EE",
  },
  {
    name: "Youth Job Readiness Initiative",
    location: "Shah Alam, Selangor",
    budget: "RM 28,500",
    beneficiaries: 84,
    startDate: "Feb 2026",
    statusKey: "projects.status.active",
    descKey: "projects.proj2.desc",
    icon: "🤝",
    statusColor: "text-[#1A3A6B] bg-[#EBF3FB]",
    iconBg: "#EBF3FB",
  },
  {
    name: "Community Financial Literacy Workshop",
    location: "Georgetown, Penang",
    budget: "RM 12,000",
    beneficiaries: 52,
    startDate: "Oct 2025",
    statusKey: "projects.status.completed",
    descKey: "projects.proj3.desc",
    icon: "📊",
    statusColor: "text-[#633806] bg-[#FAEEDA]",
    iconBg: "#FAEEDA",
  },
];

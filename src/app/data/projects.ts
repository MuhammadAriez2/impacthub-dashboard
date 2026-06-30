export interface BeneficiarySlice {
  name: string;
  value: number;
  color: string;
}

export interface Project {
  name: string;
  type: string;
  location: string;
  budget: string;
  budgetUsed: string;
  completion: number;
  beneficiaries: number;
  startDate: string;
  statusKey: string;
  descKey: string;
  icon: string;
  statusColor: string;
  iconBg: string;
  beneficiaryBreakdown: BeneficiarySlice[];
}

export const PROJECTS: Project[] = [
  {
    name: "Digital Skills Training Programme",
    type: "Education & Workforce",
    location: "Kuala Lumpur",
    budget: "RM 45,000",
    budgetUsed: "RM 33,750",
    completion: 75,
    beneficiaries: 127,
    startDate: "Jan 2026",
    statusKey: "projects.status.active",
    descKey: "projects.proj1.desc",
    icon: "🎓",
    statusColor: "text-[#1B5E38] bg-[#E8F5EE]",
    iconBg: "#E8F5EE",
    beneficiaryBreakdown: [
      { name: "B40 Youth", value: 74, color: "#1F7A68" },
      { name: "Women", value: 31, color: "#4ACED1" },
      { name: "Disabled", value: 22, color: "#1A3A6B" },
    ],
  },
  {
    name: "Youth Job Readiness Initiative",
    type: "Employment Readiness",
    location: "Shah Alam, Selangor",
    budget: "RM 28,500",
    budgetUsed: "RM 21,375",
    completion: 60,
    beneficiaries: 84,
    startDate: "Feb 2026",
    statusKey: "projects.status.active",
    descKey: "projects.proj2.desc",
    icon: "🤝",
    statusColor: "text-[#1A3A6B] bg-[#EBF3FB]",
    iconBg: "#EBF3FB",
    beneficiaryBreakdown: [
      { name: "B40 Youth", value: 52, color: "#1F7A68" },
      { name: "Refugees", value: 18, color: "#F5A623" },
      { name: "Disabled", value: 14, color: "#1A3A6B" },
    ],
  },
  {
    name: "Community Financial Literacy Workshop",
    type: "Financial Inclusion",
    location: "Georgetown, Penang",
    budget: "RM 12,000",
    budgetUsed: "RM 12,000",
    completion: 100,
    beneficiaries: 52,
    startDate: "Oct 2025",
    statusKey: "projects.status.completed",
    descKey: "projects.proj3.desc",
    icon: "📊",
    statusColor: "text-[#633806] bg-[#FAEEDA]",
    iconBg: "#FAEEDA",
    beneficiaryBreakdown: [
      { name: "B40 Women", value: 28, color: "#1F7A68" },
      { name: "Informal Sector", value: 14, color: "#4ACED1" },
      { name: "Elderly", value: 10, color: "#F5A623" },
    ],
  },
];

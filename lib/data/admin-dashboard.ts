export const adminKpis = [
  { id: "customers", label: "Total Customers", value: "1,284", delta: "+42 this week" },
  { id: "professionals", label: "Total Professionals", value: "376", delta: "+18 this week" },
  { id: "activeJobs", label: "Active Jobs", value: "148", delta: "62 en route" },
  { id: "completedJobs", label: "Completed Jobs", value: "2,941", delta: "+126 this week" },
  { id: "creditsSold", label: "Credits Sold", value: "18,420", delta: "$12.4k Stripe" },
  { id: "creditAdd", label: "Credit add", value: "640", delta: "Admin grants" },
  { id: "revenue", label: "Revenue", value: "$42,180", delta: "+12% vs last month" },
  { id: "registrations", label: "New Registrations", value: "86", delta: "This week" },
] as const;

export const weekLabels = ["3 Aug", "10 Aug", "17 Aug", "24 Aug", "31 Aug", "7 Sep"];

export const registrationSeries = {
  customers: [38, 44, 41, 52, 61, 64],
  professionals: [9, 11, 8, 14, 16, 22],
};

export const revenueByWeek = [5200, 6100, 5800, 7200, 8100, 9780];
export const creditsSoldByWeek = [2100, 2400, 1980, 2860, 3200, 3880];
export const creditAddsByWeek = [40, 80, 60, 120, 90, 250];
export const jobsCompletedByWeek = [86, 92, 88, 104, 118, 126];
export const jobsActiveByWeek = [110, 124, 118, 136, 142, 148];

export const recentRegistrations = [
  { id: "u1", name: "Sam Patel", role: "Customer", when: "Today · 09:14", city: "North Yard" },
  { id: "u2", name: "Nora Voss", role: "Professional", when: "Today · 08:41", city: "East Dock" },
  { id: "u3", name: "Elena Rossi", role: "Customer", when: "Yesterday", city: "Harbor" },
  { id: "u4", name: "Kenji Sato", role: "Professional", when: "Yesterday", city: "Central" },
  { id: "u5", name: "Chris Bell", role: "Customer", when: "8 Sep", city: "North Yard" },
];

export const creditLedgerRows = [
  { id: "cl1", who: "Maya Chen", type: "Stripe", amount: 25, when: "Today · 10:02" },
  { id: "cl2", who: "Luis Ortega", type: "Admin add", amount: 10, when: "Today · 09:18" },
  { id: "cl3", who: "Priya Shah", type: "Stripe", amount: 50, when: "Yesterday" },
  { id: "cl4", who: "Kenji Sato", type: "Stripe", amount: 10, when: "8 Sep" },
  { id: "cl5", who: "Nora Voss", type: "Admin add", amount: 10, when: "8 Sep" },
];

export const grantProfessionals = [
  { id: "p1", name: "Maya Chen" },
  { id: "p2", name: "Luis Ortega" },
  { id: "p4", name: "Kenji Sato" },
  { id: "p5", name: "Nora Voss" },
  { id: "p7", name: "Priya Shah" },
];

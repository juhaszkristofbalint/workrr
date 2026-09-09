export type NearbyJob = {
  id: string;
  title: string;
  category: string;
  customerName: string;
  neighborhood: string;
  distanceKm: number;
  budget: string;
  posted: string;
  description: string;
  emergency: boolean;
  photos: { src: string; alt: string }[];
};

export const nearbyJobs: NearbyJob[] = [
  {
    id: "nj1",
    title: "Kitchen outlet sparking",
    category: "Electrical",
    customerName: "Sam Patel",
    neighborhood: "North Yard",
    distanceKm: 0.9,
    budget: "$120–160",
    posted: "12m ago",
    description:
      "The outlet above the kitchen counter sparked when I plugged in the toaster. Faint burning smell. Power is off at the breaker.",
    emergency: true,
    photos: [
      { src: "/jobs/outlet-1.svg", alt: "Kitchen wall outlet" },
      { src: "/jobs/outlet-2.svg", alt: "Close-up of scorched outlet" },
    ],
  },
  {
    id: "nj2",
    title: "Locked out of apartment",
    category: "Locksmith",
    customerName: "Noah Kim",
    neighborhood: "Central",
    distanceKm: 1.1,
    budget: "$90–130",
    posted: "28m ago",
    description:
      "Keys are inside. Deadbolt is locked and I cannot get in. Need someone as soon as possible tonight.",
    emergency: true,
    photos: [{ src: "/jobs/lock-1.svg", alt: "Locked front door" }],
  },
  {
    id: "nj3",
    title: "Leaking sink valve",
    category: "Plumbing",
    customerName: "Jordan Hale",
    neighborhood: "Harbor St",
    distanceKm: 2.3,
    budget: "$80–110",
    posted: "2h ago",
    description:
      "The shutoff valve under the bathroom sink drips steadily. Bowl underneath. Stains starting on the cabinet floor.",
    emergency: false,
    photos: [
      { src: "/jobs/sink-1.svg", alt: "Bathroom sink cabinet" },
      { src: "/jobs/sink-2.svg", alt: "Dripping shutoff valve" },
      { src: "/jobs/sink-3.svg", alt: "Water stain on cabinet floor" },
    ],
  },
  {
    id: "nj4",
    title: "Panel check before renovation",
    category: "Electrical",
    customerName: "Riley Ng",
    neighborhood: "Central",
    distanceKm: 1.8,
    budget: "$90–140",
    posted: "3h ago",
    description:
      "Need a licensed electrician to inspect the panel before we add kitchen circuits. One breaker feels warm.",
    emergency: false,
    photos: [
      { src: "/jobs/panel-1.svg", alt: "Electrical panel" },
      { src: "/jobs/outlet-1.svg", alt: "Nearby outlet" },
    ],
  },
  {
    id: "nj5",
    title: "AC not cooling upstairs",
    category: "HVAC",
    customerName: "Elena Rossi",
    neighborhood: "East Dock",
    distanceKm: 3.6,
    budget: "$150–220",
    posted: "5h ago",
    description:
      "Upstairs rooms stay warm while downstairs is fine. Outdoor unit runs. Prefer a visit this week.",
    emergency: false,
    photos: [
      { src: "/jobs/ac-1.svg", alt: "Outdoor AC unit" },
      { src: "/jobs/ac-2.svg", alt: "Indoor vent" },
    ],
  },
];

export function nearbyJobsByDistance() {
  return [...nearbyJobs].sort((a, b) => {
    if (a.emergency !== b.emergency) return a.emergency ? -1 : 1;
    return a.distanceKm - b.distanceKm;
  });
}

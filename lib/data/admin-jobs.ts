export type ModeratedJobStatus =
  | "open"
  | "matched"
  | "en route"
  | "completed"
  | "removed";

export type ModeratedJobPhoto = {
  src: string;
  alt: string;
};

export type ModeratedJob = {
  id: string;
  title: string;
  category: string;
  description: string;
  address: string;
  customerName: string;
  assignedProfessional: string | null;
  status: ModeratedJobStatus;
  posted: string;
  photos: ModeratedJobPhoto[];
  flagged?: boolean;
};

export const moderatedJobs: ModeratedJob[] = [
  {
    id: "c1",
    title: "Kitchen outlet sparking",
    category: "Electrical",
    description:
      "The outlet above the kitchen counter sparked when I plugged in the toaster. Faint burning smell. Power is off at the breaker.",
    address: "12 Harbor St, North Yard",
    customerName: "Sam Patel",
    assignedProfessional: "Maya Chen",
    status: "matched",
    posted: "Today · 10:12",
    photos: [
      { src: "/jobs/outlet-1.svg", alt: "Kitchen wall outlet" },
      { src: "/jobs/outlet-2.svg", alt: "Close-up of scorched outlet" },
    ],
  },
  {
    id: "c2",
    title: "Leaking sink valve",
    category: "Plumbing",
    description:
      "The shutoff valve under the bathroom sink drips steadily. Bowl underneath. Stains starting on the cabinet floor.",
    address: "88 Central Ave",
    customerName: "Jordan Hale",
    assignedProfessional: null,
    status: "open",
    posted: "Yesterday · 18:40",
    photos: [
      { src: "/jobs/sink-1.svg", alt: "Bathroom sink cabinet" },
      { src: "/jobs/sink-2.svg", alt: "Dripping shutoff valve" },
      { src: "/jobs/sink-3.svg", alt: "Water stain on cabinet floor" },
    ],
  },
  {
    id: "nj2",
    title: "Locked out of apartment",
    category: "Locksmith",
    description:
      "Keys are inside. Deadbolt is locked and I cannot get in. Need someone as soon as possible tonight.",
    address: "Central · apartment lobby",
    customerName: "Noah Kim",
    assignedProfessional: "Kenji Sato",
    status: "en route",
    posted: "28m ago",
    photos: [{ src: "/jobs/lock-1.svg", alt: "Locked front door" }],
  },
  {
    id: "nj4",
    title: "Panel check before renovation",
    category: "Electrical",
    description:
      "Need a licensed electrician to inspect the panel before we add kitchen circuits. One breaker feels warm.",
    address: "Central",
    customerName: "Riley Ng",
    assignedProfessional: null,
    status: "open",
    posted: "3h ago",
    photos: [
      { src: "/jobs/panel-1.svg", alt: "Electrical panel" },
      { src: "/jobs/outlet-1.svg", alt: "Nearby outlet" },
    ],
  },
  {
    id: "nj5",
    title: "AC not cooling upstairs",
    category: "HVAC",
    description:
      "Upstairs rooms stay warm while downstairs is fine. Outdoor unit runs. Prefer a visit this week.",
    address: "East Dock",
    customerName: "Elena Rossi",
    assignedProfessional: "Luis Ortega",
    status: "completed",
    posted: "5h ago",
    photos: [
      { src: "/jobs/ac-1.svg", alt: "Outdoor AC unit" },
      { src: "/jobs/ac-2.svg", alt: "Indoor vent" },
    ],
  },
  {
    id: "mod-1",
    title: "URGENT $$$ click this listing",
    category: "Handyperson",
    description:
      "Spam listing with off-topic photos and a request that does not describe real work. Reported by two professionals.",
    address: "Unknown",
    customerName: "Chris Bell",
    assignedProfessional: null,
    status: "open",
    posted: "1h ago",
    flagged: true,
    photos: [
      { src: "/jobs/ac-2.svg", alt: "Unrelated indoor vent photo" },
      { src: "/jobs/lock-1.svg", alt: "Unrelated door photo" },
    ],
  },
];

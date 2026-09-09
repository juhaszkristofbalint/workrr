export type ProfileReview = {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
};

export type ProfileCertificate = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type WorkingHours = {
  day: string;
  hours: string;
};

export type ProfessionalProfile = {
  companyName: string;
  logo: string;
  trade: string;
  city: string;
  about: string;
  services: string[];
  gallery: { src: string; alt: string }[];
  rating: number;
  reviewsCount: number;
  hireAgainPercent: number;
  reviews: ProfileReview[];
  certificates: ProfileCertificate[];
  hours: WorkingHours[];
  phone: string;
  email: string;
  address: string;
};

export const professionalProfile: ProfessionalProfile = {
  companyName: "Harbor Electric",
  logo: "/brand/harbor-electric.svg",
  trade: "Electrical",
  city: "North Yard",
  about:
    "Licensed electrician serving North Yard and the harbor. I handle sparking outlets, panels, lighting, and urgent call-outs. Clear pricing before I start, and I clean up before I leave.",
  services: [
    "Outlet repair",
    "Panel upgrades",
    "Lighting",
    "EV chargers",
    "Emergency call-outs",
    "Safety inspections",
  ],
  gallery: [
    { src: "/jobs/outlet-1.svg", alt: "Kitchen outlet replacement" },
    { src: "/jobs/outlet-2.svg", alt: "Scorch inspection" },
    { src: "/jobs/panel-1.svg", alt: "Panel check" },
    { src: "/jobs/ac-2.svg", alt: "Lighting and vents" },
  ],
  rating: 4.9,
  reviewsCount: 128,
  hireAgainPercent: 96,
  reviews: [
    {
      id: "rv1",
      customerName: "Sam Patel",
      rating: 5,
      date: "2 days ago",
      comment:
        "Showed up the same afternoon, replaced the outlet, and checked the rest of the kitchen circuit.",
    },
    {
      id: "rv2",
      customerName: "Riley Ng",
      rating: 5,
      date: "Last week",
      comment:
        "Clear about the panel work and finished on time. Would hire again.",
    },
    {
      id: "rv3",
      customerName: "Chris Bell",
      rating: 4,
      date: "Aug 2026",
      comment: "Solid GFCI swap. A little later than the window but explained why.",
    },
  ],
  certificates: [
    {
      id: "c1",
      name: "Master electrician license",
      issuer: "State licensing board",
      year: "EL-20491",
    },
    {
      id: "c2",
      name: "Liability insurance",
      issuer: "Harbor Mutual",
      year: "$2M cover",
    },
    {
      id: "c3",
      name: "OSHA 10",
      issuer: "Safety training",
      year: "2025",
    },
  ],
  hours: [
    { day: "Mon–Fri", hours: "08:00 – 18:00" },
    { day: "Saturday", hours: "09:00 – 14:00" },
    { day: "Sunday", hours: "Emergency only" },
  ],
  phone: "555-0142",
  email: "maya@harborelectric.test",
  address: "12 Harbor St, North Yard",
};

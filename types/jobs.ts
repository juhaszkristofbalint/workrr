export type JobPhoto = {
  src: string;
  alt: string;
};

export type JobTimelineStep = {
  id: string;
  label: string;
  at: string;
  state: "done" | "current" | "upcoming";
};

export type JobOffer = {
  id: string;
  professionalId: string;
  professionalName: string;
  rating: number;
  reviews: number;
  price: number;
  availableDate: string;
  message: string;
  accepted?: boolean;
};

export type CustomerJob = {
  id: string;
  title: string;
  trade: string;
  category: string;
  description: string;
  address: string;
  status: string;
  submittedAt: string;
  photos: JobPhoto[];
  timeline: JobTimelineStep[];
  offers: JobOffer[];
};

export type NearbyJob = {
  id: string;
  title: string;
  category: string;
  customerName: string;
  address: string;
  neighborhood: string;
  distanceKm: number | null;
  lat: number | null;
  lng: number | null;
  createdAt: string;
  budget: string;
  posted: string;
  description: string;
  emergency: boolean;
  photos: JobPhoto[];
};

export type JobListRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  address: string;
  status: string;
  emergency: boolean;
  posted: string;
  photos: JobPhoto[];
  customerName: string;
  assignedProfessional: string | null;
  flagged: boolean;
  budget: string;
  preferredDate: string | null;
};

export type MyJob = JobListRow & {
  offerCount: number;
  stage: "open" | "accepted" | "completed" | "other";
};

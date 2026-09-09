export type JobStatus = "open" | "matched" | "en route";

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
  status: JobStatus;
  submittedAt: string;
  photos: JobPhoto[];
  timeline: JobTimelineStep[];
  offers: JobOffer[];
};

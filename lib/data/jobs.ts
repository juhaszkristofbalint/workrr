import type { CustomerJob } from "@/types/jobs";

export const customerJobs: CustomerJob[] = [
  {
    id: "c1",
    title: "Kitchen outlet sparking",
    trade: "Electrician",
    category: "Electrical",
    description:
      "The outlet above the kitchen counter sparked when I plugged in the toaster. There is a faint burning smell. Power to that outlet is now off at the breaker. Need someone to inspect the wiring and replace the receptacle if needed.",
    address: "12 Harbor St, North Yard",
    status: "matched",
    submittedAt: "Today · 10:12",
    photos: [
      { src: "/jobs/outlet-1.svg", alt: "Kitchen wall outlet" },
      { src: "/jobs/outlet-2.svg", alt: "Close-up of scorched outlet" },
    ],
    timeline: [
      { id: "t1", label: "Job submitted", at: "Today · 10:12", state: "done" },
      {
        id: "t2",
        label: "Professionals notified",
        at: "Today · 10:13",
        state: "done",
      },
      { id: "t3", label: "Offers received", at: "Today · 11:04", state: "done" },
      {
        id: "t4",
        label: "Offer accepted",
        at: "Today · 12:20",
        state: "current",
      },
      { id: "t5", label: "Pro on the way", at: "", state: "upcoming" },
    ],
    offers: [
      {
        id: "o1",
        professionalId: "p1",
        professionalName: "Maya Chen",
        rating: 4.9,
        reviews: 128,
        price: 140,
        availableDate: "Today · 16:00",
        message:
          "I can diagnose the outlet this afternoon and replace it if the box is safe. I’ll bring a GFCI receptacle.",
        accepted: true,
      },
      {
        id: "o2",
        professionalId: "p7",
        professionalName: "Priya Shah",
        rating: 4.4,
        reviews: 41,
        price: 165,
        availableDate: "Tomorrow · 09:00",
        message:
          "Happy to inspect the circuit and check neighboring outlets for heat damage.",
      },
    ],
  },
  {
    id: "c2",
    title: "Leaking sink valve",
    trade: "Plumber",
    category: "Plumbing",
    description:
      "The shutoff valve under the bathroom sink drips steadily. I’ve put a bowl underneath. Water stains are starting on the cabinet floor. Prefer a same-day visit if possible.",
    address: "88 Central Ave",
    status: "open",
    submittedAt: "Yesterday · 18:40",
    photos: [
      { src: "/jobs/sink-1.svg", alt: "Bathroom sink cabinet" },
      { src: "/jobs/sink-2.svg", alt: "Dripping shutoff valve" },
      { src: "/jobs/sink-3.svg", alt: "Water stain on cabinet floor" },
    ],
    timeline: [
      {
        id: "t1",
        label: "Job submitted",
        at: "Yesterday · 18:40",
        state: "done",
      },
      {
        id: "t2",
        label: "Professionals notified",
        at: "Yesterday · 18:41",
        state: "done",
      },
      {
        id: "t3",
        label: "Offers received",
        at: "Today · 08:15",
        state: "current",
      },
      { id: "t4", label: "Offer accepted", at: "", state: "upcoming" },
      { id: "t5", label: "Pro on the way", at: "", state: "upcoming" },
    ],
    offers: [
      {
        id: "o3",
        professionalId: "p2",
        professionalName: "Luis Ortega",
        rating: 4.8,
        reviews: 96,
        price: 95,
        availableDate: "Today · 14:30",
        message:
          "Classic compression valve leak. I can swap it for a quarter-turn valve this afternoon.",
      },
      {
        id: "o4",
        professionalId: "p8",
        professionalName: "Tomas Reed",
        rating: 4.2,
        reviews: 54,
        price: 80,
        availableDate: "Tomorrow · 08:00",
        message:
          "I can replace the valve first thing tomorrow and check the supply line.",
      },
    ],
  },
];

export function getCustomerJob(id: string) {
  return customerJobs.find((job) => job.id === id);
}

export function withAcceptedOffer(job: CustomerJob, offerId: string): CustomerJob {
  const offer = job.offers.find((item) => item.id === offerId);
  if (!offer) return job;

  return {
    ...job,
    status: "matched",
    offers: job.offers.map((item) => ({
      ...item,
      accepted: item.id === offerId,
    })),
    timeline: job.timeline.map((step) => {
      if (step.id === "t3") return { ...step, state: "done" };
      if (step.id === "t4") {
        return { ...step, at: "Just now", state: "current" };
      }
      if (step.id === "t5") return { ...step, state: "upcoming" };
      return step;
    }),
  };
}

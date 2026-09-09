export type Professional = {
  id: string;
  name: string;
  trade: string;
  category: string;
  specialties: string[];
  rating: number;
  reviews: number;
  distanceKm: number;
  hourlyRate: number;
  available: boolean;
  mapX: number;
  mapY: number;
};

export type Booking = {
  id: string;
  professionalName: string;
  customerName: string;
  trade: string;
  when: string;
  status: "requested" | "confirmed" | "completed" | "cancelled";
};

export type CustomerRequest = {
  id: string;
  title: string;
  trade: string;
  when: string;
  status: "open" | "matched" | "en route";
};

export type EmergencyService = {
  id: string;
  name: string;
  detail: string;
  tel: string;
};

export type ServiceRequest = {
  id: string;
  title: string;
  customerName: string;
  trade: string;
  neighborhood: string;
  when: string;
  budget: string;
  distanceKm: number;
  isNew?: boolean;
};

export type ProNotification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
};

export type ActiveJob = {
  id: string;
  title: string;
  customerName: string;
  when: string;
  status: "accepted" | "en route" | "in progress";
};

export type ProDashboardStats = {
  credits: number;
  weekEarnings: number;
  monthEarnings: number;
  pendingPayout: number;
  jobsThisWeek: number;
  jobsThisMonth: number;
  rating: number;
  reviews: number;
  hireAgainPercent: number;
};

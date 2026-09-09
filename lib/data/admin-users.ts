export type ManagedUserRole = "customer" | "professional";
export type ManagedUserStatus = "active" | "banned";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: ManagedUserRole;
  status: ManagedUserStatus;
  verified: boolean;
  city: string;
  trade?: string;
  joined: string;
};

export const managedUsers: ManagedUser[] = [
  {
    id: "u-c1",
    name: "Jordan Hale",
    email: "jordan@example.com",
    role: "customer",
    status: "active",
    verified: false,
    city: "North Yard",
    joined: "12 Aug 2026",
  },
  {
    id: "u-c2",
    name: "Sam Patel",
    email: "sam.patel@example.com",
    role: "customer",
    status: "active",
    verified: false,
    city: "North Yard",
    joined: "1 Sep 2026",
  },
  {
    id: "u-c3",
    name: "Elena Rossi",
    email: "elena@example.com",
    role: "customer",
    status: "banned",
    verified: false,
    city: "Harbor",
    joined: "22 Jul 2026",
  },
  {
    id: "u-c4",
    name: "Chris Bell",
    email: "chris.bell@example.com",
    role: "customer",
    status: "active",
    verified: false,
    city: "Central",
    joined: "8 Sep 2026",
  },
  {
    id: "u-c5",
    name: "Riley Ng",
    email: "riley.ng@example.com",
    role: "customer",
    status: "active",
    verified: false,
    city: "Central",
    joined: "19 Aug 2026",
  },
  {
    id: "p1",
    name: "Maya Chen",
    email: "maya@harborelectric.test",
    role: "professional",
    status: "active",
    verified: true,
    city: "North Yard",
    trade: "Electrical",
    joined: "3 Mar 2026",
  },
  {
    id: "p2",
    name: "Luis Ortega",
    email: "luis@example.com",
    role: "professional",
    status: "active",
    verified: true,
    city: "Harbor",
    trade: "Plumbing",
    joined: "11 Apr 2026",
  },
  {
    id: "p3",
    name: "Ava Brooks",
    email: "ava@example.com",
    role: "professional",
    status: "active",
    verified: false,
    city: "North Yard",
    trade: "Cleaning",
    joined: "2 Sep 2026",
  },
  {
    id: "p4",
    name: "Kenji Sato",
    email: "kenji@example.com",
    role: "professional",
    status: "active",
    verified: true,
    city: "Central",
    trade: "Locksmith",
    joined: "8 May 2026",
  },
  {
    id: "p6",
    name: "Eli Park",
    email: "eli.park@example.com",
    role: "professional",
    status: "banned",
    verified: false,
    city: "East Dock",
    trade: "Handyperson",
    joined: "30 Jun 2026",
  },
  {
    id: "p7",
    name: "Priya Shah",
    email: "priya@example.com",
    role: "professional",
    status: "active",
    verified: false,
    city: "Central",
    trade: "Electrical",
    joined: "28 Aug 2026",
  },
];

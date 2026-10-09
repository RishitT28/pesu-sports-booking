export type Sport = {
  id: string;
  name: string;
  icon: string;
  color: string;
  image: string;
  tagline: string;
};

export const SPORTS: Sport[] = [
  {
    id: "badminton",
    name: "Badminton",
    icon: "activity",
    color: "#e35925",
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop",
    tagline: "Synthetic Wooden Courts · Singles & Doubles",
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: "target",
    color: "#e35925",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop",
    tagline: "Hardwood & Outdoor Courts · Full Runs & 3v3",
  },
  {
    id: "squash",
    name: "Squash",
    icon: "circle-dot",
    color: "#0d1b2a",
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1000&auto=format&fit=crop",
    tagline: "Glass Back Wall · High-Speed Rallies",
  },
  {
    id: "tabletennis",
    name: "Table Tennis",
    icon: "disc",
    color: "#0d1b2a",
    image:
      "https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=1000&auto=format&fit=crop",
    tagline: "Competition Stiga Tables · Air-Conditioned Hall",
  },
  {
    id: "cricket",
    name: "Turf",
    icon: "shield",
    color: "#e35925",
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop",
    tagline: "All-Weather Box Turf · Floodlit Nights",
  },
  {
    id: "chess",
    name: "Chess",
    icon: "grid",
    color: "#475569",
    image:
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1000&auto=format&fit=crop",
    tagline: "FIDE Competition Boards · Quiet Lounge",
  },
];

export const CAMPUSES = ["RR Campus", "EC Campus"] as const;
export type Campus = (typeof CAMPUSES)[number];

export type Court = {
  id: string;
  name: string;
  sport: string;
  campus: Campus;
  pricePerHour: number;
  indoor: boolean;
  rating: number;
  image?: string;
  equipment?: string;
  capacity?: string;
};

export const COURTS: Court[] = [
  {
    id: "c1",
    name: "Badminton Court 1",
    sport: "badminton",
    campus: "RR Campus",
    pricePerHour: 0,
    indoor: true,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop",
    equipment: "Yonex Net, Non-Marking Mat, LED Floodlights",
    capacity: "4 Players Max",
  },
  {
    id: "c2",
    name: "Badminton Court 2",
    sport: "badminton",
    campus: "RR Campus",
    pricePerHour: 0,
    indoor: true,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop",
    equipment: "Synthetic Court Mat, Practice Net",
    capacity: "4 Players Max",
  },
  {
    id: "c3",
    name: "Badminton Arena",
    sport: "badminton",
    campus: "EC Campus",
    pricePerHour: 0,
    indoor: true,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop",
    equipment: "Dual Court Bay, Electronic Scoreboard",
    capacity: "4 Players Max",
  },
  {
    id: "c4",
    name: "Squash Court A",
    sport: "squash",
    campus: "RR Campus",
    pricePerHour: 0,
    indoor: true,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1000&auto=format&fit=crop",
    equipment: "Impact Glass Back Wall, Dunlop Official Balls",
    capacity: "2 Players Max",
  },
  {
    id: "c5",
    name: "Squash Court B",
    sport: "squash",
    campus: "EC Campus",
    pricePerHour: 0,
    indoor: true,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1000&auto=format&fit=crop",
    equipment: "Hardwood Floor, Ventilation System",
    capacity: "2 Players Max",
  },
  {
    id: "c6",
    name: "TT Hall — Table 1",
    sport: "tabletennis",
    campus: "RR Campus",
    pricePerHour: 0,
    indoor: true,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=1000&auto=format&fit=crop",
    equipment: "Stiga Expert Roller 25mm, Stag Net System",
    capacity: "4 Players Max",
  },
  {
    id: "c7",
    name: "TT Hall — Table 2",
    sport: "tabletennis",
    campus: "EC Campus",
    pricePerHour: 0,
    indoor: true,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=1000&auto=format&fit=crop",
    equipment: "Tournament Blue Top, Barrier Dividers",
    capacity: "4 Players Max",
  },
  {
    id: "c8",
    name: "Basketball Court",
    sport: "basketball",
    campus: "RR Campus",
    pricePerHour: 0,
    indoor: false,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop",
    equipment: "Full FIBA Court, Breakaway Hoops, Night Lighting",
    capacity: "10 Players Max",
  },
  {
    id: "c9",
    name: "Turf (Box)",
    sport: "cricket",
    campus: "EC Campus",
    pricePerHour: 0,
    indoor: false,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop",
    equipment: "All-Weather 40mm Astroturf, Enclosed Netting, 6 Floodlights",
    capacity: "14 Players Max",
  },
  {
    id: "c10",
    name: "Chess Lounge",
    sport: "chess",
    campus: "RR Campus",
    pricePerHour: 0,
    indoor: true,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1000&auto=format&fit=crop",
    equipment: "Weighted Staunton Pieces, DGT Digital Clocks",
    capacity: "2 Players per Board",
  },
];

export const SLOT_HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM – 10 PM

export function formatHour(h: number) {
  const ampm = h < 12 ? "AM" : "PM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:00 ${ampm}`;
}

// Deterministic pseudo-random booked slots so SSR/client match
export function isSlotBooked(courtId: string, hour: number, dayOffset: number) {
  let hash = 0;
  const s = `${courtId}-${hour}-${dayOffset}`;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) % 997;
  return hash % 10 < 3;
}

export type Match = {
  id: string;
  sport: string;
  title: string;
  host: string;
  campus: Campus;
  time: string;
  skill: "Beginner" | "Intermediate" | "Advanced";
  players: string[];
  maxPlayers: number;
  court: string;
};

export const INITIAL_MATCHES: Match[] = [
  {
    id: "m1",
    sport: "badminton",
    title: "Doubles — need 1 more",
    host: "Aarav S.",
    campus: "RR Campus",
    time: "Today, 5:00 PM",
    skill: "Intermediate",
    players: ["Aarav S.", "Meera K.", "Dev P."],
    maxPlayers: 4,
    court: "Badminton Court 1",
  },
  {
    id: "m2",
    sport: "basketball",
    title: "3v3 half-court run",
    host: "Rohan V.",
    campus: "RR Campus",
    time: "Today, 6:30 PM",
    skill: "Advanced",
    players: ["Rohan V.", "Ishaan T."],
    maxPlayers: 6,
    court: "Basketball Court",
  },
  {
    id: "m3",
    sport: "chess",
    title: "Blitz ladder — all welcome",
    host: "Ananya R.",
    campus: "RR Campus",
    time: "Tomorrow, 4:00 PM",
    skill: "Beginner",
    players: ["Ananya R."],
    maxPlayers: 8,
    court: "Chess Lounge",
  },
  {
    id: "m4",
    sport: "cricket",
    title: "Box turf, 6-a-side",
    host: "Karthik M.",
    campus: "EC Campus",
    time: "Sat, 7:00 AM",
    skill: "Intermediate",
    players: ["Karthik M.", "Sneha D.", "Arjun L.", "Vikram N."],
    maxPlayers: 12,
    court: "Turf (Box)",
  },
  {
    id: "m5",
    sport: "tabletennis",
    title: "TT singles practice",
    host: "Priya S.",
    campus: "EC Campus",
    time: "Tomorrow, 8:00 AM",
    skill: "Beginner",
    players: ["Priya S."],
    maxPlayers: 2,
    court: "TT Hall — Table 2",
  },
  {
    id: "m7",
    sport: "squash",
    title: "Squash rally session",
    host: "Nikhil J.",
    campus: "RR Campus",
    time: "Sun, 9:00 AM",
    skill: "Intermediate",
    players: ["Nikhil J."],
    maxPlayers: 2,
    court: "Squash Court A",
  },
];

export type Badge = { id: string; name: string; icon: string; desc: string; earned: boolean };

export const BADGES: Badge[] = [
  {
    id: "b1",
    name: "Early Bird Champ",
    icon: "clock",
    desc: "5 bookings before 8 AM",
    earned: true,
  },
  {
    id: "b2",
    name: "Shuttle Master",
    icon: "activity",
    desc: "20 badminton matches",
    earned: true,
  },
  { id: "b3", name: "Court Regular", icon: "award", desc: "7-day play streak", earned: true },
  { id: "b4", name: "Team Player", icon: "users", desc: "Join 10 community matches", earned: true },
  { id: "b5", name: "Turf Warrior", icon: "shield", desc: "10 turf hours", earned: false },
  { id: "b6", name: "Grandmaster", icon: "grid", desc: "Win 15 chess games", earned: false },
];

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  kind: "booking" | "match" | "system";
  read: boolean;
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Booking confirmed",
    body: "Badminton Court 1 · RR Campus · Today, 5–6 PM. Booking confirmed.",
    time: "2h ago",
    kind: "booking",
    read: false,
  },
  {
    id: "n2",
    title: "Match filling fast",
    body: "3v3 basketball needs 4 more players — starts 6:30 PM at RR Campus.",
    time: "3h ago",
    kind: "match",
    read: false,
  },
  {
    id: "n4",
    title: "Slot reminder",
    body: "Chess Lounge tomorrow 4 PM — don't forget your ID card.",
    time: "1d ago",
    kind: "booking",
    read: true,
  },
  {
    id: "n5",
    title: "Invite from Karthik M.",
    body: "Box turf, 6-a-side at EC Campus on Saturday morning.",
    time: "2d ago",
    kind: "match",
    read: true,
  },
];

export const FRIENDS = [
  "Aarav S.",
  "Meera K.",
  "Dev P.",
  "Rohan V.",
  "Ananya R.",
  "Sneha D.",
  "Arjun L.",
  "Priya S.",
  "Karthik M.",
  "Riya B.",
];

export const USER = {
  name: "Rishit",
  fullName: "Rishit Tathod",
  campus: "RR Campus" as Campus,
  pr: 4.2,
  skill: "Intermediate",
  matchesPlayed: 47,
  hoursLogged: 62,
  favoriteSports: ["badminton", "chess", "basketball"],
  verified: true,
};

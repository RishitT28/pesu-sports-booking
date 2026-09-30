export type Sport = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export const SPORTS: Sport[] = [
  { id: "badminton", name: "Badminton", icon: "🏸", color: "oklch(0.78 0.19 155)" },
  { id: "squash", name: "Squash", icon: "🎾", color: "oklch(0.68 0.16 230)" },
  { id: "tabletennis", name: "Table Tennis", icon: "🏓", color: "oklch(0.85 0.18 105)" },
  { id: "basketball", name: "Basketball", icon: "🏀", color: "oklch(0.72 0.18 55)" },
  { id: "cricket", name: "Cricket Turf", icon: "🏏", color: "oklch(0.7 0.2 300)" },
  { id: "chess", name: "Chess", icon: "♟️", color: "oklch(0.75 0.15 60)" },
  { id: "esports", name: "E-sports", icon: "🎮", color: "oklch(0.7 0.15 220)" },
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
};

export const COURTS: Court[] = [
  { id: "c1", name: "Badminton Court 1", sport: "badminton", campus: "RR Campus", pricePerHour: 120, indoor: true, rating: 4.8 },
  { id: "c2", name: "Badminton Court 2", sport: "badminton", campus: "RR Campus", pricePerHour: 120, indoor: true, rating: 4.6 },
  { id: "c3", name: "Badminton Arena", sport: "badminton", campus: "EC Campus", pricePerHour: 100, indoor: true, rating: 4.5 },
  { id: "c4", name: "Squash Court A", sport: "squash", campus: "RR Campus", pricePerHour: 150, indoor: true, rating: 4.9 },
  { id: "c5", name: "Squash Court B", sport: "squash", campus: "EC Campus", pricePerHour: 130, indoor: true, rating: 4.4 },
  { id: "c6", name: "TT Hall — Table 1", sport: "tabletennis", campus: "RR Campus", pricePerHour: 60, indoor: true, rating: 4.3 },
  { id: "c7", name: "TT Hall — Table 2", sport: "tabletennis", campus: "EC Campus", pricePerHour: 50, indoor: true, rating: 4.2 },
  { id: "c8", name: "Basketball Court", sport: "basketball", campus: "RR Campus", pricePerHour: 200, indoor: false, rating: 4.7 },
  { id: "c9", name: "Cricket Turf (Box)", sport: "cricket", campus: "EC Campus", pricePerHour: 500, indoor: false, rating: 4.8 },
  { id: "c10", name: "Chess Lounge", sport: "chess", campus: "RR Campus", pricePerHour: 40, indoor: true, rating: 4.6 },
  { id: "c11", name: "E-sports Arena", sport: "esports", campus: "EC Campus", pricePerHour: 180, indoor: true, rating: 4.9 },
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
  { id: "m1", sport: "badminton", title: "Doubles — need 1 more", host: "Aarav S.", campus: "RR Campus", time: "Today, 5:00 PM", skill: "Intermediate", players: ["Aarav S.", "Meera K.", "Dev P."], maxPlayers: 4, court: "Badminton Court 1" },
  { id: "m2", sport: "basketball", title: "3v3 half-court run", host: "Rohan V.", campus: "RR Campus", time: "Today, 6:30 PM", skill: "Advanced", players: ["Rohan V.", "Ishaan T."], maxPlayers: 6, court: "Basketball Court" },
  { id: "m3", sport: "chess", title: "Blitz ladder — all welcome", host: "Ananya R.", campus: "RR Campus", time: "Tomorrow, 4:00 PM", skill: "Beginner", players: ["Ananya R."], maxPlayers: 8, court: "Chess Lounge" },
  { id: "m4", sport: "cricket", title: "Box cricket, 6-a-side", host: "Karthik M.", campus: "EC Campus", time: "Sat, 7:00 AM", skill: "Intermediate", players: ["Karthik M.", "Sneha D.", "Arjun L.", "Vikram N."], maxPlayers: 12, court: "Cricket Turf (Box)" },
  { id: "m5", sport: "tabletennis", title: "TT singles practice", host: "Priya S.", campus: "EC Campus", time: "Tomorrow, 8:00 AM", skill: "Beginner", players: ["Priya S."], maxPlayers: 2, court: "TT Hall — Table 2" },
  { id: "m6", sport: "esports", title: "Valorant 5-stack scrim", host: "Aditya G.", campus: "EC Campus", time: "Today, 9:00 PM", skill: "Advanced", players: ["Aditya G.", "Riya B.", "Zaid H."], maxPlayers: 5, court: "E-sports Arena" },
  { id: "m7", sport: "squash", title: "Squash rally session", host: "Nikhil J.", campus: "RR Campus", time: "Sun, 9:00 AM", skill: "Intermediate", players: ["Nikhil J."], maxPlayers: 2, court: "Squash Court A" },
];

export type Badge = { id: string; name: string; icon: string; desc: string; earned: boolean };

export const BADGES: Badge[] = [
  { id: "b1", name: "Early Bird Champ", icon: "🌅", desc: "5 bookings before 8 AM", earned: true },
  { id: "b2", name: "Shuttle Master", icon: "🏸", desc: "20 badminton matches", earned: true },
  { id: "b3", name: "Court Regular", icon: "🔥", desc: "7-day play streak", earned: true },
  { id: "b4", name: "Team Player", icon: "🤝", desc: "Join 10 community matches", earned: true },
  { id: "b5", name: "Turf Warrior", icon: "🏏", desc: "10 cricket turf hours", earned: false },
  { id: "b6", name: "Grandmaster", icon: "♟️", desc: "Win 15 chess games", earned: false },
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
  { id: "n1", title: "Booking confirmed", body: "Badminton Court 1 · Today 5–6 PM. Show your QR pass at the gate.", time: "2h ago", kind: "booking", read: false },
  { id: "n2", title: "Match filling fast", body: "3v3 basketball needs 4 more players — starts 6:30 PM at RR Campus.", time: "3h ago", kind: "match", read: false },
  { id: "n3", title: "New badge unlocked", body: "You earned “Court Regular” for a 7-day play streak. 🔥", time: "1d ago", kind: "system", read: true },
  { id: "n4", title: "Slot reminder", body: "Chess Lounge tomorrow 4 PM — don't forget your ID card.", time: "1d ago", kind: "booking", read: true },
  { id: "n5", title: "Invite from Karthik M.", body: "Box cricket, 6-a-side at EC Campus on Saturday morning.", time: "2d ago", kind: "match", read: true },
];

export const FRIENDS = [
  "Aarav S.", "Meera K.", "Dev P.", "Rohan V.", "Ananya R.",
  "Sneha D.", "Arjun L.", "Priya S.", "Karthik M.", "Riya B.",
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

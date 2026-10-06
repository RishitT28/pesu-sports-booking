import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { INITIAL_MATCHES, INITIAL_NOTIFICATIONS, USER, type Match, type Notification } from "./data";

export type Booking = {
  id: string;
  courtId: string;
  courtName: string;
  sport: string;
  campus: string;
  dateLabel: string;
  hour: number;
  price: number;
  splitWith: string[];
  status: "upcoming" | "cancelled";
};

type AppState = {
  bookings: Booking[];
  matches: Match[];
  notifications: Notification[];
  hoursLogged: number;
  matchesPlayed: number;
  addBooking: (b: Omit<Booking, "id" | "status">) => Booking;
  cancelBooking: (id: string) => void;
  joinMatch: (id: string) => void;
  markAllRead: () => void;
};

const Ctx = createContext<AppState | null>(null);

const SEED_BOOKINGS: Booking[] = [
  {
    id: "bk-seed-1",
    courtId: "c1",
    courtName: "Badminton Court 1",
    sport: "badminton",
    campus: "RR Campus",
    dateLabel: "Today",
    hour: 17,
    price: 120,
    splitWith: ["Meera K."],
    status: "upcoming",
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [hoursLogged, setHoursLogged] = useState(USER.hoursLogged);
  const [matchesPlayed, setMatchesPlayed] = useState(USER.matchesPlayed);

  const value = useMemo<AppState>(() => ({
    bookings,
    matches,
    notifications,
    hoursLogged,
    matchesPlayed,
    addBooking: (b) => {
      const booking: Booking = { ...b, id: `bk-${Date.now()}`, status: "upcoming" };
      setBookings((prev) => [...prev, booking]);
      setHoursLogged((h) => h + 1);
      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          title: "Booking confirmed",
          body: `${b.courtName} · ${b.dateLabel} ${b.hour % 12 === 0 ? 12 : b.hour % 12}:00 ${b.hour < 12 ? "AM" : "PM"}. ${b.campus} · 1 hour. Booking confirmed.`,
          time: "Just now",
          kind: "booking",
          read: false,
        },
        ...prev,
      ]);
      return booking;
    },
    cancelBooking: (id) =>
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))),
    joinMatch: (id) => {
      setMatches((prev) =>
        prev.map((m) =>
          m.id === id && !m.players.includes(USER.name) && m.players.length < m.maxPlayers
            ? { ...m, players: [...m.players, USER.name] }
            : m,
        ),
      );
      setMatchesPlayed((n) => n + 1);
    },
    markAllRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
  }), [bookings, matches, notifications, hoursLogged, matchesPlayed]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  INITIAL_MATCHES,
  INITIAL_NOTIFICATIONS,
  USER,
  type Match,
  type Notification,
} from "./data";

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

export type QueueRequest = {
  id: string;
  courtId: string;
  courtName: string;
  sport: string;
  campus: string;
  dateLabel: string;
  hour: number;
  position: number; // 1 or 2
  status: "waiting" | "promoted" | "cancelled";
  createdAt: string;
};

type AppState = {
  bookings: Booking[];
  queueRequests: QueueRequest[];
  matches: Match[];
  notifications: Notification[];
  hoursLogged: number;
  matchesPlayed: number;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (v: boolean) => void;
  addBooking: (b: Omit<Booking, "id" | "status">) => Booking;
  cancelBooking: (id: string) => void;
  addQueueRequest: (q: Omit<QueueRequest, "id" | "status" | "createdAt" | "position">) => {
    success: boolean;
    position?: number;
    message?: string;
  };
  cancelQueueRequest: (id: string) => void;
  getQueueForSlot: (courtId: string, dateLabel: string, hour: number) => QueueRequest[];
  isSlotQueuedByUser: (courtId: string, dateLabel: string, hour: number) => boolean;
  joinMatch: (id: string) => void;
  createMatch: (m: Omit<Match, "id" | "players">) => Match;
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

const SEED_QUEUES: QueueRequest[] = [
  {
    id: "qr-seed-1",
    courtId: "c2",
    courtName: "Badminton Court 2",
    sport: "badminton",
    campus: "RR Campus",
    dateLabel: "Today",
    hour: 18,
    position: 1,
    status: "waiting",
    createdAt: "1 hour ago",
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [queueRequests, setQueueRequests] = useState<QueueRequest[]>(SEED_QUEUES);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [hoursLogged, setHoursLogged] = useState(USER.hoursLogged);
  const [matchesPlayed, setMatchesPlayed] = useState(USER.matchesPlayed);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const value = useMemo<AppState>(
    () => ({
      bookings,
      queueRequests,
      matches,
      notifications,
      hoursLogged,
      matchesPlayed,
      sidebarOpen,
      toggleSidebar,
      setSidebarOpen,
      addBooking: (b) => {
        const booking: Booking = { ...b, id: `bk-${Date.now()}`, status: "upcoming" };
        setBookings((prev) => [...prev, booking]);
        setHoursLogged((h) => h + 1);
        setNotifications((prev) => [
          {
            id: `n-${Date.now()}`,
            title: "Booking Confirmed",
            body: `${b.courtName} · ${b.dateLabel} at ${b.hour % 12 === 0 ? 12 : b.hour % 12}:00 ${b.hour < 12 ? "AM" : "PM"}. ${b.campus} (1 hour session).`,
            time: "Just now",
            kind: "booking",
            read: false,
          },
          ...prev,
        ]);
        return booking;
      },
      cancelBooking: (id) => {
        const target = bookings.find((b) => b.id === id);
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));

        // If an upcoming slot is cancelled, promote the first in line from the queue!
        if (target && target.status === "upcoming") {
          setQueueRequests((prevQueue) => {
            const waitingForSlot = prevQueue.filter(
              (q) =>
                q.courtId === target.courtId &&
                q.dateLabel === target.dateLabel &&
                q.hour === target.hour &&
                q.status === "waiting",
            );

            if (waitingForSlot.length > 0) {
              const sorted = [...waitingForSlot].sort((a, b) => a.position - b.position);
              const firstInLine = sorted[0];

              // Automatically create a confirmed booking for the promoted student
              const promotedBooking: Booking = {
                id: `bk-${Date.now()}`,
                courtId: firstInLine.courtId,
                courtName: firstInLine.courtName,
                sport: firstInLine.sport,
                campus: firstInLine.campus,
                dateLabel: firstInLine.dateLabel,
                hour: firstInLine.hour,
                price: target.price,
                splitWith: [],
                status: "upcoming",
              };

              setBookings((b) => [...b, promotedBooking]);
              setNotifications((notifs) => [
                {
                  id: `n-${Date.now()}`,
                  title: "Queue Slot Promoted!",
                  body: `A slot was cancelled for ${firstInLine.courtName} on ${firstInLine.dateLabel} at ${firstInLine.hour % 12 === 0 ? 12 : firstInLine.hour % 12}:00 ${firstInLine.hour < 12 ? "AM" : "PM"}. You have been automatically promoted to a confirmed reservation!`,
                  time: "Just now",
                  kind: "booking",
                  read: false,
                },
                ...notifs,
              ]);

              return prevQueue.map((q) => {
                if (q.id === firstInLine.id) {
                  return { ...q, status: "promoted" };
                }
                if (
                  q.courtId === target.courtId &&
                  q.dateLabel === target.dateLabel &&
                  q.hour === target.hour &&
                  q.status === "waiting"
                ) {
                  return { ...q, position: 1 };
                }
                return q;
              });
            }
            return prevQueue;
          });
        }
      },
      addQueueRequest: (q) => {
        const currentWaiting = queueRequests.filter(
          (item) =>
            item.courtId === q.courtId &&
            item.dateLabel === q.dateLabel &&
            item.hour === q.hour &&
            item.status === "waiting",
        );

        if (currentWaiting.length >= 2) {
          return {
            success: false,
            message:
              "Queue is at maximum capacity (2 standby seats limit to prevent slot starvation).",
          };
        }

        const nextPos = currentWaiting.length + 1;
        const newReq: QueueRequest = {
          ...q,
          id: `qr-${Date.now()}`,
          position: nextPos,
          status: "waiting",
          createdAt: "Just now",
        };

        setQueueRequests((prev) => [...prev, newReq]);
        setNotifications((prev) => [
          {
            id: `n-${Date.now()}`,
            title: "Waitlist Queue Confirmed",
            body: `You are in position #${nextPos} of 2 for ${q.courtName} on ${q.dateLabel} at ${q.hour % 12 === 0 ? 12 : q.hour % 12}:00 ${q.hour < 12 ? "AM" : "PM"}. If a cancellation happens, you will be automatically filled in.`,
            time: "Just now",
            kind: "booking",
            read: false,
          },
          ...prev,
        ]);

        return { success: true, position: nextPos };
      },
      cancelQueueRequest: (id) => {
        setQueueRequests((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: "cancelled" } : q)),
        );
      },
      getQueueForSlot: (courtId, dateLabel, hour) => {
        return queueRequests.filter(
          (q) =>
            q.courtId === courtId &&
            q.dateLabel === dateLabel &&
            q.hour === hour &&
            q.status === "waiting",
        );
      },
      isSlotQueuedByUser: (courtId, dateLabel, hour) => {
        return queueRequests.some(
          (q) =>
            q.courtId === courtId &&
            q.dateLabel === dateLabel &&
            q.hour === hour &&
            q.status === "waiting",
        );
      },
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
      createMatch: (m) => {
        const match: Match = {
          ...m,
          id: `m-${Date.now()}`,
          players: [m.host],
        };
        setMatches((prev) => [match, ...prev]);
        setNotifications((prev) => [
          {
            id: `n-${Date.now()}`,
            title: "Game Created",
            body: `${match.title} · ${match.court} (${match.campus}) · ${match.time}. Squad listed on open board.`,
            time: "Just now",
            kind: "match",
            read: false,
          },
          ...prev,
        ]);
        return match;
      },
      markAllRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    }),
    [bookings, queueRequests, matches, notifications, hoursLogged, matchesPlayed, sidebarOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

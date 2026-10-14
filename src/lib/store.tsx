import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  INITIAL_MATCHES,
  INITIAL_NOTIFICATIONS,
  USER,
  type Match,
  type Notification,
} from "./data";
import {
  type CollegeId,
  type CollegeConfig,
  COLLEGES,
  DEFAULT_COLLEGE_ID,
} from "./college-theme";

export type Booking = {
  id: string;
  courtId: string;
  courtName: string;
  sport: string;
  campus: string;
  dateLabel: string;
  hour: number;
  price?: number;
  status: "upcoming" | "cancelled" | "completed";
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

export type StudentUser = {
  srn: string;
  prn: string;
  name: string;
  fullName: string;
  department: string;
  campus: string;
  semester: string;
  skill: string;
  email: string;
  phone: string;
  clearanceStatus: string;
  favoriteSports: string[];
  hoursLogged: number;
  matchesPlayed: number;
};

const DEFAULT_STUDENT: StudentUser = {
  srn: "PES1UG21CS123",
  prn: "PES202100456",
  name: "Rishit",
  fullName: "Rishit Tathod",
  department: "Computer Science & Engineering",
  campus: "RR Campus",
  semester: "Semester 3 · Section G",
  skill: "Intermediate",
  email: "rishit@pesu.pes.edu",
  phone: "+91 98765 43210",
  clearanceStatus: "Active",
  favoriteSports: ["badminton", "basketball", "chess"],
  hoursLogged: 62,
  matchesPlayed: 47,
};

type AppState = {
  collegeId: CollegeId;
  college: CollegeConfig;
  setCollegeId: (id: CollegeId) => void;
  showSplashScreen: boolean;
  dismissSplashScreen: () => void;
  triggerSplashScreen: () => void;
  showManipalSplash?: boolean;
  dismissManipalSplash?: () => void;
  currentUser: StudentUser;
  isLoggedIn: boolean;
  login: (srnOrPrn: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (studentData: {
    srn: string;
    prn?: string;
    name: string;
    fullName?: string;
    campus?: string;
    department?: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<StudentUser>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    curr: string,
    next: string,
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
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

type DbBooking = {
  id: string;
  court_id: string;
  court_name: string;
  sport: string;
  campus: string;
  date_label: string;
  hour: number;
  status: "upcoming" | "completed" | "cancelled";
};

type DbQueue = {
  id: string;
  court_id: string;
  court_name: string;
  sport: string;
  campus: string;
  date_label: string;
  hour: number;
  position: number;
  status: "waiting" | "promoted" | "cancelled";
  created_at: string;
};

type DbMatch = {
  id: string;
  sport: string;
  title: string;
  host: string;
  campus: string;
  court: string;
  time: string;
  skill: "Beginner" | "Intermediate" | "Advanced";
  players: string[];
  max_players: number;
};

type DbNotif = {
  id: string;
  title: string;
  body: string;
  kind: "booking" | "match" | "system";
  time: string;
  read: number;
};

type DbStudent = {
  srn: string;
  prn: string;
  name: string;
  full_name: string;
  department: string;
  campus: string;
  semester: string;
  skill: string;
  email: string;
  phone: string;
  clearance_status: string;
  favorite_sports: string;
  hours_logged: number;
  matches_played: number;
};

// Dual-route API caller: uses relative path with direct port 8081 fallback
async function callApi<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // 1. Try relative URL (proxied by server.ts on 8080)
  try {
    const res = await fetch(endpoint, options);
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await res.json()) as T;
    }
  } catch (_err) {
    // Relative call failed or timed out, fall back to direct 8081 API
  }

  // 2. Direct fallback to port 8081
  const directUrl =
    "http://localhost:8081" + (endpoint.startsWith("/") ? endpoint : "/" + endpoint);
  const directRes = await fetch(directUrl, options);
  return (await directRes.json()) as T;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [collegeId, setCollegeIdState] = useState<CollegeId>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("book_college_id") as CollegeId;
      if (stored && COLLEGES[stored]) return stored;
    }
    return DEFAULT_COLLEGE_ID;
  });

  const [showSplashScreen, setShowSplashScreen] = useState(false);

  const college = COLLEGES[collegeId] || COLLEGES.pesu;

  const setCollegeId = (id: CollegeId) => {
    if (!COLLEGES[id]) return;
    if (isLoggedIn) {
      console.warn("College is locked to active session. Sign out to switch institution.");
      return;
    }
    setCollegeIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("book_college_id", id);
    }
    const cfg = COLLEGES[id];
    if (cfg && cfg.campuses.length > 0) {
      setCurrentUser((prev) => ({
        ...prev,
        campus: cfg.campuses[0] || prev.campus,
      }));
    }
  };

  const dismissSplashScreen = () => setShowSplashScreen(false);
  const triggerSplashScreen = () => setShowSplashScreen(true);

  // Sync theme colors and fonts dynamically to root
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--background", college.colors.pageBg);
    root.style.setProperty("--color-background", college.colors.pageBg);
    root.style.setProperty("--color-primary", college.colors.primary);
    root.style.setProperty("--primary", college.colors.primary);
    root.style.setProperty("--color-secondary", college.colors.secondary);
    root.style.setProperty("--color-border", college.colors.border);
    root.style.setProperty("--border", college.colors.border);
    root.style.setProperty("--foreground", college.colors.textPrimary);
    root.style.setProperty("--color-foreground", college.colors.textPrimary);
    root.style.setProperty("--muted-foreground", college.colors.textMuted);
    root.style.setProperty("--color-muted-foreground", college.colors.textMuted);
    root.style.setProperty("--font-serif", college.fontFamily);
    root.style.setProperty("--font-sans", college.fontFamily);
    document.title = `BookQuick ${college.shortName} — Athletic Facilities & Courts`;
  }, [college]);

  const [currentUser, setCurrentUser] = useState<StudentUser>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("book_auth_user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_STUDENT;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("book_auth_logged_in") === "true";
    }
    return false;
  });
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [queueRequests, setQueueRequests] = useState<QueueRequest[]>(SEED_QUEUES);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync with backend API on mount
  useEffect(() => {
    async function syncBackend() {
      try {
        const [bookingsRes, queueRes, matchesRes, notifRes] = await Promise.allSettled([
          callApi<DbBooking[]>("/api/bookings?srn=" + currentUser.srn),
          callApi<DbQueue[]>("/api/queue?srn=" + currentUser.srn),
          callApi<DbMatch[]>("/api/matches"),
          callApi<DbNotif[]>("/api/notifications?srn=" + currentUser.srn),
        ]);

        if (bookingsRes.status === "fulfilled" && Array.isArray(bookingsRes.value)) {
          setBookings(
            bookingsRes.value.map((b) => ({
              id: b.id,
              courtId: b.court_id,
              courtName: b.court_name,
              sport: b.sport,
              campus: b.campus,
              dateLabel: b.date_label,
              hour: b.hour,
              status: b.status,
            })),
          );
        }

        if (queueRes.status === "fulfilled" && Array.isArray(queueRes.value)) {
          setQueueRequests(
            queueRes.value.map((q) => ({
              id: q.id,
              courtId: q.court_id,
              courtName: q.court_name,
              sport: q.sport,
              campus: q.campus,
              dateLabel: q.date_label,
              hour: q.hour,
              position: q.position,
              status: q.status,
              createdAt: q.created_at,
            })),
          );
        }

        if (matchesRes.status === "fulfilled" && Array.isArray(matchesRes.value)) {
          setMatches(
            matchesRes.value.map((m) => ({
              id: m.id,
              sport: m.sport,
              title: m.title,
              host: m.host,
              campus: m.campus,
              court: m.court,
              time: m.time,
              skill: m.skill,
              players: m.players,
              maxPlayers: m.max_players,
            })),
          );
        }

        if (notifRes.status === "fulfilled" && Array.isArray(notifRes.value)) {
          setNotifications(
            notifRes.value.map((n) => ({
              id: n.id,
              title: n.title,
              body: n.body,
              kind: n.kind,
              time: n.time,
              read: n.read === 1,
            })),
          );
        }
      } catch (e) {
        // Fallback to local state if backend API is offline
      }
    }

    syncBackend();
  }, [currentUser.srn]);

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const value = useMemo<AppState>(
    () => ({
      collegeId,
      college,
      setCollegeId,
      showSplashScreen,
      dismissSplashScreen,
      triggerSplashScreen,
      showManipalSplash: showSplashScreen,
      dismissManipalSplash: dismissSplashScreen,
      currentUser,
      isLoggedIn,
      login: async (srnOrPrn, password) => {
        // Universal Superuser Interceptor: admin123 / admin123 (works across all colleges)
        const cleanId = String(srnOrPrn).trim().toLowerCase();
        if ((cleanId === "admin123" || cleanId === "admin") && password === "admin123") {
          const superuser: StudentUser = {
            srn: "admin123",
            prn: "SUPERUSER",
            name: "Superuser Admin",
            fullName: "Superuser Administrator",
            department: "Sports Directorate & Athletic Administration",
            campus: college.campuses[0] || "All Campuses (Superuser Clearance)",
            semester: "Faculty / Superuser",
            skill: "Advanced",
            email: "admin123@bookquick.edu",
            phone: "+91 99999 00000",
            clearanceStatus: "Superuser Clearance",
            favoriteSports: ["badminton", "basketball", "table_tennis", "squash", "chess"],
            hoursLogged: 999,
            matchesPlayed: 150,
          };
          setCurrentUser(superuser);
          setIsLoggedIn(true);
          setShowSplashScreen(true);
          if (typeof window !== "undefined") {
            localStorage.setItem("book_auth_logged_in", "true");
            localStorage.setItem("book_auth_user", JSON.stringify(superuser));
            localStorage.setItem("book_college_id", collegeId);
          }
          callApi("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ srnOrPrn: "admin123", password: "admin123" }),
          }).catch(() => {});
          return { success: true };
        }

        try {
          const data = await callApi<{ success?: boolean; student?: DbStudent; error?: string }>(
            "/api/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ srnOrPrn, password }),
            },
          );
          if (data && data.success && data.student) {
            const s = data.student;
            const userObj: StudentUser = {
              srn: s.srn,
              prn: s.prn,
              name: s.name,
              fullName: s.full_name,
              department: s.department,
              campus: s.campus || college.campuses[0] || "Main Campus",
              semester: s.semester,
              skill: s.skill,
              email: s.email || `${s.name.toLowerCase()}@pesu.pes.edu`,
              phone: s.phone || "+91 98765 43210",
              clearanceStatus: s.clearance_status || "Active",
              favoriteSports: JSON.parse(s.favorite_sports || '["badminton"]'),
              hoursLogged: s.hours_logged,
              matchesPlayed: s.matches_played,
            };
            setCurrentUser(userObj);
            setIsLoggedIn(true);
            setShowSplashScreen(true);
            if (typeof window !== "undefined") {
              localStorage.setItem("book_auth_logged_in", "true");
              localStorage.setItem("book_auth_user", JSON.stringify(userObj));
              localStorage.setItem("book_college_id", collegeId);
            }
            return { success: true };
          }
          return { success: false, error: data?.error || "Authentication failed" };
        } catch (err) {
          // Client-side fallback authentication if backend offline
          if (srnOrPrn.trim().length > 3 && password.length > 3) {
            setIsLoggedIn(true);
            setShowSplashScreen(true);
            if (typeof window !== "undefined") {
              localStorage.setItem("book_auth_logged_in", "true");
              localStorage.setItem("book_college_id", collegeId);
            }
            return { success: true };
          }
          return { success: false, error: "Network error connecting to auth server" };
        }
      },
      register: async (studentData) => {
        try {
          const data = await callApi<{ success?: boolean; student?: DbStudent; error?: string }>(
            "/api/auth/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(studentData),
            },
          );
          if (data && data.success && data.student) {
            const s = data.student;
            const userObj: StudentUser = {
              srn: s.srn,
              prn: s.prn,
              name: s.name,
              fullName: s.full_name,
              department: s.department,
              campus: s.campus || studentData.campus || college.campuses[0] || "Main Campus",
              semester: s.semester,
              skill: s.skill,
              email: s.email || `${s.name.toLowerCase()}@pesu.pes.edu`,
              phone: s.phone || "+91 98765 43210",
              clearanceStatus: s.clearance_status,
              favoriteSports: JSON.parse(s.favorite_sports || '["badminton"]'),
              hoursLogged: s.hours_logged,
              matchesPlayed: s.matches_played,
            };
            setCurrentUser(userObj);
            setIsLoggedIn(true);
            setShowSplashScreen(true);
            if (typeof window !== "undefined") {
              localStorage.setItem("book_auth_logged_in", "true");
              localStorage.setItem("book_auth_user", JSON.stringify(userObj));
              localStorage.setItem("book_college_id", collegeId);
            }
            return { success: true };
          }
          return { success: false, error: data?.error || "Registration failed" };
        } catch (err) {
          // Client-side offline fallback
          if (studentData.srn && studentData.password) {
            const fallbackUser: StudentUser = {
              srn: studentData.srn,
              prn: studentData.prn || studentData.srn,
              name: studentData.name || studentData.fullName || "Student",
              fullName: studentData.fullName || studentData.name || "PES Student",
              department: studentData.department || "Computer Science & Engineering",
              campus: studentData.campus || college.campuses[0] || "Main Campus",
              semester: "Semester 1",
              skill: "Intermediate",
              email: `${(studentData.name || "student").toLowerCase().replace(/\s+/g, "")}@pesu.pes.edu`,
              phone: "+91 98765 43210",
              clearanceStatus: "Active Clearance",
              favoriteSports: ["badminton"],
              hoursLogged: 0,
              matchesPlayed: 0,
            };
            setCurrentUser(fallbackUser);
            setIsLoggedIn(true);
            setShowSplashScreen(true);
            if (typeof window !== "undefined") {
              localStorage.setItem("book_auth_logged_in", "true");
              localStorage.setItem("book_auth_user", JSON.stringify(fallbackUser));
              localStorage.setItem("book_college_id", collegeId);
            }
            return { success: true };
          }
          return { success: false, error: "Network error connecting to auth server" };
        }
      },
      logout: () => {
        setIsLoggedIn(false);
        setShowSplashScreen(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem("book_auth_logged_in");
          localStorage.removeItem("book_auth_user");
          localStorage.removeItem("book_college_id");
        }
      },
      updateProfile: async (updates) => {
        try {
          const data = await callApi<{ success?: boolean; error?: string }>(
            "/api/auth/update-profile",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                srn: currentUser.srn,
                full_name: updates.fullName || currentUser.fullName,
                campus: updates.campus || currentUser.campus,
                department: updates.department || currentUser.department,
                email: updates.email || currentUser.email,
                phone: updates.phone || currentUser.phone,
                skill: updates.skill || currentUser.skill,
                favorite_sports: JSON.stringify(
                  updates.favoriteSports || currentUser.favoriteSports,
                ),
              }),
            },
          );
          if (data && data.success) {
            setCurrentUser((prev) => ({ ...prev, ...updates }));
            return { success: true };
          }
          return {
            success: false,
            ...(data?.error ? { error: data.error } : {}),
          };
        } catch (err) {
          setCurrentUser((prev) => ({ ...prev, ...updates }));
          return { success: true };
        }
      },
      changePassword: async (currentPassword, newPassword) => {
        try {
          const data = await callApi<{ success?: boolean; error?: string; message?: string }>(
            "/api/auth/change-password",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                srn: currentUser.srn,
                currentPassword,
                newPassword,
              }),
            },
          );
          return {
            success: Boolean(data?.success),
            ...(data?.error ? { error: data.error } : {}),
            ...(data?.message ? { message: data.message } : {}),
          };
        } catch (err) {
          return { success: false, error: "Failed to connect to authentication server" };
        }
      },
      bookings,
      queueRequests,
      matches,
      notifications,
      hoursLogged: currentUser.hoursLogged,
      matchesPlayed: currentUser.matchesPlayed,
      sidebarOpen,
      toggleSidebar,
      setSidebarOpen,
      addBooking: (b) => {
        const booking: Booking = { ...b, id: `bk-${Date.now()}`, status: "upcoming" };
        setBookings((prev) => [...prev, booking]);
        setCurrentUser((u) => ({ ...u, hoursLogged: u.hoursLogged + 1 }));

        // Notify
        setNotifications((prev) => [
          {
            id: `n-${Date.now()}`,
            title: "Reservation Confirmed",
            body: `${b.courtName} · ${b.dateLabel} at ${b.hour % 12 === 0 ? 12 : b.hour % 12}:00 ${b.hour < 12 ? "AM" : "PM"} (${b.campus}). PESU facility pass confirmed (No fee).`,
            time: "Just now",
            kind: "booking",
            read: false,
          },
          ...prev,
        ]);

        // Send to backend in background
        callApi("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_srn: currentUser.srn,
            court_id: b.courtId,
            court_name: b.courtName,
            sport: b.sport,
            campus: b.campus,
            date_label: b.dateLabel,
            hour: b.hour,
          }),
        }).catch(() => {});

        return booking;
      },
      cancelBooking: (id) => {
        const target = bookings.find((b) => b.id === id);
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));

        // Handle auto-promotion from queue
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

              if (firstInLine) {
                const promotedBooking: Booking = {
                  id: `bk-${Date.now()}`,
                  courtId: firstInLine.courtId,
                  courtName: firstInLine.courtName,
                  sport: firstInLine.sport,
                  campus: firstInLine.campus,
                  dateLabel: firstInLine.dateLabel,
                  hour: firstInLine.hour,
                  status: "upcoming",
                };

                setBookings((b) => [...b, promotedBooking]);
                setNotifications((notifs) => [
                  {
                    id: `n-${Date.now()}`,
                    title: "Queue Slot Promoted!",
                    body: `A slot was released for ${firstInLine.courtName} on ${firstInLine.dateLabel} at ${firstInLine.hour % 12 === 0 ? 12 : firstInLine.hour % 12}:00 ${firstInLine.hour < 12 ? "AM" : "PM"}. You have been automatically promoted from the waitlist to a confirmed reservation!`,
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
            }
            return prevQueue;
          });
        }

        // Notify backend
        callApi("/api/bookings/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: id }),
        }).catch(() => {});
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
            body: `You are in position #${nextPos} of 2 for ${q.courtName} on ${q.dateLabel} at ${q.hour % 12 === 0 ? 12 : q.hour % 12}:00 ${q.hour < 12 ? "AM" : "PM"}. If a cancellation occurs, you will be automatically filled in.`,
            time: "Just now",
            kind: "booking",
            read: false,
          },
          ...prev,
        ]);

        callApi("/api/queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_srn: currentUser.srn,
            court_id: q.courtId,
            court_name: q.courtName,
            sport: q.sport,
            campus: q.campus,
            date_label: q.dateLabel,
            hour: q.hour,
          }),
        }).catch(() => {});

        return { success: true, position: nextPos };
      },
      cancelQueueRequest: (id) => {
        setQueueRequests((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: "cancelled" } : q)),
        );
        callApi("/api/queue/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ queueId: id }),
        }).catch(() => {});
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
            m.id === id && !m.players.includes(currentUser.name) && m.players.length < m.maxPlayers
              ? { ...m, players: [...m.players, currentUser.name] }
              : m,
          ),
        );
        setCurrentUser((u) => ({ ...u, matchesPlayed: u.matchesPlayed + 1 }));

        callApi("/api/matches/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId: id, playerName: currentUser.name }),
        }).catch(() => {});
      },
      createMatch: (m) => {
        const match: Match = {
          ...m,
          id: `m-${Date.now()}`,
          players: [m.host],
        };
        setMatches((prev) => [match, ...prev]);

        callApi("/api/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sport: m.sport,
            title: m.title,
            host: m.host,
            campus: m.campus,
            court: m.court,
            time: m.time,
            skill: m.skill,
            max_players: m.maxPlayers,
          }),
        }).catch(() => {});

        return match;
      },
      markAllRead: () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        callApi("/api/notifications/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ srn: currentUser.srn }),
        }).catch(() => {});
      },
    }),
    [
      collegeId,
      college,
      showSplashScreen,
      currentUser,
      isLoggedIn,
      bookings,
      queueRequests,
      matches,
      notifications,
      sidebarOpen,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  MapPin,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  CAMPUSES,
  COURTS,
  SLOT_HOURS,
  SPORTS,
  formatHour,
  isSlotBooked,
  type Court,
} from "@/lib/data";
import { useApp } from "@/lib/store";
import { BookingDetails, MyBookings } from "@/components/BookingDetails";
import { Button } from "@/components/ui/button";
import { SportIcon } from "@/components/SportIcon";

type Search = { sport?: string | undefined };

export const Route = createFileRoute("/courts")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const sport = s["sport"];
    return typeof sport === "string" ? { sport } : {};
  },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PESU Sports — Facilities Directory & Court Booking" },
      {
        name: "description",
        content:
          "Browse live availability, reserve courts, or join waitlist queues with calendar scheduling at PES University.",
      },
      { property: "og:title", content: "PESU Sports — Facilities Directory & Court Booking" },
      {
        property: "og:description",
        content:
          "Browse live availability, reserve courts, or join waitlist queues with calendar scheduling at PES University.",
      },
    ],
  }),
  component: CourtsPage,
});

// Helper to format date cleanly
function formatDateDisplay(d: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return d.toLocaleDateString("en-US", options);
}

function formatDayLabel(d: Date, today: Date): string {
  const isSameDay =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow =
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear();

  if (isSameDay) return "Today";
  if (isTomorrow) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function CourtsPage() {
  const { sport } = Route.useSearch();
  const navigate = useNavigate({ from: "/courts" });
  const { addBooking, bookings, addQueueRequest, getQueueForSlot, isSlotQueuedByUser } = useApp();

  const [campus, setCampus] = useState<string>("All");

  // Calendar State
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);

  // Modals & Feedback
  const [selected, setSelected] = useState<{ court: Court; hour: number } | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [queueModalInfo, setQueueModalInfo] = useState<{
    court: Court;
    hour: number;
    position: number;
  } | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Compute day offset for deterministic mock bookings
  const dayOffset = useMemo(() => {
    const diffTime = selectedDate.getTime() - today.getTime();
    return Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  }, [selectedDate, today]);

  const dateLabel = useMemo(() => formatDayLabel(selectedDate, today), [selectedDate, today]);

  const filteredCourts = useMemo(
    () =>
      COURTS.filter(
        (c) => (!sport || c.sport === sport) && (campus === "All" || c.campus === campus),
      ),
    [sport, campus],
  );

  // Calendar month days calculation
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  }, [calendarMonth]);

  const confirmBooking = () => {
    if (!selected) return;
    const b = addBooking({
      courtId: selected.court.id,
      courtName: selected.court.name,
      sport: selected.court.sport,
      campus: selected.court.campus,
      dateLabel,
      hour: selected.hour,
    });
    setConfirmedBookingId(b.id);
    setSelected(null);
  };

  const handleQueueRequest = (court: Court, hour: number) => {
    const res = addQueueRequest({
      courtId: court.id,
      courtName: court.name,
      sport: court.sport,
      campus: court.campus,
      dateLabel,
      hour,
    });

    if (res.success && res.position) {
      setQueueModalInfo({ court, hour, position: res.position });
      setFeedbackToast(
        `Added to queue (Position #${res.position} of 2) for ${court.name} at ${formatHour(hour)}.`,
      );
      setTimeout(() => setFeedbackToast(null), 5000);
    } else {
      setFeedbackToast(res.message || "Queue is currently full.");
      setTimeout(() => setFeedbackToast(null), 4000);
    }
  };

  const confirmedBooking = bookings.find((b) => b.id === confirmedBookingId);

  return (
    <main className="p-4 sm:p-8 space-y-10 max-w-7xl mx-auto font-serif">
      {/* Toast alert banner */}
      {feedbackToast && (
        <div className="fixed top-20 right-4 z-50 bg-[#1a2639] text-white border-l-4 border-l-[#c45524] p-4 shadow-xl max-w-md animate-in slide-in-from-top-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-[#c45524] shrink-0 mt-0.5" />
            <div className="flex-1 text-xs leading-relaxed">{feedbackToast}</div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="text-[#a3afc2] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Header with generous spacing and soft colors */}
      <div className="bg-white border border-[#ded9cd] border-l-4 border-l-[#1a2639] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#eeeae1] pb-5">
          <div>
            <span className="text-xs font-semibold text-[#c45524]">Campus Sports Directory</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2639] mt-0.5">
              Reserve a Court or Facility
            </h1>
            <p className="text-xs text-[#636a77] mt-1.5 leading-relaxed max-w-2xl">
              Select any date from the calendar to inspect real-time slot availability. If a slot is
              booked, you can join the standby queue (maximum 2 queue spots per slot to prevent
              starvation).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#f5f4ef] px-3.5 py-2 border border-[#ded9cd] self-start sm:self-auto text-xs text-[#1a2639]">
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            <span className="font-semibold">Turnstiles open: 06:00 – 22:00</span>
          </div>
        </div>

        {/* 2. Interactive Calendar & Filter Controls */}
        <div className="mt-6 space-y-5">
          {/* Calendar Date Bar */}
          <div className="bg-[#f5f4ef] p-4 border border-[#ded9cd] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[#c45524]" />
                <span className="text-xs font-bold text-[#1a2639]">Booking Date:</span>
                <span className="text-xs font-semibold text-[#c45524] bg-white px-2.5 py-1 border border-[#ded9cd]">
                  {formatDateDisplay(selectedDate)} ({dateLabel})
                </span>
              </div>

              <button
                onClick={() => setShowCalendarDropdown((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-white border border-[#ded9cd] text-[#1a2639] hover:bg-[#ebe7df] transition-colors self-start sm:self-auto"
              >
                <CalendarIcon className="h-3.5 w-3.5 text-[#1a2639]" />
                <span>{showCalendarDropdown ? "Hide Calendar View" : "Open Calendar View"}</span>
              </button>
            </div>

            {/* Quick 5-day horizon buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {Array.from({ length: 6 }).map((_, idx) => {
                const d = new Date(today);
                d.setDate(today.getDate() + idx);
                const isSelected =
                  d.getDate() === selectedDate.getDate() &&
                  d.getMonth() === selectedDate.getMonth();
                const label = formatDayLabel(d, today);

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDate(d);
                      setShowCalendarDropdown(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors shrink-0 ${
                      isSelected
                        ? "bg-[#1a2639] text-white border-[#1a2639] font-bold"
                        : "bg-white text-[#4b5260] border-[#ded9cd] hover:bg-[#ebe7df]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Interactive Full Calendar Modal / Drawer Dropdown */}
            {showCalendarDropdown && (
              <div className="mt-3 p-4 bg-white border border-[#ded9cd] shadow-md animate-in fade-in-50">
                <div className="flex items-center justify-between border-b border-[#eeeae1] pb-2 mb-3">
                  <div className="text-xs font-bold text-[#1a2639]">
                    {calendarMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setCalendarMonth(
                          new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
                        )
                      }
                      className="p-1 hover:bg-[#f5f4ef] text-[#1a2639]"
                      aria-label="Previous Month"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setCalendarMonth(
                          new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
                        )
                      }
                      className="p-1 hover:bg-[#f5f4ef] text-[#1a2639]"
                      aria-label="Next Month"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#636a77] mb-1">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Day grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((d, i) => {
                    if (!d) {
                      return <div key={`empty-${i}`} className="h-8" />;
                    }
                    const isPast = d < today;
                    const isSelected =
                      d.getDate() === selectedDate.getDate() &&
                      d.getMonth() === selectedDate.getMonth() &&
                      d.getFullYear() === selectedDate.getFullYear();

                    return (
                      <button
                        key={`day-${i}`}
                        disabled={isPast}
                        onClick={() => {
                          setSelectedDate(d);
                          setShowCalendarDropdown(false);
                        }}
                        className={`h-8 text-xs transition-colors flex items-center justify-center border ${
                          isSelected
                            ? "bg-[#c45524] text-white border-[#c45524] font-bold"
                            : isPast
                              ? "bg-[#f5f4ef] text-[#a3afc2] border-transparent cursor-not-allowed opacity-50"
                              : "bg-white text-[#1a2639] border-[#eeeae1] hover:bg-[#ebe7df]"
                        }`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Discipline Pills */}
          <div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => navigate({ search: {} })}
                className={`px-3 py-1.5 text-xs transition-colors border shrink-0 ${
                  !sport
                    ? "bg-[#1a2639] text-white border-[#1a2639] font-bold"
                    : "bg-[#f5f4ef] text-[#4b5260] border-[#ded9cd] hover:bg-white"
                }`}
              >
                All Disciplines
              </button>
              {SPORTS.map((s) => {
                const active = sport === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => navigate({ search: { sport: s.id } })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors border shrink-0 ${
                      active
                        ? "bg-[#1a2639] text-white border-[#1a2639] font-bold"
                        : "bg-[#f5f4ef] text-[#4b5260] border-[#ded9cd] hover:bg-white"
                    }`}
                  >
                    <SportIcon sport={s.id} className="h-3.5 w-3.5" />
                    <span>{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campus Toggle */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#eeeae1]">
            <span className="text-xs text-[#636a77] font-medium mr-1">Campus:</span>
            {["All", ...CAMPUSES].map((c) => (
              <button
                key={c}
                onClick={() => setCampus(c)}
                className={`px-3 py-1 text-xs border transition-colors ${
                  campus === c
                    ? "bg-[#1a2639] text-white border-[#1a2639] font-semibold"
                    : "bg-white text-[#4b5260] border-[#ded9cd] hover:bg-[#f5f4ef]"
                }`}
              >
                {c === "All" ? "All Campuses" : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Facility Cards & Time Slots Availability Matrix */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b-2 border-[#1a2639] pb-3">
          <div>
            <h2 className="text-xl font-bold text-[#1a2639]">Available Courts & Time Slots</h2>
            <p className="text-xs text-[#636a77]">
              Showing slots for <span className="font-semibold text-[#c45524]">{dateLabel}</span>.
              Click an available slot to reserve, or join the queue for booked slots.
            </p>
          </div>
          <div className="text-xs text-[#636a77]">{filteredCourts.length} Courts Listed</div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#4b5260] bg-white p-3 border border-[#ded9cd]">
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 bg-white border-2 border-[#c45524]" />
            <span>Available Slot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 bg-[#c45524] text-white" />
            <span>Selected for Booking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 bg-[#ebe7df] border border-[#ded9cd]" />
            <span>Booked (Queue Request Open, max 2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 bg-[#1a2639] text-white" />
            <span>In Standby Queue</span>
          </div>
        </div>

        {/* Facility Cards */}
        <div className="space-y-6">
          {filteredCourts.map((court) => {
            const sportObj = SPORTS.find((s) => s.id === court.sport);

            return (
              <div
                key={court.id}
                className="bg-white border border-[#ded9cd] p-6 shadow-xs transition-colors hover:border-[#1a2639]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                  {/* Left: Court info & photography */}
                  <div className="lg:col-span-1 space-y-3">
                    <div className="relative h-44 w-full overflow-hidden bg-[#f5f4ef] border border-[#ded9cd]">
                      <img
                        src={court.image}
                        alt={court.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-[#1a2639] text-white px-2 py-0.5 text-[10px] font-semibold">
                        {court.indoor ? "Indoor Hall" : "Outdoor Arena"}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white/95 text-[#1a2639] px-2 py-0.5 text-xs font-semibold">
                        Free Student Pass
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#1a2639]">{court.name}</h3>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#636a77]">
                        <MapPin className="h-3.5 w-3.5 text-[#1a2639] shrink-0" />
                        <span>{court.campus}</span>
                        <span>·</span>
                        <span className="text-[#c45524] font-medium">{sportObj?.name}</span>
                      </div>
                      <p className="mt-2 text-xs text-[#4b5260] leading-relaxed">
                        {court.equipment}
                      </p>
                      <div className="mt-2 text-[11px] text-[#636a77] flex items-center gap-1 font-medium">
                        <Users className="h-3 w-3" />
                        <span>Capacity: {court.capacity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Slot Matrix (6 AM - 10 PM) */}
                  <div className="lg:col-span-3 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#eeeae1] pb-2">
                      <span className="text-xs font-bold text-[#1a2639]">
                        Hourly Slots for {dateLabel}
                      </span>
                      <span className="text-xs text-[#636a77]">6:00 AM to 10:00 PM</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2.5">
                      {SLOT_HOURS.map((hour) => {
                        // Check if booked deterministically or booked in state
                        const deterministicBooked = isSlotBooked(court.id, hour, dayOffset);
                        const isBookedInState = bookings.some(
                          (b) =>
                            b.courtId === court.id &&
                            b.dateLabel === dateLabel &&
                            b.hour === hour &&
                            b.status === "upcoming",
                        );
                        const booked = deterministicBooked || isBookedInState;

                        const isSelected =
                          selected?.court.id === court.id && selected?.hour === hour;

                        // Check Queue
                        const queue = getQueueForSlot(court.id, dateLabel, hour);
                        const userQueued = isSlotQueuedByUser(court.id, dateLabel, hour);
                        const queueFull = queue.length >= 2;

                        if (booked) {
                          return (
                            <div
                              key={hour}
                              className={`p-2.5 border text-left flex flex-col justify-between rounded-none transition-colors ${
                                userQueued
                                  ? "bg-[#1a2639] text-white border-[#1a2639]"
                                  : "bg-[#ebe7df] text-[#636a77] border-[#ded9cd]"
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold">{formatHour(hour)}</span>
                                  <span
                                    className={`text-[10px] px-1 py-0.2 ${
                                      userQueued
                                        ? "bg-[#c45524] text-white"
                                        : "bg-[#ded9cd] text-[#4b5260]"
                                    }`}
                                  >
                                    {userQueued ? "Queued" : "Booked"}
                                  </span>
                                </div>
                                <p className="text-[10px] mt-1 line-clamp-1">
                                  {userQueued
                                    ? `Position #${queue.find((q) => q.status === "waiting")?.position || 1} of 2`
                                    : `Queue: ${queue.length}/2 spots`}
                                </p>
                              </div>

                              <div className="mt-2 pt-1 border-t border-[#ded9cd]/60">
                                {userQueued ? (
                                  <span className="text-[10px] text-[#b4bdcb]">On standby</span>
                                ) : queueFull ? (
                                  <span className="text-[10px] text-[#8c94a0]">
                                    Queue full (2/2)
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleQueueRequest(court, hour)}
                                    className="w-full text-center text-[10px] font-bold text-[#c45524] hover:underline"
                                  >
                                    Join Queue ({2 - queue.length} left)
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        }

                        // Available slot
                        return (
                          <button
                            key={hour}
                            onClick={() => setSelected({ court, hour })}
                            className={`p-2.5 border text-left flex flex-col justify-between rounded-none transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#c45524] text-white border-[#c45524] shadow-sm"
                                : "bg-white text-[#1a2639] border-[#ded9cd] hover:border-[#c45524] hover:bg-[#faf9f5]"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold">{formatHour(hour)}</span>
                                <span
                                  className={`text-[10px] px-1 py-0.2 ${
                                    isSelected
                                      ? "bg-white text-[#c45524] font-bold"
                                      : "bg-[#f5f4ef] text-[#1a2639]"
                                  }`}
                                >
                                  {isSelected ? "Selected" : "Open"}
                                </span>
                              </div>
                              <p
                                className={`text-[10px] mt-1 ${
                                  isSelected ? "text-white/90" : "text-[#636a77]"
                                }`}
                              >
                                Access: Free with Student ID
                              </p>
                            </div>

                            <div className="mt-2 pt-1 border-t border-current/20 text-[10px] font-medium">
                              {isSelected ? "Click confirm below" : "Select Slot"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Booking Summary Drawer / Panel when slot is selected */}
      {selected && (
        <div className="bg-white border border-[#ded9cd] border-l-4 border-l-[#c45524] p-6 shadow-lg animate-in slide-in-from-bottom-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#c45524]">Reservation Summary</span>
              <h3 className="text-lg font-bold text-[#1a2639]">
                {selected.court.name} ({selected.court.campus})
              </h3>
              <p className="text-xs text-[#636a77] mt-1">
                Date: <strong className="text-[#1a2639]">{dateLabel}</strong> · Slot:{" "}
                <strong className="text-[#1a2639]">
                  {formatHour(selected.hour)} – {formatHour(selected.hour + 1)}
                </strong>{" "}
                · Facility Access:{" "}
                <strong className="text-[#1a2639]">Free (PESU Student Clearance)</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="text-xs" onClick={() => setSelected(null)}>
                Clear Selection
              </Button>
              <Button
                onClick={confirmBooking}
                className="bg-[#c45524] hover:bg-[#b04a1d] text-white text-xs font-bold px-6 py-2"
              >
                Confirm Pass
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Booking Confirmation Modal */}
      {confirmedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setConfirmedBookingId(null)}
        >
          <div
            className="w-full max-w-lg bg-white border border-[#ded9cd] p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eeeae1] pb-3">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#10b981]" />
                <h3 className="text-lg font-bold text-[#1a2639]">Reservation Confirmed!</h3>
              </div>
              <button
                onClick={() => setConfirmedBookingId(null)}
                className="p-1 text-[#636a77] hover:text-[#1a2639]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <BookingDetails booking={confirmedBooking} />

            <div className="p-3 bg-[#f5f4ef] border border-[#ded9cd] text-xs text-[#4b5260] space-y-1">
              <p className="font-semibold text-[#1a2639]">Turnstile Gate Entry Notice:</p>
              <p>
                Please arrive 5 minutes before your slot with your PESU Student RFID card or the
                digital pass in your profile. Non-marking shoes are mandatory for indoor wooden
                courts.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                className="bg-[#1a2639] hover:bg-[#25364e] text-white text-xs font-bold"
                onClick={() => setConfirmedBookingId(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Queue Standby Modal Notice */}
      {queueModalInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setQueueModalInfo(null)}
        >
          <div
            className="w-full max-w-md bg-white border border-[#ded9cd] border-t-4 border-t-[#c45524] p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eeeae1] pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#c45524]" />
                <h3 className="text-base font-bold text-[#1a2639]">Standby Queue Confirmed</h3>
              </div>
              <button
                onClick={() => setQueueModalInfo(null)}
                className="p-1 text-[#636a77] hover:text-[#1a2639]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#4b5260]">
              <p>
                You are registered in <strong>Position #{queueModalInfo.position}</strong> of 2 for:
              </p>
              <div className="p-3 bg-[#f5f4ef] border border-[#ded9cd] space-y-1 font-semibold text-[#1a2639]">
                <p>
                  {queueModalInfo.court.name} ({queueModalInfo.court.campus})
                </p>
                <p>
                  {dateLabel} · {formatHour(queueModalInfo.hour)}–
                  {formatHour(queueModalInfo.hour + 1)}
                </p>
              </div>
              <p className="text-[#636a77] text-[11px] leading-relaxed pt-1">
                <strong>Starvation Protection Policy:</strong> To keep access fair and prevent
                infinite waitlists, queues are capped at 2 standby students per slot. If the current
                slot holder cancels, your reservation will be automatically upgraded to confirmed.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                className="bg-[#c45524] hover:bg-[#b04a1d] text-white text-xs font-bold"
                onClick={() => setQueueModalInfo(null)}
              >
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Shared MyBookings (Required by rule in AGENTS.md) */}
      <MyBookings />
    </main>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Clock, Info, MapPin, ShieldCheck, Sparkles, UserCheck, Users } from "lucide-react";
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
      { title: "PESU Sports — Book Facilities & Courts" },
      {
        name: "description",
        content:
          "Browse live availability and reserve badminton, basketball, squash, and turf courts at PES University.",
      },
      { property: "og:title", content: "PESU Sports — Book Facilities & Courts" },
      {
        property: "og:description",
        content:
          "Browse live availability and reserve badminton, basketball, squash, and turf courts at PES University.",
      },
    ],
  }),
  component: Courts,
});

const DAYS = ["Today", "Tomorrow", "Sat", "Sun"];

function Courts() {
  const { sport } = Route.useSearch();
  const navigate = useNavigate({ from: "/courts" });
  const { addBooking, bookings } = useApp();
  const [campus, setCampus] = useState<string>("All");
  const [dayIdx, setDayIdx] = useState(0);
  const [selected, setSelected] = useState<{ court: Court; hour: number } | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      COURTS.filter(
        (c) => (!sport || c.sport === sport) && (campus === "All" || c.campus === campus),
      ),
    [sport, campus],
  );

  const confirmBooking = () => {
    if (!selected) return;
    const b = addBooking({
      courtId: selected.court.id,
      courtName: selected.court.name,
      sport: selected.court.sport,
      campus: selected.court.campus,
      dateLabel: DAYS[dayIdx] ?? "Today",
      hour: selected.hour,
      price: selected.court.pricePerHour,
      splitWith: [],
    });
    setConfirmed(b.id);
    setSelected(null);
  };

  const confirmedBooking = bookings.find((booking) => booking.id === confirmed);

  return (
    <main className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Sleek Editorial Header */}
      <div className="bg-white border border-[#e5e7eb] border-l-4 border-l-[#0d1b2a] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#f1f3f6] pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
              Athletic Facilities Directory
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111827] uppercase tracking-tight">
              Reserve a Court
            </h1>
            <p className="text-xs text-[#64748b] mt-1 font-medium">
              Live turnstile-connected slot availability across RR Campus and EC Campus.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#f8f8fa] px-3 py-1.5 border border-[#e5e7eb] self-start sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0d1b2a]">
              TURNSTILES LIVE · 06:00 – 22:00
            </span>
          </div>
        </div>

        {/* 2. Sleek Filter Controls Bar */}
        <div className="mt-5 space-y-4">
          {/* Sports Filter Row */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-2">
              Select Sport Discipline
            </label>
            <div className="no-scrollbar flex flex-wrap gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => navigate({ search: {} })}
                className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-colors border ${
                  !sport
                    ? "bg-[#0d1b2a] text-white border-[#0d1b2a]"
                    : "bg-[#f8f8fa] text-[#475569] border-[#e5e7eb] hover:bg-white hover:text-[#111827]"
                }`}
              >
                All Disciplines
              </button>
              {SPORTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => navigate({ search: { sport: s.id } })}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-colors border ${
                    sport === s.id
                      ? "bg-[#e35925] text-white border-[#e35925]"
                      : "bg-[#f8f8fa] text-[#475569] border-[#e5e7eb] hover:bg-white hover:text-[#111827]"
                  }`}
                >
                  <SportIcon sport={s.id} className="h-3.5 w-3.5" />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Campus & Day Selector */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#f1f3f6]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#64748b]">
                Campus:
              </span>
              <div className="flex gap-1">
                {["All", ...CAMPUSES].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCampus(c)}
                    className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border ${
                      campus === c
                        ? "bg-[#0d1b2a] text-white border-[#0d1b2a]"
                        : "bg-white text-[#475569] border-[#e5e7eb] hover:bg-[#f8f8fa]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden sm:block h-4 w-px bg-[#e5e7eb]" />

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#64748b]">
                Session Date:
              </span>
              <div className="flex gap-1">
                {DAYS.map((d, i) => (
                  <button
                    key={d}
                    onClick={() => setDayIdx(i)}
                    className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border ${
                      dayIdx === i
                        ? "bg-[#e35925] text-white border-[#e35925]"
                        : "bg-white text-[#475569] border-[#e5e7eb] hover:bg-[#f8f8fa]"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-[#f1f3f6] flex items-center gap-5 text-xs text-[#64748b]">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-white border border-[#e5e7eb]" /> Available Slot
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-[#e35925]" /> Selected Slot
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-[#f1f3f6] border border-[#e5e7eb]" /> Booked / Unavailable
          </span>
        </div>
      </div>

      {/* 3. Facility Cards & Slots Matrix */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#e5e7eb] text-xs font-black uppercase tracking-wider text-[#64748b]">
            No courts match the selected filters.
          </div>
        ) : (
          filtered.map((court) => {
            const sportInfo = SPORTS.find((s) => s.id === court.sport);
            return (
              <div
                key={court.id}
                className="bg-white border border-[#e5e7eb] p-5 sm:p-6 shadow-xs hover:border-[#0d1b2a] transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 border-b border-[#f1f3f6] pb-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative h-24 w-32 shrink-0 overflow-hidden bg-slate-100">
                      <img
                        src={court.image}
                        alt={court.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-[#0d1b2a] text-white px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider">
                        {court.indoor ? "INDOOR" : "OUTDOOR"}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 grid place-items-center bg-[#0d1b2a] text-white text-xs">
                          <SportIcon sport={court.sport} className="h-3.5 w-3.5" />
                        </span>
                        <h2 className="text-lg font-black text-[#111827] uppercase tracking-tight">
                          {court.name}
                        </h2>
                      </div>
                      <p className="flex items-center gap-1.5 text-xs text-[#64748b] font-medium">
                        <MapPin className="h-3.5 w-3.5 text-[#0d1b2a]" /> {court.campus} ·{" "}
                        <span>{court.capacity}</span>
                      </p>
                      <p className="text-xs text-[#475569] font-medium pt-1">
                        Equipment: <span className="text-[#111827]">{court.equipment}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center lg:flex-col lg:items-end justify-between gap-2">
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#64748b] block">
                        STUDENT SUBSIDY RATE
                      </span>
                      <span className="text-xl font-black text-[#111827] font-mono">
                        ₹{court.pricePerHour}
                        <span className="text-xs text-[#64748b] font-normal"> / hour</span>
                      </span>
                    </div>
                    <span className="bg-[#f4efe9] text-[#e35925] border border-[#f3dfd4] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                      {sportInfo?.name}
                    </span>
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#64748b]">
                      Select Time Slot ({DAYS[dayIdx]})
                    </span>
                    <span className="text-[10px] text-[#64748b] font-mono">60 MIN DURATION</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {SLOT_HOURS.map((h) => {
                      const booked = isSlotBooked(court.id, h, dayIdx);
                      const isSel = selected?.court.id === court.id && selected.hour === h;
                      return (
                        <button
                          key={h}
                          disabled={booked}
                          onClick={() => setSelected(isSel ? null : { court, hour: h })}
                          className={`py-2 text-[11px] font-black tabular-nums transition-colors border ${
                            isSel
                              ? "bg-[#e35925] text-white border-[#e35925]"
                              : booked
                                ? "bg-[#f1f3f6] text-[#94a3b8] border-[#e5e7eb] line-through cursor-not-allowed"
                                : "bg-white text-[#111827] border-[#e5e7eb] hover:border-[#0d1b2a] hover:bg-[#fafafc]"
                          }`}
                        >
                          {h % 12 === 0 ? 12 : h % 12} {h < 12 ? "AM" : "PM"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Booking confirmation panel */}
                {selected?.court.id === court.id && (
                  <div className="mt-5 p-5 bg-[#fafafc] border border-[#0d1b2a] border-l-4 border-l-[#e35925] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in-50 duration-150">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#e35925] block">
                        RESERVATION SUMMARY
                      </span>
                      <p className="text-sm font-black text-[#111827] uppercase tracking-tight">
                        {selected.court.name} · {DAYS[dayIdx]} ({formatHour(selected.hour)} –{" "}
                        {formatHour(selected.hour + 1)})
                      </p>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Campus: {selected.court.campus} · Rate: ₹{selected.court.pricePerHour}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-black uppercase"
                        onClick={() => setSelected(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#e35925] hover:bg-[#cf4d1c] text-white text-xs font-black uppercase tracking-wider px-5"
                        onClick={confirmBooking}
                      >
                        Confirm Pass
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 4. Athlete Activity (Preserving shared MyBookings) */}
      <MyBookings />

      {/* 5. Confirmation Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-confirmed-title"
            className="w-full max-w-md bg-white border-2 border-[#0d1b2a] p-6 text-center shadow-2xl animate-in fade-in-50 duration-150"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#0d1b2a] text-white border-l-4 border-[#e35925]">
              <Check className="h-7 w-7 text-[#e35925]" />
            </div>
            <span className="mt-3 block text-[10px] font-black uppercase tracking-widest text-[#e35925]">
              PASS ISSUED
            </span>
            <h2
              id="booking-confirmed-title"
              className="text-xl font-black text-[#111827] uppercase tracking-tight"
            >
              Facility Slot Reserved
            </h2>
            <p className="mt-1 text-xs text-[#64748b]">
              Your student RFID pass is active for the court turnstile entry.
            </p>

            <div className="mt-5 border border-[#e5e7eb]">
              <BookingDetails booking={confirmedBooking} />
            </div>

            <Button
              className="mt-5 w-full bg-[#0d1b2a] hover:bg-[#1c2d42] text-white text-xs font-black uppercase tracking-wider py-3"
              onClick={() => setConfirmed(null)}
            >
              Done & View Activity
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

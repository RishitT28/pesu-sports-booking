import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Info, MapPin } from "lucide-react";
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
      { title: "PES University — Book a Court" },
      {
        name: "description",
        content: "Browse and book badminton, squash, basketball, turf and more at PES University.",
      },
      { property: "og:title", content: "PES University — Book a Court" },
      {
        property: "og:description",
        content: "Browse and book badminton, squash, basketball, turf and more at PES University.",
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
    <main className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Breadcrumbs header matching PESU Academy */}
      <div className="bg-white border border-[#cbd5e1] p-4 rounded-none shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2e8f0] pb-3">
          <div>
            <h1 className="text-xl font-bold text-[#084d7a] uppercase tracking-wide">
              Sports Facilities — Court Booking
            </h1>
            <p className="text-xs text-[#64748b] mt-0.5">
              Reserve slots for indoor and outdoor sports complexes at RR Campus and EC Campus
            </p>
          </div>
          <div className="text-xs font-mono text-[#084d7a] bg-[#f0f3f6] px-3 py-1.5 border border-[#dbe2ea] rounded-none">
            Status: Facility Active (06:00 – 22:00)
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-4 space-y-3">
          {/* Sports Filter Row */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Filter By Sport
            </label>
            <div className="no-scrollbar flex flex-wrap gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => navigate({ search: {} })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-none transition-colors border ${
                  !sport
                    ? "bg-[#0080b0] text-white border-[#0080b0]"
                    : "bg-white text-[#334155] border-[#cbd5e1] hover:bg-[#f1f5f9]"
                }`}
              >
                All Sports
              </button>
              {SPORTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => navigate({ search: { sport: s.id } })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-none transition-colors border ${
                    sport === s.id
                      ? "bg-[#0080b0] text-white border-[#0080b0]"
                      : "bg-white text-[#334155] border-[#cbd5e1] hover:bg-[#f1f5f9]"
                  }`}
                >
                  <SportIcon sport={s.id} className="h-3.5 w-3.5" />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Campus + Day Selectors */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#f1f5f9]">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#475569]">Campus:</span>
              <div className="flex gap-1">
                {["All", ...CAMPUSES].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCampus(c)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-none border ${
                      campus === c
                        ? "bg-[#084d7a] text-white border-[#084d7a]"
                        : "bg-white text-[#334155] border-[#cbd5e1] hover:bg-[#f8fafc]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden sm:block h-4 w-px bg-[#cbd5e1]" />

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#475569]">Date:</span>
              <div className="flex gap-1">
                {DAYS.map((d, i) => (
                  <button
                    key={d}
                    onClick={() => setDayIdx(i)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-none border ${
                      dayIdx === i
                        ? "bg-[#0080b0] text-white border-[#0080b0]"
                        : "bg-white text-[#334155] border-[#cbd5e1] hover:bg-[#f8fafc]"
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
        <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center gap-5 text-xs text-[#64748b]">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-white border border-[#cbd5e1] rounded-none" /> Available
            Slot
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-[#084d7a] rounded-none" /> Selected Slot
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-[#e2e8f0] border border-[#cbd5e1] rounded-none" /> Booked /
            Unavailable
          </span>
        </div>
      </div>

      {/* Courts List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#cbd5e1] text-sm text-[#64748b] rounded-none">
            No courts match the selected filters.
          </div>
        ) : (
          filtered.map((court) => {
            const sportInfo = SPORTS.find((s) => s.id === court.sport);
            return (
              <div
                key={court.id}
                className="bg-white border border-[#cbd5e1] p-4 rounded-none shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2e8f0] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f0f3f6] text-[#084d7a] border border-[#dbe2ea] rounded-none">
                      <SportIcon sport={court.sport} className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-sm font-bold text-[#0f172a]">{court.name}</h2>
                      <p className="flex items-center gap-1 text-xs text-[#64748b] mt-0.5">
                        <MapPin className="h-3 w-3 text-[#084d7a]" /> {court.campus} ·{" "}
                        <span className="font-medium text-[#0f172a]">
                          {court.indoor ? "Indoor Court" : "Outdoor Field"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#64748b]">
                      Student Rate:{" "}
                      <strong className="text-[#0f172a]">₹{court.pricePerHour}/hr</strong>
                    </span>
                    <span className="bg-[#e6f4ea] text-[#137333] border border-[#ceead6] px-2 py-0.5 text-[10px] font-bold uppercase rounded-none">
                      {sportInfo?.name}
                    </span>
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-2">
                    Available Time Slots for {DAYS[dayIdx]}:
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {SLOT_HOURS.map((h) => {
                      const booked = isSlotBooked(court.id, h, dayIdx);
                      const isSel = selected?.court.id === court.id && selected.hour === h;
                      return (
                        <button
                          key={h}
                          disabled={booked}
                          onClick={() => setSelected(isSel ? null : { court, hour: h })}
                          className={`py-2 text-[11px] font-semibold tabular-nums rounded-none transition-colors border ${
                            isSel
                              ? "bg-[#084d7a] text-white border-[#084d7a]"
                              : booked
                                ? "bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0] line-through cursor-not-allowed"
                                : "bg-white text-[#084d7a] border-[#cbd5e1] hover:bg-[#e6f4fb] hover:border-[#0080b0]"
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
                  <div className="mt-4 p-4 border border-[#0080b0] bg-[#f0f8fc] rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in-50 duration-150">
                    <div>
                      <p className="text-xs font-bold text-[#084d7a]">
                        Selected Slot: {DAYS[dayIdx]} · {formatHour(selected.hour)} –{" "}
                        {formatHour(selected.hour + 1)}
                      </p>
                      <p className="text-[11px] text-[#475569] mt-0.5">
                        Court: {selected.court.name} ({selected.court.campus}) · Fee: ₹
                        {selected.court.pricePerHour}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none text-xs"
                        onClick={() => setSelected(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-none bg-[#0080b0] hover:bg-[#006f9c] text-white text-xs font-semibold px-4"
                        onClick={confirmBooking}
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Shared MyBookings (required by user rule in AGENTS.md) */}
      <MyBookings />

      {/* Confirmation Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-confirmed-title"
            className="w-full max-w-md bg-white border border-[#cbd5e1] p-6 text-center shadow-xl rounded-none animate-in fade-in-50 duration-150"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#e6f4ea] text-[#137333] border border-[#ceead6] rounded-none">
              <Check className="h-6 w-6" />
            </div>
            <h2 id="booking-confirmed-title" className="mt-3 text-lg font-bold text-[#084d7a]">
              Court Slot Confirmed
            </h2>
            <p className="mt-1 text-xs text-[#64748b]">
              Your PESU facility reservation slip has been generated.
            </p>

            <div className="mt-4 border border-[#e2e8f0]">
              <BookingDetails booking={confirmedBooking} />
            </div>

            <Button
              className="mt-5 w-full rounded-none bg-[#0080b0] hover:bg-[#006f9c] text-white text-xs font-semibold py-2.5"
              onClick={() => setConfirmed(null)}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { CAMPUSES, COURTS, SLOT_HOURS, SPORTS, formatHour, isSlotBooked, type Court } from "@/lib/data";
import { useApp } from "@/lib/store";
import { BookingDetails, MyBookings } from "@/components/BookingDetails";
import { Button } from "@/components/ui/button";

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
      { title: "PES Play — Book a Court" },
      { name: "description", content: "Browse and book badminton, squash, basketball, cricket and more at PES University." },
      { property: "og:title", content: "PES Play — Book a Court" },
      { property: "og:description", content: "Browse and book badminton, squash, basketball, cricket and more at PES University." },
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
    <main className="mx-auto max-w-md px-4 pb-28 pt-5 md:max-w-6xl md:px-6 md:pb-12">
      <h1 className="text-2xl font-bold">Book a Court</h1>
      <p className="mt-1 text-sm text-muted-foreground">Pick a sport, campus and time slot.</p>

      {/* Sport filter */}
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Button variant="ghost"
          onClick={() => navigate({ search: {} })}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
            !sport ? "gradient-play text-primary-foreground" : "border border-border bg-card text-muted-foreground"
          }`}
        >
          All Sports
        </Button>
        {SPORTS.map((s) => (
          <Button variant="ghost"
            key={s.id}
            onClick={() => navigate({ search: { sport: s.id } })}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              sport === s.id ? "gradient-play text-primary-foreground" : "border border-border bg-card text-muted-foreground"
            }`}
          >
            <span>{s.icon}</span> {s.name}
          </Button>
        ))}
      </div>

      {/* Campus + day filters */}
      <div className="mt-3 flex flex-wrap gap-2">
        {["All", ...CAMPUSES].map((c) => (
          <Button variant="ghost"
            key={c}
            onClick={() => setCampus(c)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              campus === c ? "bg-accent text-accent-foreground" : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {c}
          </Button>
        ))}
        <span className="mx-1 w-px bg-border" />
        {DAYS.map((d, i) => (
          <Button variant="ghost"
            key={d}
            onClick={() => setDayIdx(i)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              dayIdx === i ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {d}
          </Button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-destructive/70" /> Booked</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-accent" /> Selected</span>
      </div>

      {/* Courts */}
      <div className="mt-4 space-y-4">
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No courts match these filters.
          </p>
        )}
        {filtered.map((court) => {
          const sportInfo = SPORTS.find((s) => s.id === court.sport);
          return (
            <div key={court.id} className="rounded-3xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl"
                    style={{ backgroundColor: `color-mix(in oklab, ${sportInfo?.color ?? "gray"} 18%, transparent)` }}
                  >
                    {sportInfo?.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{court.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {court.campus} · {court.indoor ? "Indoor" : "Outdoor"}
                    </p>
                  </div>
                </div>

              </div>

              {/* Slot grid */}
              <div className="mt-4 grid grid-cols-4 gap-1.5 sm:grid-cols-8">
                {SLOT_HOURS.map((h) => {
                  const booked = isSlotBooked(court.id, h, dayIdx);
                  const isSel = selected?.court.id === court.id && selected.hour === h;
                  return (
                    <Button variant="ghost"
                      key={h}
                      disabled={booked}
                      onClick={() => setSelected(isSel ? null : { court, hour: h })}
                      className={`rounded-lg py-2 text-[10px] font-semibold tabular-nums transition-all ${
                        isSel
                          ? "bg-accent text-accent-foreground ring-2 ring-accent/50"
                          : booked
                            ? "cursor-not-allowed bg-destructive/20 text-danger-soft line-through"
                            : "bg-primary/10 text-primary hover:bg-primary/25"
                      }`}
                    >
                      {h % 12 === 0 ? 12 : h % 12}{h < 12 ? "a" : "p"}
                    </Button>
                  );
                })}
              </div>

              {/* Booking panel */}
              {selected?.court.id === court.id && (
                <div className="mt-4 rounded-2xl border border-accent/30 bg-secondary/50 p-4">
                  <p className="text-sm font-semibold">
                    {DAYS[dayIdx]} · {formatHour(selected.hour)} – {formatHour(selected.hour + 1)}
                  </p>

                  <div className="mt-4 flex justify-end">
                    <Button variant="ghost"
                      onClick={confirmBooking}
                      className="gradient-play glow-primary rounded-xl px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <MyBookings />

      {/* Confirmation modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-background/80 backdrop-blur-sm md:items-center">
          <div role="dialog" aria-modal="true" aria-labelledby="booking-confirmed-title" className="w-full max-w-sm rounded-t-3xl border border-border bg-popover p-6 text-center md:rounded-3xl">
            <div className="gradient-play mx-auto grid h-14 w-14 place-items-center rounded-full">
              <Check className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 id="booking-confirmed-title" className="mt-4 font-display text-xl font-bold">Booking Confirmed!</h3>
            <div className="mt-5"><BookingDetails booking={confirmedBooking} /></div>
            <Button variant="ghost"
              onClick={() => setConfirmed(null)}
              className="gradient-play mt-5 w-full rounded-xl py-3 text-sm font-bold text-primary-foreground"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

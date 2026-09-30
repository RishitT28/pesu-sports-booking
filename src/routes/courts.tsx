import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, IndianRupee, MapPin, Star, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { CAMPUSES, COURTS, FRIENDS, SLOT_HOURS, SPORTS, formatHour, isSlotBooked, type Court } from "@/lib/data";
import { useApp } from "@/lib/store";
import { QrPass } from "@/components/QrPass";

type Search = { sport?: string };

export const Route = createFileRoute("/courts")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    sport: typeof s.sport === "string" ? s.sport : undefined,
  }),
  head: () => ({
    meta: [
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
  const { addBooking } = useApp();
  const [campus, setCampus] = useState<string>("All");
  const [dayIdx, setDayIdx] = useState(0);
  const [selected, setSelected] = useState<{ court: Court; hour: number } | null>(null);
  const [split, setSplit] = useState(false);
  const [invited, setInvited] = useState<string[]>([]);
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
      dateLabel: DAYS[dayIdx],
      hour: selected.hour,
      price: split ? Math.round(selected.court.pricePerHour / (invited.length + 1)) : selected.court.pricePerHour,
      splitWith: invited,
    });
    setConfirmed(b.id);
    setSelected(null);
    setInvited([]);
    setSplit(false);
  };

  return (
    <main className="mx-auto max-w-md px-4 pb-28 pt-5 md:max-w-6xl md:px-6 md:pb-12">
      <h1 className="text-2xl font-bold">Book a Court</h1>
      <p className="mt-1 text-sm text-muted-foreground">Pick a sport, campus and time slot.</p>

      {/* Sport filter */}
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button
          onClick={() => navigate({ search: {} })}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
            !sport ? "gradient-play text-primary-foreground" : "border border-border bg-card text-muted-foreground"
          }`}
        >
          All Sports
        </button>
        {SPORTS.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate({ search: { sport: s.id } })}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              sport === s.id ? "gradient-play text-primary-foreground" : "border border-border bg-card text-muted-foreground"
            }`}
          >
            <span>{s.icon}</span> {s.name}
          </button>
        ))}
      </div>

      {/* Campus + day filters */}
      <div className="mt-3 flex flex-wrap gap-2">
        {["All", ...CAMPUSES].map((c) => (
          <button
            key={c}
            onClick={() => setCampus(c)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              campus === c ? "bg-accent text-accent-foreground" : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {c}
          </button>
        ))}
        <span className="mx-1 w-px bg-border" />
        {DAYS.map((d, i) => (
          <button
            key={d}
            onClick={() => setDayIdx(i)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              dayIdx === i ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {d}
          </button>
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
                <div className="shrink-0 text-right">
                  <p className="flex items-center justify-end gap-1 text-xs font-semibold text-volt">
                    <Star className="h-3 w-3 fill-current" /> {court.rating}
                  </p>
                  <p className="mt-0.5 flex items-center justify-end text-sm font-bold text-primary">
                    <IndianRupee className="h-3.5 w-3.5" />{court.pricePerHour}/hr
                  </p>
                </div>
              </div>

              {/* Slot grid */}
              <div className="mt-4 grid grid-cols-4 gap-1.5 sm:grid-cols-8">
                {SLOT_HOURS.map((h) => {
                  const booked = isSlotBooked(court.id, h, dayIdx);
                  const isSel = selected?.court.id === court.id && selected.hour === h;
                  return (
                    <button
                      key={h}
                      disabled={booked}
                      onClick={() => setSelected(isSel ? null : { court, hour: h })}
                      className={`rounded-lg py-2 text-[10px] font-semibold tabular-nums transition-all ${
                        isSel
                          ? "bg-accent text-accent-foreground ring-2 ring-accent/50"
                          : booked
                            ? "cursor-not-allowed bg-destructive/15 text-destructive/60 line-through"
                            : "bg-primary/10 text-primary hover:bg-primary/25"
                      }`}
                    >
                      {h % 12 === 0 ? 12 : h % 12}{h < 12 ? "a" : "p"}
                    </button>
                  );
                })}
              </div>

              {/* Booking panel */}
              {selected?.court.id === court.id && (
                <div className="mt-4 rounded-2xl border border-accent/30 bg-secondary/50 p-4">
                  <p className="text-sm font-semibold">
                    {DAYS[dayIdx]} · {formatHour(selected.hour)} – {formatHour(selected.hour + 1)}
                  </p>

                  <label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5">
                    <span className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-accent" /> Split payment / invite friends
                    </span>
                    <button
                      role="switch"
                      aria-checked={split}
                      onClick={(e) => { e.preventDefault(); setSplit(!split); }}
                      className={`relative h-6 w-11 rounded-full transition-colors ${split ? "bg-primary" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-all ${split ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </label>

                  {split && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {FRIENDS.map((f) => {
                        const on = invited.includes(f);
                        return (
                          <button
                            key={f}
                            onClick={() => setInvited((p) => (on ? p.filter((x) => x !== f) : [...p, f]))}
                            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                              on ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground"
                            }`}
                          >
                            {on && <Check className="h-3 w-3" />} {f}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Total:{" "}
                      <span className="font-bold text-foreground">
                        ₹{split ? Math.round(court.pricePerHour / (invited.length + 1)) : court.pricePerHour}
                      </span>
                      {split && invited.length > 0 && (
                        <span className="text-xs"> per person ({invited.length + 1} players)</span>
                      )}
                    </p>
                    <button
                      onClick={confirmBooking}
                      className="gradient-play glow-primary rounded-xl px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation modal */}
      {confirmed && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center">
          <div className="w-full max-w-sm rounded-t-3xl border border-border bg-popover p-6 text-center md:rounded-3xl">
            <div className="gradient-play mx-auto grid h-14 w-14 place-items-center rounded-full">
              <Check className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">Booking Confirmed!</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your QR entry pass is ready.</p>
            <div className="mt-5 flex justify-center">
              <QrPass seed={confirmed} />
            </div>
            <p className="mt-3 rounded-full bg-secondary px-3 py-1 font-mono text-xs text-primary inline-block">
              {confirmed.toUpperCase()}
            </p>
            <button
              onClick={() => setConfirmed(null)}
              className="gradient-play mt-5 w-full rounded-xl py-3 text-sm font-bold text-primary-foreground"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

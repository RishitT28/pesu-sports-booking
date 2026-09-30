import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Clock, Flame, MapPin, QrCode, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SPORTS, USER, formatHour } from "@/lib/data";
import { useApp } from "@/lib/store";
import { QrPass } from "@/components/QrPass";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PES Play — Home" },
      { name: "description", content: "Your campus sports dashboard: book courts, join matches, track your PR." },
      { property: "og:title", content: "PES Play — Home" },
      { property: "og:description", content: "Your campus sports dashboard: book courts, join matches, track your PR." },
    ],
  }),
  component: Home,
});

function useCountdown(targetHour: number) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const target = new Date(now);
      target.setHours(targetHour, 0, 0, 0);
      if (target.getTime() < now.getTime()) target.setDate(target.getDate() + 1);
      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLabel(`${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [targetHour]);
  return label;
}

function Home() {
  const { bookings, matches, joinMatch, cancelBooking } = useApp();
  const upcoming = bookings.filter((b) => b.status === "upcoming").sort((a, b) => a.hour - b.hour);
  const next = upcoming[0];
  const countdown = useCountdown(next?.hour ?? 17);
  const [passBooking, setPassBooking] = useState<string | null>(null);
  const pass = upcoming.find((b) => b.id === passBooking);
  const openMatches = matches.filter((m) => m.players.length < m.maxPlayers).slice(0, 3);

  return (
    <main className="mx-auto max-w-md px-4 pb-28 pt-5 md:max-w-6xl md:px-6 md:pb-12">
      {/* Greeting */}
      <section className="gradient-card glow-primary rounded-3xl border border-border p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {USER.campus}
            </p>
            <h1 className="mt-1 truncate text-2xl font-bold">
              Hey, {USER.name} 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Ready to play today?</p>
          </div>
          <div className="shrink-0 rounded-2xl border border-border bg-card/60 px-3 py-2 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">PR Rating</p>
            <p className="text-gradient text-xl font-bold">{USER.pr}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Flame className="h-3.5 w-3.5 text-primary" />
          <span>7-day streak · {USER.skill} level</span>
        </div>
      </section>

      {/* Quick book grid */}
      <section className="mt-7">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Book a Court</h2>
          <Link to="/courts" className="flex items-center gap-0.5 text-xs font-semibold text-primary">
            All courts <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3 md:grid-cols-7">
          {SPORTS.map((s) => (
            <Link
              key={s.id}
              to="/courts"
              search={{ sport: s.id }}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/50"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-xl text-xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: `color-mix(in oklab, ${s.color} 18%, transparent)` }}
              >
                {s.icon}
              </span>
              <span className="text-center text-[10px] font-medium leading-tight text-muted-foreground">
                {s.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming booking */}
      <section className="mt-7">
        <h2 className="text-lg font-bold">Upcoming Bookings</h2>
        {next ? (
          <div className="mt-3 rounded-3xl border border-primary/30 bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{next.courtName}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {next.campus} · {next.dateLabel}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {formatHour(next.hour)} – {formatHour(next.hour + 1)}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                Confirmed
              </span>
            </div>
            <div className="mt-4 rounded-2xl bg-secondary/60 p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Starts in</p>
              <p className="text-gradient font-display text-2xl font-bold tabular-nums">{countdown}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setPassBooking(next.id)}
                className="gradient-play flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <QrCode className="h-4 w-4" /> Entry Pass
              </button>
              <button
                onClick={() => cancelBooking(next.id)}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No upcoming bookings.{" "}
            <Link to="/courts" className="font-semibold text-primary">Book a court →</Link>
          </div>
        )}
        {upcoming.slice(1).map((b) => (
          <div key={b.id} className="mt-2 flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{b.courtName}</p>
              <p className="text-xs text-muted-foreground">{b.dateLabel} · {formatHour(b.hour)}</p>
            </div>
            <button
              onClick={() => setPassBooking(b.id)}
              className="shrink-0 rounded-lg bg-secondary p-2 text-primary"
              aria-label="Show entry pass"
            >
              <QrCode className="h-4 w-4" />
            </button>
          </div>
        ))}
      </section>

      {/* Find players feed */}
      <section className="mt-7">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Find Players</h2>
          <Link to="/matches" className="flex items-center gap-0.5 text-xs font-semibold text-primary">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-3 space-y-3">
          {openMatches.map((m) => {
            const sport = SPORTS.find((s) => s.id === m.sport);
            const joined = m.players.includes(USER.name);
            return (
              <div key={m.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-lg">
                    {sport?.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{m.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {m.host} · {m.time} · {m.campus}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                    {m.skill}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {m.players.slice(0, 4).map((p) => (
                      <span
                        key={p}
                        className="grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-secondary text-[10px] font-bold text-primary"
                      >
                        {p[0]}
                      </span>
                    ))}
                    <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-muted text-[9px] font-bold text-muted-foreground">
                      {m.players.length}/{m.maxPlayers}
                    </span>
                  </div>
                  <button
                    onClick={() => joinMatch(m.id)}
                    disabled={joined}
                    className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                      joined
                        ? "bg-secondary text-primary"
                        : "gradient-play text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {joined ? "Joined ✓" : "Join Match"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* QR pass modal */}
      {pass && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center"
          onClick={() => setPassBooking(null)}
        >
          <div
            className="w-full max-w-sm rounded-t-3xl border border-border bg-popover p-6 md:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Entry Pass</h3>
              <button
                onClick={() => setPassBooking(null)}
                className="rounded-full bg-secondary p-1.5 text-muted-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 flex flex-col items-center">
              <QrPass seed={pass.id} />
              <p className="mt-4 font-semibold">{pass.courtName}</p>
              <p className="text-sm text-muted-foreground">
                {pass.dateLabel} · {formatHour(pass.hour)} – {formatHour(pass.hour + 1)} · {pass.campus}
              </p>
              <p className="mt-2 rounded-full bg-secondary px-3 py-1 font-mono text-xs text-primary">
                {pass.id.toUpperCase()}
              </p>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Show this QR at the sports complex gate for verification.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

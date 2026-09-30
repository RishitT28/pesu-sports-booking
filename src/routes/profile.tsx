import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Clock, Pencil, Swords, Trophy } from "lucide-react";
import { BADGES, SPORTS, USER } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "PES Play — Profile" },
      { name: "description", content: "Your PES Play profile: stats, badges, and favorite sports." },
      { property: "og:title", content: "PES Play — Profile" },
      { property: "og:description", content: "Your PES Play profile: stats, badges, and favorite sports." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { hoursLogged, matchesPlayed, bookings } = useApp();
  const activeBookings = bookings.filter((b) => b.status === "upcoming").length;

  return (
    <main className="mx-auto max-w-md px-4 pb-28 pt-5 md:max-w-6xl md:px-6 md:pb-12">
      {/* Identity card */}
      <section className="gradient-card glow-primary rounded-3xl border border-border p-5">
        <div className="flex items-center gap-4">
          <div className="gradient-play grid h-16 w-16 shrink-0 place-items-center rounded-2xl font-display text-2xl font-bold text-primary-foreground">
            {USER.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-xl font-bold">{USER.fullName}</h1>
              {USER.verified && <BadgeCheck className="h-5 w-5 shrink-0 text-accent" />}
            </div>
            <p className="text-xs text-muted-foreground">rishit@pesu.pes.edu · {USER.campus}</p>
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold text-primary">
              <BadgeCheck className="h-3 w-3" /> PESU Verified Student
            </span>
          </div>
          <button className="shrink-0 rounded-full bg-secondary p-2 text-muted-foreground" aria-label="Edit profile">
            <Pencil className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-card/60 px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">PR / Skill Rating</p>
            <p className="text-gradient font-display text-2xl font-bold">{USER.pr} · {USER.skill}</p>
          </div>
          <Trophy className="h-8 w-8 text-volt" />
        </div>
      </section>

      {/* Stats */}
      <section className="mt-5 grid grid-cols-3 gap-3">
        {[
          { icon: Swords, label: "Matches", value: matchesPlayed },
          { icon: Clock, label: "Hours", value: hoursLogged },
          { icon: Trophy, label: "Bookings", value: activeBookings },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-3.5 text-center">
            <Icon className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1.5 font-display text-xl font-bold tabular-nums">{value}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      {/* Favorite sports */}
      <section className="mt-6">
        <h2 className="text-lg font-bold">Favorite Sports</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {USER.favoriteSports.map((id) => {
            const s = SPORTS.find((x) => x.id === id);
            return (
              <span
                key={id}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                <span>{s?.icon}</span> {s?.name}
              </span>
            );
          })}
        </div>
      </section>

      {/* Badges */}
      <section className="mt-6">
        <h2 className="text-lg font-bold">Achievements</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl border p-4 transition-all ${
                b.earned
                  ? "border-primary/30 bg-card"
                  : "border-border bg-card opacity-45 grayscale"
              }`}
            >
              <span className={`text-2xl ${b.earned ? "" : ""}`}>{b.icon}</span>
              <p className="mt-2 text-sm font-semibold leading-tight">{b.name}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{b.desc}</p>
              {b.earned && (
                <span className="mt-2 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                  Earned
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

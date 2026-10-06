import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { SPORTS, USER } from "@/lib/data";
import { useApp } from "@/lib/store";
import { MyBookings } from "@/components/BookingDetails";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PES Play — Home" },
      { name: "description", content: "Book courts, view your confirmed bookings, and join matches at PES University." },
      { property: "og:title", content: "PES Play — Home" },
      { property: "og:description", content: "Book courts, view your confirmed bookings, and join matches at PES University." },
    ],
  }),
  component: Home,
});

function Home() {
  const { matches, joinMatch } = useApp();
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

      <MyBookings />

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

    </main>
  );
}

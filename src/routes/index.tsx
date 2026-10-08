import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, ExternalLink, Info, Target, Users } from "lucide-react";
import { SPORTS, USER } from "@/lib/data";
import { useApp } from "@/lib/store";
import { MyBookings } from "@/components/BookingDetails";
import { SportIcon } from "@/components/SportIcon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PES University — Sports Facilities Portal" },
      {
        name: "description",
        content:
          "Book courts, view confirmed bookings, and join student matches at PES University.",
      },
      { property: "og:title", content: "PES University — Sports Facilities Portal" },
      {
        property: "og:description",
        content:
          "Book courts, view confirmed bookings, and join student matches at PES University.",
      },
    ],
  }),
  component: Home,
});

const ANNOUNCEMENTS = [
  {
    title: "Inter-Campus Badminton Championship (Singles & Doubles) Oct. 2026",
    date: "08-October-2026",
  },
  {
    title: "Squash Court A Routine Maintenance & Surface Polish Notice",
    date: "05-October-2026",
  },
  {
    title: "Weekend 6-a-side Box Turf Tournament Registrations Open",
    date: "03-October-2026",
  },
  {
    title: "Basketball Court Floodlights Upgrade Completed — EC Campus",
    date: "26-September-2026",
  },
  {
    title: "Annual Sports Selection Trials for University Teams 2026-27",
    date: "24-September-2026",
  },
];

function Home() {
  const { matches, joinMatch } = useApp();
  const openMatches = matches.filter((m) => m.players.length < m.maxPlayers).slice(0, 3);

  return (
    <main className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Credentials / Rules Banner (Modeled after PESU Academy Screenshot 1) */}
      <section className="bg-[#eef8ee] border border-[#b7ebb9] p-4 text-xs text-[#1e4620] rounded-none">
        <div className="flex items-center gap-2 font-bold text-sm text-[#14532d] mb-1.5">
          <Info className="h-4 w-4 shrink-0 text-[#15803d]" />
          <span>PESU Sports Complex — Facility Booking & Turnstile Access:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
          <div>
            <span className="font-semibold text-[#14532d]">Student SRN: </span>
            <span>PES1UG21CS123</span>
          </div>
          <div>
            <span className="font-semibold text-[#14532d]">Access Mode: </span>
            <span>RFID Student ID Card</span>
          </div>
          <div>
            <span className="font-semibold text-[#14532d]">RR Complex: </span>
            <span>GJ Block Ground Floor</span>
          </div>
          <div>
            <span className="font-semibold text-[#14532d]">EC Complex: </span>
            <span>Sports Arena Block</span>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-[#166534]">
          Courts operate from 06:00 AM to 10:00 PM. Bookings open 48 hours prior to slot time.
          Non-marking shoes are strictly mandatory on indoor badminton and squash courts.
        </p>
      </section>

      {/* Main Grid: Left features & Right Announcements matching PESU Academy portal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Book + Matches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sports Categories / Facilities Grid */}
          <section className="bg-white border border-[#cbd5e1] p-4 rounded-none shadow-xs">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 mb-3">
              <div>
                <h2 className="text-base font-bold text-[#084d7a] uppercase tracking-wide">
                  Sports Facilities
                </h2>
                <p className="text-xs text-[#64748b]">Select a sport to view court availability</p>
              </div>
              <Link
                to="/courts"
                className="flex items-center gap-1 text-xs font-semibold text-[#0080b0] hover:underline"
              >
                All Courts <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SPORTS.map((s) => (
                <Link
                  key={s.id}
                  to="/courts"
                  search={{ sport: s.id }}
                  className="flex items-center gap-3 p-3 border border-[#dbe2ea] bg-white hover:border-[#0080b0] hover:bg-[#f8fafc] transition-colors rounded-none group"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f0f3f6] text-[#084d7a] group-hover:bg-[#0080b0] group-hover:text-white transition-colors border border-[#dbe2ea] rounded-none">
                    <SportIcon sport={s.id} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0f172a] truncate">{s.name}</p>
                    <p className="text-[11px] text-[#64748b]">Book slot</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Open Student Matches Feed */}
          <section className="bg-white border border-[#cbd5e1] p-4 rounded-none shadow-xs">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 mb-3">
              <div>
                <h2 className="text-base font-bold text-[#084d7a] uppercase tracking-wide">
                  Student Matches & Teams
                </h2>
                <p className="text-xs text-[#64748b]">
                  Join open games hosted by fellow PESU students
                </p>
              </div>
              <Link
                to="/matches"
                className="flex items-center gap-1 text-xs font-semibold text-[#0080b0] hover:underline"
              >
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {openMatches.map((m) => {
                const joined = m.players.includes(USER.name);
                return (
                  <div
                    key={m.id}
                    className="border border-[#e2e8f0] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-[#f8fafc] rounded-none transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-[#f0f3f6] text-[#084d7a] border border-[#dbe2ea] rounded-none">
                        <SportIcon sport={m.sport} className="h-4.5 w-4.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0f172a] truncate">{m.title}</p>
                        <p className="text-[11px] text-[#64748b] mt-0.5">
                          Host: {m.host} · {m.time} · {m.campus}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#475569]">
                          <span className="font-medium text-[#084d7a]">{m.court}</span>
                          <span>•</span>
                          <span>
                            {m.players.length} / {m.maxPlayers} players
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="flex -space-x-1.5">
                        {m.players.slice(0, 3).map((p) => (
                          <span
                            key={p}
                            className="grid h-6 w-6 place-items-center bg-[#084d7a] text-[9px] font-bold text-white border border-white rounded-none"
                            title={p}
                          >
                            {p[0]}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => joinMatch(m.id)}
                        disabled={joined}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-none transition-colors ${
                          joined
                            ? "bg-[#e2e8f0] text-[#475569] cursor-default"
                            : "bg-[#0080b0] text-white hover:bg-[#006f9c]"
                        }`}
                      >
                        {joined ? "Joined" : "Join Match"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Col: Announcements (Modeled exactly on PESU Academy Screenshot 1) */}
        <div className="space-y-6">
          <section className="bg-white border border-[#cbd5e1] p-4 rounded-none shadow-xs">
            <div className="border-b border-[#e2e8f0] pb-2 mb-3">
              <h2 className="text-base font-bold text-[#084d7a] uppercase tracking-wide">
                Announcements
              </h2>
              <p className="text-xs text-[#64748b]">Department of Sports & Recreation</p>
            </div>

            <div className="divide-y divide-[#e2e8f0]">
              {ANNOUNCEMENTS.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 group">
                  <div className="flex items-start gap-2.5">
                    <Target className="h-4 w-4 text-[#0080b0] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1e293b] leading-snug group-hover:text-[#0080b0] transition-colors cursor-pointer">
                        {item.title}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-[#94a3b8]">
                        <span>Date: {item.date}</span>
                        <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Timings & Help card */}
          <section className="bg-white border border-[#cbd5e1] p-4 rounded-none shadow-xs text-xs text-[#475569]">
            <h3 className="font-bold text-[#084d7a] uppercase tracking-wide mb-2">
              Sports Help Desk
            </h3>
            <div className="space-y-1.5 text-[11px]">
              <p>
                <strong className="text-[#1e293b]">Department Office: </strong>
                Physical Education & Sports Dept.
              </p>
              <p>
                <strong className="text-[#1e293b]">Helpline: </strong>
                sports@pes.edu | Ext: 4421
              </p>
              <p>
                <strong className="text-[#1e293b]">Incharge: </strong>
                Director of Physical Education
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Shared MyBookings section (Required by user rule in AGENTS.md) */}
      <MyBookings />
    </main>
  );
}

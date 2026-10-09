import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  CalendarCheck,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  Flame,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";
import { COURTS, SPORTS, USER } from "@/lib/data";
import { useApp } from "@/lib/store";
import { MyBookings } from "@/components/BookingDetails";
import { SportIcon } from "@/components/SportIcon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PESU Sports — Athletic Facility Booking & Squad Finder" },
      {
        name: "description",
        content:
          "Official PES University sports booking platform for badminton, basketball, squash, table tennis, and turf.",
      },
      { property: "og:title", content: "PESU Sports — Athletic Facility Booking & Squad Finder" },
      {
        property: "og:description",
        content:
          "Official PES University sports booking platform for badminton, basketball, squash, table tennis, and turf.",
      },
    ],
  }),
  component: Home,
});

const ANNOUNCEMENTS = [
  {
    title: "Inter-Campus Badminton Championship (Singles & Doubles) Oct. 2026",
    date: "08-Oct-2026",
    category: "Tournament",
  },
  {
    title: "Squash Court A Routine Maintenance & Surface Polish Notice",
    date: "05-Oct-2026",
    category: "Facility",
  },
  {
    title: "Weekend 6-a-side Box Turf Tournament Registrations Open",
    date: "03-Oct-2026",
    category: "Intramural",
  },
  {
    title: "Basketball Court Floodlights Upgrade Completed — EC Campus",
    date: "26-Sep-2026",
    category: "Facility",
  },
];

function Home() {
  const navigate = useNavigate();
  const { matches, joinMatch } = useApp();
  const openMatches = matches.filter((m) => m.players.length < m.maxPlayers).slice(0, 3);

  // Quick booking bar state
  const [quickSport, setQuickSport] = useState("badminton");
  const [quickCampus, setQuickCampus] = useState("RR Campus");
  const [quickDate, setQuickDate] = useState("Today");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/courts",
      search: { sport: quickSport },
    });
  };

  // Facilities available today
  const availableTodayCourts = COURTS.slice(0, 4);

  return (
    <main className="space-y-12 pb-16">
      {/* 1. Nike-Style Cinematic Hero Section */}
      <section className="relative overflow-hidden bg-[#0d1b2a] text-white">
        {/* Background Athletic Image with Dark Gradients */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2000&auto=format&fit=crop"
            alt="PESU Basketball Arena"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0d1b2a] via-[#0d1b2a]/85 to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#e35925]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 lg:py-28">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#132238] border border-[#1f3659] text-[11px] font-black uppercase tracking-widest text-[#e35925]">
              <Sparkles className="h-3 w-3" />
              <span>Official PES University Sports Complex</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
              Just Play. <br />
              <span className="text-[#e35925]">Reserve Courts.</span> <br />
              Find Squads.
            </h1>

            <p className="text-sm sm:text-base text-[#94a3b8] font-normal leading-relaxed max-w-xl">
              High-performance court reservations for badminton, basketball, squash, table tennis,
              box turf, and chess across RR & EC campuses. RFID turnstile pass enabled.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/courts"
                className="inline-flex items-center gap-2 bg-[#e35925] hover:bg-[#cf4d1c] active:bg-[#b84317] text-white px-7 py-3.5 text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
              >
                <CalendarCheck className="h-4 w-4" /> Book a Facility
              </Link>
              <Link
                to="/matches"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-7 py-3.5 text-xs font-black uppercase tracking-wider transition-colors border border-white/20 backdrop-blur-sm"
              >
                <Users className="h-4 w-4 text-[#e35925]" /> Find Open Games
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* 2. Sleek Quick-Search / Booking Bar */}
        <section className="-mt-8 sm:-mt-10 relative z-20">
          <form
            onSubmit={handleQuickSearch}
            className="bg-white border border-[#e5e7eb] border-l-4 border-l-[#e35925] p-4 sm:p-5 shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end"
          >
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-1.5">
                Sport Facility
              </label>
              <select
                value={quickSport}
                onChange={(e) => setQuickSport(e.target.value)}
                className="w-full bg-[#f8f8fa] border border-[#e5e7eb] px-3 py-2 text-xs font-bold text-[#111827] uppercase tracking-wide focus:border-[#e35925] outline-none"
              >
                {SPORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-1.5">
                Campus Location
              </label>
              <select
                value={quickCampus}
                onChange={(e) => setQuickCampus(e.target.value)}
                className="w-full bg-[#f8f8fa] border border-[#e5e7eb] px-3 py-2 text-xs font-bold text-[#111827] uppercase tracking-wide focus:border-[#e35925] outline-none"
              >
                <option value="RR Campus">RR Campus (Ring Road)</option>
                <option value="EC Campus">EC Campus (Electronic City)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-1.5">
                Preferred Day
              </label>
              <select
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
                className="w-full bg-[#f8f8fa] border border-[#e5e7eb] px-3 py-2 text-xs font-bold text-[#111827] uppercase tracking-wide focus:border-[#e35925] outline-none"
              >
                <option value="Today">Today (Active Slots)</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Sat">Saturday (Weekend)</option>
                <option value="Sun">Sunday (Weekend)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0d1b2a] hover:bg-[#1c2d42] text-white py-2.5 px-4 text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <span>Check Live Slots</span>
              <ArrowRight className="h-4 w-4 text-[#e35925]" />
            </button>
          </form>
        </section>

        {/* 3. "Available Today" Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#0d1b2a] pb-3 gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
                Real-Time Availability
              </span>
              <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tight">
                Available Today
              </h2>
            </div>
            <Link
              to="/courts"
              className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[#0d1b2a] hover:text-[#e35925] transition-colors"
            >
              <span>View All 10 Courts</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableTodayCourts.map((court) => (
              <div
                key={court.id}
                className="bg-white border border-[#e5e7eb] p-4 flex flex-col justify-between hover:border-[#0d1b2a] transition-all shadow-xs group"
              >
                <div>
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={court.image}
                      alt={court.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-[#0d1b2a] text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                      {court.indoor ? "INDOOR" : "OUTDOOR"}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-[#111827] px-2 py-0.5 text-[10px] font-black font-mono">
                      ₹{court.pricePerHour}/hr
                    </div>
                  </div>

                  <h3 className="font-black text-sm text-[#111827] uppercase tracking-tight truncate">
                    {court.name}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-[#64748b] mt-0.5">
                    <MapPin className="h-3 w-3 text-[#0d1b2a]" /> {court.campus}
                  </p>
                  <p className="text-[11px] text-[#475569] mt-2 line-clamp-1 font-medium">
                    {court.equipment}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f1f3f6] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#e35925]">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Next: 17:00</span>
                  </div>
                  <Link
                    to="/courts"
                    search={{ sport: court.sport }}
                    className="bg-[#0d1b2a] hover:bg-[#e35925] text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors"
                  >
                    Select Slot
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Popular Sports Categories (Nike Visual Grid) */}
        <section className="space-y-4">
          <div className="border-b-2 border-[#0d1b2a] pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
              Campus Disciplines
            </span>
            <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tight">
              Browse by Sport
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPORTS.map((sport) => (
              <Link
                key={sport.id}
                to="/courts"
                search={{ sport: sport.id }}
                className="group relative h-64 overflow-hidden bg-[#0d1b2a] flex flex-col justify-end p-6 border border-[#e5e7eb] hover:border-[#0d1b2a] transition-all"
              >
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a] via-[#0d1b2a]/40 to-transparent" />
                <span className="absolute top-4 left-4 h-8 w-8 grid place-items-center bg-[#0d1b2a] text-white border-l-2 border-[#e35925]">
                  <SportIcon sport={sport.id} className="h-4 w-4" />
                </span>

                <div className="relative z-10 space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#e35925] transition-colors">
                    {sport.name}
                  </h3>
                  <p className="text-xs text-[#cbd5e1] font-medium">{sport.tagline}</p>
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-white">
                    <span>Reserve Space</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#e35925] transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Open Squad Matches & Department Notices Split */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: Find Players / Open Games */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#0d1b2a] pb-3 gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
                  Squad Matchmaking
                </span>
                <h2 className="text-2xl font-black text-[#111827] uppercase tracking-tight">
                  Open Games · Looking For Players
                </h2>
              </div>
              <Link
                to="/matches"
                className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[#0d1b2a] hover:text-[#e35925] transition-colors"
              >
                <span>View All Games</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {openMatches.map((m) => {
                const joined = m.players.includes(USER.name);
                return (
                  <div
                    key={m.id}
                    className="bg-white border border-[#e5e7eb] border-l-4 border-l-[#0d1b2a] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <span className="p-2.5 bg-[#f4f5f7] text-[#0d1b2a] border border-[#e5e7eb] shrink-0 mt-0.5">
                        <SportIcon sport={m.sport} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-[#111827] uppercase tracking-tight truncate">
                            {m.title}
                          </h3>
                          <span className="bg-[#f4f5f7] text-[#0d1b2a] border border-[#e5e7eb] text-[9px] font-black px-2 py-0.5 uppercase tracking-wider">
                            {m.skill}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748b] mt-1 font-medium">
                          Host: <strong className="text-[#111827]">{m.host}</strong> · {m.time}
                        </p>
                        <p className="text-xs text-[#0d1b2a] font-bold mt-0.5">
                          {m.court} ({m.campus})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f1f3f6]">
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#64748b] block">
                          ROSTER
                        </span>
                        <span className="text-xs font-black text-[#111827]">
                          {m.players.length} / {m.maxPlayers} Spots
                        </span>
                      </div>

                      <button
                        onClick={() => joinMatch(m.id)}
                        disabled={joined}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                          joined
                            ? "bg-[#e2e8f0] text-[#475569] cursor-default"
                            : "bg-[#e35925] hover:bg-[#cf4d1c] text-white"
                        }`}
                      >
                        {joined ? "Joined" : "Join Game"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Notices & Turnstile Guidelines */}
          <div className="space-y-6">
            <div className="bg-white border border-[#e5e7eb] p-5 shadow-xs">
              <div className="border-b-2 border-[#0d1b2a] pb-2.5 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
                  Official Bulletin
                </span>
                <h3 className="text-base font-black text-[#111827] uppercase tracking-tight">
                  Athletic Notices
                </h3>
              </div>

              <div className="divide-y divide-[#f1f3f6]">
                {ANNOUNCEMENTS.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 group">
                    <div className="flex items-start gap-2.5">
                      <Target className="h-4 w-4 text-[#e35925] shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-wider text-[#64748b]">
                          {item.category}
                        </span>
                        <p className="text-xs font-bold text-[#111827] leading-snug group-hover:text-[#e35925] transition-colors cursor-pointer">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-[#94a3b8] font-mono mt-1">
                          Date: {item.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Turnstile Access Rules */}
            <div className="bg-[#f8f8fa] border border-[#e5e7eb] border-l-4 border-l-[#0d1b2a] p-5 text-xs text-[#475569] space-y-2">
              <div className="flex items-center gap-2 font-black uppercase text-[#111827] text-xs">
                <ShieldCheck className="h-4 w-4 text-[#e35925]" />
                <span>Turnstile Access Protocols</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Mandatory RFID Student ID tap at gate turnstiles. Non-marking gum-sole shoes
                strictly required on indoor badminton and squash courts.
              </p>
              <div className="pt-1 text-[10px] font-mono font-bold text-[#0d1b2a]">
                TIMINGS: 06:00 – 22:00 (MONDAY TO SUNDAY)
              </div>
            </div>
          </div>
        </section>

        {/* 6. Athlete Activity (Preserving shared MyBookings) */}
        <MyBookings />
      </div>
    </main>
  );
}

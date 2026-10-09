import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  ChevronRight,
  Clock,
  Compass,
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
          "Official PES University sports booking platform for badminton, basketball, squash, table tennis, and box turf.",
      },
      { property: "og:title", content: "PESU Sports — Athletic Facility Booking & Squad Finder" },
      {
        property: "og:description",
        content:
          "Official PES University sports booking platform for badminton, basketball, squash, table tennis, and box turf.",
      },
    ],
  }),
  component: HomePage,
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

function HomePage() {
  const navigate = useNavigate();
  const { matches, joinMatch } = useApp();
  const openMatches = matches.filter((m) => m.players.length < m.maxPlayers).slice(0, 3);

  // Quick booking bar state
  const [quickSport, setQuickSport] = useState("badminton");
  const [quickCampus, setQuickCampus] = useState("RR Campus");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/courts",
      search: { sport: quickSport },
    });
  };

  const availableTodayCourts = COURTS.slice(0, 4);

  return (
    <main className="space-y-12 pb-16 font-serif">
      {/* 1. Cinematic Hero Section with Dull Navy & Warm Orange Accent */}
      <section className="relative overflow-hidden bg-[#1a2639] text-white">
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2000&auto=format&fit=crop"
            alt="PESU Basketball Arena"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1a2639] via-[#1a2639]/80 to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#c45524]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#24344d] border border-[#344766] text-xs font-semibold text-[#f0a27f]">
              <Sparkles className="h-3.5 w-3.5 text-[#c45524]" />
              <span>Official PES University Sports Complex</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Just play. <br />
              <span className="text-[#f0a27f]">Reserve courts.</span> <br />
              Find squads.
            </h1>

            <p className="text-sm sm:text-base text-[#cfd7e3] font-normal leading-relaxed max-w-xl">
              High-performance court reservations for badminton, basketball, squash, table tennis,
              box turf, and chess across RR & EC campuses. RFID turnstile pass enabled.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/courts"
                className="inline-flex items-center gap-2 bg-[#c45524] hover:bg-[#b04a1d] text-white px-6 py-3 text-sm font-semibold transition-colors shadow-sm"
              >
                <CalendarCheck className="h-4 w-4" /> Book a Facility
              </Link>
              <Link
                to="/matches"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 text-sm font-semibold transition-colors border border-white/20"
              >
                <Users className="h-4 w-4 text-[#f0a27f]" /> Find Open Games
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* 2. Uncongested Quick-Booking Filter Bar */}
        <section className="-mt-8 sm:-mt-10 relative z-20">
          <form
            onSubmit={handleQuickSearch}
            className="bg-white border border-[#ded9cd] border-l-4 border-l-[#c45524] p-5 sm:p-6 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
          >
            <div>
              <label className="block text-xs font-bold text-[#4b5260] mb-1.5">
                Sport Facility
              </label>
              <select
                value={quickSport}
                onChange={(e) => setQuickSport(e.target.value)}
                className="w-full bg-[#f5f4ef] border border-[#ded9cd] px-3.5 py-2 text-xs font-medium text-[#1a2639] focus:border-[#c45524] outline-none"
              >
                {SPORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4b5260] mb-1.5">
                Campus Location
              </label>
              <select
                value={quickCampus}
                onChange={(e) => setQuickCampus(e.target.value)}
                className="w-full bg-[#f5f4ef] border border-[#ded9cd] px-3.5 py-2 text-xs font-medium text-[#1a2639] focus:border-[#c45524] outline-none"
              >
                <option value="RR Campus">RR Campus (Ring Road)</option>
                <option value="EC Campus">EC Campus (Electronic City)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1a2639] hover:bg-[#25364e] text-white py-2.5 px-4 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Inspect Calendar Slots</span>
              <ArrowRight className="h-4 w-4 text-[#c45524]" />
            </button>
          </form>
        </section>

        {/* 3. Available Today Section */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b-2 border-[#1a2639] pb-3 gap-2">
            <div>
              <span className="text-xs font-semibold text-[#c45524]">Live Availability</span>
              <h2 className="text-2xl font-bold text-[#1a2639]">Available Facilities Today</h2>
            </div>
            <Link
              to="/courts"
              className="flex items-center gap-1 text-xs font-semibold text-[#1a2639] hover:text-[#c45524] transition-colors"
            >
              <span>View all courts and calendar</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableTodayCourts.map((court) => (
              <div
                key={court.id}
                className="bg-white border border-[#ded9cd] p-5 flex flex-col justify-between hover:border-[#1a2639] transition-all shadow-xs group"
              >
                <div>
                  <div className="relative h-36 w-full overflow-hidden bg-[#f5f4ef] mb-3.5 border border-[#ded9cd]">
                    <img
                      src={court.image}
                      alt={court.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-[#1a2639] text-white px-2 py-0.5 text-[10px] font-medium">
                      {court.indoor ? "Indoor" : "Outdoor"}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white/95 text-[#1a2639] px-2 py-0.5 text-xs font-semibold">
                      Free Student Pass
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-[#1a2639] truncate">{court.name}</h3>
                  <p className="flex items-center gap-1 text-xs text-[#636a77] mt-1">
                    <MapPin className="h-3 w-3 text-[#1a2639]" /> {court.campus}
                  </p>
                  <p className="text-xs text-[#4b5260] mt-2 line-clamp-2 leading-relaxed">
                    {court.equipment}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#eeeae1] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#c45524]">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Next: 17:00</span>
                  </div>
                  <Link
                    to="/courts"
                    search={{ sport: court.sport }}
                    className="bg-[#1a2639] hover:bg-[#c45524] text-white px-3 py-1.5 text-xs font-medium transition-colors"
                  >
                    Select Slot
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Popular Sports Categories Grid */}
        <section className="space-y-5">
          <div className="border-b-2 border-[#1a2639] pb-3">
            <span className="text-xs font-semibold text-[#c45524]">Campus Disciplines</span>
            <h2 className="text-2xl font-bold text-[#1a2639]">Browse by Sport</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPORTS.map((sport) => (
              <Link
                key={sport.id}
                to="/courts"
                search={{ sport: sport.id }}
                className="group relative h-60 overflow-hidden bg-[#1a2639] flex flex-col justify-end p-6 border border-[#ded9cd] hover:border-[#1a2639] transition-all"
              >
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2639] via-[#1a2639]/40 to-transparent" />
                <span className="absolute top-4 left-4 h-8 w-8 grid place-items-center bg-[#1a2639] text-white border-l-2 border-[#c45524]">
                  <SportIcon sport={sport.id} className="h-4 w-4" />
                </span>

                <div className="relative z-10 space-y-1">
                  <h3 className="text-2xl font-bold text-white group-hover:text-[#f0a27f] transition-colors">
                    {sport.name}
                  </h3>
                  <p className="text-xs text-[#cfd7e3] font-normal">{sport.tagline}</p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-white">
                    <span>Reserve facility</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#c45524] transition-transform group-hover:translate-x-1" />
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
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b-2 border-[#1a2639] pb-3 gap-2">
              <div>
                <span className="text-xs font-semibold text-[#c45524]">Squad Matchmaking</span>
                <h2 className="text-2xl font-bold text-[#1a2639]">
                  Open Games · Looking for Players
                </h2>
              </div>
              <Link
                to="/matches"
                className="flex items-center gap-1 text-xs font-semibold text-[#1a2639] hover:text-[#c45524] transition-colors"
              >
                <span>View all games</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {openMatches.map((m) => {
                const joined = m.players.includes(USER.name);
                return (
                  <div
                    key={m.id}
                    className="bg-white border border-[#ded9cd] border-l-4 border-l-[#1a2639] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xs transition-all"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <span className="p-2.5 bg-[#f5f4ef] text-[#1a2639] border border-[#ded9cd] shrink-0 mt-0.5">
                        <SportIcon sport={m.sport} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#1a2639] truncate">{m.title}</h3>
                          <span className="bg-[#f5f4ef] text-[#1a2639] border border-[#ded9cd] text-[10px] font-medium px-2 py-0.5">
                            {m.skill}
                          </span>
                        </div>
                        <p className="text-xs text-[#636a77] mt-1">
                          Host: <strong className="text-[#1a2639]">{m.host}</strong> · {m.time}
                        </p>
                        <p className="text-xs text-[#1a2639] font-medium mt-0.5">
                          {m.court} ({m.campus})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#eeeae1]">
                      <div className="text-right">
                        <span className="text-[11px] text-[#636a77] block">Roster</span>
                        <span className="text-xs font-bold text-[#1a2639]">
                          {m.players.length} / {m.maxPlayers} Spots
                        </span>
                      </div>

                      <button
                        onClick={() => joinMatch(m.id)}
                        disabled={joined}
                        className={`px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                          joined
                            ? "bg-[#ebe7df] text-[#636a77] cursor-default"
                            : "bg-[#c45524] hover:bg-[#b04a1d] text-white"
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
            <div className="bg-white border border-[#ded9cd] p-6 shadow-xs">
              <div className="border-b-2 border-[#1a2639] pb-3 mb-4">
                <span className="text-xs font-semibold text-[#c45524]">Official Bulletin</span>
                <h3 className="text-base font-bold text-[#1a2639]">Athletic Notices</h3>
              </div>

              <div className="divide-y divide-[#eeeae1]">
                {ANNOUNCEMENTS.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 group">
                    <div className="flex items-start gap-2.5">
                      <Target className="h-4 w-4 text-[#c45524] shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-[#636a77] font-semibold">
                          {item.category}
                        </span>
                        <p className="text-xs font-medium text-[#1a2639] leading-snug group-hover:text-[#c45524] transition-colors cursor-pointer">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-[#8c94a0] font-mono mt-1">
                          Date: {item.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Turnstile Access Rules */}
            <div className="bg-[#ffffff] border border-[#ded9cd] border-l-4 border-l-[#1a2639] p-6 text-xs text-[#4b5260] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#1a2639] text-xs">
                <ShieldCheck className="h-4 w-4 text-[#c45524]" />
                <span>Turnstile Access Protocols</span>
              </div>
              <p className="text-xs leading-relaxed">
                Mandatory RFID Student ID tap at sports complex turnstiles. Non-marking gum-sole
                shoes are strictly required on indoor badminton and squash courts.
              </p>
              <div className="pt-1 text-[11px] font-mono font-semibold text-[#1a2639]">
                Hours: 06:00 – 22:00 (Monday to Sunday)
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

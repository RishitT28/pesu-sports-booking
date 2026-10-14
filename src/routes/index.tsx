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
import { BookWordmark } from "@/components/CollegeLogo";
import { SportIcon } from "@/components/SportIcon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "BookQuick — Multi-University Sports Facilities & Court Booking" },
      {
        name: "description",
        content:
          "Official multi-university sports booking platform for badminton, basketball, squash, table tennis, and box turf across Karnataka campuses.",
      },
      { property: "og:title", content: "BookQuick — Athletic Facility Booking" },
      {
        property: "og:description",
        content:
          "Official inter-collegiate sports booking platform for university courts.",
      },
    ],
  }),
  component: HomePage,
});

export function HomePage() {
  const navigate = useNavigate();
  const { matches, joinMatch, college } = useApp();
  const openMatches = matches.filter((m) => m.players.length < m.maxPlayers).slice(0, 3);

  // Quick booking bar state
  const [quickSport, setQuickSport] = useState("badminton");
  const [quickCampus, setQuickCampus] = useState(college.campuses[0] || "Main Campus");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/courts",
      search: { sport: quickSport },
    });
  };

  const availableTodayCourts = COURTS.slice(0, 4);

  const announcements = [
    {
      title: `${college.shortName} Inter-Campus Badminton Championship (Singles & Doubles)`,
      date: "08-Oct-2026",
      category: "Tournament",
    },
    {
      title: `${college.shortName} Indoor Arena Surface Polishing & Court Polish Notice`,
      date: "05-Oct-2026",
      category: "Facility",
    },
    {
      title: `Weekend 6-a-side Box Turf Tournament Registrations Open`,
      date: "03-Oct-2026",
      category: "Intramural",
    },
    {
      title: `Sports Complex Floodlights Upgrade Completed — ${college.campuses[0] || "Main Campus"}`,
      date: "26-Sep-2026",
      category: "Facility",
    },
  ];

  return (
    <main className={`space-y-12 pb-16 transition-colors duration-200 ${college.fontClass}`}>
      {/* 1. Cinematic Hero Section with College Branding */}
      <section
        className="relative overflow-hidden text-white"
        style={{ backgroundColor: college.colors.secondary }}
      >
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2000&auto=format&fit=crop"
            alt={`${college.name} Sports Arena`}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(to right, ${college.colors.secondary}, ${college.colors.secondary}cc, transparent)`,
          }}
        />
        <div
          className="absolute left-0 top-0 bottom-0 w-2.5"
          style={{ backgroundColor: college.colors.primary }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
          <div className="max-w-2xl space-y-5">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 text-xs font-bold text-white shadow-xs ${college.buttonStyle.radiusClass}`}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: college.colors.accent || college.colors.primary }} />
              <span>Official {college.name} Sports Complex</span>
            </div>

            <div className="space-y-1">
              <BookWordmark size="xl" className="text-white" underscoreColor={college.colors.primary} />
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                Just play. <br />
                <span style={{ color: college.colors.accent || "#f0a27f" }}>Reserve courts.</span> <br />
                Find squads.
              </h1>
            </div>

            <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed max-w-xl">
              High-performance court reservations for badminton, basketball, squash, table tennis,
              box turf, and chess across {college.campuses.join(" & ")}. Turnstile clearance verified.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/courts"
                className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all ${college.buttonStyle.radiusClass} ${college.buttonStyle.primaryClass} ${college.buttonStyle.extraClass}`}
              >
                <CalendarCheck className="h-4 w-4" /> Book a Facility
              </Link>
              <Link
                to="/matches"
                className={`inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 text-sm font-bold transition-all border border-white/25 ${college.buttonStyle.radiusClass}`}
              >
                <Users className="h-4 w-4" style={{ color: college.colors.accent || college.colors.primary }} /> Find Open Squads
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
            className={`bg-white border p-5 sm:p-6 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4 items-end ${college.buttonStyle.radiusClass}`}
            style={{
              borderColor: college.colors.border,
              borderLeftWidth: "4px",
              borderLeftColor: college.colors.primary,
            }}
          >
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Sport Facility
              </label>
              <select
                value={quickSport}
                onChange={(e) => setQuickSport(e.target.value)}
                className={`w-full border px-3.5 py-2 text-xs font-medium text-gray-900 outline-none ${college.buttonStyle.radiusClass}`}
                style={{
                  backgroundColor: college.colors.pageBg,
                  borderColor: college.colors.border,
                }}
              >
                {SPORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Campus Location ({college.shortName})
              </label>
              <select
                value={quickCampus}
                onChange={(e) => setQuickCampus(e.target.value)}
                className={`w-full border px-3.5 py-2 text-xs font-medium text-gray-900 outline-none ${college.buttonStyle.radiusClass}`}
                style={{
                  backgroundColor: college.colors.pageBg,
                  borderColor: college.colors.border,
                }}
              >
                {college.campuses.map((camp) => (
                  <option key={camp} value={camp}>
                    {camp}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 px-4 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${college.buttonStyle.radiusClass} ${college.buttonStyle.secondaryClass} ${college.buttonStyle.extraClass}`}
            >
              <span>Inspect Calendar Slots</span>
              <ArrowRight className="h-4 w-4" style={{ color: college.colors.accent || college.colors.primary }} />
            </button>
          </form>
        </section>

        {/* 3. Available Today Section */}
        <section className="space-y-5">
          <div
            className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b-2 pb-3 gap-2"
            style={{ borderColor: college.colors.secondary }}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: college.colors.primary }}>
                {college.shortName} Live Availability
              </span>
              <h2 className="text-2xl font-bold text-gray-900">Available Facilities Today</h2>
            </div>
            <Link
              to="/courts"
              className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span>View all courts and calendar</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableTodayCourts.map((court) => (
              <div
                key={court.id}
                className={`bg-white border p-5 flex flex-col justify-between transition-all shadow-xs group ${college.buttonStyle.radiusClass}`}
                style={{ borderColor: college.colors.border }}
              >
                <div>
                  <div
                    className={`relative h-36 w-full overflow-hidden mb-3.5 border ${college.buttonStyle.radiusClass}`}
                    style={{ borderColor: college.colors.border }}
                  >
                    <img
                      src={court.image}
                      alt={court.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      className="absolute top-2 left-2 text-white px-2 py-0.5 text-[10px] font-bold"
                      style={{ backgroundColor: college.colors.secondary }}
                    >
                      {court.indoor ? "Indoor" : "Outdoor"}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white/95 text-gray-900 px-2 py-0.5 text-xs font-bold shadow-xs">
                      Free Pass
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 truncate">{court.name}</h3>
                  <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3" style={{ color: college.colors.primary }} />{" "}
                    {college.campuses[0] || court.campus}
                  </p>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                    {court.equipment}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: college.colors.primary }}>
                    <Clock className="h-3.5 w-3.5" />
                    <span>Next: 17:00</span>
                  </div>
                  <Link
                    to="/courts"
                    search={{ sport: court.sport }}
                    className={`px-3 py-1.5 text-xs font-bold transition-all ${college.buttonStyle.radiusClass} ${college.buttonStyle.secondaryClass} ${college.buttonStyle.extraClass}`}
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
          <div className="border-b-2 pb-3" style={{ borderColor: college.colors.secondary }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: college.colors.primary }}>
              Campus Disciplines
            </span>
            <h2 className="text-2xl font-bold text-gray-900">Browse by Sport</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPORTS.map((sport) => (
              <Link
                key={sport.id}
                to="/courts"
                search={{ sport: sport.id }}
                className={`group relative h-60 overflow-hidden flex flex-col justify-end p-6 border transition-all ${college.buttonStyle.radiusClass}`}
                style={{
                  backgroundColor: college.colors.secondary,
                  borderColor: college.colors.border,
                }}
              >
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-65"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${college.colors.secondary}, transparent)`,
                  }}
                />
                <span
                  className="absolute top-4 left-4 h-8 w-8 grid place-items-center text-white"
                  style={{
                    backgroundColor: college.colors.secondary,
                    borderLeft: `3px solid ${college.colors.primary}`,
                  }}
                >
                  <SportIcon sport={sport.id} className="h-4 w-4" />
                </span>

                <div className="relative z-10 space-y-1">
                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-200 transition-colors">
                    {sport.name}
                  </h3>
                  <p className="text-xs text-white/80 font-normal">{sport.tagline}</p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-white">
                    <span>Reserve facility</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" style={{ color: college.colors.primary }} />
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
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b-2 pb-3 gap-2" style={{ borderColor: college.colors.secondary }}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: college.colors.primary }}>
                  Squad Matchmaking
                </span>
                <h2 className="text-2xl font-bold text-gray-900">
                  Open Games · Looking for Players
                </h2>
              </div>
              <Link
                to="/matches"
                className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-blue-600 transition-colors"
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
                    className={`bg-white border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-xs transition-all ${college.buttonStyle.radiusClass}`}
                    style={{
                      borderColor: college.colors.border,
                      borderLeftWidth: "4px",
                      borderLeftColor: college.colors.secondary,
                    }}
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <span
                        className="p-2.5 border shrink-0 mt-0.5"
                        style={{
                          backgroundColor: college.colors.pageBg,
                          borderColor: college.colors.border,
                          color: college.colors.secondary,
                        }}
                      >
                        <SportIcon sport={m.sport} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-900 truncate">{m.title}</h3>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 border rounded"
                            style={{
                              backgroundColor: college.colors.pageBg,
                              borderColor: college.colors.border,
                              color: college.colors.secondary,
                            }}
                          >
                            {m.skill}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Host: <strong className="text-gray-900">{m.host}</strong> · {m.time}
                        </p>
                        <p className="text-xs text-gray-800 font-semibold mt-0.5">
                          {m.court} ({college.campuses[0] || m.campus})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <div className="text-right">
                        <span className="text-[11px] text-gray-500 block">Roster</span>
                        <span className="text-xs font-bold text-gray-900">
                          {m.players.length} / {m.maxPlayers} Spots
                        </span>
                      </div>

                      <button
                        onClick={() => joinMatch(m.id)}
                        disabled={joined}
                        className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer ${college.buttonStyle.radiusClass} ${
                          joined
                            ? "bg-gray-200 text-gray-500 cursor-default"
                            : `${college.buttonStyle.primaryClass} ${college.buttonStyle.extraClass}`
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
            <div
              className={`bg-white border p-6 shadow-xs ${college.buttonStyle.radiusClass}`}
              style={{ borderColor: college.colors.border }}
            >
              <div className="border-b-2 pb-3 mb-4" style={{ borderColor: college.colors.secondary }}>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: college.colors.primary }}>
                  Official Bulletin
                </span>
                <h3 className="text-base font-bold text-gray-900">{college.shortName} Notices</h3>
              </div>

              <div className="divide-y divide-gray-100">
                {announcements.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 group">
                    <div className="flex items-start gap-2.5">
                      <Target className="h-4 w-4 shrink-0 mt-0.5" style={{ color: college.colors.primary }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">
                          {item.category}
                        </span>
                        <p className="text-xs font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors cursor-pointer">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono mt-1">
                          Date: {item.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Turnstile Access Rules */}
            <div
              className={`bg-white border p-6 text-xs text-gray-600 space-y-2 ${college.buttonStyle.radiusClass}`}
              style={{
                borderColor: college.colors.border,
                borderLeftWidth: "4px",
                borderLeftColor: college.colors.secondary,
              }}
            >
              <div className="flex items-center gap-2 font-bold text-gray-900 text-xs">
                <ShieldCheck className="h-4 w-4" style={{ color: college.colors.primary }} />
                <span>Turnstile Access Protocols</span>
              </div>
              <p className="text-xs leading-relaxed">
                Mandatory {college.studentIdLabel} check or RFID clearance at {college.shortName} sports complex turnstiles. Non-marking gum-sole shoes are strictly required on indoor synthetic courts.
              </p>
              <div className="pt-1 text-[11px] font-mono font-bold text-gray-900">
                Complex Hours: 06:00 – 22:00 (Monday to Sunday)
              </div>
            </div>
          </div>
        </section>

        {/* 6. Athlete Activity (Preserving shared MyBookings rule) */}
        <MyBookings />
      </div>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  IdCard,
  MapPin,
  QrCode,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  User as UserIcon,
  Zap,
} from "lucide-react";
import { BADGES, SPORTS, USER } from "@/lib/data";
import { useApp } from "@/lib/store";
import { MyBookings } from "@/components/BookingDetails";
import { QrPass } from "@/components/QrPass";
import { SportIcon } from "@/components/SportIcon";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PESU Sports — Athlete Profile & Turnstile Clearance" },
      {
        name: "description",
        content:
          "Official student athlete identity, sports clearance RFID pass, and court booking history.",
      },
      { property: "og:title", content: "PESU Sports — Athlete Profile & Turnstile Clearance" },
      {
        property: "og:description",
        content:
          "Official student athlete identity, sports clearance RFID pass, and court booking history.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { hoursLogged, matchesPlayed, bookings } = useApp();
  const activeBookings = bookings.filter((b) => b.status === "upcoming").length;

  return (
    <main className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* 1. Athlete Identity Card */}
      <div className="bg-white border border-[#e5e7eb] border-l-4 border-l-[#0d1b2a] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f1f3f6] pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
              Student Athlete Verification
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111827] uppercase tracking-tight">
              Athlete Profile
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1.5 self-start sm:self-auto">
            <CheckCircle2 className="h-4 w-4 text-[#166534]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#166534]">
              Turnstile Clearance Active
            </span>
          </div>
        </div>

        {/* Student Data Row */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal & Academic Specs */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-start gap-5">
            <div className="h-20 w-20 shrink-0 bg-[#0d1b2a] text-white flex items-center justify-center text-3xl font-black tracking-tight border-2 border-[#e35925]">
              {USER.name[0]}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-black uppercase tracking-tight text-[#111827]">
                  {USER.fullName}
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#0d1b2a] text-white px-2 py-0.5">
                  Sem 3 · Section G
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5] px-2 py-0.5">
                  {USER.skill} Athlete
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 text-xs text-[#475569] font-medium pt-1">
                <div>
                  <span className="text-[#94a3b8] uppercase text-[10px] font-bold block">
                    Student Registration (SRN)
                  </span>
                  <span className="font-mono text-[#111827] font-semibold">PES1UG21CS123</span>
                </div>
                <div>
                  <span className="text-[#94a3b8] uppercase text-[10px] font-bold block">
                    Permanent Roll (PRN)
                  </span>
                  <span className="font-mono text-[#111827] font-semibold">PES202100456</span>
                </div>
                <div className="pt-1">
                  <span className="text-[#94a3b8] uppercase text-[10px] font-bold block">
                    Academic School
                  </span>
                  <span className="text-[#111827]">Computer Science & Engineering</span>
                </div>
                <div className="pt-1">
                  <span className="text-[#94a3b8] uppercase text-[10px] font-bold block">
                    Home Complex
                  </span>
                  <span className="text-[#0d1b2a] font-bold">{USER.campus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Turnstile RFID Digital Gate Pass */}
          <div className="bg-[#f8f8fa] border border-[#e5e7eb] p-4 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0d1b2a] mb-2.5">
              <QrCode className="h-4 w-4 text-[#e35925]" />
              <span>RFID Turnstile Pass</span>
            </div>
            <div className="p-2 bg-white border border-[#e5e7eb]">
              <QrPass seed="PES1UG21CS123" size={105} />
            </div>
            <p className="mt-2.5 text-[10px] font-mono text-[#64748b]">
              Auto-scanned at facility turnstiles
            </p>
          </div>
        </div>
      </div>

      {/* 2. Athletic Performance Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Clock,
            label: "Court Hours Logged",
            value: `${hoursLogged} hrs`,
            sub: "+4 hrs this month",
          },
          {
            icon: Swords,
            label: "Matches Played",
            value: matchesPlayed,
            sub: "78% win rate",
          },
          {
            icon: Trophy,
            label: "Active Reservations",
            value: activeBookings,
            sub: "Next up today 5 PM",
          },
          {
            icon: Zap,
            label: "PESU Power Rating",
            value: "4.2 / 5.0",
            sub: "Top 12% in CSE",
          },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div
            key={label}
            className="bg-white border border-[#e5e7eb] p-5 rounded-none shadow-xs transition-colors hover:border-[#0d1b2a]"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-[#e35925]" />
              <span className="text-[10px] font-bold uppercase text-[#94a3b8]">{sub}</span>
            </div>
            <p className="mt-3 text-2xl font-black text-[#111827] tracking-tight uppercase">
              {value}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </section>

      {/* 3. Preferred Sports & Weekly Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preferred Sports */}
        <div className="bg-white border border-[#e5e7eb] p-6 rounded-none shadow-xs">
          <div className="border-b border-[#f1f3f6] pb-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
              Specializations
            </span>
            <h2 className="text-base font-black uppercase tracking-tight text-[#111827]">
              Enrolled Disciplines & Skill Levels
            </h2>
          </div>

          <div className="space-y-3">
            {USER.favoriteSports.map((sportId) => {
              const sportObj = SPORTS.find((s) => s.id === sportId);
              return (
                <div
                  key={sportId}
                  className="flex items-center justify-between p-3.5 bg-[#f8f8fa] border border-[#e5e7eb]"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-white border border-[#e5e7eb] text-[#0d1b2a]">
                      <SportIcon sport={sportId} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-[#111827]">
                        {sportObj?.name ?? sportId}
                      </p>
                      <p className="text-[11px] text-[#64748b]">
                        {sportObj?.tagline ?? "Regular campus competitor"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-white border border-[#0d1b2a] text-[#0d1b2a]">
                    Intermediate
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Availability Schedule */}
        <div className="bg-white border border-[#e5e7eb] p-6 rounded-none shadow-xs">
          <div className="border-b border-[#f1f3f6] pb-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
              Training Routine
            </span>
            <h2 className="text-base font-black uppercase tracking-tight text-[#111827]">
              Preferred Court Availability
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { days: "Monday – Thursday", hours: "5:00 PM – 8:00 PM", status: "Post-Lectures" },
              { days: "Friday", hours: "4:00 PM – 9:00 PM", status: "Open Run Night" },
              {
                days: "Saturday & Sunday",
                hours: "7:00 AM – 11:00 AM",
                status: "Morning Sessions",
              },
            ].map((slot, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 bg-[#f8f8fa] border border-[#e5e7eb]"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#111827]">
                    {slot.days}
                  </p>
                  <p className="text-[11px] text-[#64748b] font-medium">{slot.hours}</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5]">
                  {slot.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#f1f3f6] flex items-center justify-between text-xs text-[#64748b]">
            <span>Need to update training availability?</span>
            <button className="text-[11px] font-bold uppercase tracking-wider text-[#0d1b2a] hover:text-[#e35925] transition-colors underline">
              Edit Availability
            </button>
          </div>
        </div>
      </div>

      {/* 4. Earned Athletic Badges */}
      <div className="bg-white border border-[#e5e7eb] p-6 rounded-none shadow-xs">
        <div className="border-b border-[#f1f3f6] pb-3 mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
            Milestones
          </span>
          <h2 className="text-base font-black uppercase tracking-tight text-[#111827]">
            Earned Campus Badges
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 text-center border rounded-none flex flex-col items-center justify-center transition-all ${
                badge.earned
                  ? "bg-[#f8f8fa] border-[#0d1b2a] text-[#111827]"
                  : "bg-white border-dashed border-[#e5e7eb] text-[#94a3b8] opacity-60"
              }`}
            >
              <div
                className={`h-8 w-8 flex items-center justify-center mb-2 ${
                  badge.earned ? "bg-[#0d1b2a] text-white" : "bg-[#f1f3f6] text-[#94a3b8]"
                }`}
              >
                <Award className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-tight line-clamp-1">
                {badge.name}
              </p>
              <p className="text-[9px] text-[#64748b] mt-0.5 line-clamp-2">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Shared MyBookings (Required by rule in AGENTS.md) */}
      <MyBookings />
    </main>
  );
}

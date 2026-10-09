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
    <main className="p-4 sm:p-8 space-y-10 max-w-7xl mx-auto font-serif">
      {/* 1. Athlete Identity Card */}
      <div className="bg-white border border-[#ded9cd] border-l-4 border-l-[#1a2639] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#eeeae1] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#c45524]">Student Identification</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2639] mt-0.5">
              Athlete Profile & Clearance
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] px-3.5 py-1.5 self-start sm:self-auto">
            <CheckCircle2 className="h-4 w-4 text-[#166534]" />
            <span className="text-xs font-semibold text-[#166534]">Turnstile Clearance Active</span>
          </div>
        </div>

        {/* Student Data Row */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal & Academic Specs */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-start gap-6">
            <div className="h-20 w-20 shrink-0 bg-[#1a2639] text-white flex items-center justify-center text-3xl font-bold border-2 border-[#c45524]">
              {USER.name[0]}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-[#1a2639]">{USER.fullName}</h2>
                <span className="text-xs font-semibold bg-[#1a2639] text-white px-2 py-0.5">
                  Semester 3 · Section G
                </span>
                <span className="text-xs font-medium bg-[#fdf3ee] text-[#c45524] border border-[#f5dbcf] px-2 py-0.5">
                  {USER.skill} Competitor
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-[#4b5260] pt-1">
                <div>
                  <span className="text-[#8c94a0] text-[11px] font-semibold block">
                    Student Registration Number (SRN)
                  </span>
                  <span className="font-mono text-[#1a2639] font-medium">PES1UG21CS123</span>
                </div>
                <div>
                  <span className="text-[#8c94a0] text-[11px] font-semibold block">
                    Permanent Roll Number (PRN)
                  </span>
                  <span className="font-mono text-[#1a2639] font-medium">PES202100456</span>
                </div>
                <div className="pt-1">
                  <span className="text-[#8c94a0] text-[11px] font-semibold block">
                    Academic School
                  </span>
                  <span className="text-[#1a2639]">Computer Science & Engineering</span>
                </div>
                <div className="pt-1">
                  <span className="text-[#8c94a0] text-[11px] font-semibold block">
                    Campus Complex
                  </span>
                  <span className="text-[#1a2639] font-semibold">{USER.campus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Turnstile RFID Digital Gate Pass */}
          <div className="bg-[#f5f4ef] border border-[#ded9cd] p-5 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1a2639] mb-3">
              <QrCode className="h-4 w-4 text-[#c45524]" />
              <span>RFID Turnstile Pass</span>
            </div>
            <div className="p-2 bg-white border border-[#ded9cd]">
              <QrPass seed="PES1UG21CS123" size={105} />
            </div>
            <p className="mt-2.5 text-[11px] font-mono text-[#636a77]">
              Scan at sports gate turnstiles
            </p>
          </div>
        </div>
      </div>

      {/* 2. Athletic Performance Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
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
            className="bg-white border border-[#ded9cd] p-6 shadow-xs transition-colors hover:border-[#1a2639]"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-[#c45524]" />
              <span className="text-[11px] font-medium text-[#8c94a0]">{sub}</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-[#1a2639]">{value}</p>
            <p className="text-xs text-[#636a77] mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* 3. Preferred Sports & Weekly Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preferred Sports */}
        <div className="bg-white border border-[#ded9cd] p-6 sm:p-7 shadow-xs">
          <div className="border-b border-[#eeeae1] pb-3 mb-4">
            <span className="text-xs font-semibold text-[#c45524]">Enrolled Disciplines</span>
            <h2 className="text-base font-bold text-[#1a2639]">Preferred Sports & Skill Levels</h2>
          </div>

          <div className="space-y-3">
            {USER.favoriteSports.map((sportId) => {
              const sportObj = SPORTS.find((s) => s.id === sportId);
              return (
                <div
                  key={sportId}
                  className="flex items-center justify-between p-3.5 bg-[#f5f4ef] border border-[#ded9cd]"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-white border border-[#ded9cd] text-[#1a2639]">
                      <SportIcon sport={sportId} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1a2639]">
                        {sportObj?.name ?? sportId}
                      </p>
                      <p className="text-[11px] text-[#636a77]">
                        {sportObj?.tagline ?? "Regular campus athlete"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 bg-white border border-[#1a2639] text-[#1a2639]">
                    Intermediate
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Availability Schedule */}
        <div className="bg-white border border-[#ded9cd] p-6 sm:p-7 shadow-xs">
          <div className="border-b border-[#eeeae1] pb-3 mb-4">
            <span className="text-xs font-semibold text-[#c45524]">Routine</span>
            <h2 className="text-base font-bold text-[#1a2639]">Preferred Court Availability</h2>
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
                className="flex items-center justify-between p-3.5 bg-[#f5f4ef] border border-[#ded9cd]"
              >
                <div>
                  <p className="text-xs font-bold text-[#1a2639]">{slot.days}</p>
                  <p className="text-[11px] text-[#636a77]">{slot.hours}</p>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#fdf3ee] text-[#c45524] border border-[#f5dbcf]">
                  {slot.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3.5 border-t border-[#eeeae1] flex items-center justify-between text-xs text-[#636a77]">
            <span>Need to update training schedule?</span>
            <button className="text-xs font-semibold text-[#1a2639] hover:text-[#c45524] transition-colors underline">
              Edit Availability
            </button>
          </div>
        </div>
      </div>

      {/* 4. Earned Campus Badges */}
      <div className="bg-white border border-[#ded9cd] p-6 sm:p-7 shadow-xs">
        <div className="border-b border-[#eeeae1] pb-3 mb-4">
          <span className="text-xs font-semibold text-[#c45524]">Milestones</span>
          <h2 className="text-base font-bold text-[#1a2639]">Earned Campus Badges</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 text-center border flex flex-col items-center justify-center transition-all ${
                badge.earned
                  ? "bg-[#f5f4ef] border-[#1a2639] text-[#1a2639]"
                  : "bg-white border-dashed border-[#ded9cd] text-[#8c94a0] opacity-60"
              }`}
            >
              <div
                className={`h-8 w-8 flex items-center justify-center mb-2 ${
                  badge.earned ? "bg-[#1a2639] text-white" : "bg-[#ebe7df] text-[#8c94a0]"
                }`}
              >
                <Award className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold line-clamp-1">{badge.name}</p>
              <p className="text-[10px] text-[#636a77] mt-0.5 line-clamp-2">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Shared MyBookings (Required by rule in AGENTS.md) */}
      <MyBookings />
    </main>
  );
}

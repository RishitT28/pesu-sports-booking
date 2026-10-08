import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Clock, IdCard, QrCode, Swords, Trophy, User as UserIcon } from "lucide-react";
import { SPORTS, USER } from "@/lib/data";
import { useApp } from "@/lib/store";
import { MyBookings } from "@/components/BookingDetails";
import { QrPass } from "@/components/QrPass";
import { SportIcon } from "@/components/SportIcon";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PES University — Student Profile & Sports Pass" },
      {
        name: "description",
        content:
          "Your PES University sports clearance profile, RFID pass, and court booking history.",
      },
      { property: "og:title", content: "PES University — Student Profile & Sports Pass" },
      {
        property: "og:description",
        content:
          "Your PES University sports clearance profile, RFID pass, and court booking history.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { hoursLogged, matchesPlayed, bookings } = useApp();
  const activeBookings = bookings.filter((b) => b.status === "upcoming").length;

  return (
    <main className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-white border border-[#cbd5e1] p-4 rounded-none shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2e8f0] pb-3">
          <div>
            <h1 className="text-xl font-bold text-[#084d7a] uppercase tracking-wide">
              Student Profile & Sports Clearance
            </h1>
            <p className="text-xs text-[#64748b] mt-0.5">
              PESU Academy Academic & Athletic Registration Details
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-[#e6f4ea] text-[#137333] border border-[#ceead6] px-2.5 py-1 text-xs font-bold uppercase rounded-none">
            <BadgeCheck className="h-4 w-4" /> Sports Clearance Active
          </span>
        </div>

        {/* Student Details Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity info */}
          <div className="md:col-span-2 flex items-start gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center bg-[#084d7a] text-white text-2xl font-bold rounded-none border border-[#063f64]">
              {USER.name[0]}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#0f172a] truncate">{USER.fullName}</h2>
                <span className="text-[10px] font-mono bg-[#f0f3f6] text-[#084d7a] px-2 py-0.5 border border-[#cbd5e1] rounded-none">
                  Sem 3 · Section G
                </span>
              </div>
              <p className="text-xs text-[#475569]">
                <strong>SRN: </strong> PES1UG21CS123 &nbsp;|&nbsp; <strong>PRN: </strong>{" "}
                PES202100456
              </p>
              <p className="text-xs text-[#64748b]">Department of Computer Science & Engineering</p>
              <p className="text-xs text-[#084d7a] font-medium">
                Campus: {USER.campus} · PES University
              </p>
            </div>
          </div>

          {/* Digital RFID Turnstile QR Pass */}
          <div className="border border-[#cbd5e1] p-3 bg-[#f8fafc] rounded-none flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#084d7a] mb-2 uppercase tracking-wide">
              <QrCode className="h-4 w-4" /> Turnstile RFID Pass
            </div>
            <QrPass seed="PES1UG21CS123" size={110} />
            <p className="mt-2 text-[10px] text-[#64748b] font-mono">
              Scan at Sports Complex Gates
            </p>
          </div>
        </div>
      </div>

      {/* Athletic Stats Strip */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { icon: Swords, label: "Matches Played", value: matchesPlayed },
          { icon: Clock, label: "Court Hours Logged", value: hoursLogged },
          { icon: Trophy, label: "Active Reservations", value: activeBookings },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-white border border-[#cbd5e1] p-4 text-center rounded-none shadow-xs"
          >
            <Icon className="mx-auto h-5 w-5 text-[#0080b0]" />
            <p className="mt-2 text-2xl font-bold text-[#084d7a] tabular-nums">{value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">
              {label}
            </p>
          </div>
        ))}
      </section>

      {/* Favorite Sports */}
      <section className="bg-white border border-[#cbd5e1] p-4 rounded-none shadow-xs">
        <h2 className="text-sm font-bold text-[#084d7a] uppercase tracking-wide border-b border-[#e2e8f0] pb-2 mb-3">
          Enrolled Sports & Preferences
        </h2>
        <div className="flex flex-wrap gap-2">
          {USER.favoriteSports.map((id) => {
            const s = SPORTS.find((x) => x.id === id);
            return (
              <span
                key={id}
                className="flex items-center gap-2 border border-[#cbd5e1] bg-[#f8fafc] px-3.5 py-1.5 text-xs font-semibold text-[#1e293b] rounded-none"
              >
                <SportIcon sport={id} className="h-4 w-4 text-[#0080b0]" />
                <span>{s?.name}</span>
              </span>
            );
          })}
        </div>
      </section>

      {/* Shared MyBookings (required by user rule in AGENTS.md) */}
      <MyBookings />
    </main>
  );
}

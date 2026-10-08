import { createFileRoute } from "@tanstack/react-router";
import { Bell, CalendarCheck, CheckCheck, Target, Users } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PES University — Sports Notifications & Notices" },
      {
        name: "description",
        content:
          "Booking confirmations, match alerts, and sports facility notices from PES University.",
      },
      { property: "og:title", content: "PES University — Sports Notifications & Notices" },
      {
        property: "og:description",
        content:
          "Booking confirmations, match alerts, and sports facility notices from PES University.",
      },
    ],
  }),
  component: Notifications,
});

const KIND_ICON = { booking: CalendarCheck, match: Users, system: Bell } as const;

function Notifications() {
  const { notifications, markAllRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <main className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-[#cbd5e1] p-4 rounded-none shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2e8f0] pb-3">
          <div>
            <h1 className="text-xl font-bold text-[#084d7a] uppercase tracking-wide">
              Announcements & Facility Notices
            </h1>
            <p className="text-xs text-[#64748b] mt-0.5">
              Official circulars, court reservation confirmations, and schedule updates
            </p>
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-none border border-[#cbd5e1] text-[#084d7a] bg-white hover:bg-[#f1f5f9] transition-colors self-start sm:self-auto"
            >
              <CheckCheck className="h-3.5 w-3.5 text-[#0080b0]" /> Mark All Read
            </button>
          )}
        </div>

        <div className="mt-2 text-xs text-[#64748b]">
          {unread > 0 ? (
            <span className="font-semibold text-[#0080b0]">
              {unread} unread notice{unread > 1 ? "s" : ""}
            </span>
          ) : (
            <span>All notices have been read</span>
          )}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {notifications.map((n) => {
          const Icon = KIND_ICON[n.kind];
          return (
            <div
              key={n.id}
              className={`p-4 border transition-colors rounded-none bg-white ${
                n.read
                  ? "border-[#e2e8f0] hover:bg-[#f8fafc]"
                  : "border-[#0080b0] bg-[#f0f8fc] border-l-4 border-l-[#0080b0]"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#f0f3f6] text-[#084d7a] border border-[#dbe2ea] rounded-none mt-0.5">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-[#0f172a] truncate">{n.title}</p>
                    <span className="shrink-0 text-[10px] text-[#94a3b8] font-mono">{n.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#475569] leading-relaxed">{n.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Bell, CalendarCheck, CheckCheck, Sparkles, Trophy, Users } from "lucide-react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PESU Sports — Athletic Notices & Circulars" },
      {
        name: "description",
        content:
          "Official court reservation confirmations, squad invites, and physical education department circulars.",
      },
      { property: "og:title", content: "PESU Sports — Athletic Notices & Circulars" },
      {
        property: "og:description",
        content:
          "Official court reservation confirmations, squad invites, and physical education department circulars.",
      },
    ],
  }),
  component: NotificationsPage,
});

const KIND_ICON = { booking: CalendarCheck, match: Users, system: Bell } as const;

function NotificationsPage() {
  const { notifications, markAllRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <main className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto font-sans">
      {/* 1. Editorial Header */}
      <div className="bg-white border border-[#e5e7eb] border-l-4 border-l-[#0d1b2a] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#f1f3f6] pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
              Campus Athletics Bulletin
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111827] uppercase tracking-tight">
              Notices & Alerts
            </h1>
            <p className="text-xs text-[#64748b] mt-1 font-medium">
              Official circulars, reservation confirmations, and open match roster updates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#f8f8fa] px-3 py-1.5 border border-[#e5e7eb] text-xs font-bold text-[#0d1b2a]">
              <span>Unread:</span>
              <span className={unread > 0 ? "text-[#e35925]" : "text-[#64748b]"}>{unread}</span>
            </div>
            {unread > 0 && (
              <Button
                onClick={markAllRead}
                variant="outline"
                className="border-[#0d1b2a] text-[#0d1b2a] hover:bg-[#0d1b2a] hover:text-white rounded-none uppercase text-xs font-bold tracking-wider px-3 py-1.5 flex items-center gap-1.5"
              >
                <CheckCheck className="h-4 w-4" /> Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Status ticker */}
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#475569]">
          <span className="h-2 w-2 rounded-full bg-[#10b981]" />
          <span>Physical Education & Sports Dept live dispatch server connected</span>
        </div>
      </div>

      {/* 2. Notices List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white border border-[#e5e7eb] p-12 text-center rounded-none">
            <Bell className="mx-auto h-8 w-8 text-[#94a3b8]" />
            <h3 className="mt-3 text-base font-black uppercase text-[#111827]">No Alerts</h3>
            <p className="mt-1 text-xs text-[#64748b]">
              You're all caught up on court bookings and squad messages.
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = KIND_ICON[n.kind] ?? Bell;
            return (
              <div
                key={n.id}
                className={`p-5 border transition-all rounded-none ${
                  n.read
                    ? "bg-white border-[#e5e7eb] hover:border-[#cbd5e1]"
                    : "bg-white border-[#e5e7eb] border-l-4 border-l-[#e35925] shadow-xs"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-none border ${
                      n.read
                        ? "bg-[#f8f8fa] text-[#64748b] border-[#e5e7eb]"
                        : "bg-[#0d1b2a] text-white border-[#0d1b2a]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-sm font-black text-[#111827] uppercase tracking-tight truncate">
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="shrink-0 text-[9px] font-black uppercase tracking-widest bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5] px-1.5 py-0.5">
                            New
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-[10px] font-mono text-[#94a3b8] uppercase">
                        {n.time}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-[#475569] leading-relaxed font-normal">
                      {n.body}
                    </p>

                    <div className="mt-2.5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                      <span>Type: {n.kind}</span>
                      <span>·</span>
                      <span>Verified PESU Dispatch</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

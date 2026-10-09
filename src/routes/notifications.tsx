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
    <main className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto font-serif">
      {/* 1. Header with generous padding & muted tones */}
      <div className="bg-white border border-[#ded9cd] border-l-4 border-l-[#1a2639] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#eeeae1] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#c45524]">Campus Athletics Bulletin</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2639] mt-0.5">
              Notices & Alerts
            </h1>
            <p className="text-xs text-[#636a77] mt-1.5 leading-relaxed">
              Official circulars, reservation confirmations, and open match roster updates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#f5f4ef] px-3.5 py-1.5 border border-[#ded9cd] text-xs font-medium text-[#1a2639]">
              <span>Unread:</span>
              <span className={unread > 0 ? "text-[#c45524] font-bold" : "text-[#636a77]"}>
                {unread}
              </span>
            </div>
            {unread > 0 && (
              <Button
                onClick={markAllRead}
                variant="outline"
                className="border-[#1a2639] text-[#1a2639] hover:bg-[#1a2639] hover:text-white text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                <CheckCheck className="h-4 w-4" /> Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Status ticker */}
        <div className="mt-4 flex items-center gap-2 text-xs text-[#4b5260]">
          <span className="h-2 w-2 rounded-full bg-[#10b981]" />
          <span>Physical Education & Sports Dept live dispatch server connected</span>
        </div>
      </div>

      {/* 2. Notices List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white border border-[#ded9cd] p-12 text-center">
            <Bell className="mx-auto h-8 w-8 text-[#8c94a0]" />
            <h3 className="mt-3 text-base font-bold text-[#1a2639]">No Alerts</h3>
            <p className="mt-1 text-xs text-[#636a77]">
              You're all caught up on court bookings and squad messages.
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = KIND_ICON[n.kind] ?? Bell;
            return (
              <div
                key={n.id}
                className={`p-5 sm:p-6 border transition-all ${
                  n.read
                    ? "bg-white border-[#ded9cd] hover:border-[#b4bdcb]"
                    : "bg-white border-[#ded9cd] border-l-4 border-l-[#c45524] shadow-xs"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center border ${
                      n.read
                        ? "bg-[#f5f4ef] text-[#636a77] border-[#ded9cd]"
                        : "bg-[#1a2639] text-white border-[#1a2639]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-sm font-bold text-[#1a2639] truncate">{n.title}</p>
                        {!n.read && (
                          <span className="shrink-0 text-[10px] font-semibold bg-[#fdf3ee] text-[#c45524] border border-[#f5dbcf] px-1.5 py-0.2">
                            New
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-[11px] font-mono text-[#8c94a0]">
                        {n.time}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-[#4b5260] leading-relaxed">{n.body}</p>

                    <div className="mt-3 flex items-center gap-3 text-[11px] text-[#8c94a0]">
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

import { createFileRoute } from "@tanstack/react-router";
import { Bell, CalendarCheck, CheckCheck, Users } from "lucide-react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PES Play — Notifications" },
      { name: "description", content: "Booking confirmations, match invites and updates from PES Play." },
      { property: "og:title", content: "PES Play — Notifications" },
      { property: "og:description", content: "Booking confirmations, match invites and updates from PES Play." },
    ],
  }),
  component: Notifications,
});

const KIND_ICON = { booking: CalendarCheck, match: Users, system: Bell } as const;

function Notifications() {
  const { notifications, markAllRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <main className="mx-auto max-w-md px-4 pb-28 pt-5 md:max-w-3xl md:px-6 md:pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unread > 0 ? `${unread} unread update${unread > 1 ? "s" : ""}` : "You're all caught up"}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:border-primary/50"
          >
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </button>
        )}
      </div>

      <div className="mt-5 space-y-2.5">
        {notifications.map((n) => {
          const Icon = KIND_ICON[n.kind];
          return (
            <div
              key={n.id}
              className={`flex gap-3 rounded-2xl border p-4 transition-colors ${
                n.read ? "border-border bg-card" : "border-primary/30 bg-card glow-primary"
              }`}
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  n.read ? "bg-secondary text-muted-foreground" : "gradient-play text-primary-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{n.title}</p>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse-glow" />}
            </div>
          );
        })}
      </div>
    </main>
  );
}

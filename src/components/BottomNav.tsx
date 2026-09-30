import { Link } from "@tanstack/react-router";
import { Bell, Home, MapPin, User, Users } from "lucide-react";
import { useApp } from "@/lib/store";

const TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/courts", label: "Courts", icon: MapPin },
  { to: "/matches", label: "Matches", icon: Users },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { notifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/90 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {TABS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            <span className="relative">
              <Icon className="h-5 w-5" />
              {label === "Alerts" && unread > 0 && (
                <span className="absolute -right-1.5 -top-1 grid h-4 w-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </span>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function TopNav() {
  const { notifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <header className="sticky top-0 z-50 hidden border-b border-border bg-background/80 backdrop-blur-xl md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-bold">
          PES <span className="text-gradient">Play</span>
        </Link>
        <nav className="flex items-center gap-1">
          {TABS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "bg-secondary text-primary" }}
            >
              <Icon className="h-4 w-4" />
              {label}
              {label === "Alerts" && unread > 0 && (
                <span className="grid h-4 w-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

import { Link } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  ChevronDown,
  Clock,
  Compass,
  FileText,
  LogOut,
  MapPin,
  Menu,
  QrCode,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { PESLogo } from "./PESLogo";
import { useApp } from "@/lib/store";
import { USER } from "@/lib/data";

const MAIN_NAV = [
  { to: "/", label: "Discover", icon: Compass },
  { to: "/courts", label: "Facilities", icon: CalendarCheck },
  { to: "/matches", label: "Find Squads", icon: Users },
  { to: "/profile", label: "My Activity", icon: User },
  { to: "/notifications", label: "Notices", icon: Bell },
] as const;

export function TopNav() {
  const { notifications, toggleSidebar } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[#e5e7eb] bg-[#f8f8fa]/95 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left: Hamburger (mobile/rail toggle) & Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-none text-[#111827] hover:bg-[#eaecee] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center">
            <PESLogo />
          </Link>
        </div>

        {/* Center: Desktop Editorial Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {MAIN_NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="relative px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#64748b] hover:text-[#111827] transition-colors"
              activeProps={{
                className: "text-[#111827] border-b-2 border-[#e35925] font-black",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: Quick CTA, Campus Badge & Athlete Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/courts"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#e35925] hover:bg-[#cf4d1c] active:bg-[#b84317] text-white px-3.5 py-2 text-[11px] font-black uppercase tracking-wider transition-colors shadow-xs"
          >
            <CalendarCheck className="h-3.5 w-3.5" /> Book Court
          </Link>

          <Link
            to="/notifications"
            className="relative flex h-8 w-8 items-center justify-center text-[#475569] hover:bg-[#eaecee] hover:text-[#111827] transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 grid h-2 w-2 rounded-full bg-[#e35925]" />
            )}
          </Link>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 py-1 px-1.5 hover:bg-[#eaecee] transition-colors cursor-pointer"
            >
              <div className="grid h-8 w-8 place-items-center bg-[#0d1b2a] text-white text-xs font-black tracking-tight border-l-2 border-[#e35925]">
                {USER.name[0]}
              </div>
              <span className="hidden lg:inline-block text-xs font-bold text-[#111827] uppercase tracking-wide">
                {USER.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#64748b]" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-60 border border-[#e5e7eb] bg-white shadow-xl z-50 animate-in fade-in-50 duration-100"
                onClick={() => setProfileOpen(false)}
              >
                <div className="p-3.5 border-b border-[#e5e7eb] bg-[#f8f8fa]">
                  <p className="text-xs font-black text-[#111827] uppercase tracking-tight">
                    {USER.fullName}
                  </p>
                  <p className="text-[11px] text-[#64748b] font-mono mt-0.5">SRN: PES1UG21CS123</p>
                  <span className="mt-1.5 inline-block bg-[#0d1b2a] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wider">
                    {USER.campus} · ATHLETE
                  </span>
                </div>
                <div className="p-1">
                  <Link
                    to="/profile"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#111827] hover:bg-[#f8f8fa]"
                  >
                    <User className="h-3.5 w-3.5 text-[#e35925]" /> Athlete Profile & Pass
                  </Link>
                  <Link
                    to="/courts"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#111827] hover:bg-[#f8f8fa]"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#0d1b2a]" /> Facilities Directory
                  </Link>
                  <Link
                    to="/matches"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#111827] hover:bg-[#f8f8fa]"
                  >
                    <Users className="h-3.5 w-3.5 text-[#e35925]" /> Open Games Roster
                  </Link>
                  <Link
                    to="/login"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#d9433b] hover:bg-[#fef2f2] border-t border-[#f1f3f6]"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function PESUSidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sideline Drawer / Rail with Navy Sideline Accent */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 flex flex-col bg-[#fafafc] border-r-2 border-[#0d1b2a] transition-all duration-200 ${
          sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        }`}
      >
        <div className="flex-1 overflow-y-auto py-3 no-scrollbar">
          <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">
            {sidebarOpen ? "Navigation" : "Nav"}
          </div>

          <nav className="space-y-1 px-1.5">
            {MAIN_NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                onClick={() => {
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className="group flex items-center gap-3 px-3.5 py-3 text-xs font-bold text-[#475569] transition-colors hover:bg-[#f1f3f6] hover:text-[#111827]"
                activeProps={{
                  className: "bg-[#f1f3f6] text-[#111827] font-black border-l-4 border-[#e35925]",
                }}
              >
                <Icon className="h-4 w-4 shrink-0 text-[#0d1b2a] group-hover:text-[#e35925] transition-colors" />
                {sidebarOpen && <span className="truncate uppercase tracking-wider">{label}</span>}
              </Link>
            ))}
          </nav>

          {/* Sideline Sports Details */}
          {sidebarOpen && (
            <div className="mt-6 px-4 pt-4 border-t border-[#e5e7eb] space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">
                Campus Complex
              </div>
              <div className="space-y-2 text-xs text-[#475569]">
                <div className="p-2.5 bg-white border border-[#e5e7eb]">
                  <p className="font-black text-[#111827] uppercase tracking-wide text-[11px]">
                    RR Campus Sports Hub
                  </p>
                  <p className="text-[10px] text-[#64748b] mt-0.5">GJ Block Ground & Basement</p>
                  <p className="text-[10px] text-[#e35925] font-bold mt-1">Open 06:00 – 22:00</p>
                </div>
                <div className="p-2.5 bg-white border border-[#e5e7eb]">
                  <p className="font-black text-[#111827] uppercase tracking-wide text-[11px]">
                    EC Campus Arena
                  </p>
                  <p className="text-[10px] text-[#64748b] mt-0.5">Sports Block & Box Turf</p>
                  <p className="text-[10px] text-[#e35925] font-bold mt-1">Open 06:00 – 22:00</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-[#e5e7eb] bg-white text-[10px] text-[#64748b]">
            <p className="font-black uppercase tracking-wider text-[#111827]">
              PES University Athletics
            </p>
            <p className="mt-0.5 font-mono">Turnstile Access · RFID Active</p>
          </div>
        )}
      </aside>
    </>
  );
}

export function BottomNav() {
  const { notifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e5e7eb] bg-[#f8f8fa] md:hidden shadow-lg">
      <div className="grid grid-cols-5">
        {MAIN_NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-[9px] font-black uppercase tracking-wider text-[#64748b] hover:text-[#111827] transition-colors"
            activeProps={{
              className: "text-[#111827] font-black border-t-2 border-[#e35925] bg-white",
            }}
          >
            <span className="relative">
              <Icon className="h-4 w-4" />
              {label === "Notices" && unread > 0 && (
                <span className="absolute -right-1 -top-1 grid h-2 w-2 rounded-full bg-[#e35925]" />
              )}
            </span>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

import { Link } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  ChevronDown,
  Clock,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  MapPin,
  Menu,
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
  { to: "/", label: "Home", icon: Home },
  { to: "/courts", label: "Sports Booking", icon: CalendarCheck },
  { to: "/matches", label: "Find Players", icon: Users },
  { to: "/notifications", label: "Announcements", icon: Bell },
  { to: "/profile", label: "My Profile", icon: User },
] as const;

const ACADEMY_ITEMS = [
  { label: "Online Payments", icon: CreditCard, to: "/courts" },
  { label: "Student Grievance Redressal System", icon: ShieldAlert, to: "/profile" },
  { label: "My Courses", icon: GraduationCap, to: "/" },
  { label: "Time Table", icon: Clock, to: "/courts" },
  { label: "Hall Ticket", icon: FileText, to: "/profile" },
] as const;

export function TopNav() {
  const { notifications, toggleSidebar } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-[#dbe2ea] bg-white shadow-xs">
      <div className="flex h-full items-center justify-between px-3 sm:px-5">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-none text-[#084d7a] hover:bg-[#f1f5f9] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <PESLogo />
            <div className="hidden lg:flex items-center">
              <span className="mx-2.5 h-5 w-px bg-[#cbd5e1]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#084d7a] font-sans">
                Sports & Athletics
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Notifications & Student Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/notifications"
            className="relative flex h-8 w-8 items-center justify-center rounded-none text-[#475569] hover:bg-[#f1f5f9] hover:text-[#084d7a] transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unread > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 grid h-3.5 w-3.5 place-items-center rounded-none bg-[#d9534f] text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>

          {/* User profile widget matching PESU Academy */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 py-1 px-2 rounded-none hover:bg-[#f1f5f9] transition-colors cursor-pointer"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#084d7a] text-xs font-bold text-white shadow-xs">
                {USER.name[0]}
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-[#1e293b]">
                {USER.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#64748b]" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-56 border border-[#cbd5e1] bg-white shadow-md z-50 rounded-none animate-in fade-in-50 duration-100"
                onClick={() => setProfileOpen(false)}
              >
                <div className="p-3 border-b border-[#e2e8f0] bg-[#f8fafc]">
                  <p className="text-xs font-bold text-[#0f172a]">{USER.fullName}</p>
                  <p className="text-[11px] text-[#64748b] font-mono">PES1UG21CS123</p>
                  <span className="mt-1 inline-block bg-[#e6f4ea] text-[#137333] border border-[#ceead6] px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-none">
                    {USER.campus}
                  </span>
                </div>
                <div className="p-1">
                  <Link
                    to="/profile"
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9] rounded-none"
                  >
                    <User className="h-3.5 w-3.5" /> Student Profile
                  </Link>
                  <Link
                    to="/courts"
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#f1f5f9] rounded-none"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Book a Court
                  </Link>
                  <Link
                    to="/login"
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[#c5221f] hover:bg-[#fdf2f2] rounded-none"
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

      {/* Sidebar Rail / Drawer */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 flex flex-col bg-[#084d7a] text-white transition-all duration-200 border-r border-[#063f64] ${
          sidebarOpen ? "w-60 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        }`}
      >
        <div className="flex-1 overflow-y-auto py-2 no-scrollbar">
          {/* Main Sports Portal Links */}
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#93c5fd]">
            {sidebarOpen ? "Sports Booking" : "Menu"}
          </div>
          <nav className="space-y-0.5 px-1">
            {MAIN_NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                onClick={() => {
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className="group flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-white transition-colors rounded-none hover:bg-[#0b5c8f]"
                activeProps={{
                  className: "bg-[#0082c3] text-white font-semibold shadow-xs",
                }}
              >
                <Icon className="h-4 w-4 shrink-0 text-white" />
                {sidebarOpen && <span className="truncate">{label}</span>}
              </Link>
            ))}
          </nav>

          {/* PESU Academy System Links matching Image 3 */}
          {sidebarOpen && (
            <>
              <div className="mt-5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#93c5fd] border-t border-[#0a5c91]/60 pt-3">
                PESU Academy
              </div>
              <nav className="space-y-0.5 px-1">
                {ACADEMY_ITEMS.map(({ label, icon: Icon, to }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => {
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-xs text-[#e2e8f0] transition-colors rounded-none hover:bg-[#0b5c8f] hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                    <span className="truncate">{label}</span>
                  </Link>
                ))}
              </nav>
            </>
          )}
        </div>

        {/* Sidebar Footer info */}
        {sidebarOpen && (
          <div className="p-3 border-t border-[#095788] bg-[#074269] text-[10px] text-[#94a3b8]">
            <p className="font-semibold text-white">PESU Sports Complex</p>
            <p>Ring Road & Electronic City</p>
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
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#cbd5e1] bg-white md:hidden shadow-md">
      <div className="grid grid-cols-5">
        {MAIN_NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="relative flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium text-[#64748b] hover:text-[#084d7a] transition-colors rounded-none"
            activeProps={{
              className: "bg-[#f0f7ff] text-[#0080b0] font-bold border-t-2 border-[#0080b0]",
            }}
          >
            <span className="relative">
              <Icon className="h-4.5 w-4.5" />
              {label === "Announcements" && unread > 0 && (
                <span className="absolute -right-2 -top-1 grid h-3.5 w-3.5 place-items-center bg-[#d9534f] text-[8px] font-bold text-white rounded-none">
                  {unread}
                </span>
              )}
            </span>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

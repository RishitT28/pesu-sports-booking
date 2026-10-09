import { Link } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  ChevronDown,
  Clock,
  Compass,
  FileText,
  HelpCircle,
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

const MAIN_NAV = [
  { to: "/", label: "Discover", icon: Compass },
  { to: "/courts", label: "Facilities", icon: CalendarCheck },
  { to: "/matches", label: "Find Squads", icon: Users },
  { to: "/profile", label: "My Activity", icon: User },
  { to: "/notifications", label: "Notices", icon: Bell },
  { to: "/help", label: "Help & Contacts", icon: HelpCircle },
] as const;

export function TopNav() {
  const { notifications, toggleSidebar, currentUser } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 h-16 border-b-2 border-b-[#c45524] bg-[#1a2639] text-white shadow-md font-serif">
      <div className="flex h-full items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left: Hamburger (mobile/rail toggle) & Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-none text-[#cfd7e3] hover:bg-[#25364e] hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center">
            <PESLogo inverted={true} />
          </Link>
        </div>

        {/* Center: Desktop Nav Links in Times New Roman, lowercase/title case */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {MAIN_NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="relative px-3 py-2 text-sm font-normal text-[#cfd7e3] hover:text-white hover:bg-[#24344d]/60 transition-colors"
              activeProps={{
                className: "text-white border-b-2 border-[#c45524] font-semibold bg-[#24344d]",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: Quick CTA in warm orange & Student Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/courts"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#c45524] hover:bg-[#b04a1d] text-white px-3.5 py-1.5 text-xs font-semibold transition-colors shadow-xs"
          >
            <CalendarCheck className="h-3.5 w-3.5" /> Book Court
          </Link>

          <Link
            to="/notifications"
            className="relative flex h-8 w-8 items-center justify-center text-[#cfd7e3] hover:bg-[#25364e] hover:text-white transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 grid h-2 w-2 rounded-full bg-[#c45524] ring-2 ring-[#1a2639]" />
            )}
          </Link>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 py-1 px-1.5 hover:bg-[#25364e] transition-colors cursor-pointer text-left"
            >
              <div className="grid h-8 w-8 place-items-center bg-[#c45524] text-white text-xs font-bold border border-[#df6933]">
                {currentUser?.name?.[0] || "R"}
              </div>
              <span className="hidden lg:inline-block text-xs font-medium text-[#f0f2f5]">
                {currentUser?.name || "Rishit"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#a3afc2]" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-64 border border-[#ded9cd] bg-[#ffffff] text-[#242831] shadow-xl z-50 animate-in fade-in-50 duration-100"
                onClick={() => setProfileOpen(false)}
              >
                <div className="p-3.5 border-b border-[#ded9cd] bg-[#f5f4ef]">
                  <p className="text-sm font-bold text-[#1a2639]">
                    {currentUser?.fullName || "Rishit Tathod"}
                  </p>
                  <p className="text-xs text-[#636a77] font-mono mt-0.5">
                    SRN: {currentUser?.srn || "PES1UG21CS123"}
                  </p>
                  <span className="mt-1.5 inline-block bg-[#1a2639] text-white text-[10px] font-semibold px-2 py-0.5">
                    {currentUser?.campus || "RR Campus"} · Student Athlete
                  </span>
                </div>
                <div className="p-1 text-xs">
                  <Link
                    to="/profile"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-[#242831] hover:bg-[#f5f4ef]"
                  >
                    <User className="h-3.5 w-3.5 text-[#c45524]" /> Athlete Profile & Pass
                  </Link>
                  <Link
                    to="/courts"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-[#242831] hover:bg-[#f5f4ef]"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#1a2639]" /> Facilities Directory
                  </Link>
                  <Link
                    to="/matches"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-[#242831] hover:bg-[#f5f4ef]"
                  >
                    <Users className="h-3.5 w-3.5 text-[#c45524]" /> Open Games Roster
                  </Link>
                  <Link
                    to="/help"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-[#242831] hover:bg-[#f5f4ef]"
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-[#1a2639]" /> Help & Directorate
                    Contacts
                  </Link>
                  <Link
                    to="/login"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-[#b94236] hover:bg-[#fdf2f1] border-t border-[#ded9cd]"
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

      {/* Sideline Drawer / Rail */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 flex flex-col bg-[#faf9f5] border-r border-[#ded9cd] transition-all duration-200 font-serif ${
          sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        }`}
      >
        <div className="flex-1 overflow-y-auto py-3 no-scrollbar">
          <div className="px-4 py-2 text-xs font-semibold text-[#636a77]">
            {sidebarOpen ? "Campus Navigation" : "Nav"}
          </div>

          <nav className="space-y-1 px-2">
            {MAIN_NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                onClick={() => {
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className="group flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-[#4b5260] transition-colors hover:bg-[#ebe7df] hover:text-[#1a2639]"
                activeProps={{
                  className: "bg-[#ebe7df] text-[#1a2639] font-bold border-l-4 border-[#c45524]",
                }}
              >
                <Icon className="h-4 w-4 shrink-0 text-[#1a2639] group-hover:text-[#c45524] transition-colors" />
                {sidebarOpen && <span className="truncate">{label}</span>}
              </Link>
            ))}
          </nav>

          {/* Sideline Sports Details */}
          {sidebarOpen && (
            <div className="mt-6 px-4 pt-4 border-t border-[#ded9cd] space-y-3">
              <div className="text-xs font-semibold text-[#636a77]">Sports Complex Hours</div>
              <div className="space-y-2 text-xs text-[#4b5260]">
                <div className="p-2.5 bg-white border border-[#ded9cd]">
                  <p className="font-bold text-[#1a2639] text-xs">RR Campus Sports Hub</p>
                  <p className="text-[11px] text-[#636a77] mt-0.5">GJ Block Ground & Basement</p>
                  <p className="text-[11px] text-[#c45524] font-semibold mt-1">
                    Open 06:00 – 22:00
                  </p>
                </div>
                <div className="p-2.5 bg-white border border-[#ded9cd]">
                  <p className="font-bold text-[#1a2639] text-xs">EC Campus Arena</p>
                  <p className="text-[11px] text-[#636a77] mt-0.5">Sports Complex & Box Turf</p>
                  <p className="text-[11px] text-[#c45524] font-semibold mt-1">
                    Open 06:00 – 22:00
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-[#ded9cd] bg-white text-[11px] text-[#636a77]">
            <p className="font-bold text-[#1a2639]">PES University Athletics</p>
            <p className="mt-0.5 font-mono">Turnstile clearance · RFID Active</p>
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
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#293b54] bg-[#1a2639] text-[#cfd7e3] md:hidden shadow-lg font-serif">
      <div className="grid grid-cols-6">
        {MAIN_NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="relative flex flex-col items-center justify-center gap-1 py-2 text-[9px] font-medium text-[#cfd7e3] hover:text-white transition-colors"
            activeProps={{
              className: "text-white font-bold border-t-2 border-[#c45524] bg-[#24344d]",
            }}
          >
            <span className="relative">
              <Icon className="h-4 w-4" />
              {label === "Notices" && unread > 0 && (
                <span className="absolute -right-1 -top-1 grid h-2 w-2 rounded-full bg-[#c45524]" />
              )}
            </span>
            <span className="truncate max-w-[50px]">{label.split(" ")[0]}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

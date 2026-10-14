import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  ChevronDown,
  Clock,
  Compass,
  FileText,
  HelpCircle,
  Lock,
  LogOut,
  MapPin,
  Menu,
  QrCode,
  School,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { AppBrandHeader, CollegeLogo } from "./CollegeLogo";
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
  const navigate = useNavigate();
  const { notifications, toggleSidebar, currentUser, college, collegeId, logout } =
    useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const isManipal = collegeId === "manipal";

  return (
    <>
      <header className={`sticky top-0 z-40 h-16 transition-all duration-300 ${college.ribbonStyle.ribbonClass} ${college.fontClass}`}>
        <div className="flex h-full items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
          {/* Left: Rail toggle & BookQuick Brand Header */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleSidebar}
              className={`flex h-9 w-9 items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition-colors focus:outline-none ${college.buttonStyle.radiusClass}`}
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link to="/" className="flex items-center">
              <AppBrandHeader collegeId={collegeId} inverted={true} />
            </Link>
          </div>

          {/* Center: Desktop Nav Links in college typography */}
          <nav className="hidden lg:flex items-center space-x-1">
            {MAIN_NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className={`relative px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors ${college.buttonStyle.radiusClass}`}
                activeProps={{
                  className: "text-white font-bold bg-white/20 shadow-xs",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: Locked College Badge, CTA, Notifications, and Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Locked College Indicator (cannot be switched while signed in) */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-black/25 text-white/95 border border-white/25 shadow-xs select-none ${college.buttonStyle.radiusClass}`}
              title={`Institutional access locked to ${college.name}. Sign out to switch college.`}
            >
              <Lock className="h-3 w-3 text-amber-300" />
              <span className="hidden sm:inline-block font-bold">{college.shortName}</span>
            </div>

            {/* Quick CTA in College Button Style */}
            <Link
              to="/courts"
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all ${college.buttonStyle.radiusClass} ${college.buttonStyle.primaryClass} ${college.buttonStyle.extraClass}`}
            >
              <CalendarCheck className="h-3.5 w-3.5" /> Book Court
            </Link>

            {/* Notifications */}
            <Link
              to="/notifications"
              className={`relative flex h-8 w-8 items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition-colors ${college.buttonStyle.radiusClass}`}
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span
                  className="absolute top-1 right-1 grid h-2 w-2 rounded-full ring-2 ring-black/50"
                  style={{ backgroundColor: college.colors.accent || college.colors.primary }}
                />
              )}
            </Link>

            {/* Top Right MIT Emblem (Manipal specific requirement) */}
            {isManipal && (
              <div className="hidden sm:flex items-center pl-1 border-l-2 border-white/30" title="M.I.T Manipal Official Technical Emblem">
                <CollegeLogo collegeId="manipal" showText={false} />
              </div>
            )}

            {/* User profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className={`flex items-center gap-2 py-1 px-1.5 hover:bg-white/10 transition-colors cursor-pointer text-left ${college.buttonStyle.radiusClass}`}
              >
                <div
                  className={`grid h-8 w-8 place-items-center text-white text-xs font-bold shadow-xs border border-white/20 ${college.buttonStyle.radiusClass}`}
                  style={{ backgroundColor: college.colors.primary }}
                >
                  {currentUser?.name?.[0] || "U"}
                </div>
                <span className="hidden xl:inline-block text-xs font-semibold text-white/95">
                  {currentUser?.name || "Student"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-white/70" />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 border border-gray-200 bg-white text-gray-900 shadow-2xl z-50 animate-in fade-in-50 duration-100 rounded-lg overflow-hidden"
                  onClick={() => setProfileOpen(false)}
                >
                  <div className="p-4 border-b border-gray-100 bg-gray-50/80">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {currentUser?.fullName || "Student Athlete"}
                      </p>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 flex items-center gap-1">
                        <Lock className="h-2.5 w-2.5 text-gray-500" />
                        {college.shortName}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {college.studentIdLabel}: {currentUser?.srn || "1MS21CS001"}
                    </p>
                    <span
                      className="mt-2 inline-block text-white text-[10px] font-semibold px-2 py-0.5 rounded"
                      style={{ backgroundColor: college.colors.secondary }}
                    >
                      {currentUser?.campus || college.campuses[0]} · Clearance Verified
                    </span>
                  </div>

                  <div className="p-1.5 text-xs space-y-0.5">
                    <div className="flex items-center justify-between px-3 py-2 text-[11px] text-gray-500 bg-gray-50/80 rounded-md">
                      <span>Active College:</span>
                      <span className="font-bold text-gray-800 flex items-center gap-1">
                        <Lock className="h-3 w-3 text-amber-600" /> {college.shortName} (Locked)
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <User className="h-3.5 w-3.5" /> Athlete Profile & Pass
                    </Link>
                    <Link
                      to="/courts"
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <MapPin className="h-3.5 w-3.5" /> Facilities Directory
                    </Link>
                    <Link
                      to="/matches"
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <Users className="h-3.5 w-3.5" /> Open Squads Roster
                    </Link>
                    <Link
                      to="/help"
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <HelpCircle className="h-3.5 w-3.5" /> Help & Directorate Desk
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate({ to: "/login" });
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md border-t border-gray-100 font-medium text-left cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out & Switch College
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export function PESUSidebar() {
  const { sidebarOpen, setSidebarOpen, college, collegeId } = useApp();

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
        className={`fixed top-16 bottom-0 left-0 z-40 flex flex-col bg-white border-r transition-all duration-200 ${college.fontClass} ${
          sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        }`}
        style={{ borderColor: college.colors.border }}
      >
        <div className="flex-1 overflow-y-auto py-3 no-scrollbar">
          <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            {sidebarOpen ? `${college.shortName} Athletics` : "Nav"}
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
                className={`group flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 ${college.buttonStyle.radiusClass}`}
                activeProps={{
                  className: "bg-gray-100 text-gray-900 font-bold shadow-xs",
                  style: {
                    borderLeft: `4px solid ${college.colors.primary}`,
                  },
                }}
              >
                <Icon
                  className="h-4 w-4 shrink-0 transition-colors"
                  style={{ color: college.colors.secondary }}
                />
                {sidebarOpen && <span className="truncate">{label}</span>}
              </Link>
            ))}
          </nav>

          {/* Sideline Sports Details for Active College */}
          {sidebarOpen && (
            <div className="mt-6 px-4 pt-4 border-t space-y-3" style={{ borderColor: college.colors.border }}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Live Campus Arenas
              </div>
              <div className="space-y-2 text-xs">
                {college.campuses.map((campus, idx) => (
                  <div
                    key={campus}
                    className="p-2.5 bg-gray-50/90 border rounded-md"
                    style={{ borderColor: college.colors.border }}
                  >
                    <p className="font-bold text-gray-900 text-xs">{campus}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {idx === 0 ? "Indoor Stadium & Wooden Courts" : "Floodlit Box Turf & Arenas"}
                    </p>
                    <p className="text-[11px] font-bold mt-1" style={{ color: college.colors.primary }}>
                      Open 06:00 – 22:00
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div
            className="p-4 border-t bg-gray-50/50 text-[11px] text-gray-500"
            style={{ borderColor: college.colors.border }}
          >
            <p className="font-bold text-gray-900">{college.name}</p>
            <p className="mt-0.5 font-mono text-[10px]">
              Turnstile Clearance · Verified ID
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

export function BottomNav() {
  const { notifications, college } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-30 border-t md:hidden shadow-lg ${college.ribbonStyle.ribbonClass} ${college.fontClass}`}
    >
      <div className="grid grid-cols-6">
        {MAIN_NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="relative flex flex-col items-center justify-center gap-1 py-2 text-[9px] font-medium text-white/80 hover:text-white transition-colors"
            activeProps={{
              className: "text-white font-bold bg-white/20",
              style: {
                borderTop: `2px solid ${college.colors.primary}`,
              },
            }}
          >
            <span className="relative">
              <Icon className="h-4 w-4" />
              {label === "Notices" && unread > 0 && (
                <span
                  className="absolute -right-1 -top-1 grid h-2 w-2 rounded-full"
                  style={{ backgroundColor: college.colors.accent || college.colors.primary }}
                />
              )}
            </span>
            <span className="truncate max-w-[50px]">{label.split(" ")[0]}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

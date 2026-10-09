import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  HelpCircle,
  IdCard,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  User as UserIcon,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { BADGES, CAMPUSES, SPORTS, type Campus } from "@/lib/data";
import { useApp } from "@/lib/store";
import { MyBookings } from "@/components/BookingDetails";
import { QrPass } from "@/components/QrPass";
import { SportIcon } from "@/components/SportIcon";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "PESU Sports — Athlete Profile & Clearance" },
      {
        name: "description",
        content:
          "Official student athlete identity, sports clearance RFID pass, account details, and court booking history.",
      },
      { property: "og:title", content: "PESU Sports — Athlete Profile & Clearance" },
      {
        property: "og:description",
        content:
          "Official student athlete identity, sports clearance RFID pass, account details, and court booking history.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const {
    currentUser,
    updateProfile,
    changePassword,
    logout,
    hoursLogged,
    matchesPlayed,
    bookings,
  } = useApp();

  const activeBookings = bookings.filter((b) => b.status === "upcoming").length;

  // Edit Info Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFullName, setEditFullName] = useState(currentUser.fullName);
  const [editCampus, setEditCampus] = useState<Campus>(currentUser.campus);
  const [editDept, setEditDept] = useState(currentUser.department);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editSkill, setEditSkill] = useState(currentUser.skill);
  const [editSports, setEditSports] = useState<string[]>(currentUser.favoriteSports);

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName: editFullName,
      name: editFullName.split(" ")[0] || editFullName,
      campus: editCampus,
      department: editDept,
      email: editEmail,
      phone: editPhone,
      skill: editSkill,
      favoriteSports: editSports,
    });
    setShowEditModal(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currPassword || !newPassword) {
      setPasswordError("Please fill in both current and new passwords.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    const res = await changePassword(currPassword, newPassword);
    if (res.success) {
      setPasswordSuccess("Password securely updated in encrypted database!");
      setCurrPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowPasswordModal(false), 2000);
    } else {
      setPasswordError(res.error || "Failed to update password.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const toggleSport = (sportId: string) => {
    setEditSports((prev) =>
      prev.includes(sportId) ? prev.filter((s) => s !== sportId) : [...prev, sportId],
    );
  };

  return (
    <main className="p-4 sm:p-8 space-y-10 max-w-7xl mx-auto font-serif">
      {/* 1. Athlete Identity Card with Edit & Logout Options */}
      <div className="bg-white border border-[#ded9cd] border-l-4 border-l-[#1a2639] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#eeeae1] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#c45524]">Student Identification</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2639] mt-0.5">
              Athlete Profile & Clearance
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditModal(true)}
              className="text-xs border-[#ded9cd] text-[#1a2639] hover:bg-[#f5f4ef] flex items-center gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5 text-[#c45524]" /> Edit Information
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordModal(true)}
              className="text-xs border-[#ded9cd] text-[#1a2639] hover:bg-[#f5f4ef] flex items-center gap-1.5"
            >
              <KeyRound className="h-3.5 w-3.5 text-[#1a2639]" /> Change Password
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="text-xs bg-[#b94236] hover:bg-[#a3372c] text-white flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Student Data Row */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal & Academic Specs */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-start gap-6">
            <div className="h-20 w-20 shrink-0 bg-[#1a2639] text-white flex items-center justify-center text-3xl font-bold border-2 border-[#c45524]">
              {currentUser.name[0] || "R"}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-[#1a2639]">{currentUser.fullName}</h2>
                <span className="text-xs font-semibold bg-[#1a2639] text-white px-2 py-0.5">
                  {currentUser.semester}
                </span>
                <span className="text-xs font-medium bg-[#fdf3ee] text-[#c45524] border border-[#f5dbcf] px-2 py-0.5">
                  {currentUser.skill} Competitor
                </span>
                <span className="text-xs font-medium bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] px-2 py-0.5">
                  Clearance: {currentUser.clearanceStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-[#4b5260] pt-1">
                <div>
                  <span className="text-[#8c94a0] text-[11px] font-semibold block">
                    Student Registration Number (SRN)
                  </span>
                  <span className="font-mono text-[#1a2639] font-medium">{currentUser.srn}</span>
                </div>
                <div>
                  <span className="text-[#8c94a0] text-[11px] font-semibold block">
                    Permanent Roll Number (PRN)
                  </span>
                  <span className="font-mono text-[#1a2639] font-medium">{currentUser.prn}</span>
                </div>
                <div className="pt-1">
                  <span className="text-[#8c94a0] text-[11px] font-semibold block">
                    Academic School
                  </span>
                  <span className="text-[#1a2639]">{currentUser.department}</span>
                </div>
                <div className="pt-1">
                  <span className="text-[#8c94a0] text-[11px] font-semibold block">
                    Home Complex
                  </span>
                  <span className="text-[#1a2639] font-semibold">{currentUser.campus}</span>
                </div>
                <div className="pt-1">
                  <span className="text-[#8c94a0] text-[11px] font-semibold block">
                    Official Email
                  </span>
                  <span className="text-[#1a2639]">{currentUser.email}</span>
                </div>
                <div className="pt-1">
                  <span className="text-[#8c94a0] text-[11px] font-semibold block">
                    Contact Phone
                  </span>
                  <span className="text-[#1a2639]">{currentUser.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Turnstile RFID Digital Gate Pass */}
          <div className="bg-[#f5f4ef] border border-[#ded9cd] p-5 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1a2639] mb-3">
              <QrCode className="h-4 w-4 text-[#c45524]" />
              <span>RFID Turnstile Pass</span>
            </div>
            <div className="p-2 bg-white border border-[#ded9cd]">
              <QrPass seed={currentUser.srn} size={105} />
            </div>
            <p className="mt-2.5 text-[11px] font-mono text-[#636a77]">
              Scan at sports gate turnstiles
            </p>
          </div>
        </div>

        {/* Quick Contact Desk Link */}
        <div className="mt-6 pt-4 border-t border-[#eeeae1] flex flex-wrap items-center justify-between text-xs text-[#636a77]">
          <span>Encountering card scan or turnstile gate problems?</span>
          <a
            href="/help#contacts"
            className="text-xs font-semibold text-[#c45524] hover:underline flex items-center gap-1"
          >
            <HelpCircle className="h-3.5 w-3.5" /> Contact Physical Education Directorate Desk
          </a>
        </div>
      </div>

      {/* 2. Athletic Performance Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            icon: Clock,
            label: "Court Hours Logged",
            value: `${hoursLogged} hrs`,
            sub: "+4 hrs this month",
          },
          {
            icon: Swords,
            label: "Matches Played",
            value: matchesPlayed,
            sub: "78% win rate",
          },
          {
            icon: Trophy,
            label: "Active Reservations",
            value: activeBookings,
            sub: "College facility pass",
          },
          {
            icon: Zap,
            label: "PESU Power Rating",
            value: "4.2 / 5.0",
            sub: "Top 12% in CSE",
          },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div
            key={label}
            className="bg-white border border-[#ded9cd] p-6 shadow-xs transition-colors hover:border-[#1a2639]"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-[#c45524]" />
              <span className="text-[11px] font-medium text-[#8c94a0]">{sub}</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-[#1a2639]">{value}</p>
            <p className="text-xs text-[#636a77] mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* 3. Preferred Sports & Weekly Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preferred Sports */}
        <div className="bg-white border border-[#ded9cd] p-6 sm:p-7 shadow-xs">
          <div className="border-b border-[#eeeae1] pb-3 mb-4">
            <span className="text-xs font-semibold text-[#c45524]">Enrolled Disciplines</span>
            <h2 className="text-base font-bold text-[#1a2639]">Preferred Sports & Skill Levels</h2>
          </div>

          <div className="space-y-3">
            {currentUser.favoriteSports.map((sportId) => {
              const sportObj = SPORTS.find((s) => s.id === sportId);
              return (
                <div
                  key={sportId}
                  className="flex items-center justify-between p-3.5 bg-[#f5f4ef] border border-[#ded9cd]"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-white border border-[#ded9cd] text-[#1a2639]">
                      <SportIcon sport={sportId} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1a2639]">
                        {sportObj?.name ?? sportId}
                      </p>
                      <p className="text-[11px] text-[#636a77]">
                        {sportObj?.tagline ?? "Regular campus athlete"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 bg-white border border-[#1a2639] text-[#1a2639]">
                    {currentUser.skill}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Availability Schedule */}
        <div className="bg-white border border-[#ded9cd] p-6 sm:p-7 shadow-xs">
          <div className="border-b border-[#eeeae1] pb-3 mb-4">
            <span className="text-xs font-semibold text-[#c45524]">Routine</span>
            <h2 className="text-base font-bold text-[#1a2639]">Preferred Court Availability</h2>
          </div>

          <div className="space-y-3">
            {[
              { days: "Monday – Thursday", hours: "5:00 PM – 8:00 PM", status: "Post-Lectures" },
              { days: "Friday", hours: "4:00 PM – 9:00 PM", status: "Open Run Night" },
              {
                days: "Saturday & Sunday",
                hours: "7:00 AM – 11:00 AM",
                status: "Morning Sessions",
              },
            ].map((slot, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 bg-[#f5f4ef] border border-[#ded9cd]"
              >
                <div>
                  <p className="text-xs font-bold text-[#1a2639]">{slot.days}</p>
                  <p className="text-[11px] text-[#636a77]">{slot.hours}</p>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#fdf3ee] text-[#c45524] border border-[#f5dbcf]">
                  {slot.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3.5 border-t border-[#eeeae1] flex items-center justify-between text-xs text-[#636a77]">
            <span>Need to update training schedule?</span>
            <button
              onClick={() => setShowEditModal(true)}
              className="text-xs font-semibold text-[#1a2639] hover:text-[#c45524] transition-colors underline"
            >
              Edit Availability
            </button>
          </div>
        </div>
      </div>

      {/* 4. Earned Campus Badges */}
      <div className="bg-white border border-[#ded9cd] p-6 sm:p-7 shadow-xs">
        <div className="border-b border-[#eeeae1] pb-3 mb-4">
          <span className="text-xs font-semibold text-[#c45524]">Milestones</span>
          <h2 className="text-base font-bold text-[#1a2639]">Earned Campus Badges</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 text-center border flex flex-col items-center justify-center transition-all ${
                badge.earned
                  ? "bg-[#f5f4ef] border-[#1a2639] text-[#1a2639]"
                  : "bg-white border-dashed border-[#ded9cd] text-[#8c94a0] opacity-60"
              }`}
            >
              <div
                className={`h-8 w-8 flex items-center justify-center mb-2 ${
                  badge.earned ? "bg-[#1a2639] text-white" : "bg-[#ebe7df] text-[#8c94a0]"
                }`}
              >
                <Award className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold line-clamp-1">{badge.name}</p>
              <p className="text-[10px] text-[#636a77] mt-0.5 line-clamp-2">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Shared MyBookings (Required by rule in AGENTS.md) */}
      <MyBookings />

      {/* MODAL: Edit Profile Information */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white border border-[#ded9cd] border-t-4 border-t-[#c45524] shadow-2xl p-6 sm:p-8 animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eeeae1] pb-3 mb-4">
              <div>
                <span className="text-xs font-semibold text-[#c45524]">Account Settings</span>
                <h3 className="text-lg font-bold text-[#1a2639]">Edit Student Information</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-[#636a77] hover:text-[#1a2639]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4b5260] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">
                    Campus Complex
                  </label>
                  <select
                    value={editCampus}
                    onChange={(e) => setEditCampus(e.target.value as Campus)}
                    className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
                  >
                    {CAMPUSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">
                    Athletic Skill Level
                  </label>
                  <select
                    value={editSkill}
                    onChange={(e) => setEditSkill(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4b5260] mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4b5260] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4b5260] mb-1.5">
                  Preferred Disciplines
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPORTS.map((s) => {
                    const active = editSports.includes(s.id);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => toggleSport(s.id)}
                        className={`px-3 py-1 text-xs border transition-colors ${
                          active
                            ? "bg-[#1a2639] text-white border-[#1a2639] font-medium"
                            : "bg-[#f5f4ef] text-[#4b5260] border-[#ded9cd] hover:bg-white"
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#eeeae1]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs text-[#636a77] hover:text-[#1a2639]"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="bg-[#c45524] hover:bg-[#b04a1d] text-white text-xs font-semibold px-5 py-2"
                >
                  Save Information
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Change Password */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="w-full max-w-md bg-white border border-[#ded9cd] border-t-4 border-t-[#1a2639] shadow-2xl p-6 sm:p-8 animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eeeae1] pb-3 mb-4">
              <div>
                <span className="text-xs font-semibold text-[#c45524]">Encrypted Security</span>
                <h3 className="text-lg font-bold text-[#1a2639]">Change Password</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 text-[#636a77] hover:text-[#1a2639]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4b5260] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4b5260] mb-1">
                  New Password (PBKDF2-SHA512 Encrypted)
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new secure password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4b5260] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new secure password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f5f4ef] border border-[#ded9cd] outline-none focus:border-[#1a2639] text-[#1a2639]"
                />
              </div>

              {passwordError && (
                <div className="border border-[#f5c6cb] bg-[#fdf2f1] px-3 py-2 text-xs text-[#b94236]">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="border border-[#c3e6cb] bg-[#d4edda] px-3 py-2 text-xs text-[#155724]">
                  {passwordSuccess}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#eeeae1]">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-xs text-[#636a77] hover:text-[#1a2639]"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="bg-[#1a2639] hover:bg-[#25364e] text-white text-xs font-semibold px-5 py-2"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

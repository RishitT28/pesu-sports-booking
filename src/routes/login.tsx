import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Lock,
  MapPin,
  School,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { BookWordmark, CollegeLogo } from "@/components/CollegeLogo";
import { type CollegeId, COLLEGES, type CollegeConfig } from "@/lib/college-theme";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "BookQuick — Select College & Authenticate" },
      {
        name: "description",
        content:
          "Select your university or college to enter the official athletic court reservation portal.",
      },
      { property: "og:title", content: "BookQuick — Select College & Authenticate" },
      {
        property: "og:description",
        content:
          "Official multi-university sports facilities booking portal for Karnataka institutions.",
      },
    ],
  }),
  component: LoginPage,
});

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register, college, collegeId, setCollegeId } = useApp();

  // Two-step flow: 1. Select College -> 2. Themed College Login / Register
  const [step, setStep] = useState<"select-college" | "credentials">("select-college");
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form states
  const [srn, setSrn] = useState(college.studentIdPlaceholder);
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Register form state
  const [regSrn, setRegSrn] = useState("");
  const [regPrn, setRegPrn] = useState("");
  const [regName, setRegName] = useState("");
  const [regCampus, setRegCampus] = useState(college.campuses[0] || "Main Campus");
  const [regDept, setRegDept] = useState("Computer Science & Engineering");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPass, setRegConfirmPass] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // College list for selection
  const collegeList = Object.values(COLLEGES);

  // When user selects a college in Step 1
  const handleChooseCollege = (id: CollegeId) => {
    setCollegeId(id);
    const newCfg = COLLEGES[id];
    if (newCfg) {
      setSrn(newCfg.studentIdPlaceholder);
      setPassword("password123");
      setRegCampus(newCfg.campuses[0] || "Main Campus");
      setRegSrn("");
      setError("");
      setSuccessMsg("");
    }
    setStep("credentials");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!srn.trim() || !password.trim()) {
      setError(`Please enter your valid ${college.studentIdLabel} and password.`);
      return;
    }

    setLoading(true);
    try {
      const res = await login(srn.trim(), password);
      if (res.success) {
        setSuccessMsg(`Authenticated for ${college.name}. Entering portal...`);
        setTimeout(() => {
          navigate({ to: "/" });
        }, 400);
      } else {
        setError(res.error || "Authentication failed. Please verify credentials.");
      }
    } catch {
      setError("Unable to connect to authentication server. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!regSrn.trim() || !regName.trim() || !regPassword.trim()) {
      setError(`Please enter your ${college.studentIdLabel}, full name, and chosen password.`);
      return;
    }

    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (regPassword !== regConfirmPass) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        srn: regSrn.trim(),
        ...(regPrn.trim() ? { prn: regPrn.trim() } : {}),
        name: regName.trim().split(" ")[0] || regName.trim(),
        fullName: regName.trim(),
        campus: regCampus,
        department: regDept,
        password: regPassword,
      });

      if (res.success) {
        setSuccessMsg(`Account registered for ${college.name}! Redirecting...`);
        setTimeout(() => {
          navigate({ to: "/" });
        }, 600);
      } else {
        setError(res.error || "Registration could not be completed.");
      }
    } catch {
      setError("Unable to connect to authentication server. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setSrn(college.studentIdPlaceholder);
    setPassword("password123");
    setError("");
  };

  const handleFillSuperuser = () => {
    setSrn("admin123");
    setPassword("admin123");
    setError("");
  };

  // =========================================================================
  // STEP 1: Select College
  // =========================================================================
  if (step === "select-college") {
    return (
      <div className="min-h-screen bg-[#f8f7f4] text-gray-900 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <BookWordmark size="xl" className="text-gray-950" underscoreColor="#ea580c" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
              <School className="h-3.5 w-3.5 text-amber-700" />
              <span>Multi-University Athletic Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">
              Select Your Institution
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Choose your university or college to access turnstile athletic clearance, check live court
              schedules, and join open campus sports squads.
            </p>
          </div>

          {/* College Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {collegeList.map((col: CollegeConfig) => {
              return (
                <div
                  key={col.id}
                  onClick={() => handleChooseCollege(col.id)}
                  className="group relative bg-white border border-gray-200 hover:border-gray-400 p-5 rounded-xl shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                  style={{
                    borderTopWidth: "4px",
                    borderTopColor: col.colors.primary,
                  }}
                >
                  <div className="space-y-4">
                    {/* Top row with Emblem & Short name */}
                    <div className="flex items-start justify-between gap-3">
                      <CollegeLogo collegeId={col.id} showText={false} className="h-10 w-10 shrink-0" />
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${col.colors.primary}18`,
                          color: col.colors.primary,
                        }}
                      >
                        {col.shortName}
                      </span>
                    </div>

                    {/* College Title & Tagline */}
                    <div>
                      <h2 className="text-base font-bold text-gray-950 group-hover:text-amber-800 transition-colors leading-snug">
                        {col.name}
                      </h2>
                      <p className="text-[11px] text-gray-500 font-medium mt-1 line-clamp-2">
                        {col.tagline}
                      </p>
                    </div>

                    {/* Campus tags */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{col.location}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono flex items-center justify-between">
                        <span>{col.campuses.length} Campuses</span>
                        <span>{col.established}</span>
                      </div>
                    </div>

                    {/* Credential ID info */}
                    <div className="bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200 text-[11px] flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Auth ID:</span>
                      <span className="font-bold text-gray-800">{col.studentIdLabel}</span>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold group-hover:underline" style={{ color: col.colors.primary }}>
                    <span>Enter {col.shortName} Portal</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Locked Notice footer */}
          <div className="max-w-xl mx-auto p-4 bg-white border border-gray-200 rounded-lg text-center space-y-1 text-xs text-gray-500 shadow-xs">
            <div className="flex items-center justify-center gap-1.5 font-semibold text-gray-800">
              <Lock className="h-3.5 w-3.5 text-amber-600" />
              <span>Session Isolation & Institutional Locking</span>
            </div>
            <p>
              Once you select a college and sign in, your session is strictly locked to that institution.
              To switch colleges, simply click <strong>Sign Out</strong> at any time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 2: Themed College Login / Register
  // =========================================================================
  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 py-12 transition-colors duration-300 ${college.fontClass}`}
      style={{ backgroundColor: college.colors.pageBg }}
    >
      <div
        className="w-full max-w-xl bg-white border shadow-2xl p-6 sm:p-8 transition-all duration-300"
        style={{
          borderColor: college.colors.border,
          borderTopWidth: "6px",
          borderTopColor: college.colors.primary,
        }}
      >
        {/* Back button to change college before signing in */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <button
            type="button"
            onClick={() => {
              setStep("select-college");
              setError("");
              setSuccessMsg("");
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Choose Different Institution</span>
          </button>

          <span className="text-[11px] font-mono text-gray-400">Step 2 of 2</span>
        </div>

        {/* Brand & College Header */}
        <div className="flex flex-col items-center text-center pt-5 pb-6 border-b" style={{ borderColor: college.colors.border }}>
          <div className="flex items-center gap-2 mb-2">
            <BookWordmark size="lg" className="text-gray-950" underscoreColor={college.colors.primary} />
          </div>

          <CollegeLogo collegeId={collegeId} inverted={false} />

          <div className="mt-3">
            <span
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded inline-block"
              style={{
                backgroundColor: `${college.colors.primary}18`,
                color: college.colors.primary,
              }}
            >
              {college.shortName} · Sports Directorate Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
              {mode === "login" ? "Student Sign In" : "Register Athletic Clearance"}
            </h1>
          </div>
          <p className="mt-1 text-xs text-gray-500 max-w-md">
            {mode === "login"
              ? `Sign in with your official ${college.name} credentials to reserve courts and access squad coordination.`
              : `Register your student ID for sports turnstile clearance across ${college.shortName} campuses.`}
          </p>

          {/* Session Lock Reminder */}
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] rounded-md font-medium text-left">
            <Lock className="h-3.5 w-3.5 text-amber-700 shrink-0" />
            <span>
              Institution Locked: Signing in binds your account strictly to <strong>{college.shortName}</strong> until you sign out.
            </span>
          </div>

          {/* Toggle between Sign In and Register */}
          <div
            className="mt-5 grid grid-cols-2 w-full max-w-xs p-1 text-xs font-semibold rounded-md border"
            style={{
              backgroundColor: college.colors.pageBg,
              borderColor: college.colors.border,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`py-1.5 transition-all cursor-pointer ${college.buttonStyle.radiusClass} ${
                mode === "login"
                  ? "text-white font-bold shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              style={{
                backgroundColor: mode === "login" ? college.colors.secondary : "transparent",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`py-1.5 transition-all cursor-pointer ${college.buttonStyle.radiusClass} ${
                mode === "register"
                  ? "text-white font-bold shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              style={{
                backgroundColor: mode === "register" ? college.colors.secondary : "transparent",
              }}
            >
              New Student
            </button>
          </div>
        </div>

        {/* Login Form Mode */}
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="srn" className="text-xs font-bold text-gray-700 block">
                {college.studentIdLabel} *
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="srn"
                  type="text"
                  value={srn}
                  onChange={(e) => setSrn(e.target.value)}
                  placeholder={`e.g. ${college.studentIdPlaceholder}`}
                  autoComplete="username"
                  className={`w-full border bg-gray-50/60 py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:bg-white ${college.buttonStyle.radiusClass}`}
                  style={{ borderColor: college.colors.border }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold text-gray-700 block">
                  Password *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="text-[11px] font-semibold hover:underline cursor-pointer"
                    style={{ color: college.colors.primary }}
                  >
                    Demo Student
                  </button>
                  <span className="text-gray-300 text-xs">·</span>
                  <button
                    type="button"
                    onClick={handleFillSuperuser}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-900 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3 text-amber-600" />
                    <span>Superuser</span>
                  </button>
                </div>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full border bg-gray-50/60 py-2.5 pl-9 pr-10 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:bg-white ${college.buttonStyle.radiusClass}`}
                  style={{ borderColor: college.colors.border }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 flex items-center gap-2 rounded-md">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 flex items-center gap-2 rounded-md">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${college.buttonStyle.radiusClass} ${college.buttonStyle.primaryClass} ${college.buttonStyle.extraClass}`}
            >
              {loading ? (
                `Authenticating with ${college.shortName}...`
              ) : (
                <>
                  <span>Sign In & Enter {college.shortName}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>

            {/* Demo & Superuser Credentials Box */}
            <div
              className="border p-3.5 text-xs text-gray-600 rounded-md space-y-3"
              style={{
                backgroundColor: college.colors.pageBg,
                borderColor: college.colors.border,
              }}
            >
              <div>
                <div className="flex items-center justify-between font-bold text-gray-900 mb-1">
                  <span>{college.shortName} Student Demo:</span>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="text-[10px] bg-black/10 hover:bg-black/15 px-2 py-0.5 rounded font-mono font-bold cursor-pointer transition-colors"
                  >
                    Quick Fill
                  </button>
                </div>
                <p className="font-mono text-[11px] text-gray-700">
                  {college.studentIdLabel}:{" "}
                  <span className="font-bold text-gray-900">{college.studentIdPlaceholder}</span>
                  {" · "}
                  Password: <span className="font-bold text-gray-900">password123</span>
                </p>
              </div>

              <div className="pt-2.5 border-t border-gray-200/80">
                <div className="flex items-center justify-between font-bold text-amber-900 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    Universal Superuser Clearance:
                  </span>
                  <button
                    type="button"
                    onClick={handleFillSuperuser}
                    className="text-[10px] bg-amber-600 text-white hover:bg-amber-700 px-2 py-0.5 rounded font-mono font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    Fill Superuser
                  </button>
                </div>
                <p className="font-mono text-[11px] text-amber-900">
                  ID: <span className="font-bold text-gray-950">admin123</span>
                  {" · "}
                  Password: <span className="font-bold text-gray-950">admin123</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Universal superuser valid across PESU, Jain, Christ, Amrita, MSRIT, Manipal, RVCE & BMS.
                </p>
              </div>
            </div>
          </form>
        ) : (
          /* Register Form Mode */
          <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-3.5">
            <div className="space-y-1">
              <label htmlFor="regSrn" className="text-xs font-bold text-gray-700 block">
                {college.studentIdLabel} *
              </label>
              <input
                id="regSrn"
                type="text"
                value={regSrn}
                onChange={(e) => setRegSrn(e.target.value)}
                placeholder={`e.g. ${college.studentIdPlaceholder}`}
                className={`w-full border bg-gray-50/60 py-2 px-3 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:bg-white ${college.buttonStyle.radiusClass}`}
                style={{ borderColor: college.colors.border }}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="regName" className="text-xs font-bold text-gray-700 block">
                Full Student Name *
              </label>
              <input
                id="regName"
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Rohan Varma"
                className={`w-full border bg-gray-50/60 py-2 px-3 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:bg-white ${college.buttonStyle.radiusClass}`}
                style={{ borderColor: college.colors.border }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="regPrn" className="text-xs font-bold text-gray-700 block">
                  Secondary / Roll ID
                </label>
                <input
                  id="regPrn"
                  type="text"
                  value={regPrn}
                  onChange={(e) => setRegPrn(e.target.value)}
                  placeholder="Optional"
                  className={`w-full border bg-gray-50/60 py-2 px-3 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:bg-white ${college.buttonStyle.radiusClass}`}
                  style={{ borderColor: college.colors.border }}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="regCampus" className="text-xs font-bold text-gray-700 block">
                  Campus / Facility Hub *
                </label>
                <select
                  id="regCampus"
                  value={regCampus}
                  onChange={(e) => setRegCampus(e.target.value)}
                  className={`w-full border bg-gray-50/60 py-2 px-2 text-xs text-gray-900 outline-none focus:bg-white ${college.buttonStyle.radiusClass}`}
                  style={{ borderColor: college.colors.border }}
                >
                  {college.campuses.map((camp) => (
                    <option key={camp} value={camp}>
                      {camp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="regDept" className="text-xs font-bold text-gray-700 block">
                Department / Engineering Branch
              </label>
              <input
                id="regDept"
                type="text"
                value={regDept}
                onChange={(e) => setRegDept(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className={`w-full border bg-gray-50/60 py-2 px-3 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:bg-white ${college.buttonStyle.radiusClass}`}
                style={{ borderColor: college.colors.border }}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="regPassword" className="text-xs font-bold text-gray-700 block">
                Create Secure Password (min 6 chars) *
              </label>
              <div className="relative">
                <input
                  id="regPassword"
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Enter password"
                  className={`w-full border bg-gray-50/60 py-2 pl-3 pr-10 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:bg-white ${college.buttonStyle.radiusClass}`}
                  style={{ borderColor: college.colors.border }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="regConfirmPass" className="text-xs font-bold text-gray-700 block">
                Confirm Password *
              </label>
              <input
                id="regConfirmPass"
                type="password"
                value={regConfirmPass}
                onChange={(e) => setRegConfirmPass(e.target.value)}
                placeholder="Re-enter password"
                className={`w-full border bg-gray-50/60 py-2 px-3 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:bg-white ${college.buttonStyle.radiusClass}`}
                style={{ borderColor: college.colors.border }}
              />
            </div>

            {error && (
              <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 flex items-center gap-2 rounded-md">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 flex items-center gap-2 rounded-md">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${college.buttonStyle.radiusClass} ${college.buttonStyle.secondaryClass} ${college.buttonStyle.extraClass}`}
            >
              {loading ? (
                `Registering with ${college.shortName}...`
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register & Clear Sports Pass</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security badge and Help */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs text-gray-500" style={{ borderColor: college.colors.border }}>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
            <span>NIST PBKDF2-SHA512 Vault</span>
          </div>
          <Link to="/help" className="flex items-center gap-1 font-semibold hover:underline" style={{ color: college.colors.primary }}>
            <HelpCircle className="h-3 w-3" />
            <span>Help Desk</span>
          </Link>
        </div>

        <div className="mt-4 text-center text-[11px] text-gray-400 space-y-0.5">
          <p className="font-bold text-gray-700">{college.name} · {college.tagline}</p>
          <p className="font-mono">{college.location} · {college.established}</p>
        </div>
      </div>
    </div>
  );
}

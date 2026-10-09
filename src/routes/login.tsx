import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Lock,
  MapPin,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { PESLogo } from "@/components/PESLogo";
import { Button } from "@/components/ui/button";
import { type Campus } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "PESU Sports — Student Portal Authentication" },
      {
        name: "description",
        content:
          "Sign in with your PES University credentials to access athletic facilities and court bookings.",
      },
      { property: "og:title", content: "PESU Sports — Student Portal Authentication" },
      {
        property: "og:description",
        content:
          "Sign in with your PES University credentials to access athletic facilities and court bookings.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useApp();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [srn, setSrn] = useState("PES1UG21CS123");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Register form state
  const [regSrn, setRegSrn] = useState("");
  const [regPrn, setRegPrn] = useState("");
  const [regName, setRegName] = useState("");
  const [regCampus, setRegCampus] = useState<Campus>("RR Campus");
  const [regDept, setRegDept] = useState("Computer Science & Engineering");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPass, setRegConfirmPass] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!srn.trim() || !password.trim()) {
      setError("Please provide a valid SRN or PRN and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(srn.trim(), password);
      if (res.success) {
        setSuccessMsg("Authentication verified. Redirecting to sports dashboard...");
        setTimeout(() => {
          navigate({ to: "/" });
        }, 500);
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
      setError("Please enter your SRN, full name, and chosen password.");
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
        prn: regPrn.trim() || undefined,
        name: regName.trim().split(" ")[0] || regName.trim(),
        fullName: regName.trim(),
        campus: regCampus,
        department: regDept,
        password: regPassword,
      });

      if (res.success) {
        setSuccessMsg("Account registered with encrypted credentials! Redirecting...");
        setTimeout(() => {
          navigate({ to: "/" });
        }, 800);
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
    setSrn("PES1UG21CS123");
    setPassword("password123");
    setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef] px-4 py-12 font-serif">
      <div className="w-full max-w-lg bg-white border border-[#ded9cd] border-t-4 border-t-[#1a2639] shadow-xl p-6 sm:p-8">
        {/* PESU Sports Header */}
        <div className="flex flex-col items-center text-center border-b border-[#eeeae1] pb-6">
          <PESLogo />
          <div className="mt-4">
            <span className="text-xs font-semibold text-[#c45524]">Athletics Clearance System</span>
            <h1 className="text-xl font-bold text-[#1a2639] mt-0.5">
              {mode === "login" ? "Student Sign In" : "Register Student Clearance"}
            </h1>
          </div>
          <p className="mt-1 text-xs text-[#636a77]">
            {mode === "login"
              ? "Sign in with your official PESU credentials to access facilities, squads, and passes."
              : "Register your student credentials to gain athletic access across RR and EC campuses."}
          </p>

          {/* Toggle between Sign In and Register */}
          <div className="mt-5 grid grid-cols-2 w-full max-w-xs border border-[#ded9cd] bg-[#f5f4ef] p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`py-1.5 transition-colors ${
                mode === "login"
                  ? "bg-[#1a2639] text-white shadow-xs"
                  : "text-[#636a77] hover:text-[#1a2639]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`py-1.5 transition-colors ${
                mode === "register"
                  ? "bg-[#1a2639] text-white shadow-xs"
                  : "text-[#636a77] hover:text-[#1a2639]"
              }`}
            >
              New Student
            </button>
          </div>
        </div>

        {/* Login Mode */}
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="srn" className="text-xs font-semibold text-[#4b5260] block">
                SRN / PRN / Roll Number
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c94a0]" />
                <input
                  id="srn"
                  type="text"
                  value={srn}
                  onChange={(e) => setSrn(e.target.value)}
                  placeholder="e.g. PES1UG21CS123"
                  autoComplete="username"
                  className="w-full border border-[#ded9cd] bg-[#f5f4ef] py-2 pl-9 pr-3 text-xs text-[#1a2639] placeholder:text-[#8c94a0] outline-none transition-colors focus:border-[#1a2639] focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-[#4b5260] block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[11px] text-[#c45524] hover:underline"
                >
                  Use Demo Account
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c94a0]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full border border-[#ded9cd] bg-[#f5f4ef] py-2 pl-9 pr-10 text-xs text-[#1a2639] placeholder:text-[#8c94a0] outline-none transition-colors focus:border-[#1a2639] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c94a0] hover:text-[#4b5260]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="border border-[#f5c6cb] bg-[#fdf2f1] px-3 py-2 text-xs text-[#b94236] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="border border-[#b7eb8f] bg-[#f6ffed] px-3 py-2 text-xs text-[#389e0d] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c45524] hover:bg-[#b04a1d] py-2.5 text-xs font-bold text-white shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                "Authenticating with PESU Registry..."
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>

            {/* Demo Credential Pill */}
            <div className="border border-[#e7e3d8] bg-[#faf9f6] p-3 text-xs text-[#4b5260]">
              <div className="flex items-center justify-between font-semibold text-[#1a2639] mb-1">
                <span>Default Demo Credentials:</span>
                <span className="text-[10px] bg-[#1a2639]/10 px-1.5 py-0.5 rounded text-[#1a2639]">
                  Pre-configured
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#636a77]">
                SRN: <span className="text-[#1a2639] font-bold">PES1UG21CS123</span>
              </p>
              <p className="font-mono text-[11px] text-[#636a77]">
                Password: <span className="text-[#1a2639] font-bold">password123</span>
              </p>
            </div>
          </form>
        ) : (
          /* Register Mode */
          <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-3.5">
            <div className="space-y-1">
              <label htmlFor="regSrn" className="text-xs font-semibold text-[#4b5260] block">
                SRN / Student Roll Number *
              </label>
              <input
                id="regSrn"
                type="text"
                value={regSrn}
                onChange={(e) => setRegSrn(e.target.value)}
                placeholder="e.g. PES1UG22CS456"
                className="w-full border border-[#ded9cd] bg-[#f5f4ef] py-2 px-3 text-xs text-[#1a2639] placeholder:text-[#8c94a0] outline-none transition-colors focus:border-[#1a2639] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="regName" className="text-xs font-semibold text-[#4b5260] block">
                Full Student Name *
              </label>
              <input
                id="regName"
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Arjun Sharma"
                className="w-full border border-[#ded9cd] bg-[#f5f4ef] py-2 px-3 text-xs text-[#1a2639] placeholder:text-[#8c94a0] outline-none transition-colors focus:border-[#1a2639] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="regPrn" className="text-xs font-semibold text-[#4b5260] block">
                  PRN (Optional)
                </label>
                <input
                  id="regPrn"
                  type="text"
                  value={regPrn}
                  onChange={(e) => setRegPrn(e.target.value)}
                  placeholder="PES202200890"
                  className="w-full border border-[#ded9cd] bg-[#f5f4ef] py-2 px-3 text-xs text-[#1a2639] placeholder:text-[#8c94a0] outline-none transition-colors focus:border-[#1a2639] focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="regCampus" className="text-xs font-semibold text-[#4b5260] block">
                  Campus *
                </label>
                <select
                  id="regCampus"
                  value={regCampus}
                  onChange={(e) => setRegCampus(e.target.value as Campus)}
                  className="w-full border border-[#ded9cd] bg-[#f5f4ef] py-2 px-2 text-xs text-[#1a2639] outline-none focus:border-[#1a2639] focus:bg-white"
                >
                  <option value="RR Campus">RR Campus</option>
                  <option value="EC Campus">EC Campus</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="regDept" className="text-xs font-semibold text-[#4b5260] block">
                Department / Program
              </label>
              <input
                id="regDept"
                type="text"
                value={regDept}
                onChange={(e) => setRegDept(e.target.value)}
                placeholder="e.g. Mechanical Engineering"
                className="w-full border border-[#ded9cd] bg-[#f5f4ef] py-2 px-3 text-xs text-[#1a2639] placeholder:text-[#8c94a0] outline-none transition-colors focus:border-[#1a2639] focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="regPassword" className="text-xs font-semibold text-[#4b5260] block">
                Create Secure Password (min 6 chars) *
              </label>
              <div className="relative">
                <input
                  id="regPassword"
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border border-[#ded9cd] bg-[#f5f4ef] py-2 pl-3 pr-10 text-xs text-[#1a2639] placeholder:text-[#8c94a0] outline-none transition-colors focus:border-[#1a2639] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c94a0] hover:text-[#4b5260]"
                >
                  {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="regConfirmPass"
                className="text-xs font-semibold text-[#4b5260] block"
              >
                Confirm Password *
              </label>
              <input
                id="regConfirmPass"
                type="password"
                value={regConfirmPass}
                onChange={(e) => setRegConfirmPass(e.target.value)}
                placeholder="Re-enter password"
                className="w-full border border-[#ded9cd] bg-[#f5f4ef] py-2 px-3 text-xs text-[#1a2639] placeholder:text-[#8c94a0] outline-none transition-colors focus:border-[#1a2639] focus:bg-white"
              />
            </div>

            {error && (
              <div className="border border-[#f5c6cb] bg-[#fdf2f1] px-3 py-2 text-xs text-[#b94236] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="border border-[#b7eb8f] bg-[#f6ffed] px-3 py-2 text-xs text-[#389e0d] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a2639] hover:bg-[#253752] py-2.5 text-xs font-bold text-white shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                "Creating Encrypted Credential..."
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register & Clear Sports Pass</span>
                </>
              )}
            </Button>
          </form>
        )}

        {/* Security badge and campus notice */}
        <div className="mt-6 pt-4 border-t border-[#eeeae1] flex items-center justify-between text-xs text-[#636a77]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
            <span>PBKDF2-SHA512 Encrypted</span>
          </div>
          <Link to="/help" className="flex items-center gap-1 text-[#c45524] hover:underline">
            <HelpCircle className="h-3 w-3" />
            <span>Help Desk</span>
          </Link>
        </div>

        <div className="mt-4 text-center text-[11px] text-[#8c94a0] space-y-1 font-mono">
          <p>PES University · Department of Physical Education</p>
          <p>RR Campus (Ring Road) & EC Campus (Electronic City)</p>
        </div>
      </div>
    </div>
  );
}

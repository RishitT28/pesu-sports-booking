import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { PESLogo } from "@/components/PESLogo";
import { Button } from "@/components/ui/button";

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
  const [srn, setSrn] = useState("PES1UG21CS123");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srn.trim() || !password.trim()) {
      setError("Please provide a valid SRN or PRN and password.");
      return;
    }
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f8fa] px-4 py-12 font-sans">
      <div className="w-full max-w-md bg-white border border-[#e5e7eb] border-t-4 border-t-[#0d1b2a] shadow-xl p-6 sm:p-8 rounded-none">
        {/* PESU Sports Header */}
        <div className="flex flex-col items-center text-center border-b border-[#f1f3f6] pb-6">
          <PESLogo />
          <div className="mt-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e35925]">
              Athletics Clearance System
            </span>
            <h1 className="text-xl font-black uppercase tracking-tight text-[#111827] mt-0.5">
              Student Sign In
            </h1>
          </div>
          <p className="mt-1 text-xs text-[#64748b]">
            Use your official PESU Academy credentials to access courts and squads.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="srn"
              className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block"
            >
              SRN / PRN / Roll Number
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <input
                id="srn"
                type="text"
                value={srn}
                onChange={(e) => setSrn(e.target.value)}
                placeholder="e.g. PES1UG21CS123"
                autoComplete="username"
                className="w-full rounded-none border border-[#e5e7eb] bg-[#f8f8fa] py-2 pl-9 pr-3 text-xs text-[#111827] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#0d1b2a] focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full rounded-none border border-[#e5e7eb] bg-[#f8f8fa] py-2 pl-9 pr-10 text-xs text-[#111827] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#0d1b2a] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs text-[#b91c1c] rounded-none">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-none bg-[#e35925] hover:bg-[#c84a1b] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-colors"
          >
            Authenticate & Enter
          </Button>
        </form>

        {/* Security badge and campus notice */}
        <div className="mt-6 pt-4 border-t border-[#f1f3f6] flex items-center justify-center gap-2 text-[10px] text-[#64748b]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
          <span>PESU Single Sign-On SSO Protected</span>
        </div>

        <div className="mt-4 text-center text-[10px] text-[#94a3b8] space-y-1 font-mono">
          <p>PES University · Department of Physical Education</p>
          <p>RR Campus (Ring Road) & EC Campus (Electronic City)</p>
        </div>
      </div>
    </div>
  );
}

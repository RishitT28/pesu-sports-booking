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
    <div className="flex min-h-screen items-center justify-center bg-[#f5f4ef] px-4 py-12 font-serif">
      <div className="w-full max-w-md bg-white border border-[#ded9cd] border-t-4 border-t-[#1a2639] shadow-xl p-6 sm:p-8">
        {/* PESU Sports Header */}
        <div className="flex flex-col items-center text-center border-b border-[#eeeae1] pb-6">
          <PESLogo />
          <div className="mt-4">
            <span className="text-xs font-semibold text-[#c45524]">Athletics Clearance System</span>
            <h1 className="text-xl font-bold text-[#1a2639] mt-0.5">Student Sign In</h1>
          </div>
          <p className="mt-1 text-xs text-[#636a77]">
            Use your official PESU credentials to access facilities, squads, and passes.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            <label htmlFor="password" className="text-xs font-semibold text-[#4b5260] block">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c94a0]" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
            <div className="border border-[#f5c6cb] bg-[#fdf2f1] px-3 py-2 text-xs text-[#b94236]">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#c45524] hover:bg-[#b04a1d] py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
          >
            Authenticate & Enter
          </Button>
        </form>

        {/* Security badge and campus notice */}
        <div className="mt-6 pt-4 border-t border-[#eeeae1] flex items-center justify-center gap-2 text-xs text-[#636a77]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
          <span>PESU Single Sign-On (SSO) Protected</span>
        </div>

        <div className="mt-4 text-center text-[11px] text-[#8c94a0] space-y-1 font-mono">
          <p>PES University · Department of Physical Education</p>
          <p>RR Campus (Ring Road) & EC Campus (Electronic City)</p>
        </div>
      </div>
    </div>
  );
}

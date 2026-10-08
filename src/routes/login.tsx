import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";
import { PESLogo } from "@/components/PESLogo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "PES University — Student Portal Login" },
      {
        name: "description",
        content:
          "Sign in with your PESU student credentials to access the sports facilities booking portal.",
      },
      { property: "og:title", content: "PES University — Student Portal Login" },
      {
        property: "og:description",
        content:
          "Sign in with your PESU student credentials to access the sports facilities booking portal.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [srn, setSrn] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srn.trim() || !password.trim()) {
      setError("Please enter your SRN / PRN and password.");
      return;
    }
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f3f6] px-4 py-10 font-sans">
      <div className="w-full max-w-md bg-white border border-[#cbd5e1] rounded-none shadow-md p-6 sm:p-8">
        {/* PES University Header */}
        <div className="flex flex-col items-center text-center border-b border-[#e2e8f0] pb-6">
          <PESLogo />
          <h1 className="mt-4 text-base font-bold uppercase tracking-wider text-[#084d7a]">
            Student Portal Authentication
          </h1>
          <p className="mt-1 text-xs text-[#64748b]">
            Department of Physical Education & Sports Booking
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="srn"
              className="text-xs font-bold text-[#475569] uppercase tracking-wide"
            >
              SRN / PRN / Roll No
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
                className="w-full rounded-none border border-[#cbd5e1] bg-white py-2 pl-9 pr-3 text-xs text-[#1e293b] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#0080b0]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-bold text-[#475569] uppercase tracking-wide"
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
                placeholder="Enter PESU password"
                autoComplete="current-password"
                className="w-full rounded-none border border-[#cbd5e1] bg-white py-2 pl-9 pr-10 text-xs text-[#1e293b] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#0080b0]"
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

          <button
            type="submit"
            className="w-full rounded-none bg-[#0080b0] hover:bg-[#006f9c] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-colors"
          >
            Sign In to Portal
          </button>
        </form>

        {/* Footer info matching PESU Academy */}
        <div className="mt-6 pt-4 border-t border-[#e2e8f0] text-center text-[10px] text-[#94a3b8] space-y-1">
          <p>PES University, 100 Feet Ring Road, BSK III Stage, Bangalore - 560085</p>
          <p>For credentials support, contact IT Services or Physical Education Office.</p>
        </div>
      </div>
    </div>
  );
}

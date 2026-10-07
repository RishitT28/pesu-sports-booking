import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, IdCard, Lock, User } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — PES Play" },
      { name: "description", content: "Sign in with your PESU credentials to book courts and find players." },
      { property: "og:title", content: "Login — PES Play" },
      { property: "og:description", content: "Sign in with your PESU credentials to book courts and find players." },
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
      setError("Enter your SRN / PRN and password to continue.");
      return;
    }
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl border border-border bg-card shadow-lg">
            <IdCard className="h-9 w-9 text-foreground" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">LOGIN</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your PESU credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div className="space-y-2">
            <label htmlFor="srn" className="text-sm font-medium text-muted-foreground">
              SRN / PRN
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="srn"
                type="text"
                value={srn}
                onChange={(e) => setSrn(e.target.value)}
                placeholder="PES1UG21CS123"
                autoComplete="username"
                className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/15 px-4 py-2.5 text-sm text-danger-soft">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition-transform hover:brightness-110 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

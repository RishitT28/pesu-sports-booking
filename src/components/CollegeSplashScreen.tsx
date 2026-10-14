import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { BookWordmark, CollegeLogo } from "./CollegeLogo";
import type { CollegeConfig } from "@/lib/college-theme";

export function CollegeSplashScreen({
  college,
  onDismiss,
}: {
  college: CollegeConfig;
  onDismiss: () => void;
}) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 900);

    return () => clearInterval(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none overflow-hidden animate-in fade-in duration-200 ${college.fontClass}`}
      style={{ backgroundColor: `${college.colors.secondary}F2` }}
    >
      {/* Background Graphic Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]" />
      <div
        className="absolute top-0 left-0 w-full h-2"
        style={{ backgroundColor: college.colors.primary }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-2"
        style={{ backgroundColor: college.colors.accent || college.colors.primary }}
      />

      <div
        className={`relative max-w-lg w-full bg-white text-gray-950 p-6 sm:p-10 shadow-2xl border text-center animate-in zoom-in-95 duration-200 ${college.buttonStyle.radiusClass}`}
        style={{
          borderColor: college.colors.border,
          borderTopWidth: "6px",
          borderTopColor: college.colors.primary,
        }}
      >
        {/* Top Tag */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-5 rounded-full"
          style={{
            backgroundColor: `${college.colors.primary}18`,
            color: college.colors.primary,
          }}
        >
          <Zap className="h-3.5 w-3.5 fill-current" />
          <span>{college.shortName} · Turnstile Athletic Clearance Granted</span>
        </div>

        {/* Wordmark & Logo */}
        <div className="flex flex-col items-center justify-center gap-2 mb-4">
          <BookWordmark size="xl" className="text-gray-950" accentColor={college.colors.primary} />
          <CollegeLogo collegeId={college.id} inverted={false} className="scale-110 my-1" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950 mt-1">
          {college.name}
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest mt-1 text-gray-500">
          {college.tagline}
        </p>

        {/* Campus & Clearance Metrics */}
        <div
          className="my-6 py-3.5 px-4 rounded-lg border grid grid-cols-3 gap-2 text-center text-xs"
          style={{
            backgroundColor: college.colors.pageBg,
            borderColor: college.colors.border,
          }}
        >
          <div>
            <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">
              CAMPUSES
            </span>
            <span className="font-extrabold text-gray-900 font-mono">
              {college.campuses.length} Hubs
            </span>
          </div>
          <div className="border-x border-gray-200">
            <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">
              TURNSTILES
            </span>
            <span className="font-extrabold text-gray-900 font-mono">06:00 – 22:00</span>
          </div>
          <div>
            <span className="block text-gray-500 text-[10px] uppercase font-bold tracking-wider">
              STATUS
            </span>
            <span className="font-extrabold text-emerald-600 flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Live
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-6">
          <MapPin className="h-3.5 w-3.5 text-gray-400" />
          <span>{college.location} · {college.established}</span>
        </div>

        {/* Action Button */}
        <button
          onClick={onDismiss}
          className={`w-full py-3.5 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${college.buttonStyle.radiusClass} ${college.buttonStyle.primaryClass} ${college.buttonStyle.extraClass}`}
        >
          <span>Enter {college.shortName} Arena ({countdown}s)</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

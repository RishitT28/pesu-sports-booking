export function PESLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Sleek Minimalist Geometric Athlete Emblem */}
      <div className="relative flex items-center justify-center h-8 w-8 bg-[#0d1b2a] text-white">
        {/* Dulled athletic orange sideline mark */}
        <span className="absolute -left-1 top-1 bottom-1 w-1 bg-[#e35925]" />
        <span className="font-black text-sm tracking-tighter text-white font-sans">PES</span>
      </div>

      {/* Brand Typography in Helvetica */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-base tracking-tighter text-[#111827] uppercase">
            PESU
          </span>
          <span className="font-extrabold text-xs tracking-widest text-[#e35925] uppercase">
            SPORTS
          </span>
        </div>
        <span className="text-[9px] font-bold tracking-[0.25em] text-[#64748b] uppercase mt-0.5">
          ATHLETICS & FACILITIES
        </span>
      </div>
    </div>
  );
}

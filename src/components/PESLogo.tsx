export function PESLogo({
  className = "h-8",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 select-none font-serif ${className}`}>
      {/* Refined emblem with dull navy and warm orange accent */}
      <div className="relative flex items-center justify-center h-8 w-8 bg-[#c45524] text-white">
        <span className="absolute -left-1 top-1 bottom-1 w-1 bg-[#1a2639]" />
        <span className="font-bold text-sm tracking-normal text-white">PES</span>
      </div>

      {/* Brand Typography in Times New Roman */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold text-base ${inverted ? "text-white" : "text-[#1a2639]"}`}>
            PES University
          </span>
          <span className="font-semibold text-xs text-[#c45524]">Sports</span>
        </div>
        <span
          className={`text-[10px] font-normal ${inverted ? "text-[#b4bdcb]" : "text-[#636a77]"}`}
        >
          Athletics & Facilities
        </span>
      </div>
    </div>
  );
}

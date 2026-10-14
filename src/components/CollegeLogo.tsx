import { type CollegeId, COLLEGES } from "@/lib/college-theme";

export function BookWordmark({
  className = "",
  size = "md",
  underscoreColor,
  accentColor,
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  underscoreColor?: string;
  accentColor?: string;
}) {
  const sizeClasses = {
    sm: "text-lg tracking-tight",
    md: "text-2xl tracking-tighter",
    lg: "text-3xl tracking-tighter",
    xl: "text-4xl tracking-tighter",
  };

  const highlight = accentColor || underscoreColor || "currentColor";

  return (
    <div className={`inline-flex items-baseline font-black select-none font-sans ${sizeClasses[size]} ${className}`}>
      <span className="font-extrabold tracking-tight">Book</span>
      <span
        className="font-black inline-block ml-0.5 tracking-tight"
        style={{ color: highlight }}
      >
        Quick
      </span>
    </div>
  );
}

export function CollegeLogo({
  collegeId,
  className = "h-8",
  inverted = false,
  showText = true,
}: {
  collegeId: CollegeId;
  className?: string;
  inverted?: boolean;
  showText?: boolean;
}) {
  const config = COLLEGES[collegeId] || COLLEGES.pesu;

  // Render SVG Emblem based on college
  const renderEmblem = () => {
    switch (collegeId) {
      case "pesu":
        return (
          <div className="relative flex items-center justify-center h-8 w-8 bg-[#c45524] text-white shrink-0">
            <span className="absolute -left-1 top-1 bottom-1 w-1 bg-[#1a2639]" />
            <span className="font-bold text-xs tracking-tight text-white font-serif">PES</span>
          </div>
        );

      case "jain":
        return (
          <div className="relative flex items-center justify-center h-8 w-8 bg-[#003153] border-2 border-[#eab308] rounded-lg text-[#eab308] shrink-0 shadow-xs">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M12 2L4 7V13C4 17.5 7.4 21.6 12 22.8C16.6 21.6 20 17.5 20 13V7L12 2Z"
                fill="#003153"
                stroke="#eab308"
                strokeWidth="1.5"
              />
              <path d="M12 6L14 11H10L12 6Z" fill="#eab308" />
              <path d="M10 13H14V17H10V13Z" fill="#eab308" />
            </svg>
          </div>
        );

      case "christ":
        return (
          <div className="relative flex items-center justify-center h-8 w-8 bg-[#0c2340] border border-white/30 rounded-md text-white shrink-0 shadow-md">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
              <path d="M12 4V20M4 10H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="7" r="1" fill="#60a5fa" />
              <circle cx="16" cy="7" r="1" fill="#60a5fa" />
              <circle cx="8" cy="15" r="1" fill="#60a5fa" />
              <circle cx="16" cy="15" r="1" fill="#60a5fa" />
            </svg>
          </div>
        );

      case "amrita":
        return (
          <div className="relative flex items-center justify-center h-8 w-8 bg-[#960018] border border-[#f59e0b] rounded-sm text-white shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              {/* Sacred Lotus / Flame Motif */}
              <path
                d="M12 3C12 3 8 7 8 11C8 13.5 9.5 15.5 12 16C14.5 15.5 16 13.5 16 11C16 7 12 3 12 3Z"
                fill="#f59e0b"
              />
              <path
                d="M5 14C5 17 8 19 12 20C16 19 19 17 19 14C17 15 14 15.5 12 15.5C10 15.5 7 15 5 14Z"
                fill="#ffffff"
              />
              <circle cx="12" cy="11" r="1.5" fill="#960018" />
            </svg>
          </div>
        );

      case "msrit":
        return (
          <div className="relative flex items-center justify-center h-8 w-8 bg-[#1e2430] rounded-full text-white shrink-0 shadow-xs border-2 border-[#eab308]">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" stroke="#dc2626" strokeWidth="1.5" />
              <path d="M8 8L16 16M16 8L8 16" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2.5" fill="#dc2626" />
            </svg>
          </div>
        );

      case "manipal":
        return (
          <div className="relative flex items-center justify-center h-8 w-8 bg-[#e34234] border-2 border-black rounded-none text-white shrink-0">
            <span className="font-black text-[11px] tracking-tighter text-white font-sans">
              M.I.T
            </span>
          </div>
        );

      case "rvce":
        return (
          <div className="relative flex items-center justify-center h-8 w-8 bg-[#1e40af] border-2 border-[#dc2626] rounded-xl text-white shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M12 4L14 8H18L15 11L16 15L12 13L8 15L9 11L6 8H10L12 4Z"
                fill="#ffffff"
              />
              <circle cx="12" cy="12" r="8" stroke="#dc2626" strokeWidth="1.5" />
            </svg>
          </div>
        );

      case "bms":
        return (
          <div className="relative flex items-center justify-center h-8 w-8 bg-[#003153] border-2 border-[#eab308] rounded-none text-[#eab308] shrink-0 shadow-[2px_2px_0px_#0b1f4b]">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M4 20V8L12 4L20 8V20H15V13H9V20H4Z"
                fill="#eab308"
                stroke="#003153"
                strokeWidth="1"
              />
              <circle cx="12" cy="9" r="1.5" fill="#003153" />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {renderEmblem()}

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold text-sm sm:text-base ${
                inverted ? "text-white" : "text-[#1a2639]"
              }`}
            >
              {config.name}
            </span>
          </div>
          <span
            className={`text-[10px] truncate max-w-[170px] sm:max-w-none ${
              inverted ? "text-white/70" : "text-[#636a77]"
            }`}
          >
            {config.tagline}
          </span>
        </div>
      )}
    </div>
  );
}

export function AppBrandHeader({
  collegeId,
  inverted = false,
}: {
  collegeId: CollegeId;
  inverted?: boolean;
}) {
  const config = COLLEGES[collegeId] || COLLEGES.pesu;

  // In Manipal, logo is positioned in the TOP RIGHT, so left brand shows "Book_ MIT"
  if (config.logoPlacement === "right") {
    return (
      <div className="flex items-center gap-2.5">
        <BookWordmark
          size="md"
          className={inverted ? "text-white" : "text-black"}
          underscoreColor={config.colors.primary}
        />
        <div className="hidden sm:flex flex-col border-l-2 border-black/30 pl-2 leading-none">
          <span className={`font-black text-xs uppercase tracking-wider ${inverted ? "text-white" : "text-black"}`}>
            MIT Manipal
          </span>
          <span className={`text-[10px] font-mono tracking-tight ${inverted ? "text-white/70" : "text-black/70"}`}>
            Sports Vault
          </span>
        </div>
      </div>
    );
  }

  // Left-placed logo institutions
  return (
    <div className="flex items-center gap-3">
      <BookWordmark
        size="md"
        className={inverted ? "text-white" : config.colors.textPrimary}
        underscoreColor={config.colors.accent || config.colors.primary}
      />
      <span className="hidden sm:inline-block text-white/30 text-lg font-thin">|</span>
      <CollegeLogo collegeId={collegeId} inverted={inverted} />
    </div>
  );
}

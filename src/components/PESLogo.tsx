export function PESLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Authentic PES University Compass Emblem */}
      <svg
        viewBox="0 0 100 100"
        className="h-9 w-9 shrink-0 drop-shadow-xs"
        aria-label="PES University Emblem"
      >
        {/* Outer navy circle */}
        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#0b5788" strokeWidth="4" />
        {/* Inner thin border */}
        <circle cx="50" cy="50" r="44" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

        {/* Sunburst / Compass Rays */}
        {/* 8 Primary Cardinal Points */}
        <path d="M 50 10 L 53 45 L 50 50 L 47 45 Z" fill="#e65100" />
        <path d="M 50 90 L 53 55 L 50 50 L 47 55 Z" fill="#e65100" />
        <path d="M 10 50 L 45 53 L 50 50 L 45 47 Z" fill="#e65100" />
        <path d="M 90 50 L 55 53 L 50 50 L 55 47 Z" fill="#e65100" />

        {/* Diagonal Rays */}
        <path d="M 22 22 L 46 48 L 50 50 L 48 46 Z" fill="#0b5788" />
        <path d="M 78 78 L 54 52 L 50 50 L 52 54 Z" fill="#0b5788" />
        <path d="M 22 78 L 48 54 L 50 50 L 46 52 Z" fill="#0b5788" />
        <path d="M 78 22 L 52 46 L 50 50 L 54 48 Z" fill="#0b5788" />

        {/* Secondary Points */}
        <path d="M 50 50 L 50 10 L 53 45 Z" fill="#ff9800" />
        <path d="M 50 50 L 90 50 L 55 53 Z" fill="#ff9800" />
        <path d="M 50 50 L 50 90 L 47 55 Z" fill="#ff9800" />
        <path d="M 50 50 L 10 50 L 45 47 Z" fill="#ff9800" />

        {/* Central Core */}
        <circle cx="50" cy="50" r="14" fill="#0b5788" />
        <circle cx="50" cy="50" r="8" fill="#ffffff" />
        <circle cx="50" cy="50" r="4" fill="#e65100" />
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <span className="font-extrabold text-[19px] tracking-tight text-[#084d7a] font-sans">
          PES
        </span>
        <span className="text-[9px] font-bold tracking-[0.2em] text-[#084d7a] uppercase font-sans">
          UNIVERSITY
        </span>
      </div>
    </div>
  );
}

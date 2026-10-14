export type CollegeId =
  | "pesu"
  | "jain"
  | "christ"
  | "amrita"
  | "msrit"
  | "manipal"
  | "rvce"
  | "bms";

export interface CollegeConfig {
  id: CollegeId;
  name: string;
  shortName: string;
  tagline: string;
  established: string;
  location: string;
  campuses: string[];
  studentIdLabel: string;
  studentIdPlaceholder: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    ribbonBg: string;
    ribbonText: string;
    ribbonBorder: string;
    pageBg: string;
    cardBg: string;
    border: string;
    textPrimary: string;
    textMuted: string;
    badgeBg: string;
    badgeText: string;
  };
  fontFamily: string;
  fontClass: string;
  fontName: string;
  buttonStyle: {
    variant: "classic" | "smooth" | "3d" | "flat-2d" | "shadow-rect" | "soft-pill";
    radiusClass: string;
    extraClass: string;
    primaryClass: string;
    secondaryClass: string;
  };
  ribbonStyle: {
    variant:
      | "classic"
      | "glassy"
      | "bold-red"
      | "vermillion"
      | "prussian-yellow"
      | "prussian-gold"
      | "minimal-blue";
    glassy: boolean;
    ribbonClass: string;
    borderClass: string;
  };
  logoPlacement: "left" | "right";
  hasSplashScreen: boolean;
}

export const COLLEGES: Record<CollegeId, CollegeConfig> = {
  pesu: {
    id: "pesu",
    name: "PES University",
    shortName: "PESU",
    tagline: "Athletics & Facilities Directorate",
    established: "Est. 1972",
    location: "Bengaluru, Karnataka",
    campuses: ["RR Campus", "EC Campus", "HN Campus"],
    studentIdLabel: "SRN / PRN",
    studentIdPlaceholder: "PES1UG21CS123",
    colors: {
      primary: "#c45524",
      secondary: "#1a2639",
      accent: "#ea580c",
      ribbonBg: "#1a2639",
      ribbonText: "#ffffff",
      ribbonBorder: "#c45524",
      pageBg: "#f5f4ef",
      cardBg: "#ffffff",
      border: "#ded9cd",
      textPrimary: "#1a2639",
      textMuted: "#636a77",
      badgeBg: "#1a2639",
      badgeText: "#ffffff",
    },
    fontFamily: '"Times New Roman", Times, Georgia, serif',
    fontClass: "font-serif",
    fontName: "Times New Roman",
    buttonStyle: {
      variant: "classic",
      radiusClass: "rounded-none",
      extraClass: "transition-colors border border-transparent shadow-xs active:opacity-90",
      primaryClass: "bg-[#c45524] text-white hover:bg-[#b04a1d]",
      secondaryClass: "bg-[#1a2639] text-white hover:bg-[#25364e]",
    },
    ribbonStyle: {
      variant: "classic",
      glassy: false,
      ribbonClass: "bg-[#1a2639] text-white border-b-2 border-b-[#c45524] shadow-md",
      borderClass: "border-[#c45524]",
    },
    logoPlacement: "left",
    hasSplashScreen: false,
  },

  jain: {
    id: "jain",
    name: "Jain University",
    shortName: "JAIN",
    tagline: "Center for Sports Excellence · Inter-Collegiate Arena",
    established: "Est. 1990",
    location: "Bengaluru, Karnataka",
    campuses: [
      "JGI Knowledge Campus (Jayanagar)",
      "Global Campus (Kanakapura Road)",
      "CMS Campus (Lalbagh)",
    ],
    studentIdLabel: "USN / Student ID",
    studentIdPlaceholder: "21JUCS001",
    colors: {
      primary: "#eab308",
      secondary: "#003153",
      accent: "#fbbf24",
      ribbonBg: "#003153",
      ribbonText: "#ffffff",
      ribbonBorder: "#eab308",
      pageBg: "#faf8f2",
      cardBg: "#ffffff",
      border: "#e5dec9",
      textPrimary: "#003153",
      textMuted: "#5c6b7d",
      badgeBg: "#003153",
      badgeText: "#fbbf24",
    },
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontClass: "font-['Helvetica_Neue',Helvetica,Arial,sans-serif]",
    fontName: "Helvetica",
    buttonStyle: {
      variant: "smooth",
      radiusClass: "rounded-xl",
      extraClass: "transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5",
      primaryClass: "bg-[#eab308] text-[#003153] font-semibold hover:bg-[#facc15]",
      secondaryClass: "bg-[#003153] text-white hover:bg-[#073f66]",
    },
    ribbonStyle: {
      variant: "prussian-yellow",
      glassy: false,
      ribbonClass: "bg-[#003153] text-white border-b-4 border-b-[#eab308] shadow-md",
      borderClass: "border-[#eab308]",
    },
    logoPlacement: "left",
    hasSplashScreen: false,
  },

  christ: {
    id: "christ",
    name: "Christ University",
    shortName: "CHRIST",
    tagline: "Excellence & Service · Department of Physical Education",
    established: "Est. 1969",
    location: "Bengaluru, Karnataka",
    campuses: [
      "Central Campus (Hosur Rd)",
      "Kengeri Campus",
      "Yeshwanthpur Campus",
      "BGR Campus",
    ],
    studentIdLabel: "Register Number",
    studentIdPlaceholder: "2140123",
    colors: {
      primary: "#0c2340",
      secondary: "#003153",
      accent: "#2563eb",
      ribbonBg: "rgba(12, 35, 64, 0.82)",
      ribbonText: "#ffffff",
      ribbonBorder: "rgba(255, 255, 255, 0.2)",
      pageBg: "#f8fafc",
      cardBg: "#ffffff",
      border: "#e2e8f0",
      textPrimary: "#0c2340",
      textMuted: "#64748b",
      badgeBg: "#0c2340",
      badgeText: "#ffffff",
    },
    fontFamily: '"Calibri", "Candara", "Segoe UI", sans-serif',
    fontClass: "font-['Calibri','Segoe_UI',sans-serif]",
    fontName: "Calibri",
    buttonStyle: {
      variant: "3d",
      radiusClass: "rounded-md",
      extraClass:
        "shadow-[0_4px_0_#001e3d] hover:shadow-[0_5px_0_#001e3d] active:shadow-none active:translate-y-1 transition-all font-semibold",
      primaryClass: "bg-[#0c2340] text-white hover:bg-[#13335c]",
      secondaryClass: "bg-[#003153] text-white hover:bg-[#08426d]",
    },
    ribbonStyle: {
      variant: "glassy",
      glassy: true,
      ribbonClass:
        "backdrop-blur-md bg-[#0c2340]/85 border-b border-white/20 text-white shadow-lg",
      borderClass: "border-white/20",
    },
    logoPlacement: "left",
    hasSplashScreen: false,
  },

  amrita: {
    id: "amrita",
    name: "Amrita Vishwa Vidyapeetham",
    shortName: "AMRITA",
    tagline: "Shraddhavan Labhate Jnanam · Sports & Yoga Directorate",
    established: "Est. 1994",
    location: "Bengaluru · Coimbatore",
    campuses: [
      "Bengaluru Campus (Kasavanahalli)",
      "Coimbatore Campus (Ettimadai)",
      "Amritapuri Campus",
    ],
    studentIdLabel: "Roll Number",
    studentIdPlaceholder: "BL.EN.U4CSE21001",
    colors: {
      primary: "#b91c1c",
      secondary: "#960018",
      accent: "#b91c1c",
      ribbonBg: "#991b1b",
      ribbonText: "#ffffff",
      ribbonBorder: "#960018",
      pageBg: "#faf8f5",
      cardBg: "#ffffff",
      border: "#cbd5e1",
      textPrimary: "#0f172a",
      textMuted: "#334155",
      badgeBg: "#960018",
      badgeText: "#ffffff",
    },
    fontFamily: '"Times New Roman", Times, Georgia, serif',
    fontClass: "font-serif",
    fontName: "Times New Roman",
    buttonStyle: {
      variant: "classic",
      radiusClass: "rounded-sm",
      extraClass:
        "border border-[#960018] shadow-xs hover:border-[#b91c1c] active:opacity-90 transition-colors font-medium",
      primaryClass: "bg-[#b91c1c] text-white hover:bg-[#960018]",
      secondaryClass: "bg-[#960018] text-white hover:bg-[#7b0014]",
    },
    ribbonStyle: {
      variant: "bold-red",
      glassy: false,
      ribbonClass: "bg-[#991b1b] text-white border-b-4 border-b-[#960018] shadow-md",
      borderClass: "border-[#960018]",
    },
    logoPlacement: "left",
    hasSplashScreen: false,
  },

  msrit: {
    id: "msrit",
    name: "Ramaiah Institute of Technology",
    shortName: "MSRIT",
    tagline: "MSR Nagar Athletics & Indoor Badminton Dome",
    established: "Est. 1962",
    location: "Bengaluru, Karnataka",
    campuses: ["Main Campus (Mathikere)", "MSR Nagar Sports Complex"],
    studentIdLabel: "USN",
    studentIdPlaceholder: "1MS21CS001",
    colors: {
      primary: "#dc2626",
      secondary: "#eab308",
      accent: "#eab308",
      ribbonBg: "#1e2430",
      ribbonText: "#ffffff",
      ribbonBorder: "#dc2626",
      pageBg: "#f8f7f4", // Off-white background
      cardBg: "#ffffff",
      border: "#e2e8f0",
      textPrimary: "#18181b", // Dark, sharp text
      textMuted: "#475569",
      badgeBg: "#1e2430",
      badgeText: "#eab308",
    },
    fontFamily: 'Arial, "Helvetica Neue", sans-serif',
    fontClass: "font-sans",
    fontName: "Arial",
    buttonStyle: {
      variant: "soft-pill",
      radiusClass: "rounded-full",
      extraClass:
        "border-2 border-[#eab308] shadow-xs hover:shadow-md hover:scale-[1.01] transition-all font-semibold",
      primaryClass: "bg-[#dc2626] text-white hover:bg-[#b91c1c]",
      secondaryClass: "bg-white text-[#18181b] border-2 border-[#dc2626] hover:bg-[#fef2f2]",
    },
    ribbonStyle: {
      variant: "bold-red",
      glassy: false,
      ribbonClass: "bg-[#1e2430] text-white border-b-4 border-b-[#dc2626] shadow-sm",
      borderClass: "border-[#dc2626]",
    },
    logoPlacement: "left",
    hasSplashScreen: false,
  },

  manipal: {
    id: "manipal",
    name: "Manipal Institute of Technology",
    shortName: "MIT MANIPAL",
    tagline: "MAHE Marena Indoor Sports Complex & Gymkhana",
    established: "Est. 1957",
    location: "Manipal, Udupi, Karnataka",
    campuses: [
      "MIT Manipal Campus",
      "MAHE Marena Complex",
      "Tiger Circle Sports Pavilion",
    ],
    studentIdLabel: "Learner Reg No",
    studentIdPlaceholder: "210901234",
    colors: {
      primary: "#e34234",
      secondary: "#18181b",
      accent: "#ff6347",
      ribbonBg: "#e34234",
      ribbonText: "#ffffff",
      ribbonBorder: "#18181b",
      pageBg: "#fcf9f6",
      cardBg: "#ffffff",
      border: "#18181b",
      textPrimary: "#18181b",
      textMuted: "#52525b",
      badgeBg: "#e34234",
      badgeText: "#ffffff",
    },
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    fontClass: "font-sans",
    fontName: "Helvetica / Grotesque",
    buttonStyle: {
      variant: "flat-2d",
      radiusClass: "rounded-none",
      extraClass:
        "border-2 border-black uppercase font-bold tracking-wider transition-none hover:bg-black hover:text-white active:translate-x-0.5 active:translate-y-0.5",
      primaryClass: "bg-[#e34234] text-white",
      secondaryClass: "bg-black text-white hover:bg-[#e34234]",
    },
    ribbonStyle: {
      variant: "vermillion",
      glassy: false,
      ribbonClass: "bg-[#e34234] text-white border-b-4 border-b-black shadow-none",
      borderClass: "border-black",
    },
    logoPlacement: "right", // Specifically requested on the TOP RIGHT!
    hasSplashScreen: true, // Specifically requested splash screen!
  },

  rvce: {
    id: "rvce",
    name: "R.V. College of Engineering",
    shortName: "RVCE",
    tagline: "Go, Change the World · Department of Physical Education",
    established: "Est. 1963",
    location: "Mysuru Road, Bengaluru",
    campuses: [
      "Mysuru Road Main Campus",
      "RV Sports Complex & Cricket Oval",
    ],
    studentIdLabel: "USN",
    studentIdPlaceholder: "1RV21CS045",
    colors: {
      primary: "#1e40af",
      secondary: "#dc2626",
      accent: "#3b82f6",
      ribbonBg: "#1e3a8a",
      ribbonText: "#ffffff",
      ribbonBorder: "#dc2626",
      pageBg: "#f8fafc",
      cardBg: "#ffffff",
      border: "#e2e8f0",
      textPrimary: "#1e3a8a",
      textMuted: "#64748b",
      badgeBg: "#1e40af",
      badgeText: "#ffffff",
    },
    fontFamily: '"Noto Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    fontClass: "font-['Noto_Sans',sans-serif]",
    fontName: "Noto Sans",
    buttonStyle: {
      variant: "soft-pill",
      radiusClass: "rounded-2xl",
      extraClass: "shadow-xs hover:shadow-md transition-all",
      primaryClass: "bg-[#1e40af] text-white hover:bg-[#1d4ed8]",
      secondaryClass: "bg-[#dc2626] text-white hover:bg-[#b91c1c]",
    },
    ribbonStyle: {
      variant: "minimal-blue",
      glassy: false,
      ribbonClass: "bg-[#1e3a8a] text-white border-b-2 border-b-[#dc2626] shadow-md",
      borderClass: "border-[#dc2626]",
    },
    logoPlacement: "left",
    hasSplashScreen: false,
  },

  bms: {
    id: "bms",
    name: "B.M.S. College of Engineering",
    shortName: "BMSCE",
    tagline: "Department of Physical Education & Sports · Basavanagudi",
    established: "Est. 1946",
    location: "Bull Temple Rd, Basavanagudi, Bengaluru",
    campuses: [
      "Bull Temple Road Campus",
      "BMS Sports Pavilion & Stadium",
    ],
    studentIdLabel: "USN",
    studentIdPlaceholder: "1BM21CS102",
    colors: {
      primary: "#003153",
      secondary: "#0b1f4b",
      accent: "#eab308",
      ribbonBg: "#003153",
      ribbonText: "#ffffff",
      ribbonBorder: "#eab308",
      pageBg: "#ffffff", // Mostly white background
      cardBg: "#ffffff",
      border: "#003153",
      textPrimary: "#003153",
      textMuted: "#334e68",
      badgeBg: "#003153",
      badgeText: "#eab308",
    },
    fontFamily: '"Courier New", "SF Mono", "Cascadia Code", monospace',
    fontClass: "font-mono",
    fontName: "Serial Mono",
    buttonStyle: {
      variant: "shadow-rect",
      radiusClass: "rounded-none",
      extraClass:
        "border-2 border-[#eab308] shadow-[3px_3px_0px_#0b1f4b] hover:shadow-[1px_1px_0px_#0b1f4b] active:translate-x-0.5 active:translate-y-0.5 transition-all font-mono font-bold",
      primaryClass: "bg-[#003153] text-[#ffffff] hover:bg-[#073f66]",
      secondaryClass: "bg-[#0b1f4b] text-[#ffffff] hover:bg-[#152e66]",
    },
    ribbonStyle: {
      variant: "prussian-yellow",
      glassy: false,
      ribbonClass: "bg-[#003153] text-white border-b-4 border-b-[#eab308] shadow-md",
      borderClass: "border-[#eab308]",
    },
    logoPlacement: "left",
    hasSplashScreen: false,
  },
};

export const DEFAULT_COLLEGE_ID: CollegeId = "pesu";

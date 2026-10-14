# BookQuick

Inter-Collegiate Athletic Facilities & Court Reservation Platform

BookQuick is a sports facility reservation, digital turnstile clearance, and player matchmaking platform designed for university students and athletic directorates. Built with a responsive, sportswear-brand editorial aesthetic, the system provides court scheduling, anti-starvation standby queues, open squad recruitment, and multi-campus institutional theming across premier universities in Karnataka.

---

## Key Capabilities

### Multi-Institution Design System
BookQuick dynamically adapts its color palette, typography, official emblem iconography, button styles, and campus directories according to the authenticated student's university:
- **PES University**: Athletic navy blue and muted orange accents, Georgia serif headers, and campus selection across Ring Road and Electronic City.
- **Jain University**: Prussian blue and athletic yellow highlights with smooth geometric controls.
- **Christ University**: Deep navy with three-dimensional buttons, frosted headers, and Calibri typography.
- **Amrita Vishwa Vidyapeetham**: Heritage carmine and off-white styling paired with Times New Roman typography.
- **M.S. Ramaiah Institute of Technology (MSRIT)**: High-contrast red and gold sidelines with clean Arial typography.
- **Manipal Institute of Technology (MIT)**: Contrasting vermillion and slate accents with dedicated top-right emblem placement and sharp card geometries.
- **RV College of Engineering (RVCE)**: Deep blue and crimson with soft pill controls and Noto Sans typography.
- **BMS College of Engineering (BMSCE)**: Prussian blue with gold accents, rectangular button shadows, and monospace athletic labels.

### Interactive Court Scheduling & Waitlist Management
- **Calendar & Slot Inspection**: Real-time view of daily court hours (06:00 to 22:00) across badminton, basketball, table tennis, squash, and chess facilities.
- **Two-Seat Queue Protection**: When a slot is fully occupied, up to two students may place a standby queue request. The system strictly caps queue length to prevent slot starvation.
- **Automatic Promotion**: Cancelling a confirmed booking immediately promotes the position #1 queue request and dispatches a turnstile clearance notice.
- **Zero-Fee Institutional Access**: Court reservations are validated against university athletic passes without requiring commercial payment gateways.

### Digital Turnstile Clearance & Login Splash
- **Institutional Entry Screen**: Every successful login displays a university-branded athletic clearance transition showing campus hubs, turnstile operational hours, and clearance verification before entering the arena.
- **Digital Pass & QR Verification**: Athletes can present their digital ID pass at campus turnstiles for contact-free clearance.

### Open Squad Matchmaking
- **Pickup Match Board**: Students can host open games, specify skill tiers (Beginner, Intermediate, Advanced), set roster capacity limits, and review joining players.
- **Team Roster Tracking**: Live display of current squads and open player slots across sports disciplines.

### Dual-Tier Access Control
- **Student Accounts**: Self-service athlete profile, RFID clearance ID, booking history, match activity logs, and personal preference settings.
- **Universal Superuser Access**: Built-in administrative clearance credentials (`admin123` / `admin123`) valid across all 8 institutions, granting immediate tournament-level override privileges.

---

## Institutional Directory

| Institution | Short Name | Key Colorway | Default Identifier | Campus Hubs |
| :--- | :--- | :--- | :--- | :--- |
| PES University | PESU | `#c45524` / `#1a2639` | `PES1UG21CS123` | RR Campus, EC Campus, HN Campus |
| Jain University | JU | `#003153` / `#eab308` | `21JUCS001` | JGI Knowledge Campus, School of Engineering |
| Christ University | CHRIST | `#0c2340` / `#2563eb` | `2140123` | Central Campus, Kengeri Campus, BGR Campus |
| Amrita Vishwa Vidyapeetham | AMRITA | `#960018` / `#f59e0b` | `BL.EN.U4CSE21001` | Bengaluru Campus (Kasavanahalli) |
| Ramaiah Institute of Technology | MSRIT | `#b91c1c` / `#ca8a04` | `1MS21CS001` | Mathikere Main Campus |
| Manipal Institute of Technology | MIT | `#d9381e` / `#1e293b` | `210901234` | MIT Manipal Campus |
| RV College of Engineering | RVCE | `#1d4ed8` / `#dc2626` | `1RV21CS045` | Mysuru Road Main Campus |
| BMS College of Engineering | BMSCE | `#003153` / `#d97706` | `1BM21CS102` | Bull Temple Road Campus |

---

## Technical Architecture

### Frontend
- **Framework**: React 19 with TanStack Start / Router (file-based routing)
- **Styling**: Tailwind CSS with custom institutional design tokens and CSS variable mapping
- **State Management**: React Context (`AppProvider`) with localStorage hydration and dual-route API fallback
- **Data Fetching**: TanStack React Query v5
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js v22+
- **HTTP Engine**: Native `node:http` (zero external dependencies)
- **Database**: Native `node:sqlite` (`DatabaseSync`)
- **Security**: PBKDF2-SHA512 password hashing with cryptographically secure per-user salts
- **Port**: `8081` (REST API), with automatic proxy via `8080` (Web UI)

```
[ Web Browser ]
      |
      +---> Port 8080: Frontend Application (Vite / Nitro)
      |         |
      |         +---> Proxy / Direct Fallback
      |                     |
      +---> Port 8081: Minimalist REST API (server/index.js)
                            |
                            +---> SQLite Engine (data/pesu_sports.db)
```

---

## Getting Started

### Prerequisites
- **Node.js**: Version 22.0.0 or higher (required for native `node:sqlite` support)
- **npm**: Version 10 or higher

### Installation
Clone the repository and install frontend dependencies:

```bash
git clone https://github.com/RishitT28/pesu-sports-booking.git
cd pesu-sports-booking
npm install
```

### Running the Platform

#### Option A: Unified Launcher (Recommended)
Starts both the frontend web app (port 8080) and the backend API service (port 8081) concurrently:

```bash
node launcher.js
```

#### Option B: Individual Processes
Run each service in separate terminal sessions:

```bash
# Terminal 1: Backend API Service (Port 8081)
npm run server

# Terminal 2: Web Client (Port 8080)
npm run dev
```

Once started, open **`http://localhost:8080`** in your browser.

---

## Authentication & Credentials

### Universal Superuser
To access full administrative clearance across any university:
- **Login ID / SRN**: `admin123`
- **Password**: `admin123`

The superuser credential bypasses campus limits, holds active turnstile clearance across all sports directorates, and can be filled with a single click using the "Superuser" button on the login screen.

### University Demo Accounts
Pre-seeded student accounts for each institution use the default password: **`password123`**

| University | Login ID (SRN / Roll No) | Password | Clearance |
| :--- | :--- | :--- | :--- |
| PES University | `PES1UG21CS123` | `password123` | Active |
| Jain University | `21JUCS001` | `password123` | Active |
| Christ University | `2140123` | `password123` | Active |
| Amrita Vishwa Vidyapeetham | `BL.EN.U4CSE21001` | `password123` | Active |
| MSRIT | `1MS21CS001` | `password123` | Active |
| MIT Manipal | `210901234` | `password123` | Active |
| RVCE | `1RV21CS045` | `password123` | Active |
| BMSCE | `1BM21CS102` | `password123` | Active |

New students may also register directly via the **New Student** registration tab on the login screen.

---

## REST API Reference

The backend server runs on `http://localhost:8081` and provides the following endpoints:

### Authentication
- `POST /api/auth/login` — Authenticate student or superuser with password verification.
- `POST /api/auth/register` — Create new student record with salted PBKDF2 hash.
- `GET /api/auth/profile?srn={srn}` — Retrieve student athlete profile by ID.
- `POST /api/auth/update-profile` — Update athlete branch, phone, or favorite sports.
- `POST /api/auth/change-password` — Verify current password and write new PBKDF2 hash.

### Facilities & Bookings
- `GET /api/bookings?srn={srn}` — Retrieve booking roster (filtered by student or full ledger).
- `POST /api/bookings` — Create confirmed slot reservation (`status: 'upcoming'`).
- `POST /api/bookings/cancel` — Cancel booking; automatically evaluates standby queue and promotes position #1.

### Standby Queue
- `GET /api/queue?srn={srn}` — List active waitlist entries.
- `POST /api/queue` — Place queue request (enforces max 2 students per slot limit).
- `POST /api/queue/cancel` — Withdraw standby request.

### Matchmaking
- `GET /api/matches` — List open student pickup matches.
- `POST /api/matches` — Broadcast new pickup game listing.
- `POST /api/matches/join` — Register player into match roster.

### Notifications
- `GET /api/notifications?srn={srn}` — Fetch student notices and clearance updates.
- `POST /api/notifications/read` — Mark notifications as read.

---

## Project Structure

```
pesu-sports-booking/
├── data/                       # Local SQLite storage (auto-initialized)
│   └── pesu_sports.db
├── server/                     # Minimalist zero-dependency backend
│   ├── index.js                # HTTP router and SQLite schema engine
│   └── README.md               # Backend API technical documentation
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── BookingDetails.tsx  # Shared court and booking information view
│   │   ├── BottomNav.tsx       # Institutional top ribbon, rail, and bottom nav
│   │   ├── CollegeLogo.tsx     # Vector emblems and BookQuick wordmark
│   │   ├── CollegeSplashScreen.tsx # Universal login turnstile transition
│   │   ├── QrPass.tsx          # Digital turnstile RFID pass card
│   │   └── SportIcon.tsx       # Discipline iconography
│   ├── lib/
│   │   ├── college-theme.ts    # Institutional styling & campus registry
│   │   ├── data.ts             # Static facility and badge definitions
│   │   └── store.tsx           # Application state provider and API caller
│   └── routes/                 # TanStack file-based application routes
│       ├── __root.tsx          # Shell layout and splash coordinator
│       ├── index.tsx           # Discovery & quick booking portal
│       ├── courts.tsx          # Facilities directory & calendar booking
│       ├── matches.tsx         # Open squads & player matchmaking
│       ├── profile.tsx         # Student identity pass & superuser clearance
│       ├── login.tsx           # Two-step institutional sign-in portal
│       ├── help.tsx            # Directorate guidelines & contact desk
│       └── notifications.tsx   # Athletic circulars & turnstile notices
├── launcher.js                 # Dual-application startup orchestrator
├── package.json
└── README.md
```

---

## License

This project is licensed under the MIT License. Institutional trademarks, emblems, and university names are the intellectual property of their respective institutions and are used for identification purposes only.

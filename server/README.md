# BookQuick — Backend Service Documentation

A minimalist, high-performance, zero-dependency REST API for the **BookQuick** multi-university sports facilities booking platform.

---

## 1. Quick Start

### Prerequisites
- **Node.js**: v22+ (uses native `node:sqlite` and `node:http`). Zero `npm install` steps needed for the server.

### Run the Server
From the repository root:
```bash
# Direct execution
node server/index.js

# Or via npm script
npm run server
```

The server listens on **`http://localhost:8081`** by default (or the port defined by `PORT` environment variable).

---

## 2. Architecture & Design Principles

- **Zero External Dependencies**: Uses native Node.js built-ins (`node:http`, `node:crypto`, `node:sqlite`, `node:fs`, `node:path`).
- **Portable SQLite Storage**: Database is stored at `data/pesu_sports.db`. It auto-creates itself and seeds default seed records if absent.
- **Platform-Agnostic**: Works identically on macOS, Linux, and Windows.
- **Clean RESTful Design**: JSON request and response payloads with CORS headers enabled.

---

## 3. Database Schema

The SQLite schema consists of 5 relational tables:

### 1. `students`
Stores registered university students and credentials.
```sql
CREATE TABLE students (
  srn TEXT PRIMARY KEY,             -- e.g. "PES1UG21CS123" / University ID
  prn TEXT UNIQUE,                  -- Secondary PRN / Registration #
  name TEXT NOT NULL,               -- Display first name
  full_name TEXT NOT NULL,          -- Full student name
  department TEXT NOT NULL,         -- Department / Branch
  campus TEXT NOT NULL,             -- Campus affiliation
  semester TEXT NOT NULL,           -- Semester / Year
  skill TEXT NOT NULL,              -- Beginner / Intermediate / Advanced
  email TEXT,                       -- Student email
  phone TEXT,                       -- Mobile phone number
  password_salt TEXT NOT NULL,      -- Cryptographic salt (hex)
  password_hash TEXT NOT NULL,      -- PBKDF2-SHA512 hash
  clearance_status TEXT DEFAULT 'Active',
  favorite_sports TEXT DEFAULT '["badminton","basketball","chess"]',
  hours_logged INTEGER DEFAULT 62,
  matches_played INTEGER DEFAULT 47,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### 2. `bookings`
Stores confirmed and cancelled court reservations.
```sql
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,              -- e.g. "bk-173891823"
  student_srn TEXT NOT NULL,        -- FK -> students(srn)
  court_id TEXT NOT NULL,           -- e.g. "c1", "c2"
  court_name TEXT NOT NULL,         -- e.g. "Badminton Court 1"
  sport TEXT NOT NULL,              -- "badminton", "basketball", etc.
  campus TEXT NOT NULL,             -- e.g. "RR Campus", "Central Campus"
  date_label TEXT NOT NULL,         -- e.g. "Today", "Tomorrow", "Mon, Oct 12"
  hour INTEGER NOT NULL,            -- 24-hour integer (6 to 21)
  status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming' | 'completed' | 'cancelled'
  duration TEXT DEFAULT '1 Hour',
  cancelled_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (student_srn) REFERENCES students(srn)
);
```

### 3. `queue_requests`
Standby queue requests for fully-booked court slots.
```sql
CREATE TABLE queue_requests (
  id TEXT PRIMARY KEY,              -- e.g. "qr-173891823"
  student_srn TEXT NOT NULL,        -- FK -> students(srn)
  court_id TEXT NOT NULL,
  court_name TEXT NOT NULL,
  sport TEXT NOT NULL,
  campus TEXT NOT NULL,
  date_label TEXT NOT NULL,
  hour INTEGER NOT NULL,
  position INTEGER NOT NULL,        -- 1 or 2 (Max 2 spots per slot)
  status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting' | 'promoted' | 'cancelled'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (student_srn) REFERENCES students(srn)
);
```

### 4. `matches`
Open pickup runs and squad matchmaking listings.
```sql
CREATE TABLE matches (
  id TEXT PRIMARY KEY,
  sport TEXT NOT NULL,
  title TEXT NOT NULL,
  host TEXT NOT NULL,
  campus TEXT NOT NULL,
  court TEXT NOT NULL,
  time TEXT NOT NULL,
  skill TEXT NOT NULL,              -- "Beginner" | "Intermediate" | "Advanced"
  players TEXT NOT NULL,            -- JSON array of strings
  max_players INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
```

### 5. `notifications`
Direct student notices and booking alerts.
```sql
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  student_srn TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'system', -- 'booking' | 'queue' | 'system'
  time TEXT NOT NULL,
  read INTEGER DEFAULT 0,           -- 0 = unread, 1 = read
  created_at TEXT NOT NULL
);
```

---

## 4. API Endpoints

### Authentication
- `POST /api/auth/login`
  - Body: `{ "srnOrPrn": "PES1UG21CS123", "password": "password123" }`
  - Superuser Access (Valid across all universities): `{ "srnOrPrn": "admin123", "password": "admin123" }`
  - Response: `{ "success": true, "student": { ... } }`
- `POST /api/auth/register`
  - Body: `{ "srn": "1BM21CS102", "name": "Aarav", "fullName": "Aarav S.", "password": "securepwd", "campus": "Bull Temple Road Campus", "department": "CSE" }`
  - Response: `{ "success": true, "student": { ... } }`
- `GET /api/auth/profile?srn=PES1UG21CS123`
  - Response: Student profile object
- `POST /api/auth/update-profile`
  - Body: `{ "srn": "PES1UG21CS123", "phone": "+91 99999 88888", "campus": "RR Campus" }`
- `POST /api/auth/change-password`
  - Body: `{ "srn": "PES1UG21CS123", "currentPassword": "old", "newPassword": "new" }`

### Bookings
- `GET /api/bookings?srn=PES1UG21CS123`
  - Query: `srn` (optional; returns all bookings if omitted)
  - Response: `Booking[]`
- `POST /api/bookings`
  - Body: `{ "student_srn": "PES1UG21CS123", "court_id": "c1", "court_name": "Badminton Court 1", "sport": "badminton", "campus": "RR Campus", "date_label": "Today", "hour": 18 }`
  - Creates booking with status `'upcoming'` (Free college facility).
- `POST /api/bookings/cancel`
  - Body: `{ "bookingId": "bk-12345" }`
  - Automatically cancels booking, inspects waitlist, and **auto-promotes** position #1 queue request if available!

### Standby Queue (Waitlist)
- `GET /api/queue?srn=PES1UG21CS123`
  - Response: `QueueRequest[]`
- `POST /api/queue`
  - Body: `{ "student_srn": "PES1UG21CS123", "court_id": "c1", "court_name": "Badminton Court 1", "sport": "badminton", "campus": "RR Campus", "date_label": "Today", "hour": 18 }`
  - Enforces starvation protection: maximum 2 students per slot.
- `POST /api/queue/cancel`
  - Body: `{ "queueId": "qr-12345" }`

### Community Matches & Squads
- `GET /api/matches`
  - Response: `Match[]`
- `POST /api/matches`
  - Body: `{ "sport": "basketball", "title": "3v3 Half-Court", "host": "Rohan", "campus": "RR Campus", "court": "Court A", "time": "Today, 6:00 PM", "skill": "Intermediate", "max_players": 6 }`
- `POST /api/matches/join`
  - Body: `{ "matchId": "m1", "playerName": "Rishit" }`

### Notifications
- `GET /api/notifications?srn=PES1UG21CS123`
  - Response: `Notification[]`
- `POST /api/notifications/read`
  - Body: `{ "srn": "PES1UG21CS123" }`

---

## 5. Notes for Production / Migration

If transitioning from SQLite to PostgreSQL, MySQL, Supabase, or Prisma:
1. Replace `new DatabaseSync()` with your chosen ORM/driver connection pool.
2. The schema maps 1-to-1 with PostgreSQL types (`TEXT` -> `VARCHAR`/`TEXT`, `INTEGER` -> `INT`).
3. Replace `crypto.pbkdf2Sync` with `bcrypt` or Argon2 if needed.
4. Route handlers in `server/index.js` are modular and can be ported directly into Express, Fastify, or NestJS in under an hour.

/**
 * BookQuick — Minimalist Backend Server
 * 
 * Simple, zero-dependency Node.js REST API using native `node:sqlite` and `node:http`.
 * Easily portable to any computer running Node.js (v22+).
 * 
 * Default Port: 8081
 * Database:     data/pesu_sports.db
 */

import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8081;
const DATA_DIR = path.join(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_PATH = path.join(DATA_DIR, "pesu_sports.db");

// Initialize SQLite database
const db = new DatabaseSync(DB_PATH);

// -------------------------------------------------------------
// Database Schema & Initialization
// -------------------------------------------------------------
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      srn TEXT PRIMARY KEY,
      prn TEXT UNIQUE,
      name TEXT NOT NULL,
      full_name TEXT NOT NULL,
      department TEXT NOT NULL,
      campus TEXT NOT NULL,
      semester TEXT NOT NULL,
      skill TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      password_salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      clearance_status TEXT DEFAULT 'Active',
      favorite_sports TEXT DEFAULT '["badminton","basketball","chess"]',
      hours_logged INTEGER DEFAULT 62,
      matches_played INTEGER DEFAULT 47,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      student_srn TEXT NOT NULL,
      court_id TEXT NOT NULL,
      court_name TEXT NOT NULL,
      sport TEXT NOT NULL,
      campus TEXT NOT NULL,
      date_label TEXT NOT NULL,
      hour INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'upcoming',
      duration TEXT DEFAULT '1 Hour',
      cancelled_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (student_srn) REFERENCES students(srn)
    );

    CREATE TABLE IF NOT EXISTS queue_requests (
      id TEXT PRIMARY KEY,
      student_srn TEXT NOT NULL,
      court_id TEXT NOT NULL,
      court_name TEXT NOT NULL,
      sport TEXT NOT NULL,
      campus TEXT NOT NULL,
      date_label TEXT NOT NULL,
      hour INTEGER NOT NULL,
      position INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'waiting',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (student_srn) REFERENCES students(srn)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      sport TEXT NOT NULL,
      title TEXT NOT NULL,
      host TEXT NOT NULL,
      campus TEXT NOT NULL,
      court TEXT NOT NULL,
      time TEXT NOT NULL,
      skill TEXT NOT NULL,
      players TEXT NOT NULL,
      max_players INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      student_srn TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'system',
      time TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // Seed default student if database is empty
  const count = db.prepare("SELECT COUNT(*) as c FROM students").get().c;
  if (count === 0) {
    seedDatabase();
  } else {
    // Ensure admin123 superuser is always seeded
    ensureSuperuserExists();
  }
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function verifyPassword(password, salt, storedHash) {
  const hash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
}

function ensureSuperuserExists() {
  const admin = db.prepare("SELECT * FROM students WHERE UPPER(srn) = 'ADMIN123'").get();
  if (!admin) {
    const salt = generateSalt();
    const hash = hashPassword("admin123", salt);
    const now = new Date().toISOString();
    db.prepare(`
      INSERT OR REPLACE INTO students (
        srn, prn, name, full_name, department, campus, semester, skill,
        email, phone, password_salt, password_hash, clearance_status,
        favorite_sports, hours_logged, matches_played, created_at, updated_at
      ) VALUES (
        'admin123', 'SUPERUSER', 'Superuser Admin', 'Superuser Administrator',
        'Sports Directorate & Athletic Administration', 'All Campuses', 'Faculty / Superuser',
        'Advanced', 'admin123@bookquick.edu', '+91 99999 00000', ?, ?, 'Superuser Clearance',
        ?, 999, 150, ?, ?
      )
    `).run(salt, hash, JSON.stringify(["badminton", "basketball", "table_tennis", "squash", "chess"]), now, now);
  }
}

function seedDatabase() {
  const salt = generateSalt();
  const hash = hashPassword("password123", salt);
  const now = new Date().toISOString();

  const demoStudents = [
    {
      srn: "PES1UG21CS123",
      prn: "PES202100456",
      name: "Rishit",
      fullName: "Rishit Tathod",
      department: "Computer Science & Engineering",
      campus: "RR Campus",
      email: "rishit@pesu.pes.edu",
    },
    {
      srn: "21JUCS001",
      prn: "JU2021001",
      name: "Rohan",
      fullName: "Rohan K.",
      department: "Information Science",
      campus: "JGI Knowledge Campus (Jayanagar)",
      email: "rohan@jainuniversity.ac.in",
    },
    {
      srn: "2140123",
      prn: "CU2140123",
      name: "David",
      fullName: "David Mathew",
      department: "School of Engineering",
      campus: "Central Campus (Hosur Rd)",
      email: "david.m@christuniversity.in",
    },
    {
      srn: "BL.EN.U4CSE21001",
      prn: "AM2021001",
      name: "Ananya",
      fullName: "Ananya S.",
      department: "Computer Science & Engineering",
      campus: "Bengaluru Campus (Kasavanahalli)",
      email: "ananya@amrita.edu",
    },
    {
      srn: "1MS21CS001",
      prn: "MSR2021001",
      name: "Varun",
      fullName: "Varun Rao",
      department: "Computer Science",
      campus: "Main Campus (Mathikere)",
      email: "varun.r@msrit.edu",
    },
    {
      srn: "210901234",
      prn: "MIT2021001",
      name: "Kabir",
      fullName: "Kabir Nair",
      department: "Mechanical Engineering",
      campus: "MIT Manipal Campus",
      email: "kabir.nair@learner.manipal.edu",
    },
    {
      srn: "1RV21CS045",
      prn: "RV2021045",
      name: "Tanvi",
      fullName: "Tanvi Patel",
      department: "Aerospace Engineering",
      campus: "Mysuru Road Main Campus",
      email: "tanvi.p@rvce.edu.in",
    },
    {
      srn: "1BM21CS102",
      prn: "BMS2021102",
      name: "Karthik",
      fullName: "Karthik Bhat",
      department: "Computer Science & Engineering",
      campus: "Bull Temple Road Campus",
      email: "karthik.bhat@bmsce.ac.in",
    },
  ];

  for (const s of demoStudents) {
    db.prepare(`
      INSERT OR IGNORE INTO students (
        srn, prn, name, full_name, department, campus, semester, skill,
        email, phone, password_salt, password_hash, clearance_status,
        favorite_sports, hours_logged, matches_played, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, 62, 47, ?, ?)
    `).run(
      s.srn,
      s.prn,
      s.name,
      s.fullName,
      s.department,
      s.campus,
      "Semester 3 · Section A",
      "Intermediate",
      s.email,
      "+91 98765 43210",
      salt,
      hash,
      JSON.stringify(["badminton", "basketball", "chess"]),
      now,
      now
    );
  }

  db.prepare(`
    INSERT INTO bookings (
      id, student_srn, court_id, court_name, sport, campus,
      date_label, hour, status, duration, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'upcoming', '1 Hour', ?)
  `).run(
    "bk-seed-1",
    "PES1UG21CS123",
    "c1",
    "Badminton Court 1",
    "badminton",
    "RR Campus",
    "Today",
    17,
    now
  );

  db.prepare(`
    INSERT INTO queue_requests (
      id, student_srn, court_id, court_name, sport, campus,
      date_label, hour, position, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'waiting', ?, ?)
  `).run(
    "qr-seed-1",
    "PES1UG21CS123",
    "c2",
    "Badminton Court 2",
    "badminton",
    "RR Campus",
    "Today",
    18,
    now,
    now
  );

  const seedMatches = [
    {
      id: "m1",
      sport: "badminton",
      title: "Doubles practice — need 1 more",
      host: "Aarav S.",
      campus: "RR Campus",
      court: "Badminton Court 1",
      time: "Today, 5:00 PM",
      skill: "Intermediate",
      players: ["Aarav S.", "Meera K.", "Dev P."],
      max_players: 4,
    },
    {
      id: "m2",
      sport: "basketball",
      title: "3v3 half-court pickup run",
      host: "Rohan V.",
      campus: "RR Campus",
      court: "Basketball Court",
      time: "Today, 6:30 PM",
      skill: "Advanced",
      players: ["Rohan V.", "Ishaan T."],
      max_players: 6,
    },
  ];

  for (const m of seedMatches) {
    db.prepare(`
      INSERT INTO matches (
        id, sport, title, host, campus, court, time, skill, players, max_players, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      m.id,
      m.sport,
      m.title,
      m.host,
      m.campus,
      m.court,
      m.time,
      m.skill,
      JSON.stringify(m.players),
      m.max_players,
      now
    );
  }

  const seedNotifs = [
    {
      id: "n1",
      student_srn: "PES1UG21CS123",
      title: "Booking Confirmed",
      body: "Badminton Court 1 reserved for today at 5:00 PM (RR Campus). Turnstile access cleared.",
      kind: "booking",
      time: "2 hours ago",
      read: 0,
    },
    {
      id: "n2",
      student_srn: "PES1UG21CS123",
      title: "Queue Position Update",
      body: "You are currently Position #1 for Badminton Court 2 (6:00 PM slot). Automatic clearance will trigger upon slot cancellation.",
      kind: "queue",
      time: "45 mins ago",
      read: 0,
    },
  ];

  for (const n of seedNotifs) {
    db.prepare(`
      INSERT INTO notifications (
        id, student_srn, title, body, kind, time, read, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(n.id, n.student_srn, n.title, n.body, n.kind, n.time, n.read, now);
  }
}

// -------------------------------------------------------------
// HTTP Utilities & JSON Response Handler
// -------------------------------------------------------------
function json(res, data, status = 200) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function addNotification({ student_srn, title, body, kind = "system" }) {
  const id = `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO notifications (id, student_srn, title, body, kind, time, read, created_at)
    VALUES (?, ?, ?, ?, ?, 'Just now', 0, ?)
  `).run(id, student_srn, title, body, kind, now);
}

// -------------------------------------------------------------
// Request Handler
// -------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost:" + PORT}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const query = Object.fromEntries(parsedUrl.searchParams);

  // CORS Preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end();
    return;
  }

  try {
    // 1. Health / Welcome
    if (pathname === "/" || pathname === "/api/health") {
      return json(res, {
        status: "ok",
        app: "BookQuick Sports Platform API",
        version: "1.0.0",
        port: PORT,
        endpoints: [
          "POST /api/auth/login",
          "POST /api/auth/register",
          "GET  /api/auth/profile",
          "POST /api/auth/update-profile",
          "POST /api/auth/change-password",
          "GET  /api/bookings",
          "POST /api/bookings",
          "POST /api/bookings/cancel",
          "GET  /api/queue",
          "POST /api/queue",
          "POST /api/queue/cancel",
          "GET  /api/matches",
          "POST /api/matches",
          "POST /api/matches/join",
          "GET  /api/notifications",
          "POST /api/notifications/read",
        ],
      });
    }

    // 2. Authentication: Login
    if (pathname === "/api/auth/login" && method === "POST") {
      const { srnOrPrn, password } = await parseBody(req);
      if (!srnOrPrn || !password) {
        return json(res, { error: "Student ID and Password required" }, 400);
      }

      // Universal Superuser Interceptor: admin123 / admin123 (works for all colleges)
      const cleanId = String(srnOrPrn).trim().toLowerCase();
      if ((cleanId === "admin123" || cleanId === "admin") && password === "admin123") {
        ensureSuperuserExists();
        const adminStudent = db.prepare("SELECT * FROM students WHERE UPPER(srn) = 'ADMIN123'").get();
        if (adminStudent) {
          const { password_salt, password_hash, ...safeAdmin } = adminStudent;
          return json(res, { success: true, student: safeAdmin, isSuperuser: true });
        }
      }

      const student = db
        .prepare("SELECT * FROM students WHERE UPPER(srn) = UPPER(?) OR UPPER(prn) = UPPER(?)")
        .get(srnOrPrn, srnOrPrn);

      if (!student) {
        return json(res, { error: "Student credentials not found" }, 401);
      }

      const isValid = verifyPassword(password, student.password_salt, student.password_hash);
      if (!isValid) {
        return json(res, { error: "Invalid password for provided student ID" }, 401);
      }

      const { password_salt, password_hash, ...safeStudent } = student;
      return json(res, { success: true, student: safeStudent });
    }

    // 3. Authentication: Register
    if (pathname === "/api/auth/register" && method === "POST") {
      const data = await parseBody(req);
      if (!data.srn || !data.password || !data.name) {
        return json(res, { error: "SRN/Student ID, Name, and Password are required" }, 400);
      }

      const existing = db
        .prepare("SELECT * FROM students WHERE UPPER(srn) = UPPER(?)")
        .get(data.srn);
      if (existing) {
        return json(res, { error: `Student with ID '${data.srn}' already registered` }, 400);
      }

      const salt = generateSalt();
      const hash = hashPassword(data.password, salt);
      const now = new Date().toISOString();
      const fName = data.fullName || data.name;
      const sName = data.name || fName.split(" ")[0];

      db.prepare(`
        INSERT INTO students (
          srn, prn, name, full_name, department, campus, semester, skill,
          email, phone, password_salt, password_hash, clearance_status,
          favorite_sports, hours_logged, matches_played, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, 0, 0, ?, ?)
      `).run(
        data.srn.toUpperCase(),
        data.prn ? data.prn.toUpperCase() : data.srn.toUpperCase(),
        sName,
        fName,
        data.department || "General Engineering",
        data.campus || "Main Campus",
        data.semester || "Semester 1",
        data.skill || "Intermediate",
        data.email || `${sName.toLowerCase()}@university.edu`,
        data.phone || "+91 98765 43210",
        salt,
        hash,
        JSON.stringify(["badminton"]),
        now,
        now
      );

      const created = db
        .prepare("SELECT * FROM students WHERE UPPER(srn) = UPPER(?)")
        .get(data.srn);
      const { password_salt, password_hash, ...safeStudent } = created;
      return json(res, { success: true, student: safeStudent });
    }

    // 4. Student Profile
    if (pathname === "/api/auth/profile" && method === "GET") {
      const srn = query.srn;
      if (!srn) return json(res, { error: "Student ID required" }, 400);
      if (String(srn).toUpperCase() === "ADMIN123") {
        ensureSuperuserExists();
      }
      const student = db
        .prepare("SELECT * FROM students WHERE UPPER(srn) = UPPER(?)")
        .get(srn);
      if (!student) return json(res, { error: "Student not found" }, 404);
      const { password_salt, password_hash, ...safeStudent } = student;
      return json(res, safeStudent);
    }

    // 5. Update Profile
    if (pathname === "/api/auth/update-profile" && method === "POST") {
      const { srn, ...updates } = await parseBody(req);
      if (!srn) return json(res, { error: "Student ID required" }, 400);

      delete updates.password_salt;
      delete updates.password_hash;

      const fields = [];
      const values = [];
      for (const [key, val] of Object.entries(updates)) {
        fields.push(`${key} = ?`);
        values.push(val);
      }
      fields.push("updated_at = ?");
      values.push(new Date().toISOString());
      values.push(srn);

      db.prepare(`UPDATE students SET ${fields.join(", ")} WHERE UPPER(srn) = UPPER(?)`).run(...values);

      const updated = db.prepare("SELECT * FROM students WHERE UPPER(srn) = UPPER(?)").get(srn);
      const { password_salt, password_hash, ...safeStudent } = updated;
      return json(res, { success: true, student: safeStudent });
    }

    // 6. Change Password
    if (pathname === "/api/auth/change-password" && method === "POST") {
      const { srn, currentPassword, newPassword } = await parseBody(req);
      if (!srn || !currentPassword || !newPassword) {
        return json(res, { error: "All fields required" }, 400);
      }

      const student = db
        .prepare("SELECT * FROM students WHERE UPPER(srn) = UPPER(?)")
        .get(srn);
      if (!student) return json(res, { error: "Student not found" }, 404);

      const valid = verifyPassword(currentPassword, student.password_salt, student.password_hash);
      if (!valid) return json(res, { error: "Current password does not match" }, 401);

      const newSalt = generateSalt();
      const newHash = hashPassword(newPassword, newSalt);
      const now = new Date().toISOString();

      db.prepare(
        "UPDATE students SET password_salt = ?, password_hash = ?, updated_at = ? WHERE UPPER(srn) = UPPER(?)"
      ).run(newSalt, newHash, now, srn);

      return json(res, { success: true, message: "Password updated successfully" });
    }

    // 7. Bookings: List
    if (pathname === "/api/bookings" && method === "GET") {
      const srn = query.srn;
      const bookings = srn
        ? db.prepare("SELECT * FROM bookings WHERE UPPER(student_srn) = UPPER(?) ORDER BY created_at DESC").all(srn)
        : db.prepare("SELECT * FROM bookings ORDER BY created_at DESC").all();
      return json(res, bookings);
    }

    // 8. Bookings: Create (Zero-Fee College Facility)
    if (pathname === "/api/bookings" && method === "POST") {
      const body = await parseBody(req);
      if (!body.student_srn || !body.court_id || !body.hour) {
        return json(res, { error: "Incomplete booking details" }, 400);
      }

      const id = `bk-${Date.now()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO bookings (
          id, student_srn, court_id, court_name, sport, campus, date_label, hour, status, duration, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'upcoming', ?, ?)
      `).run(
        id,
        body.student_srn,
        body.court_id,
        body.court_name,
        body.sport,
        body.campus,
        body.date_label,
        body.hour,
        body.duration || "1 Hour",
        now
      );

      db.prepare("UPDATE students SET hours_logged = hours_logged + 1 WHERE UPPER(srn) = UPPER(?)").run(body.student_srn);

      addNotification({
        student_srn: body.student_srn,
        title: "Reservation Confirmed",
        body: `${body.court_name} · ${body.date_label} at ${body.hour % 12 === 0 ? 12 : body.hour % 12}:00 ${body.hour < 12 ? "AM" : "PM"} (${body.campus}). Facility pass confirmed (No charge).`,
        kind: "booking",
      });

      const newBooking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(id);
      return json(res, { success: true, booking: newBooking });
    }

    // 9. Bookings: Cancel (with Waitlist Auto-Promotion)
    if (pathname === "/api/bookings/cancel" && method === "POST") {
      const { bookingId } = await parseBody(req);
      if (!bookingId) return json(res, { error: "Booking ID required" }, 400);

      const target = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);
      if (!target) return json(res, { error: "Booking not found" }, 404);

      const now = new Date().toISOString();
      db.prepare("UPDATE bookings SET status = 'cancelled', cancelled_at = ? WHERE id = ?").run(now, bookingId);

      // Auto-promote top student in standby queue if one exists
      const nextInQueue = db.prepare(`
        SELECT * FROM queue_requests 
        WHERE court_id = ? AND date_label = ? AND hour = ? AND status = 'waiting'
        ORDER BY position ASC, created_at ASC
        LIMIT 1
      `).get(target.court_id, target.date_label, target.hour);

      let promoted = null;
      if (nextInQueue) {
        const promoBookingId = `bk-promoted-${Date.now()}`;
        db.prepare(`
          INSERT INTO bookings (
            id, student_srn, court_id, court_name, sport, campus, date_label, hour, status, duration, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'upcoming', '1 Hour', ?)
        `).run(
          promoBookingId,
          nextInQueue.student_srn,
          nextInQueue.court_id,
          nextInQueue.court_name,
          nextInQueue.sport,
          nextInQueue.campus,
          nextInQueue.date_label,
          nextInQueue.hour,
          now
        );

        db.prepare("UPDATE queue_requests SET status = 'promoted', updated_at = ? WHERE id = ?").run(now, nextInQueue.id);

        addNotification({
          student_srn: nextInQueue.student_srn,
          title: "Queue Spot Promoted!",
          body: `Great news! A slot for ${nextInQueue.court_name} on ${nextInQueue.date_label} at ${nextInQueue.hour}:00 has opened. Your booking is now confirmed!`,
          kind: "queue",
        });

        promoted = db.prepare("SELECT * FROM bookings WHERE id = ?").get(promoBookingId);
      }

      return json(res, { success: true, booking: target, promoted });
    }

    // 10. Standby Queue: List
    if (pathname === "/api/queue" && method === "GET") {
      const srn = query.srn;
      const queues = srn
        ? db.prepare("SELECT * FROM queue_requests WHERE UPPER(student_srn) = UPPER(?) ORDER BY created_at DESC").all(srn)
        : db.prepare("SELECT * FROM queue_requests ORDER BY created_at DESC").all();
      return json(res, queues);
    }

    // 11. Standby Queue: Join (Starvation Protection: Max 2 in queue per slot)
    if (pathname === "/api/queue" && method === "POST") {
      const body = await parseBody(req);
      const activeCount = db.prepare(`
        SELECT COUNT(*) as c FROM queue_requests
        WHERE court_id = ? AND date_label = ? AND hour = ? AND status = 'waiting'
      `).get(body.court_id, body.date_label, body.hour).c;

      if (activeCount >= 2) {
        return json(res, {
          success: false,
          error: "Maximum waitlist capacity reached (2 spots). Please pick another slot.",
        }, 400);
      }

      const id = `qr-${Date.now()}`;
      const now = new Date().toISOString();
      const position = activeCount + 1;

      db.prepare(`
        INSERT INTO queue_requests (
          id, student_srn, court_id, court_name, sport, campus, date_label, hour, position, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting', ?, ?)
      `).run(
        id,
        body.student_srn,
        body.court_id,
        body.court_name,
        body.sport,
        body.campus,
        body.date_label,
        body.hour,
        position,
        now,
        now
      );

      addNotification({
        student_srn: body.student_srn,
        title: "Standby Queue Request Registered",
        body: `You are Position #${position} for ${body.court_name} on ${body.date_label} at ${body.hour}:00. You will be automatically enrolled if a spot clears.`,
        kind: "queue",
      });

      const newQr = db.prepare("SELECT * FROM queue_requests WHERE id = ?").get(id);
      return json(res, { success: true, request: newQr, position });
    }

    // 12. Standby Queue: Cancel
    if (pathname === "/api/queue/cancel" && method === "POST") {
      const { queueId } = await parseBody(req);
      const now = new Date().toISOString();
      db.prepare("UPDATE queue_requests SET status = 'cancelled', updated_at = ? WHERE id = ?").run(now, queueId);
      const updated = db.prepare("SELECT * FROM queue_requests WHERE id = ?").get(queueId);
      return json(res, { success: true, request: updated });
    }

    // 13. Matches: List
    if (pathname === "/api/matches" && method === "GET") {
      const matches = db.prepare("SELECT * FROM matches ORDER BY created_at DESC").all();
      return json(res, matches);
    }

    // 14. Matches: Create
    if (pathname === "/api/matches" && method === "POST") {
      const body = await parseBody(req);
      const id = `m-${Date.now()}`;
      const now = new Date().toISOString();
      const playersJson = Array.isArray(body.players) ? JSON.stringify(body.players) : JSON.stringify([body.host]);

      db.prepare(`
        INSERT INTO matches (
          id, sport, title, host, campus, court, time, skill, players, max_players, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        body.sport,
        body.title,
        body.host,
        body.campus,
        body.court,
        body.time,
        body.skill,
        playersJson,
        body.max_players || 4,
        now
      );

      const match = db.prepare("SELECT * FROM matches WHERE id = ?").get(id);
      return json(res, { success: true, match });
    }

    // 15. Matches: Join
    if (pathname === "/api/matches/join" && method === "POST") {
      const { matchId, playerName } = await parseBody(req);
      const match = db.prepare("SELECT * FROM matches WHERE id = ?").get(matchId);
      if (!match) return json(res, { error: "Match not found" }, 404);

      const players = JSON.parse(match.players || "[]");
      if (!players.includes(playerName)) {
        if (players.length >= match.max_players) {
          return json(res, { error: "Squad is already full" }, 400);
        }
        players.push(playerName);
        db.prepare("UPDATE matches SET players = ? WHERE id = ?").run(JSON.stringify(players), matchId);
      }

      const updated = db.prepare("SELECT * FROM matches WHERE id = ?").get(matchId);
      return json(res, { success: true, match: updated });
    }

    // 16. Notifications: List
    if (pathname === "/api/notifications" && method === "GET") {
      const srn = query.srn || "PES1UG21CS123";
      const notifs = db.prepare(`
        SELECT * FROM notifications WHERE UPPER(student_srn) = UPPER(?) ORDER BY created_at DESC
      `).all(srn);
      return json(res, notifs);
    }

    // 17. Notifications: Mark Read
    if (pathname === "/api/notifications/read" && method === "POST") {
      const { srn } = await parseBody(req);
      const studentSrn = srn || "PES1UG21CS123";
      db.prepare("UPDATE notifications SET read = 1 WHERE UPPER(student_srn) = UPPER(?)").run(studentSrn);
      return json(res, { success: true });
    }

    // 404 Fallback
    return json(res, { error: "Endpoint not found" }, 404);
  } catch (err) {
    console.error("API error:", err);
    return json(res, { error: "Internal Server Error", message: err.message }, 500);
  }
});

// Initialize database & start server
initDatabase();

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Book_ Minimalist Backend Server`);
  console.log(`  API Active on: http://localhost:${PORT}`);
  console.log(`  Database File: ${DB_PATH}`);
  console.log(`======================================================\n`);
});

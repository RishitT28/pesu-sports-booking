import { DatabaseSync } from "node:sqlite";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "pesu_sports.db");
export const db = new DatabaseSync(DB_PATH);

// Initialize schema
export function initDatabase() {
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

  seedDefaultData();
}

// Password cryptography using PBKDF2 with SHA-512 and salt
export function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

export function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

export function verifyPassword(password, salt, storedHash) {
  const hash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
}

function seedDefaultData() {
  // Check if students exist
  const existing = db.prepare("SELECT COUNT(*) as count FROM students").get();
  if (existing.count === 0) {
    const salt = generateSalt();
    const hash = hashPassword("password123", salt);
    const now = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO students (
        srn, prn, name, full_name, department, campus, semester, skill,
        email, phone, password_salt, password_hash, clearance_status,
        favorite_sports, hours_logged, matches_played, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      "PES1UG21CS123",
      "PES202100456",
      "Rishit",
      "Rishit Tathod",
      "Computer Science & Engineering",
      "RR Campus",
      "Semester 3 · Section G",
      "Intermediate",
      "rishit@pesu.pes.edu",
      "+91 98765 43210",
      salt,
      hash,
      "Active",
      JSON.stringify(["badminton", "basketball", "chess"]),
      62,
      47,
      now,
      now,
    );

    // Seed sample bookings
    db.prepare(
      `
      INSERT INTO bookings (
        id, student_srn, court_id, court_name, sport, campus,
        date_label, hour, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      "bk-seed-1",
      "PES1UG21CS123",
      "c1",
      "Badminton Court 1",
      "badminton",
      "RR Campus",
      "Today",
      17,
      "upcoming",
      now,
    );

    // Seed sample queue request
    db.prepare(
      `
      INSERT INTO queue_requests (
        id, student_srn, court_id, court_name, sport, campus,
        date_label, hour, position, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      "qr-seed-1",
      "PES1UG21CS123",
      "c2",
      "Badminton Court 2",
      "badminton",
      "RR Campus",
      "Today",
      18,
      1,
      "waiting",
      now,
      now,
    );

    // Seed sample matches
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
      {
        id: "m3",
        sport: "chess",
        title: "Blitz ladder — all ratings welcome",
        host: "Ananya R.",
        campus: "RR Campus",
        court: "Chess Lounge",
        time: "Tomorrow, 4:00 PM",
        skill: "Beginner",
        players: ["Ananya R."],
        max_players: 8,
      },
    ];

    for (const m of seedMatches) {
      db.prepare(
        `
        INSERT INTO matches (
          id, sport, title, host, campus, court, time, skill, players, max_players, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      ).run(
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
        now,
      );
    }

    // Seed sample notifications
    const seedNotifications = [
      {
        id: "n1",
        student_srn: "PES1UG21CS123",
        title: "Reservation Confirmed",
        body: "Badminton Court 1 · RR Campus · Today, 5:00 PM to 6:00 PM. No fee facility pass ready.",
        kind: "booking",
        time: "2 hours ago",
        read: 0,
      },
      {
        id: "n2",
        student_srn: "PES1UG21CS123",
        title: "Standby Queue Active",
        body: "You are currently in Position #1 of 2 for Badminton Court 2 on Today at 6:00 PM.",
        kind: "booking",
        time: "1 hour ago",
        read: 0,
      },
      {
        id: "n3",
        student_srn: "PES1UG21CS123",
        title: "Campus Circular: Turnstile Pass",
        body: "Sports complex turnstiles now accept both physical RFID student cards and digital profile QR passes.",
        kind: "system",
        time: "Yesterday",
        read: 1,
      },
    ];

    for (const n of seedNotifications) {
      db.prepare(
        `
        INSERT INTO notifications (
          id, student_srn, title, body, kind, time, read, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      ).run(n.id, n.student_srn, n.title, n.body, n.kind, n.time, n.read, now);
    }
  }
}

// Student queries
export function getStudent(srnOrPrn) {
  return db
    .prepare("SELECT * FROM students WHERE UPPER(srn) = UPPER(?) OR UPPER(prn) = UPPER(?)")
    .get(srnOrPrn, srnOrPrn);
}

export function getAllStudents() {
  return db.prepare("SELECT * FROM students ORDER BY created_at DESC").all();
}

export function updateStudent(srn, updates) {
  const fields = [];
  const values = [];

  for (const [key, val] of Object.entries(updates)) {
    if (key === "srn") continue;
    fields.push(`${key} = ?`);
    values.push(val);
  }

  fields.push("updated_at = ?");
  values.push(new Date().toISOString());
  values.push(srn);

  db.prepare(`UPDATE students SET ${fields.join(", ")} WHERE srn = ?`).run(...values);
  return getStudent(srn);
}

export function registerStudent({
  srn,
  prn,
  name,
  fullName,
  department = "Computer Science & Engineering",
  campus = "RR Campus",
  semester = "Semester 1",
  skill = "Intermediate",
  email,
  phone = "+91 98765 43210",
  password = "password123",
}) {
  const existing = getStudent(srn);
  if (existing) {
    throw new Error(`Student with SRN '${srn}' is already registered.`);
  }

  const salt = generateSalt();
  const hash = hashPassword(password, salt);
  const now = new Date().toISOString();
  const fName = fullName || name;
  const sName = name || fName.split(" ")[0];
  const sEmail = email || `${sName.toLowerCase()}@pesu.pes.edu`;

  db.prepare(
    `
    INSERT INTO students (
      srn, prn, name, full_name, department, campus, semester, skill,
      email, phone, password_salt, password_hash, clearance_status,
      favorite_sports, hours_logged, matches_played, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active Clearance', '["badminton"]', 0, 0, ?, ?)
  `,
  ).run(
    srn.toUpperCase(),
    prn ? prn.toUpperCase() : srn.toUpperCase(),
    sName,
    fName,
    department,
    campus,
    semester,
    skill,
    sEmail,
    phone,
    salt,
    hash,
    now,
    now,
  );

  return getStudent(srn);
}

// Bookings queries
export function getBookings(srn) {
  if (srn) {
    return db
      .prepare("SELECT * FROM bookings WHERE student_srn = ? ORDER BY created_at DESC")
      .all(srn);
  }
  return db.prepare("SELECT * FROM bookings ORDER BY created_at DESC").all();
}

export function createBooking({
  student_srn,
  court_id,
  court_name,
  sport,
  campus,
  date_label,
  hour,
}) {
  const id = `bk-${Date.now()}`;
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO bookings (
      id, student_srn, court_id, court_name, sport, campus, date_label, hour, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'upcoming', ?)
  `,
  ).run(id, student_srn, court_id, court_name, sport, campus, date_label, hour, now);

  // Increment hours logged for student
  db.prepare("UPDATE students SET hours_logged = hours_logged + 1 WHERE srn = ?").run(student_srn);

  // Add confirmation notification
  addNotification({
    student_srn,
    title: "Reservation Confirmed",
    body: `${court_name} · ${date_label} at ${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? "AM" : "PM"} (${campus}). PESU facility reservation confirmed (No fee).`,
    kind: "booking",
  });

  return db.prepare("SELECT * FROM bookings WHERE id = ?").get(id);
}

export function cancelBooking(bookingId) {
  const target = db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);
  if (!target) return null;

  const now = new Date().toISOString();
  db.prepare("UPDATE bookings SET status = 'cancelled', cancelled_at = ? WHERE id = ?").run(
    now,
    bookingId,
  );

  // Automatic Queue Promotion: Check if students are queued for this court, date, and hour!
  const queued = db
    .prepare(
      `
    SELECT * FROM queue_requests 
    WHERE court_id = ? AND date_label = ? AND hour = ? AND status = 'waiting'
    ORDER BY position ASC
  `,
    )
    .all(target.court_id, target.date_label, target.hour);

  if (queued.length > 0) {
    const firstInLine = queued[0];

    // Promote to confirmed booking
    const newBookingId = `bk-${Date.now()}`;
    db.prepare(
      `
      INSERT INTO bookings (
        id, student_srn, court_id, court_name, sport, campus, date_label, hour, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'upcoming', ?)
    `,
    ).run(
      newBookingId,
      firstInLine.student_srn,
      firstInLine.court_id,
      firstInLine.court_name,
      firstInLine.sport,
      firstInLine.campus,
      firstInLine.date_label,
      firstInLine.hour,
      now,
    );

    // Update queue record to promoted
    db.prepare("UPDATE queue_requests SET status = 'promoted', updated_at = ? WHERE id = ?").run(
      now,
      firstInLine.id,
    );

    // Shift any remaining queue positions
    db.prepare(
      `
      UPDATE queue_requests SET position = position - 1, updated_at = ?
      WHERE court_id = ? AND date_label = ? AND hour = ? AND status = 'waiting' AND id != ?
    `,
    ).run(now, target.court_id, target.date_label, target.hour, firstInLine.id);

    // Dispatch promotion notification to the queued student
    addNotification({
      student_srn: firstInLine.student_srn,
      title: "Waitlist Spot Promoted!",
      body: `A slot opened for ${firstInLine.court_name} on ${firstInLine.date_label} at ${firstInLine.hour % 12 === 0 ? 12 : firstInLine.hour % 12}:00 ${firstInLine.hour < 12 ? "AM" : "PM"}. You have been automatically promoted from the waitlist to a confirmed reservation!`,
      kind: "booking",
    });
  }

  return db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId);
}

// Queue Requests queries
export function getQueueRequests(srn) {
  if (srn) {
    return db
      .prepare("SELECT * FROM queue_requests WHERE student_srn = ? ORDER BY created_at DESC")
      .all(srn);
  }
  return db.prepare("SELECT * FROM queue_requests ORDER BY created_at DESC").all();
}

export function createQueueRequest({
  student_srn,
  court_id,
  court_name,
  sport,
  campus,
  date_label,
  hour,
}) {
  // Check current waiting count
  const waiting = db
    .prepare(
      `
    SELECT * FROM queue_requests 
    WHERE court_id = ? AND date_label = ? AND hour = ? AND status = 'waiting'
  `,
    )
    .all(court_id, date_label, hour);

  if (waiting.length >= 2) {
    return {
      success: false,
      message: "Queue is at maximum capacity (max 2 spots per slot to prevent starvation).",
    };
  }

  const id = `qr-${Date.now()}`;
  const now = new Date().toISOString();
  const position = waiting.length + 1;

  db.prepare(
    `
    INSERT INTO queue_requests (
      id, student_srn, court_id, court_name, sport, campus, date_label, hour, position, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting', ?, ?)
  `,
  ).run(id, student_srn, court_id, court_name, sport, campus, date_label, hour, position, now, now);

  addNotification({
    student_srn,
    title: "Waitlist Queue Registered",
    body: `You are in Position #${position} of 2 for ${court_name} on ${date_label} at ${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? "AM" : "PM"}. You will be automatically promoted if a cancellation occurs.`,
    kind: "booking",
  });

  return {
    success: true,
    request: db.prepare("SELECT * FROM queue_requests WHERE id = ?").get(id),
  };
}

export function cancelQueueRequest(queueId) {
  const now = new Date().toISOString();
  db.prepare("UPDATE queue_requests SET status = 'cancelled', updated_at = ? WHERE id = ?").run(
    now,
    queueId,
  );
  return db.prepare("SELECT * FROM queue_requests WHERE id = ?").get(queueId);
}

// Matches queries
export function getMatches() {
  const rows = db.prepare("SELECT * FROM matches ORDER BY created_at DESC").all();
  return rows.map((r) => ({ ...r, players: JSON.parse(r.players) }));
}

export function createMatch({ sport, title, host, campus, court, time, skill, max_players }) {
  const id = `m-${Date.now()}`;
  const now = new Date().toISOString();
  const players = [host];

  db.prepare(
    `
    INSERT INTO matches (
      id, sport, title, host, campus, court, time, skill, players, max_players, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    sport,
    title,
    host,
    campus,
    court,
    time,
    skill,
    JSON.stringify(players),
    max_players,
    now,
  );

  return {
    id,
    sport,
    title,
    host,
    campus,
    court,
    time,
    skill,
    players,
    max_players,
    created_at: now,
  };
}

export function joinMatch(matchId, playerName) {
  const match = db.prepare("SELECT * FROM matches WHERE id = ?").get(matchId);
  if (!match) return null;

  const players = JSON.parse(match.players);
  if (!players.includes(playerName) && players.length < match.max_players) {
    players.push(playerName);
    db.prepare("UPDATE matches SET players = ? WHERE id = ?").run(JSON.stringify(players), matchId);
  }

  return { ...match, players };
}

// Notifications queries
export function getNotifications(srn) {
  return db
    .prepare("SELECT * FROM notifications WHERE student_srn = ? ORDER BY created_at DESC")
    .all(srn);
}

export function addNotification({ student_srn, title, body, kind }) {
  const id = `n-${Date.now()}`;
  const now = new Date().toISOString();
  db.prepare(
    `
    INSERT INTO notifications (id, student_srn, title, body, kind, time, read, created_at)
    VALUES (?, ?, ?, ?, ?, 'Just now', 0, ?)
  `,
  ).run(id, student_srn, title, body, kind || "system", now);
}

export function markNotificationsRead(srn) {
  db.prepare("UPDATE notifications SET read = 1 WHERE student_srn = ?").run(srn);
}

// Admin raw access
export function adminExecuteSql(sql) {
  const trimmed = sql.trim();
  if (trimmed.toUpperCase().startsWith("SELECT") || trimmed.toUpperCase().startsWith("PRAGMA")) {
    return { type: "query", rows: db.prepare(sql).all() };
  }
  const info = db.exec(sql);
  return { type: "exec", success: true };
}

initDatabase();

import { DatabaseSync } from "node:sqlite";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Central Locked Storage Vault
const LOCKED_DIR = path.join(__dirname, "..", "locked_storage");
if (!fs.existsSync(LOCKED_DIR)) {
  fs.mkdirSync(LOCKED_DIR, { recursive: true });
}

// Database location inside the locked storage vault
const DB_PATH = path.join(LOCKED_DIR, "pesu_sports.db");

// If old DB in data/ exists and locked DB doesn't, copy over
const OLD_DATA_DIR = path.join(__dirname, "..", "data");
const OLD_DB_PATH = path.join(OLD_DATA_DIR, "pesu_sports.db");
if (!fs.existsSync(DB_PATH) && fs.existsSync(OLD_DB_PATH)) {
  try {
    fs.copyFileSync(OLD_DB_PATH, DB_PATH);
  } catch (e) {
    console.error("Migration error:", e);
  }
}

export const db = new DatabaseSync(DB_PATH);

// Master Admin Security Key
export const MASTER_ADMIN_KEY = "123";

export function getMasterKeyDerived() {
  return crypto.createHash("sha256").update(MASTER_ADMIN_KEY).digest();
}

// AES-256-CBC Encryption for Admin Password Access
export function encryptPasswordWithMasterKey(plaintextPassword) {
  const iv = crypto.randomBytes(16);
  const key = getMasterKeyDerived();
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let enc = cipher.update(plaintextPassword, "utf8", "hex");
  enc += cipher.final("hex");
  return iv.toString("hex") + ":" + enc;
}

export function decryptPasswordWithMasterKey(encryptedPayload, providedMasterKey) {
  if (providedMasterKey !== MASTER_ADMIN_KEY) {
    throw new Error("Invalid admin entry key / master password (expected 123).");
  }
  if (!encryptedPayload) {
    return "password123";
  }
  if (!encryptedPayload.includes(":")) {
    return encryptedPayload;
  }
  const [ivHex, encHex] = encryptedPayload.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.createHash("sha256").update(providedMasterKey).digest();
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let dec = decipher.update(encHex, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

// Password cryptography using PBKDF2 with SHA-512 and salt for Web Student Login
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
      password_encrypted TEXT,
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

  // Migrate columns if table already existed without them
  try {
    db.exec("ALTER TABLE students ADD COLUMN password_encrypted TEXT;");
  } catch {}
  try {
    db.exec("ALTER TABLE bookings ADD COLUMN duration TEXT DEFAULT '1 Hour';");
  } catch {}

  seedDefaultData();
}

function seedDefaultData() {
  const existing = db.prepare("SELECT COUNT(*) as count FROM students").get();
  const defaultEnc = encryptPasswordWithMasterKey("password123");

  if (existing.count === 0) {
    const salt = generateSalt();
    const hash = hashPassword("password123", salt);
    const now = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO students (
        srn, prn, name, full_name, department, campus, semester, skill,
        email, phone, password_salt, password_hash, password_encrypted, clearance_status,
        favorite_sports, hours_logged, matches_played, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      defaultEnc,
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
        date_label, hour, status, duration, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      "1 Hour",
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
  } else {
    // Backfill any students missing password_encrypted
    db.prepare("UPDATE students SET password_encrypted = ? WHERE password_encrypted IS NULL").run(
      defaultEnc,
    );
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
  const enc = encryptPasswordWithMasterKey(password);
  const now = new Date().toISOString();
  const fName = fullName || name;
  const sName = name || fName.split(" ")[0];
  const sEmail = email || `${sName.toLowerCase()}@pesu.pes.edu`;

  db.prepare(
    `
    INSERT INTO students (
      srn, prn, name, full_name, department, campus, semester, skill,
      email, phone, password_salt, password_hash, password_encrypted, clearance_status,
      favorite_sports, hours_logged, matches_played, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active Clearance', '["badminton"]', 0, 0, ?, ?)
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
    enc,
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
  duration = "1 Hour",
}) {
  const id = `bk-${Date.now()}`;
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO bookings (
      id, student_srn, court_id, court_name, sport, campus, date_label, hour, status, duration, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'upcoming', ?, ?)
  `,
  ).run(id, student_srn, court_id, court_name, sport, campus, date_label, hour, duration, now);

  db.prepare("UPDATE students SET hours_logged = hours_logged + 1 WHERE srn = ?").run(student_srn);

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

  // Check waitlist for this slot
  const nextInQueue = db
    .prepare(
      `
    SELECT * FROM queue_requests 
    WHERE court_id = ? AND date_label = ? AND hour = ? AND status = 'waiting'
    ORDER BY position ASC, created_at ASC
    LIMIT 1
  `,
    )
    .get(target.court_id, target.date_label, target.hour);

  let promotedStudent = null;
  if (nextInQueue) {
    // Promote queue student to confirmed booking
    const newBookingId = `bk-promoted-${Date.now()}`;
    db.prepare(
      `
      INSERT INTO bookings (
        id, student_srn, court_id, court_name, sport, campus, date_label, hour, status, duration, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'upcoming', '1 Hour', ?)
    `,
    ).run(
      newBookingId,
      nextInQueue.student_srn,
      nextInQueue.court_id,
      nextInQueue.court_name,
      nextInQueue.sport,
      nextInQueue.campus,
      nextInQueue.date_label,
      nextInQueue.hour,
      now,
    );

    db.prepare("UPDATE queue_requests SET status = 'promoted', updated_at = ? WHERE id = ?").run(
      now,
      nextInQueue.id,
    );

    addNotification({
      student_srn: nextInQueue.student_srn,
      title: "Queue Spot Promoted!",
      body: `Great news! A slot for ${nextInQueue.court_name} on ${nextInQueue.date_label} at ${nextInQueue.hour}:00 has CLEARED UP. Your reservation is now CONFIRMED!`,
      kind: "queue",
    });

    promotedStudent = getStudent(nextInQueue.student_srn);
  }

  return {
    booking: db.prepare("SELECT * FROM bookings WHERE id = ?").get(bookingId),
    promoted: nextInQueue,
    promotedStudent,
    freedSlot: target,
  };
}

// Queue requests queries
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

// ----------------------------------------------------------------------------
// Dedicated Desktop Admin App Queries (Required Tables 1, 2, 3)
// ----------------------------------------------------------------------------

// Table 1: Person, Booking place, booking time, booking duration
export function getAdminTable1_Bookings() {
  const rows = db
    .prepare(
      `
    SELECT 
      b.id,
      COALESCE(s.full_name, b.student_srn) AS person,
      b.court_name AS booking_place,
      (b.date_label || ' at ' || (CASE WHEN b.hour > 12 THEN (b.hour - 12) || ':00 PM' WHEN b.hour = 12 THEN '12:00 PM' ELSE b.hour || ':00 AM' END)) AS booking_time,
      COALESCE(b.duration, '1 Hour') AS booking_duration,
      b.status,
      b.student_srn,
      b.sport,
      b.campus,
      b.hour,
      b.date_label
    FROM bookings b
    LEFT JOIN students s ON b.student_srn = s.srn
    ORDER BY b.created_at DESC
  `,
    )
    .all();

  return rows.map((r) => ({
    id: r.id,
    person: r.person,
    booking_place: r.booking_place,
    booking_time: r.booking_time,
    booking_duration: r.booking_duration,
    status: r.status,
    student_srn: r.student_srn,
  }));
}

// Table 2: Person, Number of bookings
export function getAdminTable2_BookingCounts() {
  const rows = db
    .prepare(
      `
    SELECT 
      s.full_name AS person,
      s.srn,
      COUNT(b.id) AS number_of_bookings,
      COUNT(CASE WHEN b.status = 'upcoming' THEN 1 END) AS active_bookings,
      s.email,
      s.phone AS contact
    FROM students s
    LEFT JOIN bookings b ON s.srn = b.student_srn
    GROUP BY s.srn, s.full_name, s.email, s.phone
    ORDER BY number_of_bookings DESC, s.full_name ASC
  `,
    )
    .all();

  return rows.map((r) => ({
    person: r.person,
    number_of_bookings: r.number_of_bookings,
    active_bookings: r.active_bookings,
    srn: r.srn,
    email: r.email,
    contact: r.contact,
  }));
}

// Table 3: Person, Contact, SRN, Password(encrypted), Email
export function getAdminTable3_StudentRecords() {
  const rows = db
    .prepare(
      `
    SELECT 
      full_name AS person,
      phone AS contact,
      srn,
      password_encrypted,
      password_hash,
      email
    FROM students
    ORDER BY created_at DESC
  `,
    )
    .all();

  return rows.map((r) => ({
    person: r.person,
    contact: r.contact || "+91 98765 43210",
    srn: r.srn,
    encrypted_password: r.password_encrypted
      ? `[AES-256 Encrypted: ${r.password_encrypted.slice(0, 16)}...]`
      : "[PBKDF2 Hashed]",
    email: r.email || `${r.srn.toLowerCase()}@pesu.pes.edu`,
  }));
}

// Admin Table 1 Update/Add/Delete
export function updateAdminBooking(
  id,
  { person_name, booking_place, booking_time, booking_duration, status },
) {
  const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(id);
  if (!booking) throw new Error(`Booking with ID ${id} not found.`);

  const updates = [];
  const params = [];

  if (booking_place) {
    updates.push("court_name = ?");
    params.push(booking_place);
  }
  if (booking_duration) {
    updates.push("duration = ?");
    params.push(booking_duration);
  }
  if (status) {
    updates.push("status = ?");
    params.push(status);
  }

  if (updates.length > 0) {
    params.push(id);
    db.prepare(`UPDATE bookings SET ${updates.join(", ")} WHERE id = ?`).run(...params);
  }

  // If person_name given, update student full_name
  if (person_name && booking.student_srn) {
    db.prepare("UPDATE students SET full_name = ?, name = ? WHERE srn = ?").run(
      person_name,
      person_name.split(" ")[0] || person_name,
      booking.student_srn,
    );
  }

  return getAdminTable1_Bookings();
}

export function addAdminBooking({
  student_srn,
  court_name,
  booking_time,
  booking_duration = "1 Hour",
}) {
  // Check student
  let student = getStudent(student_srn);
  if (!student) {
    // If student doesn't exist, create student
    student = registerStudent({
      srn: student_srn.toUpperCase(),
      name: student_srn,
      fullName: student_srn,
      password: "password123",
    });
  }

  const id = `bk-adm-${Date.now()}`;
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO bookings (
      id, student_srn, court_id, court_name, sport, campus, date_label, hour, status, duration, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'upcoming', ?, ?)
  `,
  ).run(
    id,
    student.srn,
    "c1",
    court_name || "Badminton Court 1",
    "badminton",
    student.campus || "RR Campus",
    booking_time || "Today",
    18,
    booking_duration,
    now,
  );

  return getAdminTable1_Bookings();
}

export function deleteAdminBooking(id) {
  db.prepare("DELETE FROM bookings WHERE id = ?").run(id);
  return getAdminTable1_Bookings();
}

// Admin Table 3 Update Student Info
export function updateAdminStudentRecord(srn, { person, contact, email }) {
  const student = getStudent(srn);
  if (!student) throw new Error(`Student ${srn} not found.`);

  const updates = [];
  const params = [];

  if (person) {
    updates.push("full_name = ?");
    updates.push("name = ?");
    params.push(person);
    params.push(person.split(" ")[0] || person);
  }
  if (contact) {
    updates.push("phone = ?");
    params.push(contact);
  }
  if (email) {
    updates.push("email = ?");
    params.push(email);
  }

  if (updates.length > 0) {
    updates.push("updated_at = ?");
    params.push(new Date().toISOString());
    params.push(student.srn);
    db.prepare(`UPDATE students SET ${updates.join(", ")} WHERE srn = ?`).run(...params);
  }

  return getAdminTable3_StudentRecords();
}

// Admin Password Reveal Dialog Handler
export function revealStudentPassword(srn, masterKey) {
  if (masterKey !== MASTER_ADMIN_KEY) {
    throw new Error("Access Denied: Incorrect Admin Master Key (expected 123).");
  }

  const student = getStudent(srn);
  if (!student) throw new Error(`Student ${srn} not found.`);

  const plaintext = decryptPasswordWithMasterKey(student.password_encrypted, masterKey);
  return {
    srn: student.srn,
    person: student.full_name,
    plaintextPassword: plaintext,
  };
}

// Admin Password Edit Handler (2-time confirmation required)
export function updateStudentPasswordByAdmin(srn, newPassword, confirmPassword, masterKey) {
  if (masterKey !== MASTER_ADMIN_KEY) {
    throw new Error("Access Denied: Incorrect Admin Master Key (expected 123).");
  }
  if (!newPassword || newPassword.length < 4) {
    throw new Error("Password must be at least 4 characters long.");
  }
  if (newPassword !== confirmPassword) {
    throw new Error("Confirmation password does not match. Please enter the same password twice.");
  }

  const student = getStudent(srn);
  if (!student) throw new Error(`Student ${srn} not found.`);

  const newSalt = generateSalt();
  const newHash = hashPassword(newPassword, newSalt);
  const newEnc = encryptPasswordWithMasterKey(newPassword);
  const now = new Date().toISOString();

  db.prepare(
    `
    UPDATE students 
    SET password_salt = ?, password_hash = ?, password_encrypted = ?, updated_at = ?
    WHERE srn = ?
  `,
  ).run(newSalt, newHash, newEnc, now, student.srn);

  return {
    success: true,
    srn: student.srn,
    message: `Password for ${student.full_name} (${student.srn}) securely updated and re-encrypted.`,
  };
}

// Admin SQL execution
export function adminExecuteSql(sql) {
  const trimmed = sql.trim();
  if (trimmed.toUpperCase().startsWith("SELECT") || trimmed.toUpperCase().startsWith("PRAGMA")) {
    return { type: "query", rows: db.prepare(sql).all() };
  }
  db.exec(sql);
  return { type: "exec", success: true };
}

initDatabase();

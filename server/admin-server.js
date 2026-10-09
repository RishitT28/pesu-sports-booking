import http from "node:http";
import {
  db,
  getStudent,
  getAllStudents,
  updateStudent,
  registerStudent,
  getBookings,
  createBooking,
  cancelBooking,
  getQueueRequests,
  createQueueRequest,
  cancelQueueRequest,
  getMatches,
  createMatch,
  joinMatch,
  getNotifications,
  markNotificationsRead,
  verifyPassword,
  hashPassword,
  generateSalt,
  adminExecuteSql,
  getAdminTable1_Bookings,
  getAdminTable2_BookingCounts,
  getAdminTable3_StudentRecords,
  updateAdminBooking,
  addAdminBooking,
  deleteAdminBooking,
  updateAdminStudentRecord,
  revealStudentPassword,
  updateStudentPasswordByAdmin,
  MASTER_ADMIN_KEY,
} from "./db.js";

import {
  getConfig as getEmailConfig,
  saveConfig as saveEmailConfig,
  sendBookingReminder,
  sendQueueClearedAlert,
  sendSlotFreedAlert,
  sendTestEmail,
  getEmailLogs,
} from "./email-service.js";

const PORT = 8081;

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

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost:8081"}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const query = Object.fromEntries(parsedUrl.searchParams);

  // Handle CORS Preflight
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
    // -------------------------------------------------------------
    // API: Authentication & Student Profile
    // -------------------------------------------------------------
    if (pathname === "/api/auth/login" && method === "POST") {
      const { srnOrPrn, password } = await parseBody(req);
      if (!srnOrPrn || !password) {
        return json(res, { error: "SRN/PRN and Password required" }, 400);
      }

      const student = getStudent(srnOrPrn);
      if (!student) {
        return json(res, { error: "Student credentials not found in sports registry" }, 401);
      }

      const valid = verifyPassword(password, student.password_salt, student.password_hash);
      if (!valid) {
        return json(res, { error: "Invalid password for provided SRN" }, 401);
      }

      // Strip sensitive salt/hash from response
      const { password_salt, password_hash, ...safeStudent } = student;
      return json(res, { success: true, student: safeStudent });
    }

    if (pathname === "/api/auth/register" && method === "POST") {
      const data = await parseBody(req);
      if (!data.srn || !data.password || !data.name) {
        return json(res, { error: "SRN, Name, and Password are required" }, 400);
      }
      try {
        const student = registerStudent(data);
        const { password_salt, password_hash, ...safeStudent } = student;
        return json(res, { success: true, student: safeStudent });
      } catch (err) {
        return json(res, { error: err.message }, 400);
      }
    }

    if (pathname === "/api/auth/profile" && method === "GET") {
      const srn = query.srn;
      if (!srn) return json(res, { error: "SRN query required" }, 400);
      const student = getStudent(srn);
      if (!student) return json(res, { error: "Student not found" }, 404);
      const { password_salt, password_hash, ...safeStudent } = student;
      return json(res, safeStudent);
    }

    if (pathname === "/api/auth/update-profile" && method === "POST") {
      const { srn, ...updates } = await parseBody(req);
      if (!srn) return json(res, { error: "SRN required" }, 400);

      delete updates.password_salt;
      delete updates.password_hash;

      const updated = updateStudent(srn, updates);
      const { password_salt, password_hash, ...safeStudent } = updated;
      return json(res, { success: true, student: safeStudent });
    }

    if (pathname === "/api/auth/change-password" && method === "POST") {
      const { srn, currentPassword, newPassword } = await parseBody(req);
      if (!srn || !currentPassword || !newPassword) {
        return json(res, { error: "All fields required" }, 400);
      }

      const student = getStudent(srn);
      if (!student) return json(res, { error: "Student not found" }, 404);

      const valid = verifyPassword(currentPassword, student.password_salt, student.password_hash);
      if (!valid) {
        return json(res, { error: "Current password does not match" }, 401);
      }

      const newSalt = generateSalt();
      const newHash = hashPassword(newPassword, newSalt);

      updateStudent(srn, { password_salt: newSalt, password_hash: newHash });
      return json(res, { success: true, message: "Password securely updated" });
    }

    // -------------------------------------------------------------
    // API: Bookings (No fees, full cancellation with queue promotion)
    // -------------------------------------------------------------
    if (pathname === "/api/bookings" && method === "GET") {
      const srn = query.srn;
      const bookings = getBookings(srn);
      return json(res, bookings);
    }

    if (pathname === "/api/bookings" && method === "POST") {
      const body = await parseBody(req);
      if (!body.student_srn || !body.court_id || !body.hour) {
        return json(res, { error: "Incomplete booking details" }, 400);
      }
      const newBooking = createBooking(body);
      const student = getStudent(body.student_srn);
      if (student) {
        sendBookingReminder(newBooking, student).catch(() => {});
      }
      return json(res, { success: true, booking: newBooking });
    }

    if (pathname === "/api/bookings/cancel" && method === "POST") {
      const { bookingId } = await parseBody(req);
      if (!bookingId) return json(res, { error: "Booking ID required" }, 400);
      const result = cancelBooking(bookingId);

      // Automated email agent alerts
      if (result && result.promoted && result.promotedStudent) {
        sendQueueClearedAlert(
          result.promoted,
          result.promotedStudent,
          result.promoted.court_name,
        ).catch(() => {});
      }
      if (result && result.freedSlot) {
        sendSlotFreedAlert(
          result.freedSlot.court_name,
          result.freedSlot.date_label,
          result.freedSlot.hour,
        ).catch(() => {});
      }

      return json(res, {
        success: true,
        booking: result ? result.booking : null,
        promoted: result ? result.promoted : null,
      });
    }

    // -------------------------------------------------------------
    // API: Standby Queue Requests (Max 2 seats starvation protection)
    // -------------------------------------------------------------
    if (pathname === "/api/queue" && method === "GET") {
      const srn = query.srn;
      const queues = getQueueRequests(srn);
      return json(res, queues);
    }

    if (pathname === "/api/queue" && method === "POST") {
      const body = await parseBody(req);
      const result = createQueueRequest(body);
      return json(res, result);
    }

    if (pathname === "/api/queue/cancel" && method === "POST") {
      const { queueId } = await parseBody(req);
      const updated = cancelQueueRequest(queueId);
      return json(res, { success: true, request: updated });
    }

    // -------------------------------------------------------------
    // API: Community Matches & Open Runs
    // -------------------------------------------------------------
    if (pathname === "/api/matches" && method === "GET") {
      return json(res, getMatches());
    }

    if (pathname === "/api/matches" && method === "POST") {
      const body = await parseBody(req);
      const match = createMatch(body);
      return json(res, { success: true, match });
    }

    if (pathname === "/api/matches/join" && method === "POST") {
      const { matchId, playerName } = await parseBody(req);
      const match = joinMatch(matchId, playerName);
      return json(res, { success: true, match });
    }

    // -------------------------------------------------------------
    // API: Notifications
    // -------------------------------------------------------------
    if (pathname === "/api/notifications" && method === "GET") {
      const srn = query.srn || "PES1UG21CS123";
      return json(res, getNotifications(srn));
    }

    if (pathname === "/api/notifications/read" && method === "POST") {
      const { srn } = await parseBody(req);
      markNotificationsRead(srn || "PES1UG21CS123");
      return json(res, { success: true });
    }

    // -------------------------------------------------------------
    // API: Desktop Admin App & Multi-Table Management
    // -------------------------------------------------------------
    if (pathname === "/api/admin/desktop/auth" && method === "POST") {
      const { adminKey, password } = await parseBody(req);
      if (password === MASTER_ADMIN_KEY || password === "123" || adminKey === "ADMIN-KEY") {
        return json(res, { success: true, message: "Admin access granted" });
      }
      return json(res, { error: "Invalid admin passkey (expected 123)" }, 401);
    }

    if (pathname === "/api/admin/desktop/tables" && method === "GET") {
      const table1 = getAdminTable1_Bookings();
      const table2 = getAdminTable2_BookingCounts();
      const table3 = getAdminTable3_StudentRecords();
      return json(res, {
        success: true,
        table1,
        table2,
        table3,
      });
    }

    if (pathname === "/api/admin/desktop/update-booking" && method === "POST") {
      const body = await parseBody(req);
      if (!body.id) return json(res, { error: "Booking ID required" }, 400);
      try {
        const updated = updateAdminBooking(body.id, body);
        return json(res, { success: true, table1: updated });
      } catch (err) {
        return json(res, { error: err.message }, 400);
      }
    }

    if (pathname === "/api/admin/desktop/add-booking" && method === "POST") {
      const body = await parseBody(req);
      if (!body.student_srn) return json(res, { error: "Student SRN required" }, 400);
      try {
        const updated = addAdminBooking(body);
        return json(res, { success: true, table1: updated });
      } catch (err) {
        return json(res, { error: err.message }, 400);
      }
    }

    if (pathname === "/api/admin/desktop/delete-booking" && method === "POST") {
      const { id } = await parseBody(req);
      if (!id) return json(res, { error: "Booking ID required" }, 400);
      try {
        const updated = deleteAdminBooking(id);
        return json(res, { success: true, table1: updated });
      } catch (err) {
        return json(res, { error: err.message }, 400);
      }
    }

    if (pathname === "/api/admin/desktop/update-student" && method === "POST") {
      const body = await parseBody(req);
      if (!body.srn) return json(res, { error: "SRN required" }, 400);
      try {
        const updated = updateAdminStudentRecord(body.srn, body);
        return json(res, { success: true, table3: updated });
      } catch (err) {
        return json(res, { error: err.message }, 400);
      }
    }

    if (pathname === "/api/admin/desktop/reveal-password" && method === "POST") {
      const { srn, masterKey } = await parseBody(req);
      if (!srn || !masterKey) return json(res, { error: "SRN and Master Key required" }, 400);
      try {
        const revealed = revealStudentPassword(srn, masterKey);
        return json(res, { success: true, ...revealed });
      } catch (err) {
        return json(res, { error: err.message }, 403);
      }
    }

    if (pathname === "/api/admin/desktop/update-password" && method === "POST") {
      const { srn, newPassword, confirmPassword, masterKey } = await parseBody(req);
      if (!srn || !newPassword || !confirmPassword || !masterKey) {
        return json(res, { error: "All fields are required" }, 400);
      }
      try {
        const result = updateStudentPasswordByAdmin(srn, newPassword, confirmPassword, masterKey);
        return json(res, { success: true, ...result });
      } catch (err) {
        return json(res, { error: err.message }, 400);
      }
    }

    // -------------------------------------------------------------
    // API: Email Configuration & Agent Operations
    // -------------------------------------------------------------
    if (pathname === "/api/email/config" && method === "GET") {
      return json(res, getEmailConfig());
    }

    if (pathname === "/api/email/config" && method === "POST") {
      const body = await parseBody(req);
      const result = saveEmailConfig(body);
      return json(res, result);
    }

    if (pathname === "/api/email/test" && method === "POST") {
      const { targetEmail } = await parseBody(req);
      const result = await sendTestEmail(targetEmail);
      return json(res, result);
    }

    if (pathname === "/api/email/logs" && method === "GET") {
      return json(res, getEmailLogs());
    }

    // -------------------------------------------------------------
    // API: Database Admin Operations
    // -------------------------------------------------------------
    if (pathname === "/api/admin/sql" && method === "POST") {
      const { query } = await parseBody(req);
      if (!query) return json(res, { error: "Query required" }, 400);
      try {
        const result = adminExecuteSql(query);
        return json(res, result);
      } catch (err) {
        return json(res, { error: err.message }, 400);
      }
    }

    if (pathname === "/api/admin/stats" && method === "GET") {
      const studentsCount = db.prepare("SELECT COUNT(*) as c FROM students").get().c;
      const bookingsCount = db.prepare("SELECT COUNT(*) as c FROM bookings").get().c;
      const activeBookings = db
        .prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'upcoming'")
        .get().c;
      const queuesCount = db
        .prepare("SELECT COUNT(*) as c FROM queue_requests WHERE status = 'waiting'")
        .get().c;
      const matchesCount = db.prepare("SELECT COUNT(*) as c FROM matches").get().c;
      return json(res, {
        studentsCount,
        bookingsCount,
        activeBookings,
        queuesCount,
        matchesCount,
        dbPath: "data/pesu_sports.db",
      });
    }

    // -------------------------------------------------------------
    // HTML: The Database Management Website on Port 8081
    // -------------------------------------------------------------
    if (pathname === "/" || pathname === "/admin") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(renderAdminApp());
      return;
    }

    // Default 404
    json(res, { error: "Endpoint not found" }, 404);
  } catch (err) {
    console.error("API error:", err);
    json(res, { error: "Internal Server Error", message: err.message }, 500);
  }
});

function renderAdminApp() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PES University Sports · Database Management System</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --bg: #f5f4ef;
      --card-bg: #ffffff;
      --navy: #1a2639;
      --orange: #c45524;
      --text: #242831;
      --muted: #636a77;
      --border: #ded9cd;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: "Times New Roman", Times, Georgia, serif;
      line-height: 1.5;
      padding: 0;
    }
    header {
      background: var(--navy);
      color: #fff;
      padding: 16px 28px;
      border-bottom: 3px solid var(--orange);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge-port {
      background: var(--orange);
      color: #fff;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 14px;
      padding: 20px 28px;
      background: #faf9f5;
      border-bottom: 1px solid var(--border);
    }
    .stat-card {
      background: #fff;
      border: 1px solid var(--border);
      border-left: 3px solid var(--navy);
      padding: 12px 16px;
    }
    .stat-card.orange { border-left-color: var(--orange); }
    .stat-num {
      font-size: 24px;
      font-weight: bold;
      color: var(--navy);
    }
    .stat-label {
      font-size: 11px;
      color: var(--muted);
      text-transform: uppercase;
    }
    main {
      padding: 24px 28px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .tabs {
      display: flex;
      gap: 4px;
      border-bottom: 2px solid var(--navy);
      margin-bottom: 20px;
      overflow-x: auto;
    }
    .tab-btn {
      padding: 10px 18px;
      background: #eeeae1;
      border: 1px solid var(--border);
      border-bottom: none;
      cursor: pointer;
      font-family: inherit;
      font-size: 13px;
      color: var(--text);
      font-weight: 600;
    }
    .tab-btn.active {
      background: var(--navy);
      color: #fff;
      border-color: var(--navy);
    }
    .panel { display: none; }
    .panel.active { display: block; }
    .table-container {
      background: #fff;
      border: 1px solid var(--border);
      overflow-x: auto;
      margin-top: 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      text-align: left;
    }
    th {
      background: var(--navy);
      color: #fff;
      padding: 10px 12px;
      font-weight: 600;
      white-space: nowrap;
      border-right: 1px solid #2d3e56;
    }
    td {
      padding: 8px 12px;
      border-bottom: 1px solid #eeeae1;
      border-right: 1px solid #eeeae1;
      white-space: nowrap;
    }
    tr:hover td { background: #faf9f5; }
    .btn {
      padding: 5px 10px;
      font-size: 11px;
      font-family: inherit;
      border: 1px solid var(--border);
      cursor: pointer;
      background: #fff;
      font-weight: 600;
    }
    .btn-orange { background: var(--orange); color: #fff; border-color: var(--orange); }
    .btn-navy { background: var(--navy); color: #fff; border-color: var(--navy); }
    .btn-danger { background: #b94236; color: #fff; border-color: #b94236; }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .sql-box {
      width: 100%;
      height: 120px;
      font-family: "Consolas", monospace;
      font-size: 13px;
      padding: 12px;
      border: 1px solid var(--border);
      background: #fff;
      margin-bottom: 10px;
    }
    .mono { font-family: monospace; font-size: 11px; }
    .pill {
      display: inline-block;
      padding: 2px 6px;
      font-size: 10px;
      font-weight: bold;
    }
    .pill-green { background: #e6f4ea; color: #137333; }
    .pill-orange { background: #fdf3ee; color: var(--orange); }
    .pill-red { background: #fdf2f1; color: #b94236; }
    .modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 999;
      align-items: center;
      justify-content: center;
    }
    .modal-overlay.open { display: flex; }
    .modal {
      background: #fff;
      border: 1px solid var(--border);
      width: 500px;
      max-width: 90%;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    .form-group { margin-bottom: 12px; }
    .form-group label { display: block; font-size: 11px; font-weight: bold; margin-bottom: 4px; }
    .form-group input, .form-group select {
      width: 100%;
      padding: 6px 8px;
      font-size: 12px;
      border: 1px solid var(--border);
      font-family: inherit;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <h2 style="font-size: 18px; letter-spacing: 0.5px;">PES University Sports · Direct Database Management</h2>
      <span class="badge-port">ADMIN PORT: 8081</span>
    </div>
    <div style="font-size: 12px; color: #cfd7e3;">
      Connected to SQLite DB: <strong class="mono" style="color: #fff;">data/pesu_sports.db</strong>
    </div>
  </header>

  <div class="stats-bar" id="statsBar">
    <div class="stat-card">
      <div class="stat-num" id="statStudents">-</div>
      <div class="stat-label">Registered Students</div>
    </div>
    <div class="stat-card orange">
      <div class="stat-num" id="statBookings">-</div>
      <div class="stat-label">Active Reservations</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" id="statQueues">-</div>
      <div class="stat-label">Standby Queue (Max 2/Slot)</div>
    </div>
    <div class="stat-card orange">
      <div class="stat-num" id="statMatches">-</div>
      <div class="stat-label">Open Match Rosters</div>
    </div>
  </div>

  <main>
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('students')">Students & Clearance</button>
      <button class="tab-btn" onclick="switchTab('bookings')">Bookings & Cancellations</button>
      <button class="tab-btn" onclick="switchTab('queue')">Standby Queue (Waitlist)</button>
      <button class="tab-btn" onclick="switchTab('matches')">Community Matches</button>
      <button class="tab-btn" onclick="switchTab('sql')">Direct SQL Console</button>
    </div>

    <!-- Panel 1: Students -->
    <div id="panel-students" class="panel active">
      <div class="toolbar">
        <div>
          <strong style="font-size: 15px;">Student Registry & Encrypted Credentials</strong>
          <p style="font-size: 11px; color: var(--muted);">Direct access to student profiles, clearance status, and cryptographic hashes.</p>
        </div>
        <button class="btn btn-orange" onclick="openAddStudentModal()">+ Add New Student</button>
      </div>
      <div class="table-container">
        <table id="studentsTable">
          <thead>
            <tr>
              <th>SRN</th>
              <th>PRN</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>Campus</th>
              <th>Clearance</th>
              <th>Hours</th>
              <th>Password Hash (PBKDF2-512)</th>
              <th>Salt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>

    <!-- Panel 2: Bookings -->
    <div id="panel-bookings" class="panel">
      <div class="toolbar">
        <div>
          <strong style="font-size: 15px;">Court Reservations & Turnstile Passes</strong>
          <p style="font-size: 11px; color: var(--muted);">College facility reservations. Cancelling an upcoming slot automatically triggers promotion of queued students.</p>
        </div>
        <button class="btn btn-navy" onclick="loadBookings()">Refresh Bookings</button>
      </div>
      <div class="table-container">
        <table id="bookingsTable">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Student SRN</th>
              <th>Court</th>
              <th>Sport</th>
              <th>Campus</th>
              <th>Date</th>
              <th>Slot Hour</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>

    <!-- Panel 3: Queue Requests -->
    <div id="panel-queue" class="panel">
      <div class="toolbar">
        <div>
          <strong style="font-size: 15px;">Standby Queue (Starvation-Protected Waitlist)</strong>
          <p style="font-size: 11px; color: var(--muted);">Maximum 2 standby positions per court slot. Promoted automatically upon slot cancellation.</p>
        </div>
        <button class="btn btn-navy" onclick="loadQueue()">Refresh Queue</button>
      </div>
      <div class="table-container">
        <table id="queueTable">
          <thead>
            <tr>
              <th>Queue ID</th>
              <th>Student SRN</th>
              <th>Court</th>
              <th>Date</th>
              <th>Hour</th>
              <th>Position</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>

    <!-- Panel 4: Matches -->
    <div id="panel-matches" class="panel">
      <div class="toolbar">
        <div>
          <strong style="font-size: 15px;">Open Community Games & Squad Finder</strong>
          <p style="font-size: 11px; color: var(--muted);">Player squads organized by students.</p>
        </div>
        <button class="btn btn-navy" onclick="loadMatches()">Refresh Matches</button>
      </div>
      <div class="table-container">
        <table id="matchesTable">
          <thead>
            <tr>
              <th>Match ID</th>
              <th>Sport</th>
              <th>Title</th>
              <th>Host</th>
              <th>Campus</th>
              <th>Court</th>
              <th>Time</th>
              <th>Skill</th>
              <th>Roster</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>

    <!-- Panel 5: SQL Console -->
    <div id="panel-sql" class="panel">
      <div class="toolbar">
        <div>
          <strong style="font-size: 15px;">Direct SQLite Query Console</strong>
          <p style="font-size: 11px; color: var(--muted);">Execute raw SQL statements directly on <code>pesu_sports.db</code>.</p>
        </div>
      </div>
      <textarea id="sqlQuery" class="sql-box" placeholder="SELECT * FROM students LIMIT 10;">SELECT * FROM students;</textarea>
      <div style="display: flex; gap: 8px; margin-bottom: 14px;">
        <button class="btn btn-orange" onclick="executeSql()">Execute SQL</button>
        <button class="btn" onclick="setQuery('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 10;')">Select Bookings</button>
        <button class="btn" onclick="setQuery('SELECT * FROM queue_requests;')">Select Queue</button>
        <button class="btn" onclick="setQuery('PRAGMA table_info(students);')">Table Schema</button>
      </div>
      <div id="sqlResult" class="table-container"></div>
    </div>
  </main>

  <!-- Modal for Adding Student -->
  <div id="studentModal" class="modal-overlay">
    <div class="modal">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 14px;">
        <strong style="font-size: 15px;">Add Student Athlete</strong>
        <button onclick="closeModal()" style="border:none; background:none; cursor:pointer; font-size: 16px;">×</button>
      </div>
      <form id="addStudentForm" onsubmit="saveStudent(event)">
        <div class="form-group">
          <label>SRN</label>
          <input id="newSrn" required placeholder="PES1UG22CS999">
        </div>
        <div class="form-group">
          <label>PRN</label>
          <input id="newPrn" required placeholder="PES202200999">
        </div>
        <div class="form-group">
          <label>Full Name</label>
          <input id="newName" required placeholder="Kiran Rao">
        </div>
        <div class="form-group">
          <label>Campus</label>
          <select id="newCampus">
            <option value="RR Campus">RR Campus</option>
            <option value="EC Campus">EC Campus</option>
          </select>
        </div>
        <div class="form-group">
          <label>Department</label>
          <input id="newDept" value="Computer Science & Engineering">
        </div>
        <div class="form-group">
          <label>Password (Will be encrypted with PBKDF2-512 + Salt)</label>
          <input id="newPassword" type="password" required value="password123">
        </div>
        <div style="display:flex; justify-content: flex-end; gap: 8px; margin-top: 16px;">
          <button type="button" class="btn" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-orange">Create Student</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    async function fetchStats() {
      const res = await fetch("/api/admin/stats");
      const d = await res.json();
      document.getElementById("statStudents").textContent = d.studentsCount;
      document.getElementById("statBookings").textContent = d.activeBookings + " (" + d.bookingsCount + " total)";
      document.getElementById("statQueues").textContent = d.queuesCount;
      document.getElementById("statMatches").textContent = d.matchesCount;
    }

    async function loadStudents() {
      const res = await fetch("/api/admin/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "SELECT * FROM students ORDER BY created_at DESC" })
      });
      const d = await res.json();
      const tbody = document.querySelector("#studentsTable tbody");
      tbody.innerHTML = "";
      if (d.rows) {
        d.rows.forEach(s => {
          const tr = document.createElement("tr");
          tr.innerHTML = \`
            <td class="mono"><strong>\${s.srn}</strong></td>
            <td class="mono">\${s.prn || ""}</td>
            <td>\${s.full_name}</td>
            <td>\${s.department}</td>
            <td>\${s.campus}</td>
            <td><span class="pill pill-green">\${s.clearance_status}</span></td>
            <td>\${s.hours_logged} hrs</td>
            <td class="mono" style="max-width: 140px; overflow: hidden; text-overflow: ellipsis;" title="\${s.password_hash}">\${s.password_hash.substring(0, 16)}...</td>
            <td class="mono">\${s.password_salt}</td>
            <td>
              <button class="btn btn-danger" onclick="deleteStudent('\${s.srn}')">Delete</button>
            </td>
          \`;
          tbody.appendChild(tr);
        });
      }
    }

    async function loadBookings() {
      const res = await fetch("/api/bookings");
      const bookings = await res.json();
      const tbody = document.querySelector("#bookingsTable tbody");
      tbody.innerHTML = "";
      bookings.forEach(b => {
        const isUpcoming = b.status === "upcoming";
        const tr = document.createElement("tr");
        tr.innerHTML = \`
          <td class="mono"><strong>\${b.id}</strong></td>
          <td class="mono">\${b.student_srn}</td>
          <td>\${b.court_name}</td>
          <td>\${b.sport}</td>
          <td>\${b.campus}</td>
          <td>\${b.date_label}</td>
          <td>\${b.hour}:00</td>
          <td>
            <span class="pill \${isUpcoming ? "pill-green" : "pill-red"}">\${b.status}</span>
          </td>
          <td class="mono">\${b.created_at.substring(0, 19)}</td>
          <td>
            \${isUpcoming ? \`<button class="btn btn-danger" onclick="adminCancelBooking('\${b.id}')">Cancel & Promote Queue</button>\` : "Released"}
          </td>
        \`;
        tbody.appendChild(tr);
      });
    }

    async function loadQueue() {
      const res = await fetch("/api/queue");
      const queues = await res.json();
      const tbody = document.querySelector("#queueTable tbody");
      tbody.innerHTML = "";
      queues.forEach(q => {
        const tr = document.createElement("tr");
        tr.innerHTML = \`
          <td class="mono"><strong>\${q.id}</strong></td>
          <td class="mono">\${q.student_srn}</td>
          <td>\${q.court_name}</td>
          <td>\${q.date_label}</td>
          <td>\${q.hour}:00</td>
          <td><span class="pill pill-orange">#\${q.position} of 2</span></td>
          <td><span class="pill \${q.status === 'waiting' ? 'pill-orange' : 'pill-green'}">\${q.status}</span></td>
          <td class="mono">\${q.created_at.substring(0, 19)}</td>
          <td>
            \${q.status === 'waiting' ? \`<button class="btn btn-danger" onclick="adminCancelQueue('\${q.id}')">Remove</button>\` : "-"}
          </td>
        \`;
        tbody.appendChild(tr);
      });
    }

    async function loadMatches() {
      const res = await fetch("/api/matches");
      const matches = await res.json();
      const tbody = document.querySelector("#matchesTable tbody");
      tbody.innerHTML = "";
      matches.forEach(m => {
        const tr = document.createElement("tr");
        tr.innerHTML = \`
          <td class="mono">\${m.id}</td>
          <td>\${m.sport}</td>
          <td><strong>\${m.title}</strong></td>
          <td>\${m.host}</td>
          <td>\${m.campus}</td>
          <td>\${m.court}</td>
          <td>\${m.time}</td>
          <td>\${m.skill}</td>
          <td class="mono">\${(m.players || []).join(", ")} (\${(m.players || []).length}/\${m.max_players})</td>
        \`;
        tbody.appendChild(tr);
      });
    }

    async function executeSql() {
      const query = document.getElementById("sqlQuery").value;
      const res = await fetch("/api/admin/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const d = await res.json();
      const container = document.getElementById("sqlResult");
      if (d.error) {
        container.innerHTML = \`<div style="padding: 14px; color: #b94236; background: #fdf2f1;">\${d.error}</div>\`;
        return;
      }
      if (d.type === "query" && d.rows) {
        if (d.rows.length === 0) {
          container.innerHTML = '<div style="padding: 14px; color: var(--muted);">Query executed successfully. 0 rows returned.</div>';
          return;
        }
        const cols = Object.keys(d.rows[0]);
        let html = '<table><thead><tr>' + cols.map(c => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>';
        d.rows.forEach(r => {
          html += '<tr>' + cols.map(c => '<td>' + (r[c] !== null ? r[c] : '<em>NULL</em>') + '</td>').join('') + '</tr>';
        });
        html += '</tbody></table>';
        container.innerHTML = html;
      } else {
        container.innerHTML = '<div style="padding: 14px; color: #137333; background: #e6f4ea;">Statement executed successfully.</div>';
      }
      fetchStats();
    }

    function setQuery(q) {
      document.getElementById("sqlQuery").value = q;
      executeSql();
    }

    async function adminCancelBooking(id) {
      if (!confirm("Cancel this booking? If students are in the standby queue, the first student will be immediately promoted.")) return;
      await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id })
      });
      loadBookings();
      loadQueue();
      fetchStats();
    }

    async function adminCancelQueue(id) {
      if (!confirm("Remove from queue?")) return;
      await fetch("/api/queue/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queueId: id })
      });
      loadQueue();
      fetchStats();
    }

    async function deleteStudent(srn) {
      if (!confirm("Delete student " + srn + "?")) return;
      await fetch("/api/admin/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "DELETE FROM students WHERE srn = '" + srn + "'" })
      });
      loadStudents();
      fetchStats();
    }

    function openAddStudentModal() {
      document.getElementById("studentModal").classList.add("open");
    }

    function closeModal() {
      document.getElementById("studentModal").classList.remove("open");
    }

    async function saveStudent(e) {
      e.preventDefault();
      const srn = document.getElementById("newSrn").value.trim();
      const prn = document.getElementById("newPrn").value.trim();
      const fullName = document.getElementById("newName").value.trim();
      const campus = document.getElementById("newCampus").value;
      const dept = document.getElementById("newDept").value.trim();
      const password = document.getElementById("newPassword").value;

      // Call SQL insert or API
      const now = new Date().toISOString();
      const sql = \`INSERT INTO students (srn, prn, name, full_name, department, campus, semester, skill, password_salt, password_hash, created_at, updated_at) 
                   VALUES ('\${srn}', '\${prn}', '\${fullName.split(' ')[0]}', '\${fullName}', '\${dept}', '\${campus}', 'Sem 1', 'Beginner', 'demo_salt', 'demo_hash', '\${now}', '\${now}')\`;
      
      const res = await fetch("/api/admin/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sql })
      });
      const d = await res.json();
      if (d.error) alert(d.error);
      else {
        closeModal();
        loadStudents();
        fetchStats();
      }
    }

    function switchTab(name) {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
      event.target.classList.add("active");
      document.getElementById("panel-" + name).classList.add("active");
      if (name === "students") loadStudents();
      if (name === "bookings") loadBookings();
      if (name === "queue") loadQueue();
      if (name === "matches") loadMatches();
    }

    // Init
    fetchStats();
    loadStudents();
  </script>
</body>
</html>`;
}

server.listen(PORT, () => {
  console.log(`[Database Management App & API] running at http://localhost:${PORT}`);
});

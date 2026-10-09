import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, "..", "locked_storage", "email_config.json");
const LOG_PATH = path.join(__dirname, "..", "locked_storage", "email_dispatches.log");

let emailTransporter = null;
let currentConfig = loadConfig();
const emailLogs = [];

export function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("[Email Service] Error reading email config:", err.message);
  }

  return {
    adminEmail: "sportsdesk@pesu.pes.edu",
    senderName: "PES University Sports Clearance Office",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    secure: false,
    auth: {
      user: "sportsdesk@pesu.pes.edu",
      pass: "",
    },
    triggers: {
      bookingReminder: true,
      slotFreed: true,
      queueCleared: true,
    },
    lastUpdated: new Date().toISOString(),
  };
}

export function saveConfig(newConfig) {
  currentConfig = {
    ...currentConfig,
    ...newConfig,
    lastUpdated: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(currentConfig, null, 2), "utf8");
    emailTransporter = null; // Re-create transporter on next send
    logEvent("SYSTEM", "CONFIG_UPDATED", `Email agent configured for ${currentConfig.adminEmail}`);
    return { success: true, config: currentConfig };
  } catch (err) {
    console.error("[Email Service] Error saving email config:", err.message);
    return { success: false, error: err.message };
  }
}

export function getConfig() {
  if (!currentConfig) currentConfig = loadConfig();
  return currentConfig;
}

function getTransporter() {
  if (emailTransporter) return emailTransporter;

  const cfg = getConfig();
  if (!cfg.auth || !cfg.auth.pass) {
    // Return null if no password configured
    return null;
  }

  emailTransporter = nodemailer.createTransport({
    host: cfg.smtpHost || "smtp.gmail.com",
    port: parseInt(cfg.smtpPort, 10) || 587,
    secure: Boolean(cfg.secure),
    auth: {
      user: cfg.auth.user || cfg.adminEmail,
      pass: cfg.auth.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return emailTransporter;
}

function logEvent(recipient, type, details) {
  const entry = {
    timestamp: new Date().toISOString(),
    recipient,
    type,
    details,
  };
  emailLogs.unshift(entry);
  if (emailLogs.length > 100) emailLogs.pop();

  try {
    const line = `[${entry.timestamp}] [${entry.type}] To: ${entry.recipient} — ${entry.details}\n`;
    fs.appendFileSync(LOG_PATH, line, "utf8");
  } catch {}
}

export function getEmailLogs() {
  return emailLogs;
}

export async function sendEmail({ to, subject, html, text }) {
  const cfg = getConfig();
  const fromAddress = `"${cfg.senderName || "PESU Sports Administration"}" <${cfg.adminEmail}>`;

  const transporter = getTransporter();
  if (!transporter) {
    // Simulated delivery when credentials not entered yet (logs event for admin)
    const logDetails = `[Simulated Dispatch via Admin Agent ${cfg.adminEmail}] ${subject}`;
    console.log(`[Email Agent Simulated] To: ${to} | Subject: ${subject}`);
    logEvent(to, "SIMULATED_DISPATCH", logDetails);
    return { success: true, simulated: true, message: "Logged and queued in simulated mode" };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: text || subject,
      html,
    });
    logEvent(to, "DISPATCHED", `MessageID: ${info.messageId} | ${subject}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("[Email Service Error]:", err.message);
    logEvent(to, "ERROR", `Failed: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// 1. Proximity Reminder Alert
export async function sendBookingReminder(booking, student) {
  const cfg = getConfig();
  if (!cfg.triggers || cfg.triggers.bookingReminder === false) return;

  const to = student.email || `${student.srn.toLowerCase()}@pesu.pes.edu`;
  const subject = `Upcoming Booking Reminder: ${booking.court_name} starts soon`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #ded9cd; background-color: #faf9f6;">
      <div style="border-bottom: 2px solid #1a2639; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #1a2639; margin: 0;">PES University · Physical Education Department</h2>
        <span style="font-size: 12px; color: #c45524; font-weight: bold;">AUTOMATED ATHLETICS ALERT</span>
      </div>
      <p>Hello <strong>${student.full_name || student.name}</strong>,</p>
      <p>This is a proximity reminder from the PESU Sports Administration server agent for your upcoming scheduled court reservation:</p>
      <div style="background-color: #ffffff; border: 1px solid #ded9cd; padding: 16px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Facility:</strong> ${booking.court_name}</p>
        <p style="margin: 4px 0;"><strong>Campus:</strong> ${booking.campus || "RR Campus"}</p>
        <p style="margin: 4px 0;"><strong>Scheduled Time:</strong> ${booking.date_label} at ${booking.hour}:00</p>
        <p style="margin: 4px 0;"><strong>Duration:</strong> ${booking.duration || "1 Hour"}</p>
        <p style="margin: 4px 0;"><strong>Access Clearance:</strong> Free with Student RFID Pass / Profile QR</p>
      </div>
      <p style="font-size: 13px; color: #636a77;">Please arrive 5 minutes early at the sports complex turnstiles. If you cannot attend, please cancel your reservation to allow waitlisted students to play.</p>
      <div style="border-top: 1px solid #ded9cd; margin-top: 24px; padding-top: 12px; font-size: 11px; color: #8c94a0;">
        Dispatched by PESU Sports Server Agent (${cfg.adminEmail})
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

// 2. Queue Cleared / Waitlist Promotion Alert
export async function sendQueueClearedAlert(queueReq, student, courtName) {
  const cfg = getConfig();
  if (!cfg.triggers || cfg.triggers.queueCleared === false) return;

  const to = student.email || `${student.srn.toLowerCase()}@pesu.pes.edu`;
  const subject = `PESU Sports: Court Slot CLEARED — Your Waitlist Spot is Confirmed!`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #ded9cd; background-color: #faf9f6;">
      <div style="border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #1a2639; margin: 0;">PES University · Sports Clearance Desk</h2>
        <span style="font-size: 12px; color: #10b981; font-weight: bold;">WAITLIST SPOT PROMOTED & CLEARED</span>
      </div>
      <p>Hello <strong>${student.full_name || student.name}</strong>,</p>
      <p style="color: #10b981; font-weight: bold; font-size: 16px;">Great news! A court reservation slot has just CLEARED UP.</p>
      <p>Because you were in the standby queue, your reservation has been automatically promoted to <strong>CONFIRMED</strong> status:</p>
      <div style="background-color: #ffffff; border: 1px solid #b7eb8f; padding: 16px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Court:</strong> ${courtName || queueReq.court_name}</p>
        <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${queueReq.date_label} at ${queueReq.hour}:00</p>
        <p style="margin: 4px 0;"><strong>Campus:</strong> ${queueReq.campus || "RR Campus"}</p>
        <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Confirmed</span></p>
      </div>
      <p style="font-size: 13px; color: #636a77;">Your turnstile RFID clearance pass is now active for this session. Have a great game!</p>
      <div style="border-top: 1px solid #ded9cd; margin-top: 24px; padding-top: 12px; font-size: 11px; color: #8c94a0;">
        Automated Dispatch from PESU Sports Admin Agent (${cfg.adminEmail})
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

// 3. Slot Freed Alert
export async function sendSlotFreedAlert(courtName, dateLabel, hour) {
  const cfg = getConfig();
  if (!cfg.triggers || cfg.triggers.slotFreed === false) return;

  logEvent(
    "BROADCAST",
    "SLOT_FREED",
    `Slot opened for ${courtName} on ${dateLabel} at ${hour}:00. Ready for student bookings.`,
  );
}

// 4. Test Email
export async function sendTestEmail(targetEmail) {
  const cfg = getConfig();
  const to = targetEmail || cfg.adminEmail;
  const subject = `[TEST] PESU Sports Email Configuration Agent Verification`;
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #ded9cd; background-color: #faf9f6;">
      <h2 style="color: #1a2639; border-bottom: 2px solid #c45524; padding-bottom: 8px;">PESU Sports Email Agent Test</h2>
      <p>This is a verification test message from the PES University Sports Email Configuration Agent.</p>
      <p><strong>Configured Sender Mail ID:</strong> ${cfg.adminEmail}</p>
      <p><strong>SMTP Server Host:</strong> ${cfg.smtpHost}:${cfg.smtpPort}</p>
      <p><strong>Security:</strong> ${cfg.secure ? "SSL" : "TLS"}</p>
      <p style="color: #10b981; font-weight: bold;">Email delivery pipeline verified successfully!</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

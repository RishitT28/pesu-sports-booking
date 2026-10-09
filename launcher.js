import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(
  "\x1b[36m%s\x1b[0m",
  "==================================================================",
);
console.log(
  "\x1b[1m\x1b[33m%s\x1b[0m",
  "  PES UNIVERSITY SPORTS BOOKING & DATABASE PLATFORM LAUNCHER",
);
console.log(
  "\x1b[36m%s\x1b[0m",
  "==================================================================",
);
console.log("  [1] Main Sports Website:          \x1b[32mhttp://localhost:8080\x1b[0m");
console.log("  [2] Database Management Website:  \x1b[34mhttp://localhost:8081\x1b[0m");
console.log("  [3] SQLite Database Location:     \x1b[35mdata/pesu_sports.db\x1b[0m");
console.log(
  "\x1b[36m%s\x1b[0m",
  "==================================================================",
);
console.log("  Press Ctrl+C to safely shut down both applications.\n");

// 1. Launch Database Management App (Port 8081)
const adminProcess = spawn(process.execPath, [path.join(__dirname, "server", "admin-server.js")], {
  stdio: "inherit",
  cwd: __dirname,
  shell: false,
});

adminProcess.on("error", (err) => {
  console.error("\x1b[31m[DB Admin 8081 Error]:\x1b[0m", err.message);
});

// 2. Launch Main Website (Port 8080)
const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";

const webProcess = spawn(npmCmd, ["run", "dev", "--", "--port", "8080", "--host"], {
  stdio: "inherit",
  cwd: __dirname,
  shell: true,
});

webProcess.on("error", (err) => {
  console.error("\x1b[31m[Main Web 8080 Error]:\x1b[0m", err.message);
});

// Graceful shutdown
function shutdown() {
  console.log("\n\x1b[33m[Launcher] Stopping both applications...\x1b[0m");
  try {
    if (!adminProcess.killed) adminProcess.kill("SIGTERM");
  } catch (_) {}
  try {
    if (!webProcess.killed) webProcess.kill("SIGTERM");
  } catch (_) {}
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", () => {
  try {
    adminProcess.kill();
    webProcess.kill();
  } catch (_) {}
});

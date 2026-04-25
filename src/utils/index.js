/**
 * src/utils/index.js
 * ─────────────────────────────────────────────────────────────
 * Shared utility functions and constants.
 */

/* ── Date helpers ────────────────────────────────────────── */
export function formatDate(dateStr, options = {}) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

/* ── Currency ────────────────────────────────────────────── */
export function formatINR(amount) {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ── String helpers ──────────────────────────────────────── */
export function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/* ── Percentage ──────────────────────────────────────────── */
export function pct(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

/* ── Role constants ──────────────────────────────────────── */
export const ROLES = {
  ADMIN:   "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT:  "parent",
};

export const DASHBOARD_PATH = {
  admin:   "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
  parent:  "/parent/dashboard",
};

/* ── Grade helpers ───────────────────────────────────────── */
export function gradeFromMarks(marks, max = 100) {
  const p = pct(marks, max);
  if (p >= 90) return { grade: "A+", color: "success" };
  if (p >= 80) return { grade: "A",  color: "success" };
  if (p >= 70) return { grade: "B+", color: "info" };
  if (p >= 60) return { grade: "B",  color: "info" };
  if (p >= 50) return { grade: "C",  color: "warning" };
  if (p >= 35) return { grade: "D",  color: "warning" };
  return { grade: "F", color: "danger" };
}

/* ── Download blob ───────────────────────────────────────── */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

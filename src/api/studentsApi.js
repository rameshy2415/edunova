import axiosInstance from "./axiosInstance";

/**
 * studentsApi.js
 * ─────────────────────────────────────────────────────────────
 * All student-related backend calls.
 * Used by: Admin pages, Teacher pages (read-only subset)
 */
export const studentsApi = {
  // ── Core CRUD ──────────────────────────────────────────────

  /** GET /students?page=1&limit=20&class=9A&search=aryan */
  getAllStudents: (schoolId) => axiosInstance.get(`/admin/students/list/${schoolId}`),

  /** GET /students?page=1&limit=20&class=9A&search=aryan */
  getAll: (params) => axiosInstance.get("/students", { params }),

  /** GET /students/:id */
  getById: (id) => axiosInstance.get(`/admin/students/${id}`),

  /** POST /students  — Admin only */
  create: (payload) => axiosInstance.post("/admin/students", payload),

  /** PUT /students/:id */
  update: (id, payload) => axiosInstance.put(`/students/${id}`, payload),

  /** DELETE /students/:id — Admin only */
  remove: (id) => axiosInstance.delete(`/students/${id}`),

  // ── Attendance ─────────────────────────────────────────────

  /** GET /students/:id/attendance?month=4&year=2026 */
  getAttendance: (id, params) =>
    axiosInstance.get(`/students/${id}/attendance`, { params }),

  /** POST /students/attendance/bulk — Teacher marks whole class */
  markBulkAttendance: (payload) =>
    axiosInstance.post("/students/attendance/bulk", payload),

  // ── Grades ─────────────────────────────────────────────────

  /** GET /students/:id/grades?term=1 */
  getGrades: (id, params) =>
    axiosInstance.get(`/students/${id}/grades`, { params }),

  /** POST /students/:id/grades */
  addGrade: (id, payload) =>
    axiosInstance.post(`/students/${id}/grades`, payload),

  // ── Fees ───────────────────────────────────────────────────

  /** GET /students/:id/fees */
  getFees: (id) => axiosInstance.get(`/students/${id}/fees`),
};

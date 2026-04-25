import axiosInstance from "./axiosInstance";

/**
 * reportsApi.js
 * ─────────────────────────────────────────────────────────────
 */
export const reportsApi = {
  /** GET /reports/attendance?class=9A&from=2026-04-01&to=2026-04-30 */
  getAttendance: (params) =>
    axiosInstance.get("/reports/attendance", { params }),

  /** GET /reports/performance?term=1&class=9A */
  getPerformance: (params) =>
    axiosInstance.get("/reports/performance", { params }),

  /** GET /reports/finance?month=4&year=2026 */
  getFinance: (params) =>
    axiosInstance.get("/reports/finance", { params }),

  /** GET /reports/export?type=attendance&format=pdf — returns blob */
  exportReport: (params) =>
    axiosInstance.get("/reports/export", { params, responseType: "blob" }),
};

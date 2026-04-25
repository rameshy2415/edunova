import axiosInstance from "./axiosInstance";

/**
 * feesApi.js
 * ─────────────────────────────────────────────────────────────
 */
export const feesApi = {
  /** GET /fees?status=overdue&class=9A */
  getAll: (params) => axiosInstance.get("/fees", { params }),

  /** POST /fees/payment — Record a new payment */
  recordPayment: (payload) => axiosInstance.post("/fees/payment", payload),

  /** GET /fees/summary — Dashboard totals */
  getSummary: () => axiosInstance.get("/fees/summary"),

  /** GET /fees/upcoming — Dues in next 30 days */
  getUpcoming: () => axiosInstance.get("/fees/upcoming"),

  /** POST /fees/remind/:studentId — Send overdue reminder */
  sendReminder: (studentId) =>
    axiosInstance.post(`/fees/remind/${studentId}`),

  /** GET /fees/receipt/:paymentId — Download receipt PDF */
  getReceipt: (paymentId) =>
    axiosInstance.get(`/fees/receipt/${paymentId}`, { responseType: "blob" }),
};

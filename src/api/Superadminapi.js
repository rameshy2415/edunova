import axiosInstance from "./axiosInstance";

/**
 * superAdminApi.js
 * ─────────────────────────────────────────────────────────────
 * All super-admin-scoped API calls.
 * Every endpoint here requires role = "superadmin" on the JWT.
 * The backend should guard these routes with a superadmin middleware.
 */
export const superAdminApi = {

  // ── Dashboard ──────────────────────────────────────────────

  /** GET /superadmin/stats — platform-wide KPIs */
  getStats: () => axiosInstance.get("/superadmin/stats"),

  // ── Schools ────────────────────────────────────────────────

  /** GET /superadmin/schools?search=&plan=&status=&page=1 */
  getSchools: (params) => axiosInstance.get("/superadmin/schools", { params }),

  /** GET /superadmin/schools/:id */
  getSchoolById: (id) => axiosInstance.get(`/superadmin/schools/${id}`),

  /**
   * POST /superadmin/schools/onboard
   * Body: { school, subscription, admin }
   * Creates school record + subscription + admin user atomically.
   * Returns: { school, subscription, adminUser, welcomeEmailSent }
   */
  onboardSchool: (payload) =>
    axiosInstance.post("/superadmin/schools/onboard", payload),

  /** PUT /superadmin/schools/:id — update school info */
  updateSchool: (id, payload) =>
    axiosInstance.put(`/superadmin/schools/${id}`, payload),

  /** POST /superadmin/schools/:id/suspend */
  suspendSchool: (id, reason) =>
    axiosInstance.post(`/superadmin/schools/${id}/suspend`, { reason }),

  /** POST /superadmin/schools/:id/reinstate */
  reinstateSchool: (id) =>
    axiosInstance.post(`/superadmin/schools/${id}/reinstate`),

  /** DELETE /superadmin/schools/:id — hard delete (irreversible) */
  deleteSchool: (id) =>
    axiosInstance.delete(`/superadmin/schools/${id}`),

  // ── Subscriptions ──────────────────────────────────────────

  /** GET /superadmin/subscriptions?status=&plan= */
  getSubscriptions: (params) =>
    axiosInstance.get("/superadmin/subscriptions", { params }),

  /** GET /superadmin/subscriptions/:id */
  getSubscriptionById: (id) =>
    axiosInstance.get(`/superadmin/subscriptions/${id}`),

  /**
   * PUT /superadmin/subscriptions/:id
   * Body: { planId, billingCycle, amountOverride, discountPct }
   */
  updateSubscription: (id, payload) =>
    axiosInstance.put(`/superadmin/subscriptions/${id}`, payload),

  /** POST /superadmin/subscriptions/:id/renew */
  renewSubscription: (id, payload) =>
    axiosInstance.post(`/superadmin/subscriptions/${id}/renew`, payload),

  /** POST /superadmin/subscriptions/:id/cancel */
  cancelSubscription: (id, reason) =>
    axiosInstance.post(`/superadmin/subscriptions/${id}/cancel`, { reason }),

  /** GET /superadmin/subscription-plans — list available plans */
  getPlans: () => axiosInstance.get("/superadmin/subscription-plans"),

  // ── Admin accounts ─────────────────────────────────────────

  /** GET /superadmin/admins?schoolId=&search= */
  getAdmins: (params) => axiosInstance.get("/superadmin/admins", { params }),

  /** GET /superadmin/admins/:id */
  getAdminById: (id) => axiosInstance.get(`/superadmin/admins/${id}`),

  /**
   * POST /superadmin/admins
   * Creates a new admin user for an existing school.
   * Body: { schoolId, name, email, phone, tempPassword, sendWelcomeEmail }
   */
  createAdmin: (payload) => axiosInstance.post("/superadmin/admins", payload),

  /** PUT /superadmin/admins/:id — update admin details */
  updateAdmin: (id, payload) =>
    axiosInstance.put(`/superadmin/admins/${id}`, payload),

  /** POST /superadmin/admins/:id/reset-password */
  resetAdminPassword: (id) =>
    axiosInstance.post(`/superadmin/admins/${id}/reset-password`),

  /** POST /superadmin/admins/:id/resend-welcome */
  resendWelcomeEmail: (id) =>
    axiosInstance.post(`/superadmin/admins/${id}/resend-welcome`),

  /** POST /superadmin/admins/:id/disable */
  disableAdmin: (id) =>
    axiosInstance.post(`/superadmin/admins/${id}/disable`),

  /** POST /superadmin/admins/:id/enable */
  enableAdmin: (id) =>
    axiosInstance.post(`/superadmin/admins/${id}/enable`),

  // ── Analytics ──────────────────────────────────────────────

  /** GET /superadmin/analytics/overview */
  getAnalyticsOverview: () =>
    axiosInstance.get("/superadmin/analytics/overview"),

  /** GET /superadmin/analytics/revenue?from=&to= */
  getRevenueData: (params) =>
    axiosInstance.get("/superadmin/analytics/revenue", { params }),

  /** GET /superadmin/analytics/growth */
  getGrowthData: () => axiosInstance.get("/superadmin/analytics/growth"),

  // ── Audit log ──────────────────────────────────────────────

  /** GET /superadmin/audit?page=1&limit=50&action=&targetType= */
  getAuditLogs: (params) =>
    axiosInstance.get("/superadmin/audit", { params }),

  // ── Platform settings ──────────────────────────────────────

  /** GET /superadmin/settings */
  getSettings: () => axiosInstance.get("/superadmin/settings"),

  /** PUT /superadmin/settings */
  updateSettings: (payload) =>
    axiosInstance.put("/superadmin/settings", payload),
};
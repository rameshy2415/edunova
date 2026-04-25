import axiosInstance from "./axiosInstance";

/**
 * authApi.js
 * ─────────────────────────────────────────────────────────────
 * All authentication-related API calls.
 *
 * Backend expects role in the login payload so the server
 * can return a role-scoped JWT and user profile in one shot.
 */
export const authApi = {
  /**
   * POST /auth/login
   * Body: { email, password, role }
   * Returns: { token: string, user: { id, name, email, role, avatar? } }
   */
  login: (credentials) => axiosInstance.post("/auth/login", credentials),

  /**
   * POST /auth/logout
   * Invalidates the JWT on the server (optional — depends on backend).
   */
  logout: () => axiosInstance.post("/auth/logout"),

  /**
   * POST /auth/forgot-password
   * Body: { email }
   * Returns: { message: string }
   */
  forgotPassword: (email) =>
    axiosInstance.post("/auth/forgot-password", { email }),

  /**
   * POST /auth/reset-password
   * Body: { token, newPassword }
   */
  resetPassword: (token, newPassword) =>
    axiosInstance.post("/auth/reset-password", { token, newPassword }),

  /**
   * GET /auth/me
   * Returns the current authenticated user's profile.
   * Useful to refresh user data after edits.
   */
  me: () => axiosInstance.get("/auth/me"),
};

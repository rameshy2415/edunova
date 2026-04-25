import axios from "axios";

/**
 * axiosInstance.js
 * ─────────────────────────────────────────────────────────────
 * Single Axios instance shared across the whole app.
 *
 * Features:
 *  - Reads REACT_APP_API_URL from .env (falls back to localhost)
 *  - Automatically attaches Bearer token from localStorage
 *  - 401 response → clears session and redirects to /login
 *  - Centralized error shape normalization
 */

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ── REQUEST INTERCEPTOR ── */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("edunova_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── RESPONSE INTERCEPTOR ── */
axiosInstance.interceptors.response.use(
  (response) => response, // pass through 2xx

  (error) => {
    const status = error.response?.status;

    // Session expired or token invalid → force re-login
    if (status === 401) {
      localStorage.removeItem("edunova_token");
      localStorage.removeItem("edunova_user");
      window.location.href = "/login";
    }

    // Forbidden (wrong role trying to access a route)
    if (status === 403) {
      window.location.href = "/unauthorized";
    }

    // Normalize error message for UI
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred.";

    return Promise.reject({ status, message, raw: error });
  }
);

export default axiosInstance;

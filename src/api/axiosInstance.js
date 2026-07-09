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

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1500000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Helper: Force logout and redirect ─────────────────────
const forceLogout = () => {
    localStorage.removeItem('edunova_token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('edunova_user');

    // Use replace so user can't go back to expired session
    if (window.location.pathname !== '/login' && window.location.pathname !== '/parent-login') {
        window.location.replace('/login');
    }
};

// ── Track if a refresh is currently in progress ───────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

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

const normalizedMessage = (error) => {
    
  const status = error.response?.status;
  const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred.";
    return { status, message, raw: error }
};

/* ── RESPONSE INTERCEPTOR ── */
axiosInstance.interceptors.response.use(
  (response) => response, // pass through 2xx

  async (error) => {
    console.log(error);
    const originalRequest = error.config;
    const status = error.response?.status;

    // Skip refresh for the refresh endpoint itself (avoid infinite loop)
    if (originalRequest.url?.includes("/auth/refresh")) {
      forceLogout();
      return Promise.reject(error);
    }

    // Skip refresh for login endpoints
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/otp")
    ) {
      // return Promise.reject(error);
      const normalizedMsg = normalizedMessage(error);
      return Promise.reject(normalizedMsg);
    }

    // Handle 401 — token expired
    if (status === 401 && !originalRequest._retry) {
      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        isRefreshing = false;
        forceLogout();
        return Promise.reject(error);
      }

      try {
        // Use a NEW axios instance to avoid interceptor recursion
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );

        const { token: newAccessToken, refreshToken: newRefreshToken } =
          refreshResponse.data;
        console.log(refreshResponse);

        localStorage.setItem("edunova_token", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Process all queued requests with the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed — refresh token is also expired/invalid
        processQueue(refreshError, null);
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Session expired or token invalid → force re-login
    /* if (status === 401) {
      localStorage.removeItem("edunova_token");
      localStorage.removeItem("edunova_user");
      window.location.href = "/login";
    } */

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
  },
);

export default axiosInstance;

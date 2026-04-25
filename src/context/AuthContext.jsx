import React, { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "../api/authApi";

/**
 * AuthContext
 * ─────────────────────────────────────────────────────────────
 * Provides: user, role, token, login(), logout(), isAuthenticated
 *
 * Roles accepted: "admin" | "teacher" | "student" | "parent"
 *
 * Usage:
 *   const { user, role, login, logout, isAuthenticated } = useAuth();
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Rehydrate from localStorage so refresh doesn't log user out
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("edunova_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("edunova_token") || null);

  /**
   * login({ email, password, role })
   * Calls POST /auth/login, stores JWT + user object.
   * Returns the user so the caller can redirect by role.
   */
  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials);
    localStorage.setItem("edunova_token", data.token);
    localStorage.setItem("edunova_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user; // { id, name, email, role, avatar? }
  }, []);

  /** Clears session completely */
  const logout = useCallback(async () => {
    try {
      await authApi.logout(); // optional backend invalidation
    } catch (_) {
      // swallow — clear locally regardless
    } finally {
      localStorage.removeItem("edunova_token");
      localStorage.removeItem("edunova_user");
      setToken(null);
      setUser(null);
    }
  }, []);

  /** Update stored profile (e.g. after editing account details) */
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("edunova_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,           // full user object from backend
    token,          // raw JWT (also set on axios default headers in axiosInstance)
    role: user?.role ?? null,
    isAuthenticated: !!token,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Convenience hook */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

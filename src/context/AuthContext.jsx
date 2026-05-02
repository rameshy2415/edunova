import React, { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "../api/authApi";

/**
 * AuthContext
 * ─────────────────────────────────────────────────────────────
 * Roles: "superadmin" | "admin" | "teacher" | "student" | "parent"
 *
 * superadmin — platform-level: manages all schools & subscriptions
 * admin      — school-level:   manages one school
 * teacher    — class-level:    marks attendance, enters grades
 * student    — read-only:      views own grades, fees, timetable
 * parent     — read-only:      tracks child's progress
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("edunova_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("edunova_token") || null
  );

  /**
   * login({ email, password, role })
   * Calls POST /auth/login → backend returns { token, user }
   * Returns the user object so caller can redirect by role.
   */
  const login = useCallback(async (credentials) => {
    //const { data } = await authApi.login(credentials);
    const { data } ={data: { token: "string", user: { id:1, name:"Admin Principal", email: credentials.email, role: credentials.role } }}; 
    localStorage.setItem("edunova_token", data.token);
    localStorage.setItem("edunova_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user; // { id, name, email, role, schoolId?, avatar? }
  }, []);

  /** Clear session — calls optional backend invalidation */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (_) {
      // swallow — clear locally regardless
    } finally {
      localStorage.removeItem("edunova_token");
      localStorage.removeItem("edunova_user");
      setToken(null);
      setUser(null);
    }
  }, []);

  /** Merge updated fields into stored user (e.g. after profile edit) */
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("edunova_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,                          // full user object from backend
    token,                         // raw JWT
    role: user?.role ?? null,      // "superadmin" | "admin" | "teacher" | "student" | "parent"
    schoolId: user?.schoolId ?? null, // null for superadmin
    isAuthenticated: !!token,
    isSuperAdmin: user?.role === "superadmin",
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
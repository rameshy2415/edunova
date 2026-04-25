/**
 * src/api/index.js
 * ─────────────────────────────────────────────────────────────
 * Barrel export — import anything from "../api" in one line.
 *
 * Usage:
 *   import { studentsApi, feesApi } from "../api";
 */
export { authApi }     from "./authApi";
export { studentsApi } from "./studentsApi";
export { teachersApi } from "./teachersApi";
export { feesApi }     from "./feesApi";
export { reportsApi }  from "./reportsApi";
export { default as axiosInstance } from "./axiosInstance";

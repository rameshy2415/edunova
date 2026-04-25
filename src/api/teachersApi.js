import axiosInstance from "./axiosInstance";

/**
 * teachersApi.js
 * ─────────────────────────────────────────────────────────────
 */
export const teachersApi = {
  getAll:   (params) => axiosInstance.get("/teachers", { params }),
  getById:  (id)     => axiosInstance.get(`/teachers/${id}`),
  create:   (data)   => axiosInstance.post("/teachers", data),
  update:   (id, data) => axiosInstance.put(`/teachers/${id}`, data),
  remove:   (id)     => axiosInstance.delete(`/teachers/${id}`),

  /** GET /teachers/:id/schedule */
  getSchedule: (id, params) =>
    axiosInstance.get(`/teachers/${id}/schedule`, { params }),

  /** GET /teachers/:id/classes — classes assigned to this teacher */
  getClasses: (id) => axiosInstance.get(`/teachers/${id}/classes`),
};

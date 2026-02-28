import { api } from "./api";

export const communityService = {
  list: () => api.get("/api/community"),
  create: (payload) => api.post("/api/community", payload),
  update: (id, payload) => api.put(`/api/community/${id}`, payload),
  remove: (id) => api.delete(`/api/community/${id}`),
};

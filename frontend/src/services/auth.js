import { api } from "./api"

export const authService = {
    register: (email, password) => api.post("/api/auth/register", { email, password }),
    login: (email, password) => api.post("/api/auth/login", { email, password }),
    me: () => api.get("/api/auth/me"),
    logout: () => api.post("/api/auth/logout", {})
};
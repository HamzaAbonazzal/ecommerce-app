import axios from "axios";
import { getAdminToken, getUserToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const url = config.url || "";

  // مسارات الأدمن → admin_token
  if (url.startsWith("/admin")) {
    const adminToken = getAdminToken();
    if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
  } else {
    // باقي المسارات → user_token (إن وُجد)
    const userToken = getUserToken();
    if (userToken) config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

export default api;

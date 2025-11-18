import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || "https://aroma-electronic.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
});

// Attach token if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

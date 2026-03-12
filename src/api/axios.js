import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 second timeout
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle responses
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
      error.response = {
        data: { message: "সার্ভারের সাথে সংযোগ হচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।" },
      };
    }
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

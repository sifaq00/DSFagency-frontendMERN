import axios from "axios";

const instance = axios.create({
  // Fallback ke lokal jika env belum di-set
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// OPTIONAL tapi gue SARANKAN
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout kalau token kadaluarsa/invalid
instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;

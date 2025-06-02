import axios from "axios";
import { BASE_URL } from "../utils/Utils";
import { useAuthContext } from "../auth/AuthProvider";

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage/context jika ada
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
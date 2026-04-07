import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use((config) => {
  const token = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_ALT;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;

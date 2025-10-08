import axios from "axios";
import { getAuth } from "firebase/auth";

// Axios instance
const api = axios.create({
  baseURL: "/api", // thanks to vite proxy
});

// Add Firebase token automatically
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

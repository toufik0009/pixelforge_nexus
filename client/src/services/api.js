import axios from "axios";

const api = axios.create({
  baseURL: "https://pixelforge-nexus-server-2.onrender.com/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// toufikumar429_db_user
// ENvlnElQsBX42wfr
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_SERVER_BASE_URL,
});

export default api;

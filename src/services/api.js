import axios from "axios";

const api = axios.create({
  baseURL: "https://attm-backend-main-gvzubr.laravel.cloud/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
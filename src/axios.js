// src/api/axios.js
import axios from "axios";

const API_BASE_URL = "https://qwertyuiop999.pythonanywhere.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;

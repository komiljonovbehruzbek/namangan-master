// src/api/axios.js
import axios from "axios";

const API_BASE_URL = "https://qwertyuiop999.pythonanywhere.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNjIyNjY4LCJpYXQiOjE3NjI2MDgyNjgsImp0aSI6ImVjNDVhNzU0MTU0YjQ4ZWM5MGNmMDNlZjNkNTAzOGU1IiwidXNlcl9pZCI6IjEifQ.qCvSYpI5vxS9dJPmmVvHKz9qrvwtRRNpCV-ODPSQ5qc"
  },
});

// Request interceptor – o'zgarmaydi
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor – o'zgarmaydi
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
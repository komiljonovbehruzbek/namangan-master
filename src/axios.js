// src/api/axios.js
import axios from "axios";

const API_BASE_URL = "https://qwertyuiop999.pythonanywhere.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNjU2MjcyLCJpYXQiOjE3NjI2NDE4NzIsImp0aSI6IjdjZWMyNDJiY2NhYTQxZGViMDA3MzI4YmQ5ODVkNjcxIiwidXNlcl9pZCI6IjEifQ.n4AyY_Wqskb9gHTyTk8YkwNOEMM6KhcKQnSFchY49Dw",
  },
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

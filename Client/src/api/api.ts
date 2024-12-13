import axios from "axios";
import { store } from "../redux/store";

// Base URL is environment dependent
const baseURL = import.meta.env.PROD ? "/api" : "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include token in requests
api.interceptors.request.use(
  (config) => {
    const token = store.getState().token.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: dispatch logout action if needed
      // store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;

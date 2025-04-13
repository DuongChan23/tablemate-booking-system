
import axios from 'axios';

// Base API configuration for axios
const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with your actual API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors like 401, 403, etc.
    if (error.response) {
      // Unauthorized, redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      
      // Forbidden
      if (error.response.status === 403) {
        console.error('Access denied. Insufficient permissions.');
      }
      
      // Bad request
      if (error.response.status === 400) {
        console.error('Bad request:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

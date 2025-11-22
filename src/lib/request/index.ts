import axios from 'axios';

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for API calls
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Network errors (backend not running, CORS issues, etc.)
    if (!error.response) {
      // Don't redirect on network errors - let components handle them
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      // Get current path for redirect
      const currentPath = window.location.pathname;

      // Only redirect if not already on login page
      if (currentPath !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    // Handle 403 Forbidden
    if (error.response.status === 403) {
      console.error(
        'Forbidden: You do not have permission to access this resource'
      );
    }

    return Promise.reject(error);
  }
);

export default request;

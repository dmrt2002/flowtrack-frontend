import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useCurrentUser } from '@/store/currentUserStore';

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('🔧 Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

// Response interceptor for API calls
request.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Network errors (backend not running, CORS issues, etc.)
    if (!error.response) {
      // Don't redirect on network errors - let components handle them
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Session expired
    if (error.response.status === 401) {
      const { clearUser } = useCurrentUser.getState();

      // Skip redirect for public auth endpoints and logout
      const publicAuthEndpoints = [
        '/auth/forgot-password',
        '/auth/register',
        '/auth/login',
        '/auth/reset-password',
        '/auth/verify-email',
        '/auth/resend-verification',
        '/auth/logout',
        '/auth/logout-all',
      ];

      const publicAuthPages = [
        '/login',
        '/signup',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/auth/verify-email',
      ];

      const originalRequest = error.config as InternalAxiosRequestConfig;
      const isPublicAuthEndpoint = originalRequest.url
        ? publicAuthEndpoints.some((endpoint) =>
            originalRequest.url?.includes(endpoint)
          )
        : false;

      const currentPath = window.location.pathname;
      const isPublicAuthPage = publicAuthPages.some((page) =>
        currentPath.startsWith(page)
      );

      // Don't clear user or redirect for logout endpoints - let the logout handler manage it
      if (!isPublicAuthEndpoint && !isPublicAuthPage) {
        clearUser();

        // Only redirect if not a public auth endpoint/page and not already on login page
        if (currentPath !== '/login') {
          window.location.href = '/login';
        }
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

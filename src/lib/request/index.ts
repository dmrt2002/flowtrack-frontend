import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useCurrentUser } from '@/store/currentUserStore';

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache for Clerk token to avoid repeated calls
let clerkTokenCache: { token: string | null; timestamp: number } | null = null;
const TOKEN_CACHE_DURATION = 60 * 1000; // 1 minute cache

// Request interceptor to add Clerk token if available
request.interceptors.request.use(
  async (config) => {
    // Skip token addition ONLY for public auth endpoints that don't need authentication
    // These are endpoints where users register/login and don't have tokens yet
    const publicAuthEndpoints = [
      '/auth/register',
      '/auth/login',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verify-email',
      '/auth/resend-verification',
    ];

    const shouldSkipToken = publicAuthEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (shouldSkipToken) {
      return config;
    }

    // Try to get Clerk token (client-side only)
    if (typeof window !== 'undefined') {
      try {
        // Check cache first
        const now = Date.now();
        if (
          clerkTokenCache &&
          now - clerkTokenCache.timestamp < TOKEN_CACHE_DURATION
        ) {
          if (clerkTokenCache.token) {
            config.headers.Authorization = `Bearer ${clerkTokenCache.token}`;
          }
          return config;
        }

        // Get Clerk session token using the window.__clerk object
        // This is available after ClerkProvider loads
        const clerkInstance = (window as any).__clerk;

        if (clerkInstance && clerkInstance.session) {
          // Get the session token directly
          const token = await clerkInstance.session.getToken({
            template: 'default',
            skipCache: false,
          });

          // Update cache
          clerkTokenCache = {
            token,
            timestamp: now,
          };

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } else {
          // Clerk not loaded or no session - set cache to avoid re-checking
          clerkTokenCache = {
            token: null,
            timestamp: now,
          };
        }
      } catch (error) {
        // Clerk not available or not authenticated
        console.error('❌ Clerk token fetch failed:', error);
        // Clear cache on error
        clerkTokenCache = null;
        // Continue without token - this is expected for native auth users
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

console.log(
  '🔧 Backend URL:',
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
);

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

      // Skip redirect for public auth endpoints
      const publicAuthEndpoints = [
        '/auth/forgot-password',
        '/auth/register',
        '/auth/login',
        '/auth/reset-password',
        '/auth/verify-email',
        '/auth/resend-verification',
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

      clearUser();

      // Only redirect if not a public auth endpoint/page and not already on login page
      if (!isPublicAuthEndpoint && !isPublicAuthPage) {
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

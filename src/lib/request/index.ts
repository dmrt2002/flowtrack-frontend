import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useCurrentUser } from '@/store/currentUserStore';

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log(
  '🔧 Backend URL:',
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
);

// Request interceptor to add access token to headers
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from Zustand store
    const { tokens } = useCurrentUser.getState();

    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

request.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Network errors (backend not running, CORS issues, etc.)
    if (!error.response) {
      // Don't redirect on network errors - let components handle them
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401) {
      const { tokens, clearUser } = useCurrentUser.getState();

      // If this is a refresh token request that failed, logout
      if (originalRequest.url?.includes('/auth/refresh')) {
        clearUser();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // If we have a refresh token and haven't tried refreshing yet
      if (tokens?.refreshToken && !originalRequest._retry) {
        if (isRefreshing) {
          // Queue requests while refresh is in progress
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return request(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh the token
          const response = await request.post('/auth/refresh', {
            refreshToken: tokens.refreshToken,
          });

          const { accessToken, refreshToken, expiresAt } = response.data;

          // Update tokens in store
          const { setTokens } = useCurrentUser.getState();
          setTokens({ accessToken, refreshToken, expiresAt });

          // Update authorization header for original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Process queued requests
          processQueue(null);

          // Retry original request
          return request(originalRequest);
        } catch (refreshError) {
          // Refresh failed - logout user
          processQueue(refreshError as AxiosError);
          clearUser();

          // Skip redirect for public auth endpoints (forgot-password, register, login, etc.)
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

          const isPublicAuthEndpoint = originalRequest.url
            ? publicAuthEndpoints.some((endpoint) =>
                originalRequest.url?.includes(endpoint)
              )
            : false;

          const currentPath = window.location.pathname;
          const isPublicAuthPage = publicAuthPages.some((page) =>
            currentPath.startsWith(page)
          );

          // Only redirect if not a public auth endpoint/page and not already on login page
          if (!isPublicAuthEndpoint && !isPublicAuthPage) {
            if (currentPath !== '/login') {
              // window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available - redirect to login
        // BUT: Skip redirect for public auth endpoints (forgot-password, register, login, etc.)
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
            // window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
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

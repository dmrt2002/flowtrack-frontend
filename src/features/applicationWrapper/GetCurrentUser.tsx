'use client';

import { useEffect } from 'react';
import { useCurrentUser } from '@/store/currentUserStore';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { AxiosError } from 'axios';

export function GetCurrentUser() {
  const { setUser, clearUser, setLoading } = useCurrentUser();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const response = await request.get(mainUrl.getCurrentUser);
        setUser(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;

        // Network errors (backend not running, CORS, connection refused)
        if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
          console.warn(
            '⚠️ Backend server is not reachable. Please ensure the backend is running at:',
            process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
          );
          clearUser();
          return;
        }

        // 401 Unauthorized - user not logged in
        if (axiosError.response?.status === 401) {
          console.info('User is not authenticated');
          clearUser();
          return;
        }

        // Other errors
        console.error('Failed to fetch current user:', error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [setUser, clearUser, setLoading]);

  return null;
}

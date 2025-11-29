'use client';

import { useEffect, useRef } from 'react';
import { useCurrentUser } from '@/store/currentUserStore';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { AxiosError } from 'axios';

export function GetCurrentUser() {
  const { currentUser, setUser, clearUser, setLoading } = useCurrentUser();
  const hasFetched = useRef(false);

  useEffect(() => {
    // Check if user already exists in store
    if (currentUser) {
      console.log('✅ User already in store, skipping fetch');
      setLoading(false);
      return; // User already loaded, don't fetch
    }

    // Check if we've already attempted fetch in this session (using ref only)
    // Don't use sessionStorage - it persists across page refreshes but Zustand state doesn't
    if (hasFetched.current) {
      console.log('⏭️ Already attempted fetch in this session, skipping');
      return;
    }

    const fetchCurrentUser = async () => {
      hasFetched.current = true;
      setLoading(true);

      try {
        console.log('📡 Fetching current user from /auth/me...');
        // Backend will verify httpOnly accessToken cookie
        const response = await request.get(mainUrl.getCurrentUser);
        console.log('✅ User fetched successfully:', response.data);
        setUser(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;

        // Network errors (backend not running, CORS, connection refused)
        if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
          console.warn(
            '⚠️ Backend server is not reachable. Please ensure the backend is running at:',
            process.env.NEXT_PUBLIC_BACKEND_URL
          );
          clearUser();
          return;
        }

        // 401 Unauthorized - user not logged in (backend verified no valid cookie)
        if (axiosError.response?.status === 401) {
          console.info(
            '❌ User is not authenticated (401) - no valid httpOnly cookie'
          );
          clearUser();
          return;
        }

        // Other errors
        console.error('❌ Failed to fetch current user:', error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

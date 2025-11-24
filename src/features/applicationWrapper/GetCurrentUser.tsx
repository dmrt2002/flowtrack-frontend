'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useCurrentUser } from '@/store/currentUserStore';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { AxiosError } from 'axios';

// Persistent flag across remounts using sessionStorage
const FETCH_FLAG_KEY = 'flowtrack_user_fetched';

const getFetchFlag = () => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(FETCH_FLAG_KEY) === 'true';
};

const setFetchFlag = (value: boolean) => {
  if (typeof window === 'undefined') return;
  if (value) {
    sessionStorage.setItem(FETCH_FLAG_KEY, 'true');
  } else {
    sessionStorage.removeItem(FETCH_FLAG_KEY);
  }
};

export function GetCurrentUser() {
  const { isLoaded: clerkLoaded, isSignedIn } = useAuth();
  const { currentUser, setUser, clearUser, setLoading, isLoading } =
    useCurrentUser();
  const hasFetched = useRef(false);

  useEffect(() => {
    // Wait for Clerk to load
    if (!clerkLoaded) {
      console.log('⏳ Waiting for Clerk to load...');
      return;
    }

    console.log('✅ Clerk loaded, isSignedIn:', isSignedIn);

    // If user is not signed in with Clerk, clear user state and don't fetch
    if (!isSignedIn) {
      console.log('⚠️ No Clerk session - user not authenticated');
      clearUser();
      setLoading(false);
      return;
    }

    // Check if user already exists in store
    if (currentUser) {
      return; // User already loaded, don't fetch
    }

    // Check if we've already fetched (using both ref and sessionStorage)
    if (hasFetched.current || getFetchFlag()) {
      return;
    }

    // Don't fetch if already loading
    if (isLoading) {
      return;
    }

    const fetchCurrentUser = async () => {
      hasFetched.current = true;
      setFetchFlag(true);

      try {
        setLoading(true);
        console.log('📡 Fetching current user from /auth/me...');
        const response = await request.get(mainUrl.getCurrentUser);
        console.log('✅ User fetched successfully:', response.data);
        setUser(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;

        // Network errors (backend not running, CORS, connection refused)
        if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
          console.warn(
            '⚠️ Backend server is not reachable. Please ensure the backend is running at:',
            process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'
          );
          clearUser();
          setFetchFlag(false); // Reset flag on error so we can retry
          return;
        }

        // 401 Unauthorized - user not logged in
        if (axiosError.response?.status === 401) {
          console.info('❌ User is not authenticated (401)');
          clearUser();
          setFetchFlag(false); // Reset flag on 401
          return;
        }

        // Other errors
        console.error('❌ Failed to fetch current user:', error);
        clearUser();
        setFetchFlag(false); // Reset flag on error
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkLoaded, isSignedIn, currentUser, isLoading]); // Wait for Clerk to load

  return null;
}

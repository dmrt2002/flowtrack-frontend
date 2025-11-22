import { create } from 'zustand';
import type { User } from '@/features/auth/types';

/**
 * Global user store using Zustand
 * Stores current authenticated user data
 */

type TokenData = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

type CurrentUserStore = {
  currentUser: User | null;
  tokens: TokenData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (userData: User) => void;
  setTokens: (tokenData: TokenData) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
};

export const useCurrentUser = create<CurrentUserStore>((set) => ({
  currentUser: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (userData) =>
    set({
      currentUser: userData,
      isAuthenticated: true,
      isLoading: false,
    }),
  setTokens: (tokenData) =>
    set({
      tokens: tokenData,
    }),
  clearUser: () =>
    set({
      currentUser: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

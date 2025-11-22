import { create } from 'zustand';

export type Roles = 'ADMIN' | 'USER' | 'MANAGER';

type CurrentUser = {
  id: string;
  employeeNo: string;
  name: string;
  email: string;
  role: Roles;
};

type CurrentUserStore = {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (userData: CurrentUser) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
};

export const useCurrentUser = create<CurrentUserStore>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (userData) =>
    set({
      currentUser: userData,
      isAuthenticated: true,
      isLoading: false,
    }),
  clearUser: () =>
    set({
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

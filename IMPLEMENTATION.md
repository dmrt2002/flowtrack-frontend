# Frontend Architecture & Implementation Guide

**Document Version**: 2.1 (Google Sign-in Update)  
**Based on**: PolicyHub @ v1.0

---

## 1. Project Overview

A Next.js 15.3.2 (App Router) application using TypeScript, React 19, and Tailwind CSS 4. This PolicyHub frontend for Bandhan Bank's unified branch banking system follows a feature-based architecture with:

- TanStack Query for server state management
- Zustand for global client state
- React Hook Form with Zod for form validation

The UI uses Shadcn/UI components (Radix UI primitives) with a dynamic, config-driven design system. Authentication is handled via a custom JWT (HTTP-only cookie) system, alongside Google Sign-in.

---

## 2. Folder Structure Philosophy

The project uses a feature-based architecture with clear separation of concerns. Each feature is self-contained with its own components, hooks, services, types, and schemas.

### Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with ApplicationWrappers
│   ├── login/                    # Public routes
│   └── ...
│
├── components/
│   ├── common/
│   │   ├── role-gaurd/           # Role-based access control
│   │   └── theme-switcher.tsx    # Component to change theme
│   ├── layouts/
│   ├── navigation/
│   └── ui/                       # Shadcn/UI components
│
├── features/
│   ├── applicationWrapper/       # App-level providers
│   │   ├── GetCurrentUser.tsx
│   │   ├── index.tsx
│   │   └── ThemeProvider.tsx     # Client component for next-themes
│   └── auth/                     # NEW: Auth-specific feature folder
│       ├── components/
│       │   ├── GoogleSignInButton.tsx
│       │   └── LoginForm.tsx
│       ├── hooks/
│       │   ├── useSignInMutation.ts
│       │   └── useGoogleSignInMutation.ts
│       └── services.ts
│
├── lib/
│   ├── request/                  # Axios instance & interceptors
│   ├── tanstack/                 # TanStack Query client
│   ├── themes/                   # Theme configuration
│   │   ├── index.ts
│   │   └── types.ts
│   └── utils.ts
│
├── services/                     # (DEPRECATED: Logic moved to features/*)
│
├── store/
│   └── currentUserStore.ts
│
├── hooks/
│
├── types/
│
├── url/
│   └── url.ts
│
├── validations/
│   └── login.ts
│
└── styles/
    ├── globals.css               # Core styles, dynamic theme variables
    └── fonts.css
```

### Key Principles

- **Feature-Based Organization**: Each feature (admin-dashboard, auth, etc.) contains all related code.
- **Shared Components**: Common reusable components live in `components/common` and `components/ui`.
- **Service Layer**: API calls live in feature-specific `services/` or `hooks/`.
- **Type Safety**: Types are co-located with features or stored globally in `types/`.
- **Config-Driven Theming**: The entire application theme is controlled from `lib/themes/index.ts`.

---

## 3. Core Dependencies & Tooling

### Framework

- Next.js 15.3.2 (App Router with Turbopack)
- React 19.0.0
- TypeScript 5.x

### Package Manager

- npm (package-lock.json present)

### Linting & Formatting

- ESLint 9.x with Next.js config, Prettier integration
- Prettier 3.5.3 with Tailwind CSS plugin
- Husky: pre-commit hooks
- lint-staged: run linters on staged files
- Commitlint: enforce conventional commits

**Key ESLint Rules**

- `@typescript-eslint/no-explicit-any`: off (allows `any`)
- Extends `next/core-web-vitals`, `next/typescript`, `prettier`

---

## 4. UI & Styling

The application's core USP is its dynamic UI/UX. Themes (light and dark) are controlled from a single configuration file, leveraging `next-themes` and CSS variables.

### UI Library

- Shadcn/UI (Radix UI primitives with Tailwind CSS)
- Icon library: `lucide-react`

### Component Structure

Components follow the Shadcn/UI composition pattern, styled with Tailwind CSS and class-variance-authority (CVA). All components consume dynamic CSS variables for colors, making them theme-agnostic.

### Theming (Dynamic Architecture)

1. **Theme Provider (Activation)**

   ```
   // src/features/applicationWrapper/ThemeProvider.tsx
   'use client';
   import { ThemeProvider as NextThemesProvider } from 'next-themes';
   import { type ThemeProviderProps } from 'next-themes/dist/types';

   export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
     return (
       <NextThemesProvider {...props}>
         {children}
       </NextThemesProvider>
     );
   }
   ```

   ```
   // src/app/layout.tsx
   import { ThemeProvider } from '@/features/applicationWrapper/ThemeProvider';

   export default function RootLayout({ children }) {
     return (
       <html lang="en" suppressHydrationWarning>
         <body>
           <ThemeProvider
             attribute="class"
             defaultTheme="system"
             enableSystem
             disableTransitionOnChange
           >
             <ApplicationWrappers> {/* This contains your other providers */}
               {children}
             </ApplicationWrappers>
           </ThemeProvider>
         </body>
       </html>
     );
   }
   ```

2. **Single Config File**

   All theme definitions live in `src/lib/themes/index.ts`, defining HSL values for all themes.

   ```
   // src/lib/themes/index.ts
   import { Theme } from './types';

   const defaultThemeColors = {
     light: {
       background: '0 0% 100%',
       foreground: '222.2 84% 4.9%',
       primary: '221.2 83.2% 53.3%', // Blue
       // ... all other Shadcn/UI colors
     },
     dark: {
       background: '222.2 84% 4.9%',
       foreground: '210 40% 98%',
       primary: '217.2 91.2% 59.8%', // Blue
       // ... all other Shadcn/UI colors
     },
   };

   export const themes: Theme[] = [
     {
       name: 'default',
       label: 'Default Blue',
       colors: defaultThemeColors,
     },
     // ... other themes
   ];
   ```

3. **CSS Variable Generation**

   `src/styles/globals.css` defines theme variables using class names, replacing static `:root` variables.

   ```
   /* src/styles/globals.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer base {
     /* --- Theme: default --- */
     :root,
     .theme-default {
       --background: 0 0% 100%;
       --foreground: 222.2 84% 4.9%;
       --primary: 221.2 83.2% 53.3%;
       /* ... all other light colors */
     }

     .dark,
     .theme-default.dark {
       --background: 222.2 84% 4.9%;
       --foreground: 210 40% 98%;
       --primary: 217.2 91.2% 59.8%;
       /* ... all other dark colors */
     }

     /* --- Other themes (e.g., .theme-green) --- */
   }
   ```

4. **Tailwind Configuration**

   Tailwind consumes these CSS variables to remain theme-agnostic.

   ```
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         colors: {
           background: 'hsl(var(--background))',
           foreground: 'hsl(var(--foreground))',
           primary: {
             DEFAULT: 'hsl(var(--primary))',
             foreground: 'hsl(var(--primary-foreground))',
           },
           // ... all other Shadcn/UI colors mapped to CSS vars
         },
       },
     },
     // ...
   };
   ```

---

## 5. State Management

### Server State (Client-Side)

- TanStack Query (React Query) v5.80.7
- All server data fetching is handled via TanStack Query (see Section 6)

### Global Client State

- Zustand v5.0.5

```
// src/store/currentUserStore.ts
import { create } from 'zustand';

type CurrentUser = {
  id: string;
  employeeNo: string;
  name: string;
  email: string;
  role: Roles;
  // ... other fields
};

type currentUserStore = {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (userData: CurrentUser) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
};

export const useCurrentUser = create<currentUserStore>((set) => ({
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
```

- Providers: Zustand stores are used directly (no provider needed)
- Access via `const { currentUser } = useCurrentUser()`

### Local Component State

- Standard React hooks: `useState`, `useReducer`, `useMemo`, `useEffect`

### Form State

- React Hook Form v7.58.1
- Zod v3.25.67
- Resolver: `@hookform/resolvers` v5.1.1
- Forms use React Hook Form with Zod schemas
- A custom `DynamicFormBuilder` component supports declarative form creation

---

## 6. TanStack Query Implementation Details

1. **Client Provider Setup**

   - Location: `src/lib/tanstack/query-client.tsx`
   - `QueryClient` configured with `defaultOptions: { queries: { retry: false } }`
   - Provider Location: `src/features/applicationWrapper/index.tsx`
   - `QueryClientProvider` wraps the application
   - `Toaster` from `sonner` is also rendered here
   - Global default options: `retry: false`

2. **Query Structure**

   - Custom hooks pattern: all queries use `use[Resource]` hooks
   - Example file: `src/features/create-process/services/queries.ts`
   - Query key convention: `['resourceName']` or `['resourceName', id]`
   - Fetch functions live in feature-specific `services/` or `hooks/`

3. **Mutation Structure**

   - Defined in feature-specific files (e.g., `features/create-process/services/mutation.ts`)
   - Use `useMutation` and `useQueryClient`
   - Handle `onSuccess` (cache invalidation + toasts) and `onError` (error toasts)
   - Cache invalidation: `queryClient.invalidateQueries()` on success
   - Optimistic UI: not implemented

4. **Caching & Data Fetching**
   - All server data fetched via TanStack Query hooks
   - Common options: `refetchOnWindowFocus: false`, `refetchOnMount: false`

---

## 7. Routing

- Router: Next.js App Router (`src/app/`)
- Root layout: `src/app/layout.tsx` (wraps with ApplicationWrappers and ThemeProvider)
- Feature-specific layouts: `src/components/layouts/HandSLayout.tsx`

### Route Protection

- Authentication guard: Axios interceptor in `src/lib/request/index.ts`. On 401, redirects to `/login?redirect=${currentPath}`.
- Role-Based Access Control: `src/components/common/role-gaurd/RoleGaurd.tsx` uses the `useCurrentUser` Zustand store.
- User authentication check: `GetCurrentUser` component in ApplicationWrappers fetches the user on mount.

---

## 8. Authentication (Custom JWT)

### Provider

- Custom JWT-based authentication using HTTP-only cookies.

### State Management

- Zustand store: `src/store/currentUserStore.ts`
- Stores `currentUser`, `isAuthenticated`, `isLoading`
- Accessed via `useCurrentUser()` hook

### Session Management

- Token storage: HTTP-only cookies (`withCredentials: true` in Axios config)
- Tokens managed server-side
- Token refresh handled automatically by the server
- Axios interceptor handles 401 responses

### Logout

- `useLogoutMutation` calls the logout endpoint, clears the Zustand store, and forces a redirect

---

## 9. API Layer

### Communication

- REST API
- Client: Axios v1.9.0

### API Client Setup

- Centralized Axios instance: `src/lib/request/index.ts`
- `baseURL` from `process.env.NEXT_PUBLIC_BACKEND_URL`
- `withCredentials: true` for cookie-based auth
- Response interceptor handles 401/403 errors globally

### Type Safety

- Manual TypeScript types
- Type definitions co-located in feature `services/` or global `types/`

### API Endpoint Constants

- Centralized in `src/url/url.ts`
- Exported as `mainUrl` object

---

## 10. Notifications

- Provider: `sonner`
- Implementation: `Toaster` rendered in `src/features/applicationWrapper/index.tsx`
- Usage: `toast.success('...')` or `toast.error('...')` called from mutation hooks (`onSuccess`, `onError`)

---

## 11. Google Sign-in Implementation

This flow complements the custom JWT authentication.

### Provider

- Client-side: `@react-oauth/google`
- Wrapper: `GoogleOAuthProvider` wraps the application (ApplicationWrappers or `app/layout.tsx`)

### Authentication Flow

1. User clicks the `GoogleSignInButton` component (in `features/auth/components/`) on `/login`.
2. The button triggers `useGoogleLogin` (from `@react-oauth/google`) to get a one-time code from Google.
3. The code is passed to the `useGoogleSignInMutation` hook.
4. The mutation calls a service that `POST`s the code to `mainUrl.googleSignIn` (e.g., `/api/v1/auth/google`).

### Backend Logic

1. Receives the code from the client.
2. Exchanges the code with Google for `access_token` and `id_token`.
3. Verifies the `id_token` to get the user's email and profile.
4. Finds or creates a user in the database with this email.
5. Generates its own session (HTTP-only cookie) identical to the custom JWT flow.

### Client Response

- `useGoogleSignInMutation` `onSuccess` handler triggers.
- No need to set the user in Zustand.
- Redirects to the dashboard (e.g., `/dashboard-home`).
- `GetCurrentUser` runs on the destination page, detects the session cookie, fetches user data, and populates the `currentUserStore`.

### Impact on Stack

- **Zustand Store**: No change; populated by `GetCurrentUser`.
- **Backend**: Requires new endpoint to handle the Google OAuth code and issue a session.
- **Frontend**: Requires `GoogleOAuthProvider`, `useGoogleSignInMutation`, and a new UI component.
- **`url.ts`**: Add new endpoint constant `googleSignIn: '/api/v1/auth/google'`.

---

## 12. Starter Template Next Steps

Based on this analysis, the starter template must include:

- **Project Setup**

  - Next.js 15+ (App Router), TypeScript, path aliases (`@/*`)
  - ESLint, Prettier, Husky, lint-staged

- **State Management**

  - Zustand for global client state
  - Configured TanStack Query provider
  - React Hook Form with Zod and `@hookform/resolvers`

- **TanStack Query Implementation**

  - Custom `use[Resource]` hooks
  - `retry: false` in `QueryClient` defaults
  - `refetchOnWindowFocus: false` and `refetchOnMount: false` for static lists
  - Invalidate queries after mutations

- **UI & Styling (Critical)**

  - Shadcn/UI with Radix UI primitives
  - Tailwind CSS configured to consume HSL CSS variables (e.g., `background: 'hsl(var(--background))'`)
  - `next-themes` `ThemeProvider` in `app/layout.tsx`
  - `lib/themes/index.ts` defining theme color palettes for light/dark modes
  - `globals.css` structured with theme class names (`.theme-default`, `.theme-green`, `.theme-green.dark`)
  - `ThemeSwitcher` component (`components/common/theme-switcher.tsx`) using `useTheme` from `next-themes`
  - `cn()` utility (`lib/utils.ts`) using `clsx` and `tailwind-merge`

- **Folder Structure**

  - Feature-based architecture (`src/features/`)
  - `lib/themes/` directory
  - Shared components in `components/common/` and `components/ui/`

- **API Layer**

  - Centralized Axios instance (`lib/request/index.ts`) with 401/403 interceptors
  - `withCredentials: true`
  - Centralized endpoints in `url/url.ts`

- **Authentication**

  - HTTP-only cookie-based auth
  - Zustand `currentUserStore`
  - `GetCurrentUser` component to fetch user on app load
  - `RoleGuard` component for RBAC
  - Include `GoogleOAuthProvider` (`@react-oauth/google`)
  - `useGoogleSignInMutation` sends Google code to backend and redirects without setting state

- **Forms**

  - React Hook Form with Zod
  - Reusable `DynamicFormBuilder` recommended

- **Code Quality**

  - Prettier with Tailwind plugin
  - Commitlint for conventional commits

- **Notifications**
  - `sonner` for toast notifications, configured in root `ApplicationWrappers`

---

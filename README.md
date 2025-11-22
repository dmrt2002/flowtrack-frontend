# FlowTrack Frontend

A Next.js 15.3.2 (App Router) application using TypeScript, React 19, and Tailwind CSS 4. This is the frontend for FlowTrack, a unified branch banking system.

## Tech Stack

- **Framework**: Next.js 15.3.2 with App Router and Turbopack
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4, Shadcn/UI components
- **State Management**:
  - TanStack Query v5.80.7 for server state
  - Zustand v5.0.5 for global client state
- **Forms**: React Hook Form v7.58.1 with Zod validation
- **HTTP Client**: Axios v1.9.0
- **UI Components**: Shadcn/UI (Radix UI primitives)
- **Theme**: next-themes for dark/light mode support
- **Icons**: lucide-react
- **Notifications**: sonner

## Features

- **Dynamic Theming**: Config-driven theme system with light/dark mode support
- **Authentication**: Custom JWT (HTTP-only cookie) + Google Sign-in ready
- **Role-Based Access Control**: RoleGuard component for protecting routes
- **Form Validation**: React Hook Form with Zod schemas
- **Type-Safe API**: Axios with TypeScript interfaces
- **Code Quality**: ESLint, Prettier, Husky, lint-staged, commitlint
- **Modern UI**: Shadcn/UI components with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables:

```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your backend URL:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with providers
│   ├── login/                    # Login page
│   └── dashboard-home/           # Dashboard page
│
├── components/
│   ├── common/                   # Shared components
│   │   ├── role-gaurd/           # Role-based access control
│   │   └── theme-switcher.tsx   # Theme toggle component
│   └── ui/                       # Shadcn/UI components
│
├── features/                     # Feature-based modules
│   ├── applicationWrapper/       # App-level providers
│   │   ├── GetCurrentUser.tsx
│   │   ├── index.tsx
│   │   └── ThemeProvider.tsx
│   ├── auth/                     # Authentication feature
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services.ts
│   ├── example-data/             # Example TanStack Query hooks
│   └── example-form/             # Example form with validation
│
├── lib/
│   ├── request/                  # Axios instance & interceptors
│   ├── tanstack/                 # TanStack Query configuration
│   ├── themes/                   # Theme configuration
│   └── utils.ts                  # Utility functions (cn, etc.)
│
├── store/
│   └── currentUserStore.ts       # Zustand store for current user
│
├── url/
│   └── url.ts                    # Centralized API endpoints
│
├── validations/                  # Zod schemas
│   ├── login.ts
│   └── example.ts
│
└── styles/
    └── globals.css               # Global styles with theme variables
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Authentication

The application supports two authentication methods:

1. **Custom JWT**: Email/password authentication with HTTP-only cookies
2. **Google Sign-in**: OAuth2 flow (requires `NEXT_PUBLIC_GOOGLE_CLIENT_ID`)

Authentication state is managed via Zustand store and automatically populated on app load.

## Theming

The application uses a dynamic theming system powered by CSS variables and next-themes:

- Light and dark modes
- Config-driven color palettes
- Theme switcher component
- Automatic system preference detection

Theme colors are defined in `src/lib/themes/index.ts` and applied via CSS variables in `src/styles/globals.css`.

## Code Quality

Pre-commit hooks are configured to:

- Run ESLint on staged TypeScript files
- Format code with Prettier
- Validate commit messages (conventional commits)

## API Integration

API calls are centralized using:

- Axios instance with interceptors (`src/lib/request/`)
- Endpoint constants (`src/url/url.ts`)
- TanStack Query for data fetching and caching
- Automatic 401 redirect to login

## Contributing

1. Follow conventional commit format
2. Ensure code passes linting and formatting
3. Write tests for new features
4. Update documentation as needed

## License

Private - All rights reserved

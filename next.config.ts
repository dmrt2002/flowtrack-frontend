import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable Turbopack to avoid build cache corruption
  experimental: {
    turbo: undefined,
  },
};

export default nextConfig;

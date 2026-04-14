import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',  // Wildcard for any subdomain
        pathname: '/**',  // This ensures any path is included
      },
    ],
  },
};

export default nextConfig;
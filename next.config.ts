import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Image
   images: {
    domains: ['bukatsustorage.blob.core.windows.net'],
  },
};

export default nextConfig;
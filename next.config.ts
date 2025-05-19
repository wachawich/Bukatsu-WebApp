import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/Bukatsu-WebApp',

  images: {
    domains: ['bukatsustorage.blob.core.windows.net'],
     unoptimized: true
  },
};


export default nextConfig;
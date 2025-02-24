import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Any request starting with /api
        destination: "http://44.204.193.108:8000/api/:path*", // Backend API
      },
    ];
  },
};

export default nextConfig;

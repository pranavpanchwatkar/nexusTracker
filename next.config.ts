import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // Allow large photo uploads from mobile cameras
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wildlife-backend-52nu.onrender.com",
      },
    ],
  },
};

export default nextConfig;
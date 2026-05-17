import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Factor V: standalone output bundles the app for portable deployment
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

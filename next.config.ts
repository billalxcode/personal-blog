import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/articles/*/images/**",
      },
    ],
  },
};

export default nextConfig;

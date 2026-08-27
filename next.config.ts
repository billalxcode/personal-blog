import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/journals/*/images/**",
      },
      {
        pathname: "/*",
      },
    ],
  },
  transpilePackages: ["next-mdx-remote"]
};

export default nextConfig;

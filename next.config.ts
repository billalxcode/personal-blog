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
  transpilePackages: ["next-mdx-remote"],
  async redirects() {
    return [
      {
        source: "/articles/quantum-entanglement",
        destination: "/journals/quantum-entanglement",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone",
  async rewrites() {
    return [
      // LP（public/lp/index.html）を /lp で配信する
      { source: "/lp", destination: "/lp/index.html" },
    ];
  },
};

export default nextConfig;

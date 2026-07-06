import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure data JSON files are bundled with serverless API route functions
  outputFileTracingIncludes: {
    "/api/**": ["./data/**/*"],
  },
};

export default nextConfig;

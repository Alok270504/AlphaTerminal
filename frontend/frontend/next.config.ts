import type { NextConfig } from "next";

// Forces Next/Turbopack to treat THIS directory as the project root,
// even if parent folders have other lockfiles.
const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

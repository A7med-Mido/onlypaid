import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;

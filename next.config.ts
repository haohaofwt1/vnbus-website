import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma", "stripe"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

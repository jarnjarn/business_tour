import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  eslint: {
    ignoreDuringBuilds: true, // ⚠️ Giúp build không bị fail vì lỗi ESLint
  },
  /* config options here */
};

export default nextConfig;

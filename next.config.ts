import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removido output: "export" para permitir API Routes
  // output: "standalone" se usa automáticamente en Vercel
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Removido basePath para deployment estándar en Vercel
  // basePath: process.env.NODE_ENV === 'production' ? '/localmarket' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/localmarket/' : '',
};

export default nextConfig;

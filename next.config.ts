import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración optimizada para Vercel
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Asegurar que las rutas se manejen correctamente
  trailingSlash: false,
  // Optimización para serverless
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Configuración para Vercel Functions
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

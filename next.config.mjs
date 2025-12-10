/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable caching for development
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  async headers() {
    return [
      {
        // Apply headers to all USDZ files in public/models
        source: '/models/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, OPTIONS',
          },
        ],
      },
    ];
  },
  // Use rewrites to serve all model files through API route with proper MIME types
  async rewrites() {
    return [
      {
        // Match: /models/live_grass/philippine.usdz → /api/models/models/live_grass/philippine.usdz
        // Match: /models/artificial_grass/15mm.usdz → /api/models/models/artificial_grass/15mm.usdz
        source: '/models/:category/:file',
        destination: '/api/models/models/:category/:file',
      },
    ];
  },
};

export default nextConfig;

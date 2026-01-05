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
  // Exclude large dependencies from serverless function tracing
  // Files in public/ are served as static assets by Vercel's CDN
  // They must be EXCLUDED from function tracing to avoid the 250MB limit
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@google/model-viewer/**/*',
      'public/models/**/*',  // Exclude model files from serverless functions
    ],
  },
};

export default nextConfig;

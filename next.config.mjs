/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Use rewrites to serve USDZ files through API route with proper MIME type
  async rewrites() {
    return [
      {
        source: '/models/:path*.usdz',
        destination: '/api/models/models/:path*.usdz',
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply headers to all USDZ files
        source: '/models/:path*.usdz',
        headers: [
          {
            key: 'Content-Type',
            value: 'model/vnd.usdz+zip',
          },
          {
            key: 'Content-Disposition',
            value: 'inline; filename=":path*.usdz"',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Also apply to GLB files for consistency
        source: '/models/:path*.glb',
        headers: [
          {
            key: 'Content-Type',
            value: 'model/gltf-binary',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

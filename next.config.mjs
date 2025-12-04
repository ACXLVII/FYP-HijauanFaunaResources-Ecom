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
            value: 'inline',
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

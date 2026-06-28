/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Vary",
            value: "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

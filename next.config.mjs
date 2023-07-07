await import("./src/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.icons8.com",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;

await import("./src/env.mjs");
import withPWAInit from "@imbios/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});

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

export default withPWA(nextConfig);

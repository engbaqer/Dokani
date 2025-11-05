/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3500",
        pathname: "/**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "storesplatform-api-production-ca3f.up.railway.app",
        pathname: "/**", // optional: add your real API domain for deployment
      },
    ],
  },
};

export default nextConfig;

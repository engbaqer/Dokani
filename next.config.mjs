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
        hostname: "your-production-domain.com",
        pathname: "/**", // optional: add your real API domain for deployment
      },
    ],
  },
};

export default nextConfig;

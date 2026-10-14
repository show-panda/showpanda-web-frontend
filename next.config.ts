import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [
      // Real movie posters from the booking API.
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      // Google profile pictures for signed-in users.
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

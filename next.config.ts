import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  images: {
    // Seeded picsum images are deterministic stand-ins for real poster/theatre
    // artwork. Swap these patterns for your CDN / TMDB image host in production.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "fastly.picsum.photos", pathname: "/**" },
      // Real movie posters from the booking API.
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/**" },
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

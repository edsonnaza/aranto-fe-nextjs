import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = {
  reactStrictMode: true,
  trailingSlash: false, // Asegúrate de que está en `false`
};

export default nextConfig;
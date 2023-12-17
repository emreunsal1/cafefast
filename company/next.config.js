/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  webpackDevMiddleware: (config) => {
    // Solve compiling problem via vagrant
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // delay before rebuilding
    };
    return config;
  },
  webpack: (config) => {
    config.plugins = config.plugins || [];

    config.optimization.providedExports = true;

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./"),
    };

    return config;
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every image is served from /public, so no remote hosts are allowed.
  // Add a remotePatterns entry here if artwork ever moves to a CDN.
  turbopack: {},
};

export default nextConfig;

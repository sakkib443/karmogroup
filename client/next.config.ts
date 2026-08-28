import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit .next/standalone so the Docker image ships only the server plus the
  // node_modules it actually imports (needed by the Dockerfile / Coolify).
  output: "standalone",
  // React Compiler is disabled: with it on, Suspense-wrapped pages could get
  // stuck on their fallback/loading state (Next 16.1.2 + React 19). Leave off
  // until that interaction is resolved upstream.
  reactCompiler: false,
  images: {
    // WebP only — no AVIF.
    //
    // AVIF encoding stalls on the detailed background textures: the mattress
    // damask (`mattress/mosaic/karmo-pattern-texture.jpg`) served back a JPEG
    // in 4ms but never finished an AVIF encode at w=1920, even after 90s. The
    // browser asks for AVIF first, so those textures simply never painted —
    // the section backgrounds looked as though they had been deleted, while
    // the same URL fetched fine with curl.
    //
    // WebP encodes in milliseconds, is supported everywhere the site targets,
    // and costs a few KB against AVIF. Worth it to have the images appear.
    formats: ["image/webp"],
    qualities: [70, 72, 75, 82, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // Locally-stored uploads served by the backend (disk-storage mode).
      // Local dev: backend runs on http://localhost:5000.
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },
      // Production backend on the VPS — disk-storage uploads are served from
      // https://api.healixbd.com/uploads/...
      {
        protocol: "https",
        hostname: "api.healixbd.com",
      },
    ],
  },
};

export default nextConfig;

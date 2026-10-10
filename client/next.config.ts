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
    // Serve images as-is, skipping Next's on-demand optimizer.
    //
    // On the Coolify VPS the /_next/image route re-encodes each image per
    // request with sharp; the box is weak, so even a 77 KB file took ~5 s and
    // 40+ images queued into a 5-6 s load. The sources are already small WebP
    // (converted and capped at 2000px by scripts/optimize-aggressive.mjs), so
    // the optimizer added latency for no real size win. Unoptimized serves the
    // static files straight from disk with long cache headers — far faster on
    // a low-powered server. (formats/qualities/deviceSizes below are ignored
    // while this is on, kept for when a stronger host makes optimizing worth it.)
    unoptimized: true,
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
    qualities: [70, 72, 75, 80, 82, 85, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920, 2048, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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

import { NextResponse } from "next/server";

import { readImage } from "@/lib/review/store";

export const runtime = "nodejs";

const TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

/** GET /api/review/file/<name>  ->  an uploaded review screenshot. */
export async function GET(_request, { params }) {
  const { name } = await params;
  const img = await readImage(name);
  if (!img) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(img.buf, {
    headers: {
      "Content-Type": TYPES[img.ext],
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
}

import { NextResponse } from "next/server";

import {
  MAX_UPLOAD_BYTES,
  clientIp,
  rateLimited,
  saveImage,
} from "@/lib/review/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 4;

/** POST /api/review/upload (multipart, field "files")  ->  { urls: [...] } */
export async function POST(request) {
  if (rateLimited(clientIp(request), 30)) {
    return NextResponse.json(
      { ok: false, error: "Too many uploads. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  }

  const files = form
    .getAll("files")
    .filter((f) => f && typeof f === "object" && typeof f.arrayBuffer === "function");

  if (!files.length) {
    return NextResponse.json({ ok: false, error: "No image received." }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ ok: false, error: `Up to ${MAX_FILES} images at a time.` }, { status: 400 });
  }

  const urls = [];
  for (const file of files) {
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ ok: false, error: "An image is larger than 8 MB." }, { status: 413 });
    }
    try {
      const name = await saveImage(Buffer.from(await file.arrayBuffer()));
      urls.push(`/api/review/file/${name}`);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Only PNG, JPG, WEBP or GIF images are allowed." },
        { status: 415 },
      );
    }
  }

  return NextResponse.json({ ok: true, urls });
}

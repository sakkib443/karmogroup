import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// fs + fetch, so this must be the Node runtime, and it must never be cached —
// every request generates fresh imagery.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Imagen on the Gemini API. imagen-4 is the sharpest; imagen-3 is the safe
// fallback if a key/tier does not have 4 yet. The client can ask for either;
// anything else falls back to the env default.
const DEFAULT_MODEL =
  process.env.GEMINI_IMAGE_MODEL || "imagen-4.0-generate-001";
const ALLOWED_MODELS = new Set([
  "imagen-4.0-generate-001",
  "imagen-4.0-ultra-generate-001",
  "imagen-4.0-fast-generate-001",
  "imagen-3.0-generate-002",
]);
const ALLOWED_AR = new Set(["1:1", "3:4", "4:3", "9:16", "16:9"]);

function slugify(name) {
  const s = (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return s || "karmo-image";
}

export async function POST(req) {
  // This tool spends real API credits, so it is off in a production build
  // unless deliberately switched on. Locally (next dev) it is always allowed.
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_IMAGE_STUDIO !== "true"
  ) {
    return NextResponse.json(
      { error: "The image studio is disabled in production." },
      { status: 403 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY is not set. Add it to client/.env.local and restart the dev server.",
      },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const prompt = (body.prompt || "").trim();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is empty." }, { status: 400 });
  }

  const model = ALLOWED_MODELS.has(body.model) ? body.model : DEFAULT_MODEL;
  const aspectRatio = ALLOWED_AR.has(body.aspectRatio)
    ? body.aspectRatio
    : "16:9";
  const count = Math.min(Math.max(parseInt(body.count, 10) || 1, 1), 4);
  const baseName = slugify(body.filename);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict`;

  let apiRes, data;
  try {
    apiRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: count,
          aspectRatio,
          // Interiors sometimes include people; allow adults, leave the
          // stricter child-generation rules to the API.
          personGeneration: "allow_adult",
        },
      }),
    });
    data = await apiRes.json();
  } catch (e) {
    return NextResponse.json(
      { error: "Could not reach the Imagen API: " + e.message },
      { status: 502 },
    );
  }

  if (!apiRes.ok) {
    const msg = data?.error?.message || JSON.stringify(data);
    return NextResponse.json(
      {
        error: `Imagen API error (${apiRes.status}): ${msg}`,
        hint:
          apiRes.status === 404
            ? `The model "${model}" may not be available on your key. Try imagen-3.0-generate-002.`
            : undefined,
        model,
      },
      { status: apiRes.status },
    );
  }

  const preds = data.predictions || [];
  if (!preds.length) {
    return NextResponse.json(
      {
        error:
          "The API returned no image — the prompt was most likely blocked by a safety filter. Try rephrasing.",
      },
      { status: 422 },
    );
  }

  // Saved straight into public/ so the file is immediately usable in the site.
  const dir = path.join(process.cwd(), "public", "images", "generated");
  await mkdir(dir, { recursive: true });

  const images = [];
  for (let i = 0; i < preds.length; i++) {
    const b64 = preds[i].bytesBase64Encoded;
    if (!b64) continue;
    const suffix = preds.length > 1 ? `-${i + 1}` : "";
    const file = `${baseName}${suffix}.png`;
    await writeFile(path.join(dir, file), Buffer.from(b64, "base64"));
    images.push({
      path: `/images/generated/${file}`,
      dataUrl: `data:${preds[i].mimeType || "image/png"};base64,${b64}`,
    });
  }

  return NextResponse.json({ ok: true, model, aspectRatio, images });
}

import { NextResponse } from "next/server";

import { REVIEW_PAGES } from "@/components/karmo/review/reviewConfig";
import {
  clientIp,
  listPage,
  rateLimited,
  recordDecision,
  validateDecision,
} from "@/lib/review/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/** GET /api/review?page=/  ->  every section's status + history for that page. */
export async function GET(request) {
  const page = new URL(request.url).searchParams.get("page") || "/";
  if (!REVIEW_PAGES[page]) {
    return NextResponse.json({ ok: false, error: "Unknown page." }, { status: 404, headers: NO_STORE });
  }
  try {
    const { sections, temporary } = await listPage(page);
    return NextResponse.json({ ok: true, page, sections, temporary }, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Review storage is unavailable." },
      { status: 500, headers: NO_STORE },
    );
  }
}

/** POST /api/review  ->  approve / request changes / reset one section. */
export async function POST(request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a minute and try again." },
      { status: 429, headers: NO_STORE },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400, headers: NO_STORE });
  }

  const checked = validateDecision(body);
  if (checked.error) {
    return NextResponse.json({ ok: false, error: checked.error }, { status: 400, headers: NO_STORE });
  }

  try {
    const section = await recordDecision(checked.value);
    return NextResponse.json({ ok: true, section }, { headers: NO_STORE });
  } catch (err) {
    if (err?.code === "GONE") {
      return NextResponse.json({ ok: false, error: err.message }, { status: 409, headers: NO_STORE });
    }
    return NextResponse.json(
      { ok: false, error: "Could not save. Please try again." },
      { status: 500, headers: NO_STORE },
    );
  }
}

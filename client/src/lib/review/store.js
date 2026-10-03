/**
 * Server-side store for the client-review system.
 *
 * One JSON file (review.json) holds every approval / note; uploaded
 * screenshots live beside it in files/. No database needed.
 *
 * Where it lives, in order of preference:
 *   1. $REVIEW_DATA_DIR            (set this to a mounted volume in production)
 *   2. <cwd>/.review-data
 *   3. <os tmp>/karmo-review       (works anywhere, but is wiped on redeploy)
 * `temporary` is reported to the UI so the team knows when data is not durable.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";

import { REVIEW_PAGES } from "@/components/karmo/review/reviewConfig";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_NOTE = 2000;
const MAX_IMAGES = 6;
const MAX_ENTRIES = 300;

/* -- storage location ----------------------------------------------------- */

let storagePromise;
async function resolveStorage() {
  const candidates = [
    process.env.REVIEW_DATA_DIR,
    path.join(process.cwd(), ".review-data"),
    path.join(os.tmpdir(), "karmo-review"),
  ].filter(Boolean);

  for (const dir of candidates) {
    try {
      await fs.mkdir(path.join(dir, "files"), { recursive: true });
      const probe = path.join(dir, `.probe-${process.pid}`);
      await fs.writeFile(probe, "ok");
      await fs.unlink(probe);
      return { dir, temporary: dir.startsWith(os.tmpdir()) };
    } catch {
      /* not writable, try the next candidate */
    }
  }
  throw new Error("No writable directory for review data");
}

export function getStorage() {
  if (!storagePromise) {
    storagePromise = resolveStorage().catch((err) => {
      storagePromise = undefined;
      throw err;
    });
  }
  return storagePromise;
}

/* -- JSON db (serialised read-modify-write, atomic replace) ---------------- */

const emptyDb = () => ({ version: 1, pages: {} });

async function readDb(dir) {
  const file = path.join(dir, "review.json");
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return emptyDb();
    if (err instanceof SyntaxError) {
      // Never lose feedback to a corrupt file: keep it aside and start fresh.
      await fs.rename(file, `${file}.corrupt-${Date.now()}`).catch(() => {});
      return emptyDb();
    }
    throw err;
  }
}

async function writeDb(dir, db) {
  // The folder can vanish at runtime (volume remount, manual cleanup).
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, "review.json");
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2));
  await fs.rename(tmp, file);
}

let queue = Promise.resolve();
function withLock(task) {
  const run = queue.then(() => task());
  queue = run.catch(() => {});
  return run;
}

/* -- public API ------------------------------------------------------------ */

/**
 * A section record:
 *   status     "pending" | "approved" | "changes"
 *   updatedAt  ISO time of the last action
 *   requests   change requests the team still tracks: { id, at, note, images,
 *              done, doneAt, editedAt }. Done ones stay (so they can be
 *              reopened) until the section is reset.
 *   entries    the full history log, oldest first. Never edited — every action
 *              (approve, request, done, reopen, edit, delete, reset) appends.
 *
 * Records written before `requests` existed get them rebuilt from the log:
 * every "changes" entry since the last reset is an open request.
 */
function normalise(sec) {
  sec.entries ??= [];
  if (!Array.isArray(sec.requests)) {
    let since = 0;
    sec.entries.forEach((e, i) => {
      if (e.status === "reset") since = i + 1;
    });
    sec.requests = sec.entries
      .slice(since)
      .filter((e) => e.status === "changes")
      .map((e) => ({ id: e.id, at: e.at, note: e.note || "", images: e.images || [], done: false }));
  }
  return sec;
}

export async function listPage(page) {
  const { dir, temporary } = await getStorage();
  const db = await readDb(dir);
  const sections = db.pages?.[page]?.sections ?? {};
  Object.values(sections).forEach(normalise);
  return { sections, temporary };
}

export async function recordDecision({ page, id, status, note, images, requestId }) {
  const { dir } = await getStorage();
  return withLock(async () => {
    const db = await readDb(dir);
    db.pages ??= {};
    const pageRec = (db.pages[page] ??= { sections: {} });
    const sec = normalise(
      (pageRec.sections[id] ??= { status: "pending", updatedAt: null, entries: [] }),
    );

    const at = new Date().toISOString();
    const entry = { id: crypto.randomUUID(), at, status };
    const open = () => sec.requests.filter((r) => !r.done).length;
    // Once the team has done every open request, the section goes back to
    // the client for another look.
    const settle = () => {
      if (sec.status === "changes" && open() === 0) sec.status = "pending";
    };

    if (status === "approved") {
      sec.status = "approved";
    } else if (status === "changes") {
      sec.requests.push({ id: entry.id, at, note, images, done: false });
      Object.assign(entry, { note, images });
      sec.status = "changes";
    } else if (status === "reset") {
      sec.requests = [];
      sec.status = "pending";
    } else {
      const req = sec.requests.find((r) => r.id === requestId);
      if (!req) throw Object.assign(new Error("That request no longer exists."), { code: "GONE" });
      entry.ref = req.id;
      entry.note = req.note;
      if (status === "done") {
        req.done = true;
        req.doneAt = at;
        settle();
      } else if (status === "reopened") {
        req.done = false;
        req.doneAt = null;
        sec.status = "changes";
      } else if (status === "edited") {
        entry.before = req.note;
        entry.note = note;
        req.note = note;
        req.editedAt = at;
      } else if (status === "deleted") {
        entry.images = req.images;
        sec.requests = sec.requests.filter((r) => r.id !== req.id);
        settle();
      }
    }

    sec.entries.push(entry);
    if (sec.entries.length > MAX_ENTRIES) sec.entries = sec.entries.slice(-MAX_ENTRIES);
    sec.updatedAt = at;

    await writeDb(dir, db);
    return sec;
  });
}

/* -- validation ------------------------------------------------------------ */

const ID_RE = /^[a-z0-9-]{1,40}$/;
const REQ_ID_RE = /^[a-f0-9-]{36}$/;
const REQUEST_ACTIONS = ["done", "reopened", "edited", "deleted"];
const STATUSES = ["approved", "changes", "reset", ...REQUEST_ACTIONS];
const IMG_URL_RE = /^\/api\/review\/file\/[a-z0-9]+-[a-f0-9]{12}\.(?:png|jpg|webp|gif)$/;
export const FILE_RE = /^[a-z0-9]+-[a-f0-9]{12}\.(png|jpg|webp|gif)$/;

export function validateDecision(body) {
  if (!body || typeof body !== "object") return { error: "Invalid request." };

  const page = typeof body.page === "string" ? body.page : "";
  const id = typeof body.id === "string" ? body.id : "";
  if (!REVIEW_PAGES[page] || !ID_RE.test(id)) return { error: "Unknown section." };
  if (!REVIEW_PAGES[page].sections.some((s) => s.id === id)) {
    return { error: "Unknown section." };
  }

  const status = body.status;
  if (!STATUSES.includes(status)) {
    return { error: "Invalid status." };
  }

  const note = typeof body.note === "string" ? body.note.trim().slice(0, MAX_NOTE) : "";
  const images = Array.isArray(body.images)
    ? body.images.filter((u) => typeof u === "string" && IMG_URL_RE.test(u)).slice(0, MAX_IMAGES)
    : [];

  if (status === "changes" && !note && images.length === 0) {
    return { error: "Tell us what to change, or attach an image." };
  }

  const onRequest = REQUEST_ACTIONS.includes(status);
  const requestId = typeof body.requestId === "string" ? body.requestId : "";
  if (onRequest && !REQ_ID_RE.test(requestId)) return { error: "Unknown request." };
  if (status === "edited" && !note) return { error: "The note can't be empty." };

  return {
    value: {
      page,
      id,
      status,
      note: status === "changes" || status === "edited" ? note : "",
      images: status === "changes" ? images : [],
      requestId: onRequest ? requestId : undefined,
    },
  };
}

/* -- images ---------------------------------------------------------------- */

function sniffImage(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 4).toString("ascii") === "GIF8") return "gif";
  if (
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "webp";
  }
  return null; // SVG and everything else is refused on purpose
}

export async function saveImage(buffer) {
  const ext = sniffImage(buffer);
  if (!ext) throw new Error("Unsupported image type");
  const { dir } = await getStorage();
  await fs.mkdir(path.join(dir, "files"), { recursive: true });
  const name = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  await fs.writeFile(path.join(dir, "files", name), buffer);
  return name;
}

export async function readImage(name) {
  if (!FILE_RE.test(name)) return null;
  const { dir } = await getStorage();
  try {
    const buf = await fs.readFile(path.join(dir, "files", name));
    return { buf, ext: name.split(".").pop() };
  } catch {
    return null;
  }
}

/* -- light abuse protection (per IP, in memory) ---------------------------- */

const hits = new Map();
export function rateLimited(ip, limit = 40, windowMs = 60_000) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.start > windowMs) {
    hits.set(ip, { start: now, count: 1 });
    if (hits.size > 5000) {
      for (const [key, val] of hits) if (now - val.start > windowMs) hits.delete(key);
    }
    return false;
  }
  rec.count += 1;
  return rec.count > limit;
}

export function clientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : "local").slice(0, 64);
}

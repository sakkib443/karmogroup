import { API_URL, API_CONFIGURED } from "@/config/api";

/**
 * Upload one career document (CV, cover letter, certificate, photo).
 *
 * Deliberately a plain `fetch` rather than an RTK Query mutation: the endpoint
 * takes `multipart/form-data`, and the file goes up before the application row
 * exists — there is nothing to attach it to and no cache tag to invalidate. The
 * caller just needs the URL back to put in the form state.
 *
 * The route is public (candidates have no account) and rate-limited server-side.
 */
export type UploadedFile = { url: string; fileName: string; size: number };

export async function uploadCareerFile(file: File): Promise<UploadedFile> {
    if (!API_CONFIGURED) {
        throw new Error("Uploads are unavailable — the API is not configured.");
    }

    const body = new FormData();
    body.append("file", file);

    const res = await fetch(`${API_URL}/upload/document`, { method: "POST", body });

    /* A 429 or a multer rejection comes back as JSON with a message; a proxy
       failure may not be JSON at all, so fall back to the status text. */
    let payload: any = null;
    try {
        payload = await res.json();
    } catch {
        /* ignore */
    }

    if (!res.ok || !payload?.success) {
        throw new Error(payload?.message || `Upload failed (${res.status})`);
    }

    return {
        url: payload.data.url,
        fileName: payload.data.fileName || file.name,
        size: payload.data.size || file.size,
    };
}

/** Human file size for the "attached" row under each field. */
export const prettySize = (bytes: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const MAX_FILE_BYTES = 20 * 1024 * 1024;

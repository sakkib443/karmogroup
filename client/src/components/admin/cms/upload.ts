/**
 * Uploads for Site content. Pictures are resized (longest side 2560px) and turned
 * into WebP in the browser first, so the site stays fast whatever the camera made;
 * videos, GIFs and SVGs go up as they are. Files land in the media library
 * (POST /api/media) and come back as "/api/media/<id>".
 */
import { API_URL } from '@/config/api';
import type { MediaItem } from '@/redux/api/cmsApi';

const MAX_SIDE = 2560;
const QUALITY = 0.85;

async function shrinkImage(file: File): Promise<{ blob: Blob; width: number; height: number; name: string }> {
    const keep = ['image/gif', 'image/svg+xml'].includes(file.type);
    const bitmap = await createImageBitmap(file).catch(() => null);
    if (!bitmap) return { blob: file, width: 0, height: 0, name: file.name };
    const { width, height } = bitmap;
    if (keep) { bitmap.close?.(); return { blob: file, width, height, name: file.name }; }

    const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/webp', QUALITY));
    // Already small and in WebP? Keep the original rather than re-encoding it larger.
    if (!blob || (blob.size >= file.size && file.type === 'image/webp' && scale === 1)) {
        return { blob: file, width, height, name: file.name };
    }
    return { blob, width: w, height: h, name: file.name.replace(/\.[^.]+$/, '') + '.webp' };
}

function videoSize(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
        const v = document.createElement('video');
        v.preload = 'metadata';
        v.onloadedmetadata = () => { resolve({ width: v.videoWidth, height: v.videoHeight }); URL.revokeObjectURL(v.src); };
        v.onerror = () => resolve({ width: 0, height: 0 });
        v.src = URL.createObjectURL(file);
    });
}

const token = () => {
    try { return localStorage.getItem('token') || ''; } catch { return ''; }
};

/** Upload one file to the media library, reporting progress (0–100). */
export async function uploadMedia(file: File, onProgress?: (pct: number) => void): Promise<MediaItem> {
    const isVideo = file.type.startsWith('video/');
    if (!isVideo && !file.type.startsWith('image/')) throw new Error('Choose a picture or an MP4/WebM video');
    if (isVideo && file.size > 100 * 1024 * 1024) throw new Error('Videos can be up to 100 MB');

    const prepared = isVideo
        ? { blob: file as Blob, name: file.name, ...(await videoSize(file)) }
        : await shrinkImage(file);

    const form = new FormData();
    form.append('file', prepared.blob, prepared.name);
    form.append('name', prepared.name);
    if (prepared.width) form.append('width', String(prepared.width));
    if (prepared.height) form.append('height', String(prepared.height));

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/media`);
        const t = token();
        if (t) xhr.setRequestHeader('Authorization', `Bearer ${t}`);
        xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100)); };
        xhr.onload = () => {
            let body: { data?: MediaItem; message?: string } = {};
            try { body = JSON.parse(xhr.responseText); } catch { /* not JSON */ }
            if (xhr.status >= 200 && xhr.status < 300 && body.data) resolve(body.data);
            else reject(new Error(body.message || `Upload failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error('Upload failed — check the connection'));
        xhr.send(form);
    });
}

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import config from '../config';

// ── Which storage backend? ─────────────────────────────────
// If Cloudinary creds are present we upload to the cloud; otherwise we fall
// back to LOCAL DISK storage (great for a VPS where the /uploads folder is
// persistent). Add the CLOUDINARY_* vars later and it switches automatically —
// no code change needed.
export const isCloudinaryEnabled = Boolean(
    config.cloudinary.cloud_name && config.cloudinary.api_key && config.cloudinary.api_secret,
);

// Folder where locally-uploaded files are written. Served statically at
// GET /uploads/<filename> (see app.ts). Created on boot when using disk mode.
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!isCloudinaryEnabled && !fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── Configure Cloudinary (only used when enabled) ──────────
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key:    config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
});

// Cloudinary storage — stores uploads directly to the cloud.
const cloudStorage = new CloudinaryStorage({
    cloudinary,
    params: async (_req: any, _file: any) => ({
        folder:         's-kawsar-sunnah-mart/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' }],
        public_id:      `product_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    }),
});

// Local disk storage — writes files into UPLOAD_DIR with a unique name.
const diskStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
        cb(null, `product_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`);
    },
});

// ── Multer upload — up to 10 files, 10MB each ─────────────
export const upload = multer({
    storage: isCloudinaryEnabled ? cloudStorage : diskStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpg, png, webp, gif, avif)'));
        }
    },
});

/**
 * ── Document upload — CVs, cover letters, certificates, job descriptions ───
 *
 * Separate from `upload` above rather than widening it: that one is the product
 * image pipeline, and it resizes and re-encodes everything it touches. Running
 * a PDF through an image transformation destroys it.
 *
 * Cloudinary needs `resource_type: 'raw'` for anything that is not an image, so
 * the two cannot share a storage config either. Limit is 20MB — a CV with
 * scanned certificates attached runs well past the 10MB the image path allows.
 */
const DOC_MIMES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

const docCloudStorage = new CloudinaryStorage({
    cloudinary,
    params: async (_req: any, file: any) => ({
        folder: 'karmo/career',
        resource_type: file.mimetype === 'application/pdf' || file.mimetype.startsWith('application/') ? 'raw' : 'image',
        public_id: `cv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    }),
});

const docDiskStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const ext = (path.extname(file.originalname) || '.pdf').toLowerCase();
        cb(null, `cv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`);
    },
});

export const uploadDocument = multer({
    storage: isCloudinaryEnabled ? (docCloudStorage as any) : docDiskStorage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (_req, file, cb) => {
        if (DOC_MIMES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, DOCX or image files are allowed'));
        }
    },
});

// ── Resolve the public URL for an uploaded file ────────────
// Cloudinary sets `file.path` to the full secure URL. For disk storage we
// build an absolute URL to the statically-served /uploads route, using the
// configured backend_url (preferred) or the incoming request host.
export function fileToUrl(req: Request, file: Express.Multer.File): string {
    if (isCloudinaryEnabled) return (file as any).path;
    const base = (config.backend_url || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
    return `${base}/uploads/${file.filename}`;
}

export { cloudinary };

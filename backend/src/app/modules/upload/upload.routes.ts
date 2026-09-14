import express from 'express';
import { upload, uploadDocument } from '../../utils/cloudinary';
import { uploadController } from './upload.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';

const router = express.Router();

/**
 * Career document uploads are PUBLIC — a candidate has no account, so the CV
 * has to land before there is anything to authenticate against.
 *
 * Two things keep that from being an open file drop: multer's own filter (PDF,
 * DOC, DOCX and images only, 20MB) and this counter, which caps one IP to 20
 * uploads an hour. That is generous for a real applicant with certificates and
 * useless to anyone trying to park files on the account.
 */
const uploadHits = new Map<string, { count: number; resetAt: number }>();
const HOUR = 60 * 60 * 1000;

const rateLimitUploads = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const hit = uploadHits.get(ip);

    if (!hit || now > hit.resetAt) {
        uploadHits.set(ip, { count: 1, resetAt: now + HOUR });
        return next();
    }
    if (hit.count >= 20) {
        return res.status(429).json({ success: false, message: 'Too many uploads. Please try again later.' });
    }
    hit.count += 1;
    return next();
};

/* Drop expired buckets hourly so the map cannot grow without bound. */
setInterval(() => {
    const now = Date.now();
    for (const [ip, hit] of uploadHits) if (now > hit.resetAt) uploadHits.delete(ip);
}, HOUR).unref?.();

// POST /api/upload/document  — single CV / cover letter / certificate (public)
router.post('/document', rateLimitUploads, uploadDocument.single('file'), uploadController.uploadDocument);

// POST /api/upload/documents — up to 5 certificates at once (public)
router.post('/documents', rateLimitUploads, uploadDocument.array('files', 5), uploadController.uploadDocuments);

// POST /api/upload/image  — single image (admin only)
router.post(
    '/image',
    authMiddleware,
    authorizeRoles('admin'),
    upload.single('image'),
    uploadController.uploadSingle,
);

// POST /api/upload/images — multiple up to 10 (admin only)
router.post(
    '/images',
    authMiddleware,
    authorizeRoles('admin'),
    upload.array('images', 10),
    uploadController.uploadMultiple,
);

// POST /api/upload/my-images — multiple up to 5 (any logged-in user, e.g. return requests)
router.post(
    '/my-images',
    authMiddleware,
    upload.array('images', 5),
    uploadController.uploadMultiple,
);

export const UploadRoutes = router;

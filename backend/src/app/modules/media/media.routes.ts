import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../utils/AppError';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import { R } from '../../constants/roles';

/**
 * The site's media library — images and videos for Site content, stored in MongoDB
 * (GridFS, bucket "media") rather than on the server's disk. That way an upload made
 * from a laptop shows on the live site too (both read the same database), and a
 * redeploy of the server cannot wipe it.
 *
 *   POST   /api/media        upload one file          (super admin, admin)
 *   GET    /api/media        list the library         (super admin, admin)
 *   GET    /api/media/:id    the file, cached forever (public; supports Range for video)
 *   DELETE /api/media/:id    remove a file            (super admin, admin)
 *
 * Images are resized and turned into WebP in the browser before they are sent.
 */

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'];
const VIDEO_TYPES = ['video/mp4', 'video/webm'];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (IMAGE_TYPES.includes(file.mimetype) || VIDEO_TYPES.includes(file.mimetype)) cb(null, true);
        else cb(new AppError(400, 'Only images (JPG, PNG, WebP, AVIF, GIF, SVG) and videos (MP4, WebM)'));
    },
});

const bucket = () => {
    const db = mongoose.connection.db;
    if (!db) throw new AppError(503, 'Database not ready');
    return new mongoose.mongo.GridFSBucket(db, { bucketName: 'media' });
};

const toId = (id: string) => {
    if (!/^[a-f0-9]{24}$/i.test(id)) throw new AppError(404, 'File not found');
    return new mongoose.Types.ObjectId(id);
};

const present = (f: any) => ({
    _id: String(f._id),
    url: `/api/media/${f._id}`,
    name: f.metadata?.name || f.filename,
    contentType: f.metadata?.contentType || '',
    kind: f.metadata?.kind || 'image',
    size: f.length,
    width: f.metadata?.width || null,
    height: f.metadata?.height || null,
    uploadedAt: f.uploadDate,
    uploadedBy: f.metadata?.uploadedBy?.name || '',
});

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles(...R.admin), upload.single('file'), catchAsync(async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) throw new AppError(400, 'Choose a file to upload');
    const kind = file.mimetype.startsWith('video/') ? 'video' : 'image';
    if (kind === 'image' && file.size > 15 * 1024 * 1024) throw new AppError(400, 'Images can be up to 15 MB');

    const num = (v: unknown) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Math.round(Number(v)) : null);
    const metadata = {
        contentType: file.mimetype,
        kind,
        name: String(req.body.name || file.originalname || 'file').slice(0, 160),
        width: num(req.body.width),
        height: num(req.body.height),
        uploadedBy: { id: req.user?.userId, name: req.user?.name || '' },
    };

    const id = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
        const stream = bucket().openUploadStream(metadata.name, { metadata });
        stream.on('error', reject);
        stream.on('finish', () => resolve(stream.id as mongoose.Types.ObjectId));
        stream.end(file.buffer);
    });
    const saved = await bucket().find({ _id: id }).next();
    sendResponse(res, { statusCode: 201, success: true, message: 'Uploaded', data: present(saved) });
}));

router.get('/', authMiddleware, authorizeRoles(...R.admin), catchAsync(async (req: Request, res: Response) => {
    const kind = String(req.query.kind || '');
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 60));
    const page = Math.max(1, Number(req.query.page) || 1);
    const filter: Record<string, unknown> = kind === 'image' || kind === 'video' ? { 'metadata.kind': kind } : {};
    const db = mongoose.connection.db!;
    const [files, total] = await Promise.all([
        bucket().find(filter).sort({ uploadDate: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
        db.collection('media.files').countDocuments(filter),
    ]);
    sendResponse(res, {
        statusCode: 200, success: true, message: 'Media', data: files.map(present),
        meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
}));

router.get('/:id', catchAsync(async (req: Request, res: Response) => {
    const _id = toId(req.params.id);
    const file: any = await bucket().find({ _id }).next();
    if (!file) throw new AppError(404, 'File not found');

    const size: number = file.length;
    const etag = `"${file._id}"`;
    res.setHeader('Content-Type', file.metadata?.contentType || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('ETag', etag);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    if (req.headers['if-none-match'] === etag) { res.status(304).end(); return; }

    // Video seeks ask for byte ranges.
    const range = req.headers.range;
    if (range) {
        const m = /bytes=(\d*)-(\d*)/.exec(range);
        const start = m && m[1] ? Number(m[1]) : 0;
        const end = m && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
        if (start >= size || start > end) {
            res.status(416).setHeader('Content-Range', `bytes */${size}`);
            res.end();
            return;
        }
        res.status(206);
        res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
        res.setHeader('Content-Length', String(end - start + 1));
        bucket().openDownloadStream(_id, { start, end: end + 1 }).on('error', () => res.end()).pipe(res);
        return;
    }
    res.setHeader('Content-Length', String(size));
    bucket().openDownloadStream(_id).on('error', () => res.end()).pipe(res);
}));

router.delete('/:id', authMiddleware, authorizeRoles(...R.admin), catchAsync(async (req: Request, res: Response) => {
    const _id = toId(req.params.id);
    const file = await bucket().find({ _id }).next();
    if (!file) throw new AppError(404, 'File not found');
    await bucket().delete(_id);
    sendResponse(res, { statusCode: 200, success: true, message: 'Deleted', data: { _id: String(_id) } });
}));

export const MediaRoutes = router;

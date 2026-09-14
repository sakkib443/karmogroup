import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { fileToUrl } from '../../utils/cloudinary';

// POST /api/upload/image   — single image
// POST /api/upload/images  — multiple images (max 10)

export const uploadController = {
    // ── Single image ──────────────────────────────────────────
    uploadSingle: catchAsync(async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const url = fileToUrl(req, req.file as Express.Multer.File); // works for Cloudinary + local disk
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Image uploaded successfully',
            data: { url },
        });
    }),

    /**
     * ── Single document — CV, cover letter, certificate, JD ───
     *
     * Public: a candidate uploads their CV before the application row exists,
     * so there is nobody to authenticate. The route is rate-limited and the
     * multer filter only lets PDF/DOC/DOCX and images through.
     *
     * Returns the original filename alongside the URL — the admin list shows
     * "Rahim_CV.pdf", not the random public_id Cloudinary stores it under.
     */
    uploadDocument: catchAsync(async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const file = req.file as Express.Multer.File;
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'File uploaded successfully',
            data: { url: fileToUrl(req, file), fileName: file.originalname, size: file.size },
        });
    }),

    /** Several certificates in one go. */
    uploadDocuments: catchAsync(async (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: `${files.length} file(s) uploaded successfully`,
            data: {
                files: files.map((f) => ({ url: fileToUrl(req, f), fileName: f.originalname, size: f.size })),
                urls: files.map((f) => fileToUrl(req, f)),
            },
        });
    }),

    // ── Multiple images (up to 10) ────────────────────────────
    uploadMultiple: catchAsync(async (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }
        const urls = files.map((f) => fileToUrl(req, f));
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: `${urls.length} image(s) uploaded successfully`,
            data: { urls },
        });
    }),
};

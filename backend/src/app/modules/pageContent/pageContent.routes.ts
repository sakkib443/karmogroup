import express, { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../utils/AppError';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import { R } from '../../constants/roles';
import { PageContent } from './pageContent.model';

/**
 * Site content — the editable text, images and settings of each website page.
 *
 *   GET  /api/page-content                 every page and its status       (admin)
 *   GET  /api/page-content/:page           what the site shows             (public)
 *   GET  /api/page-content/:page/edit      draft + published + history     (admin)
 *   PUT  /api/page-content/:page/draft     save edits as a draft            (admin)
 *   POST /api/page-content/:page/publish   make the draft (or body) live    (admin)
 *   POST /api/page-content/:page/discard   drop the draft                   (admin)
 *   POST /api/page-content/:page/restore   load an older version as draft   (admin)
 *
 * "Admin" here is the super admin and admins.
 */

const KEEP_VERSIONS = 10;
const MAX_BYTES = 2 * 1024 * 1024;

const pageKey = (v: string) => {
    const page = String(v || '').trim().toLowerCase();
    if (!/^[a-z0-9-]{2,40}$/.test(page)) throw new AppError(400, 'Unknown page');
    return page;
};

const contentOf = (body: any) => {
    const content = body?.content;
    if (!content || typeof content !== 'object' || Array.isArray(content)) throw new AppError(400, 'Send the page content');
    if (JSON.stringify(content).length > MAX_BYTES) throw new AppError(413, 'This page has too much content to save');
    return content;
};

const actor = (req: Request) => ({ id: req.user?.userId, name: req.user?.name || '', role: req.user?.role || '' });

const status = (doc: any) => ({
    page: doc.page,
    hasDraft: doc.draft != null,
    draftAt: doc.draftAt,
    draftBy: doc.draftBy,
    publishedAt: doc.publishedAt,
    publishedBy: doc.publishedBy,
});

const forEditor = (doc: any) => ({
    ...status(doc),
    published: doc.published || {},
    draft: doc.draft,
    versions: (doc.versions || []).map((v: any, index: number) => ({ index, at: v.at, by: v.by })),
});

async function findOrCreate(page: string) {
    return (await PageContent.findOne({ page })) || new PageContent({ page, published: {}, draft: null });
}

const admin = [authMiddleware, authorizeRoles(...R.admin)];
const router = express.Router();

router.get('/', ...admin, catchAsync(async (_req: Request, res: Response) => {
    const docs = await PageContent.find({}, { page: 1, draft: 1, draftAt: 1, draftBy: 1, publishedAt: 1, publishedBy: 1 }).lean();
    sendResponse(res, { statusCode: 200, success: true, message: 'Pages', data: docs.map(status) });
}));

router.get('/:page', catchAsync(async (req: Request, res: Response) => {
    const page = pageKey(req.params.page);
    const doc: any = await PageContent.findOne({ page }, { published: 1, publishedAt: 1 }).lean();
    res.setHeader('Cache-Control', 'no-store');
    sendResponse(res, { statusCode: 200, success: true, message: 'Page content', data: { page, content: doc?.published || {}, publishedAt: doc?.publishedAt || null } });
}));

router.get('/:page/edit', ...admin, catchAsync(async (req: Request, res: Response) => {
    const page = pageKey(req.params.page);
    const doc: any = await PageContent.findOne({ page }).lean();
    sendResponse(res, { statusCode: 200, success: true, message: 'Page content', data: doc ? forEditor(doc) : forEditor({ page, published: {}, draft: null, versions: [] }) });
}));

router.put('/:page/draft', ...admin, catchAsync(async (req: Request, res: Response) => {
    const page = pageKey(req.params.page);
    const content = contentOf(req.body);
    const doc: any = await findOrCreate(page);
    doc.draft = content;
    doc.draftAt = new Date();
    doc.draftBy = actor(req);
    doc.markModified('draft');
    await doc.save();
    sendResponse(res, { statusCode: 200, success: true, message: 'Draft saved', data: status(doc) });
}));

router.post('/:page/publish', ...admin, catchAsync(async (req: Request, res: Response) => {
    const page = pageKey(req.params.page);
    const doc: any = await findOrCreate(page);
    const content = req.body?.content ? contentOf(req.body) : doc.draft;
    if (!content) throw new AppError(400, 'Nothing to publish — no changes since the last publish');

    // Keep what was live, newest first, so it can be brought back.
    if (doc.publishedAt) {
        doc.versions.unshift({ at: doc.publishedAt, by: doc.publishedBy, content: doc.published || {} });
        doc.versions = doc.versions.slice(0, KEEP_VERSIONS);
    }
    doc.published = content;
    doc.publishedAt = new Date();
    doc.publishedBy = actor(req);
    doc.draft = null;
    doc.draftAt = undefined;
    doc.draftBy = undefined;
    doc.markModified('published');
    doc.markModified('draft');
    await doc.save();
    sendResponse(res, { statusCode: 200, success: true, message: 'Published', data: forEditor(doc) });
}));

router.post('/:page/discard', ...admin, catchAsync(async (req: Request, res: Response) => {
    const page = pageKey(req.params.page);
    const doc: any = await PageContent.findOne({ page });
    if (doc) {
        doc.draft = null;
        doc.draftAt = undefined;
        doc.draftBy = undefined;
        doc.markModified('draft');
        await doc.save();
    }
    sendResponse(res, { statusCode: 200, success: true, message: 'Draft discarded', data: doc ? forEditor(doc) : null });
}));

router.post('/:page/restore', ...admin, catchAsync(async (req: Request, res: Response) => {
    const page = pageKey(req.params.page);
    const doc: any = await PageContent.findOne({ page });
    const index = Number(req.body?.index);
    const version = doc?.versions?.[index];
    if (!version) throw new AppError(404, 'That version is no longer kept');
    doc.draft = version.content || {};
    doc.draftAt = new Date();
    doc.draftBy = actor(req);
    doc.markModified('draft');
    await doc.save();
    sendResponse(res, { statusCode: 200, success: true, message: 'Version loaded as a draft — publish to make it live', data: forEditor(doc) });
}));

export const PageContentRoutes = router;

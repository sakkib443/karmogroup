import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import JobService from './job.service';

const JobController = {
    /* Public — the career page. `publicOnly` is forced on so a crafted
       `?status=draft` cannot surface an unpublished posting. */
    getPublic: catchAsync(async (req: Request, res: Response) => {
        const { jobs, meta } = await JobService.getAll(req.query as Record<string, unknown>, true);
        sendResponse(res, { statusCode: 200, success: true, message: 'Jobs fetched', data: jobs, meta });
    }),

    getFilterOptions: catchAsync(async (_req: Request, res: Response) => {
        const options = await JobService.getFilterOptions();
        sendResponse(res, { statusCode: 200, success: true, message: 'Filter options fetched', data: options });
    }),

    getBySlug: catchAsync(async (req: Request, res: Response) => {
        const job = await JobService.getBySlug(req.params.slug);
        if (!job || (job as any).status !== 'published') {
            return sendResponse(res, { statusCode: 404, success: false, message: 'Position not found', data: null });
        }
        sendResponse(res, { statusCode: 200, success: true, message: 'Job fetched', data: job });
    }),

    // ── Admin ──────────────────────────────────────────────────────────────
    getAll: catchAsync(async (req: Request, res: Response) => {
        const { jobs, meta } = await JobService.getAll(req.query as Record<string, unknown>, false);
        sendResponse(res, { statusCode: 200, success: true, message: 'Jobs fetched', data: jobs, meta });
    }),

    getById: catchAsync(async (req: Request, res: Response) => {
        const job = await JobService.getById(req.params.id);
        sendResponse(res, { statusCode: job ? 200 : 404, success: !!job, message: job ? 'Job fetched' : 'Job not found', data: job });
    }),

    create: catchAsync(async (req: Request, res: Response) => {
        const job = await JobService.create(req.body);
        sendResponse(res, { statusCode: 201, success: true, message: 'Job created', data: job });
    }),

    update: catchAsync(async (req: Request, res: Response) => {
        const job = await JobService.update(req.params.id, req.body);
        sendResponse(res, { statusCode: 200, success: true, message: 'Job updated', data: job });
    }),

    updateStatus: catchAsync(async (req: Request, res: Response) => {
        const job = await JobService.updateStatus(req.params.id, req.body.status);
        sendResponse(res, { statusCode: 200, success: true, message: 'Job status updated', data: job });
    }),

    duplicate: catchAsync(async (req: Request, res: Response) => {
        const job = await JobService.duplicate(req.params.id);
        sendResponse(res, { statusCode: 201, success: true, message: 'Job duplicated', data: job });
    }),

    delete: catchAsync(async (req: Request, res: Response) => {
        await JobService.delete(req.params.id);
        sendResponse(res, { statusCode: 200, success: true, message: 'Job deleted' });
    }),

    stats: catchAsync(async (_req: Request, res: Response) => {
        const stats = await JobService.stats();
        sendResponse(res, { statusCode: 200, success: true, message: 'Job stats fetched', data: stats });
    }),
};

export default JobController;

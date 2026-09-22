import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import ApplicationService from './application.service';

/** Escape a value for a CSV cell — quotes doubled, whole field quoted. */
const csvCell = (value: unknown) => {
    const text = value === null || value === undefined ? '' : String(value);
    return `"${text.replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
};

const ApplicationController = {
    /* Public — no auth. The service rejects closed postings and duplicate
       emails, and those come back as a plain 400 the form can show. */
    create: catchAsync(async (req: Request, res: Response) => {
        try {
            const application: any = await ApplicationService.create(req.body);
            sendResponse(res, {
                statusCode: 201,
                success: true,
                message: 'Application submitted successfully',
                data: { trackingId: application.trackingId, _id: application._id },
            });
        } catch (err: any) {
            sendResponse(res, {
                statusCode: 400,
                success: false,
                message: err?.message || 'Could not submit application',
                data: null,
            });
        }
    }),

    /* Public — status only, by tracking id. Never exposes HR notes. */
    track: catchAsync(async (req: Request, res: Response) => {
        const application = await ApplicationService.trackByTrackingId(req.params.trackingId);
        sendResponse(res, {
            statusCode: application ? 200 : 404,
            success: !!application,
            message: application ? 'Application found' : 'No application found for this tracking ID',
            data: application,
        });
    }),

    // ── Admin ──────────────────────────────────────────────────────────────
    getAll: catchAsync(async (req: Request, res: Response) => {
        const { applications, meta } = await ApplicationService.getAll(req.query as Record<string, unknown>);
        sendResponse(res, { statusCode: 200, success: true, message: 'Applications fetched', data: applications, meta });
    }),

    getById: catchAsync(async (req: Request, res: Response) => {
        const application = await ApplicationService.getById(req.params.id);
        sendResponse(res, {
            statusCode: application ? 200 : 404,
            success: !!application,
            message: application ? 'Application fetched' : 'Application not found',
            data: application,
        });
    }),

    update: catchAsync(async (req: Request, res: Response) => {
        const application = await ApplicationService.update(req.params.id, req.body);
        sendResponse(res, { statusCode: 200, success: true, message: 'Application updated', data: application });
    }),

    updateStatus: catchAsync(async (req: Request, res: Response) => {
        const application = await ApplicationService.updateStatus(req.params.id, req.body.status);
        sendResponse(res, { statusCode: 200, success: true, message: 'Status updated', data: application });
    }),

    bulkStatus: catchAsync(async (req: Request, res: Response) => {
        const result = await ApplicationService.bulkStatus(req.body.ids || [], req.body.status);
        sendResponse(res, { statusCode: 200, success: true, message: 'Applications updated', data: result });
    }),

    delete: catchAsync(async (req: Request, res: Response) => {
        await ApplicationService.delete(req.params.id);
        sendResponse(res, { statusCode: 200, success: true, message: 'Application deleted' });
    }),

    stats: catchAsync(async (_req: Request, res: Response) => {
        const stats = await ApplicationService.stats();
        sendResponse(res, { statusCode: 200, success: true, message: 'Application stats fetched', data: stats });
    }),

    /* Streams a CSV rather than JSON, so this one writes the response itself
       instead of going through sendResponse. */
    exportCsv: catchAsync(async (req: Request, res: Response) => {
        const rows: any[] = await ApplicationService.exportRows(req.query as Record<string, unknown>);

        const headers = [
            'Tracking ID', 'Applied On', 'Job', 'Status', 'Name', 'Email', 'Phone',
            'Date of Birth', 'Gender', 'District', 'Present Address',
            'Current Designation', 'Current Company', 'Experience (yrs)',
            'Current Salary', 'Expected Salary', 'Notice Period', 'Available From',
            'Skills', 'Education', 'LinkedIn', 'Portfolio', 'CV', 'Rating', 'Notes',
        ];

        const lines = [headers.map(csvCell).join(',')];
        for (const r of rows) {
            lines.push(
                [
                    r.trackingId,
                    r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : '',
                    r.job?.title || r.jobTitle,
                    r.status,
                    r.fullName,
                    r.email,
                    r.phone,
                    r.dateOfBirth ? new Date(r.dateOfBirth).toISOString().slice(0, 10) : '',
                    r.gender,
                    r.district,
                    r.presentAddress,
                    r.currentDesignation,
                    r.currentCompany,
                    r.totalExperience,
                    r.currentSalary,
                    r.expectedSalary,
                    r.noticePeriod,
                    r.availableFrom ? new Date(r.availableFrom).toISOString().slice(0, 10) : '',
                    (r.skills || []).join('; '),
                    (r.educations || [])
                        .map((e: any) => [e.degree, e.institution, e.passingYear].filter(Boolean).join(' — '))
                        .join(' | '),
                    r.linkedinUrl,
                    r.portfolioUrl,
                    r.cvUrl,
                    r.rating,
                    r.adminNotes,
                ]
                    .map(csvCell)
                    .join(',')
            );
        }

        const stamp = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="karmo-applications-${stamp}.csv"`);
        /* BOM so Excel opens the Bangla/UTF-8 columns correctly. */
        res.send('﻿' + lines.join('\n'));
    }),
};

export default ApplicationController;

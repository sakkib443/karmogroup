import { Application } from './application.model';
import { Job } from '../job/job.model';

/** KG-2026-0042 — the reference a candidate keeps to check their status. */
const makeTrackingId = async () => {
    const year = new Date().getFullYear();
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const n = Math.floor(1000 + Math.random() * 9000);
        const trackingId = `KG-${year}-${n}`;
        const clash = await Application.findOne({ trackingId }).select('_id').lean();
        if (!clash) return trackingId;
    }
};

const buildFilter = (query: Record<string, unknown>) => {
    const filter: any = {};
    if (query.job && query.job !== 'all') filter.job = query.job;
    if (query.status && query.status !== 'all') filter.status = query.status;
    if (query.starred === 'true') filter.isStarred = true;

    if (query.minExperience) filter.totalExperience = { $gte: Number(query.minExperience) };
    if (query.maxExpectedSalary) filter.expectedSalary = { $lte: Number(query.maxExpectedSalary) };

    if (query.from || query.to) {
        filter.createdAt = {};
        if (query.from) filter.createdAt.$gte = new Date(String(query.from));
        if (query.to) {
            /* Inclusive of the whole "to" day, not midnight at its start. */
            const to = new Date(String(query.to));
            to.setHours(23, 59, 59, 999);
            filter.createdAt.$lte = to;
        }
    }

    const search = String(query.search || '').trim();
    if (search) {
        filter.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { trackingId: { $regex: search, $options: 'i' } },
            { skills: { $regex: search, $options: 'i' } },
            { currentDesignation: { $regex: search, $options: 'i' } },
        ];
    }
    return filter;
};

const SORTS: Record<string, any> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    rating: { rating: -1, createdAt: -1 },
    experience: { totalExperience: -1 },
    salary: { expectedSalary: 1 },
};

const ApplicationService = {
    create: async (data: any) => {
        const job: any = await Job.findById(data.job).select('title status acceptingApplications deadline').lean();
        if (!job) throw new Error('This position no longer exists');
        if (job.status !== 'published') throw new Error('This position is not open for applications');
        if (job.acceptingApplications === false) throw new Error('This position is no longer accepting applications');
        if (job.deadline && new Date(job.deadline) < new Date()) {
            throw new Error('The deadline for this position has passed');
        }

        const already = await Application.findOne({ job: data.job, email: String(data.email).toLowerCase() })
            .select('trackingId')
            .lean();
        if (already) throw new Error('You have already applied for this position with this email');

        const application = await Application.create({
            ...data,
            jobTitle: job.title,
            trackingId: await makeTrackingId(),
        });

        Job.updateOne({ _id: data.job }, { $inc: { applicationCount: 1 } }).catch(() => {});

        /* In-app bell for HR, same pattern the inquiry module uses. Never allowed
           to block or fail the application itself. */
        try {
            const { NotificationService } = require('../notification/notification.service');
            NotificationService.notifyAdmins({
                type: 'new_application',
                title: 'New job application',
                message: `${data.fullName} applied for "${job.title}".`,
                link: '/dashboard/admin/jobs/applications',
                meta: { applicationId: application._id.toString(), job: String(data.job) },
            }).catch(() => {});
        } catch {
            /* ignore */
        }

        return application;
    },

    getAll: async (query: Record<string, unknown>) => {
        const page = Number(query.page) || 1;
        const limit = Math.min(Number(query.limit) || 20, 200);
        const skip = (page - 1) * limit;
        const filter = buildFilter(query);
        const sort = SORTS[String(query.sort || 'newest')] || SORTS.newest;

        const [applications, total] = await Promise.all([
            Application.find(filter).populate('job', 'title slug division').sort(sort).skip(skip).limit(limit).lean(),
            Application.countDocuments(filter),
        ]);

        return { applications, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    },

    getById: async (id: string) => Application.findById(id).populate('job', 'title slug division').lean(),

    /** Public status lookup — deliberately narrow, no HR notes or contact data. */
    trackByTrackingId: async (trackingId: string) => {
        const app: any = await Application.findOne({ trackingId: String(trackingId).trim().toUpperCase() })
            .select('trackingId fullName jobTitle status createdAt')
            .lean();
        return app;
    },

    updateStatus: async (id: string, status: string) =>
        Application.findByIdAndUpdate(id, { status }, { new: true }),

    update: async (id: string, data: any) => {
        /* HR-editable fields only. A PATCH must never be able to rewrite the
           candidate's own submission or move it to another posting. */
        const allowed = ['status', 'adminNotes', 'rating', 'isStarred'];
        const patch: any = {};
        for (const key of allowed) if (key in data) patch[key] = data[key];
        return Application.findByIdAndUpdate(id, patch, { new: true });
    },

    bulkStatus: async (ids: string[], status: string) => {
        const result = await Application.updateMany({ _id: { $in: ids } }, { status });
        return { modified: result.modifiedCount };
    },

    delete: async (id: string) => {
        const app: any = await Application.findByIdAndDelete(id);
        if (app?.job) Job.updateOne({ _id: app.job }, { $inc: { applicationCount: -1 } }).catch(() => {});
        return app;
    },

    /** Flat rows for the CSV export — same filter as the screen the HR is on. */
    exportRows: async (query: Record<string, unknown>) => {
        const filter = buildFilter(query);
        return Application.find(filter).populate('job', 'title').sort({ createdAt: -1 }).lean();
    },

    stats: async () => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const [total, today, newCount, shortlisted, interview, hired, rejected] = await Promise.all([
            Application.countDocuments({}),
            Application.countDocuments({ createdAt: { $gte: startOfToday } }),
            Application.countDocuments({ status: 'new' }),
            Application.countDocuments({ status: 'shortlisted' }),
            Application.countDocuments({ status: 'interview' }),
            Application.countDocuments({ status: 'hired' }),
            Application.countDocuments({ status: 'rejected' }),
        ]);

        /* "How many CVs has each posting pulled" — the question HR asks first. */
        const perJob = await Application.aggregate([
            { $group: { _id: '$job', count: { $sum: 1 }, jobTitle: { $first: '$jobTitle' } } },
            { $sort: { count: -1 } },
            { $limit: 20 },
        ]);

        return { total, today, new: newCount, shortlisted, interview, hired, rejected, perJob };
    },
};

export default ApplicationService;

import { Job } from './job.model';
import { Application } from '../application/application.model';

/** "Senior Foam Chemist" → "senior-foam-chemist", uniqued with -2, -3, … */
const makeSlug = async (title: string, ignoreId?: string) => {
    const base =
        String(title || '')
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 70) || 'position';

    let slug = base;
    let n = 2;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const clash: any = await Job.findOne({ slug }).select('_id').lean();
        if (!clash || (ignoreId && String(clash._id) === String(ignoreId))) return slug;
        slug = `${base}-${n++}`;
    }
};

/**
 * Turn the query string into a mongo filter.
 *
 * `publicOnly` is the difference between the two audiences: the career page may
 * only ever see published postings, while the admin list may ask for any
 * status — so the flag is applied last and cannot be overridden by a query
 * parameter.
 */
const buildFilter = (query: Record<string, unknown>, publicOnly: boolean) => {
    const filter: any = {};

    if (query.division && query.division !== 'all') filter.division = query.division;
    if (query.employmentType && query.employmentType !== 'all') filter.employmentType = query.employmentType;
    if (query.workplaceType && query.workplaceType !== 'all') filter.workplaceType = query.workplaceType;
    if (query.experienceLevel && query.experienceLevel !== 'all') filter.experienceLevel = query.experienceLevel;
    if (query.department && query.department !== 'all') filter.department = query.department;
    if (query.location) filter.location = { $regex: String(query.location), $options: 'i' };

    const search = String(query.search || '').trim();
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } },
            { summary: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
            { skills: { $regex: search, $options: 'i' } },
        ];
    }

    if (publicOnly) {
        filter.status = 'published';
    } else if (query.status && query.status !== 'all') {
        filter.status = query.status;
    }

    return filter;
};

const SORTS: Record<string, any> = {
    newest: { isFeatured: -1, createdAt: -1 },
    oldest: { createdAt: 1 },
    deadline: { deadline: 1 },
    title: { title: 1 },
};

const JobService = {
    create: async (data: any) => {
        const slug = await makeSlug(data.slug || data.title);
        return Job.create({ ...data, slug });
    },

    getAll: async (query: Record<string, unknown>, publicOnly = false) => {
        const page = Number(query.page) || 1;
        const limit = Math.min(Number(query.limit) || 12, 100);
        const skip = (page - 1) * limit;
        const filter = buildFilter(query, publicOnly);
        const sort = SORTS[String(query.sort || 'newest')] || SORTS.newest;

        const [jobs, total] = await Promise.all([
            Job.find(filter).sort(sort).skip(skip).limit(limit).lean(),
            Job.countDocuments(filter),
        ]);

        return { jobs, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    },

    /** Facet values for the filter bar, taken from live postings only. */
    getFilterOptions: async () => {
        const [departments, locations] = await Promise.all([
            Job.distinct('department', { status: 'published', department: { $ne: '' } }),
            Job.distinct('location', { status: 'published', location: { $ne: '' } }),
        ]);
        return { departments: departments.sort(), locations: locations.sort() };
    },

    getBySlug: async (slug: string, countView = true) => {
        const job = await Job.findOne({ slug }).lean();
        if (!job) return null;
        if (countView) Job.updateOne({ _id: job._id }, { $inc: { views: 1 } }).catch(() => {});
        return job;
    },

    getById: async (id: string) => Job.findById(id).lean(),

    update: async (id: string, data: any) => {
        const patch: any = { ...data };
        /* Only re-slug when the title actually changes — a published posting's
           URL should not move because someone fixed a typo in the benefits. */
        if (data.title) {
            const current: any = await Job.findById(id).select('title slug').lean();
            if (current && current.title !== data.title) {
                patch.slug = await makeSlug(data.title, id);
            }
        }
        return Job.findByIdAndUpdate(id, patch, { new: true, runValidators: true });
    },

    updateStatus: async (id: string, status: string) =>
        Job.findByIdAndUpdate(id, { status }, { new: true }),

    duplicate: async (id: string) => {
        const src: any = await Job.findById(id).lean();
        if (!src) return null;
        delete src._id;
        delete src.createdAt;
        delete src.updatedAt;
        const title = `${src.title} (copy)`;
        return Job.create({
            ...src,
            title,
            slug: await makeSlug(title),
            status: 'draft',
            applicationCount: 0,
            views: 0,
        });
    },

    /* Applications are removed with the posting — they are meaningless without
       it, and leaving them orphaned would skew every count on the dashboard. */
    delete: async (id: string) => {
        await Application.deleteMany({ job: id });
        return Job.findByIdAndDelete(id);
    },

    stats: async () => {
        const [total, published, draft, closed, applications, newApplications] = await Promise.all([
            Job.countDocuments({}),
            Job.countDocuments({ status: 'published' }),
            Job.countDocuments({ status: 'draft' }),
            Job.countDocuments({ status: 'closed' }),
            Application.countDocuments({}),
            Application.countDocuments({ status: 'new' }),
        ]);
        return { total, published, draft, closed, applications, newApplications };
    },
};

export default JobService;

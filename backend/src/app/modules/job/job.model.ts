import { Schema, model } from 'mongoose';

/**
 * A vacancy on the Career page.
 *
 * Only `title` is required. Everything else is optional so HR can publish a
 * bare position in seconds and fill the detail in later — the public page hides
 * whatever is empty rather than showing blank rows.
 *
 * `slug` is what `/career/[slug]` resolves, generated from the title in the
 * service and kept unique by appending a counter.
 */
const jobSchema = new Schema(
    {
        title: { type: String, required: true, maxlength: 160, trim: true },
        slug: { type: String, required: true, unique: true, index: true, trim: true },

        // ── Classification (drives the public filters) ──────────────────────
        division: {
            type: String,
            enum: ['foam', 'mattress', 'hometex', 'chemicals', 'corporate', 'other'],
            default: 'corporate',
            index: true,
        },
        department: { type: String, maxlength: 120, trim: true, default: '' },
        employmentType: {
            type: String,
            enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
            default: 'full-time',
            index: true,
        },
        workplaceType: {
            type: String,
            enum: ['on-site', 'hybrid', 'remote'],
            default: 'on-site',
        },
        location: { type: String, maxlength: 160, trim: true, default: '' },
        experienceLevel: {
            type: String,
            enum: ['entry', 'mid', 'senior', 'lead', 'executive', 'any'],
            default: 'any',
            index: true,
        },

        // ── Numbers ────────────────────────────────────────────────────────
        vacancies: { type: Number, min: 0, default: 1 },
        experienceMin: { type: Number, min: 0, default: null },
        experienceMax: { type: Number, min: 0, default: null },
        salaryMin: { type: Number, min: 0, default: null },
        salaryMax: { type: Number, min: 0, default: null },
        salaryCurrency: { type: String, default: 'BDT', trim: true },
        salaryPeriod: { type: String, enum: ['monthly', 'yearly', 'hourly'], default: 'monthly' },
        /* When true the page prints "Negotiable" and ignores the range. */
        salaryNegotiable: { type: Boolean, default: false },

        // ── Long copy. Stored as HTML from the admin rich-text editor. ──────
        summary: { type: String, maxlength: 600, trim: true, default: '' },
        description: { type: String, default: '' },
        responsibilities: { type: String, default: '' },
        requirements: { type: String, default: '' },
        education: { type: String, default: '' },
        benefits: { type: String, default: '' },

        skills: [{ type: String, trim: true }],

        // ── Media ──────────────────────────────────────────────────────────
        bannerImage: { type: String, default: '' },
        /* Full job description as a downloadable file. */
        jdFile: { type: String, default: '' },
        jdFileName: { type: String, default: '' },

        // ── Publishing ─────────────────────────────────────────────────────
        status: {
            type: String,
            enum: ['draft', 'published', 'closed'],
            default: 'draft',
            index: true,
        },
        deadline: { type: Date, default: null },
        isUrgent: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
        /* Set false to collect CVs without a live vacancy (general application). */
        acceptingApplications: { type: Boolean, default: true },

        // ── Contact shown on the posting (HR calls/emails manually) ─────────
        contactEmail: { type: String, trim: true, default: '' },
        contactPhone: { type: String, trim: true, default: '' },

        // ── SEO ────────────────────────────────────────────────────────────
        metaTitle: { type: String, maxlength: 200, trim: true, default: '' },
        metaDescription: { type: String, maxlength: 400, trim: true, default: '' },

        /* Denormalised counter kept in step by the application service, so the
           admin list can show "24 applied" without a per-row count query. */
        applicationCount: { type: Number, default: 0, min: 0 },
        views: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

/* The public list is always "published, newest first", usually narrowed by one
   of the filter facets — this covers that path. */
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ title: 'text', summary: 'text', department: 'text', skills: 'text' });

export const Job = model('Job', jobSchema);

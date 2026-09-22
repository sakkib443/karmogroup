import { Schema, model } from 'mongoose';

/**
 * A candidate's application against a Job.
 *
 * Applicants never sign in — there is no user account behind this. Identity is
 * the email/phone they type, and `trackingId` is what they keep to check the
 * status later at /career/track.
 *
 * Only name, email, phone and the CV are required. Everything else is optional
 * so a candidate can apply in a minute from a phone and still have the option
 * to fill in a full profile.
 */

const educationSchema = new Schema(
    {
        degree: { type: String, trim: true, default: '' },
        institution: { type: String, trim: true, default: '' },
        field: { type: String, trim: true, default: '' },
        result: { type: String, trim: true, default: '' },
        passingYear: { type: String, trim: true, default: '' },
    },
    { _id: false }
);

const experienceSchema = new Schema(
    {
        company: { type: String, trim: true, default: '' },
        designation: { type: String, trim: true, default: '' },
        duration: { type: String, trim: true, default: '' },
        responsibilities: { type: String, trim: true, default: '' },
    },
    { _id: false }
);

const applicationSchema = new Schema(
    {
        job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
        /* Copied at submit time so the admin list and CSV export still read
           correctly if the posting is later renamed or deleted. */
        jobTitle: { type: String, trim: true, default: '' },

        trackingId: { type: String, required: true, unique: true, index: true },

        // ── Step 1 · Personal ──────────────────────────────────────────────
        fullName: { type: String, required: true, maxlength: 120, trim: true },
        email: { type: String, required: true, maxlength: 160, trim: true, lowercase: true },
        phone: { type: String, required: true, maxlength: 40, trim: true },
        dateOfBirth: { type: Date, default: null },
        gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
        nationalId: { type: String, trim: true, default: '' },
        presentAddress: { type: String, maxlength: 400, trim: true, default: '' },
        permanentAddress: { type: String, maxlength: 400, trim: true, default: '' },
        district: { type: String, trim: true, default: '' },

        // ── Step 2 · Professional ──────────────────────────────────────────
        currentDesignation: { type: String, trim: true, default: '' },
        currentCompany: { type: String, trim: true, default: '' },
        totalExperience: { type: Number, min: 0, default: null },
        currentSalary: { type: Number, min: 0, default: null },
        expectedSalary: { type: Number, min: 0, default: null },
        noticePeriod: { type: String, trim: true, default: '' },
        availableFrom: { type: Date, default: null },
        skills: [{ type: String, trim: true }],
        experiences: [experienceSchema],

        // ── Step 3 · Education ─────────────────────────────────────────────
        educations: [educationSchema],

        // ── Step 4 · Files and links ───────────────────────────────────────
        /* The one file that matters. Cloudinary raw URL. */
        cvUrl: { type: String, required: true },
        cvFileName: { type: String, trim: true, default: '' },
        photoUrl: { type: String, default: '' },
        coverLetterUrl: { type: String, default: '' },
        portfolioFileUrl: { type: String, default: '' },
        certificates: [{ type: String }],
        coverLetterText: { type: String, maxlength: 5000, default: '' },
        linkedinUrl: { type: String, trim: true, default: '' },
        portfolioUrl: { type: String, trim: true, default: '' },
        references: { type: String, maxlength: 1000, trim: true, default: '' },

        // ── HR pipeline ────────────────────────────────────────────────────
        status: {
            type: String,
            enum: ['new', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'],
            default: 'new',
            index: true,
        },
        /* HR-only. Never returned on the public tracking endpoint. */
        adminNotes: { type: String, maxlength: 4000, default: '' },
        rating: { type: Number, min: 0, max: 5, default: 0 },
        isStarred: { type: Boolean, default: false },
        source: { type: String, trim: true, default: 'website' },
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

/* The admin screen is "one job, newest first, optionally one status". */
applicationSchema.index({ job: 1, createdAt: -1 });
applicationSchema.index({ status: 1, createdAt: -1 });
/* One application per email per job — enforced here rather than in the service
   so a double-submit from a slow connection cannot slip through. */
applicationSchema.index({ job: 1, email: 1 }, { unique: true });
applicationSchema.index({ fullName: 'text', email: 'text', phone: 'text', skills: 'text' });

export const Application = model('Application', applicationSchema);

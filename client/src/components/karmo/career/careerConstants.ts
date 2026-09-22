/**
 * Shared vocabulary for the career pages and the admin screens.
 *
 * The values here must match the enums in `backend/.../job.model.ts` and
 * `application.model.ts` exactly — they are what gets sent as filter params and
 * saved on the document. Labels are the only part meant to be edited freely.
 */

export const DIVISIONS = [
    { value: 'foam', label: 'Foam' },
    { value: 'mattress', label: 'Mattress' },
    { value: 'hometex', label: 'HomeTex' },
    { value: 'chemicals', label: 'Chemicals' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'other', label: 'Other' },
] as const;

export const EMPLOYMENT_TYPES = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'temporary', label: 'Temporary' },
] as const;

export const WORKPLACE_TYPES = [
    { value: 'on-site', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'remote', label: 'Remote' },
] as const;

export const EXPERIENCE_LEVELS = [
    { value: 'entry', label: 'Entry level' },
    { value: 'mid', label: 'Mid level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'executive', label: 'Executive' },
    { value: 'any', label: 'Any' },
] as const;

export const JOB_STATUSES = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'closed', label: 'Closed' },
] as const;

/* The HR pipeline, in the order it is worked. `tone` drives the badge colour on
   both the admin list and the public tracking page. */
export const APPLICATION_STATUSES = [
    { value: 'new', label: 'New', tone: 'slate' },
    { value: 'shortlisted', label: 'Shortlisted', tone: 'blue' },
    { value: 'interview', label: 'Interview', tone: 'amber' },
    { value: 'offered', label: 'Offered', tone: 'violet' },
    { value: 'hired', label: 'Hired', tone: 'green' },
    { value: 'rejected', label: 'Rejected', tone: 'red' },
] as const;

export const STATUS_TONE: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    violet: 'bg-violet-50 text-violet-700 ring-violet-200',
    green: 'bg-green-50 text-green-700 ring-green-200',
    red: 'bg-red-50 text-red-700 ring-red-200',
};

export const labelOf = (
    list: readonly { value: string; label: string }[],
    value?: string
) => list.find((x) => x.value === value)?.label || value || '';

/** "৳ 25,000 – ৳ 35,000 / month", or "Negotiable", or "" when nothing is set. */
export const formatSalary = (job: {
    salaryMin?: number | null;
    salaryMax?: number | null;
    salaryCurrency?: string;
    salaryPeriod?: string;
    salaryNegotiable?: boolean;
}) => {
    if (job.salaryNegotiable) return 'Negotiable';
    const { salaryMin, salaryMax } = job;
    if (!salaryMin && !salaryMax) return '';
    const cur = job.salaryCurrency === 'BDT' ? '৳' : job.salaryCurrency || '';
    const n = (v: number) => v.toLocaleString('en-IN');
    const per = job.salaryPeriod && job.salaryPeriod !== 'monthly' ? ` / ${job.salaryPeriod.replace('ly', '')}` : ' / month';
    if (salaryMin && salaryMax) return `${cur} ${n(salaryMin)} – ${cur} ${n(salaryMax)}${per}`;
    return `${cur} ${n((salaryMin || salaryMax) as number)}${per}`;
};

/** "3 – 5 yrs", "5+ yrs", "Fresher welcome". */
export const formatExperience = (job: { experienceMin?: number | null; experienceMax?: number | null }) => {
    const { experienceMin: min, experienceMax: max } = job;
    if (min == null && max == null) return '';
    if (min != null && max != null) return `${min} – ${max} yrs`;
    if (min != null) return min === 0 ? 'Fresher welcome' : `${min}+ yrs`;
    return `Up to ${max} yrs`;
};

/** Days left before the deadline; negative once it has passed. */
export const daysLeft = (deadline?: string | null) => {
    if (!deadline) return null;
    const ms = new Date(deadline).getTime() - Date.now();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

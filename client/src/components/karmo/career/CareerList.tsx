"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    FiSearch,
    FiMapPin,
    FiBriefcase,
    FiClock,
    FiUsers,
    FiArrowRight,
    FiX,
} from "react-icons/fi";

import {
    useGetPublicJobsQuery,
    useGetJobFilterOptionsQuery,
} from "@/redux/api/jobApi";
import {
    DIVISIONS,
    EMPLOYMENT_TYPES,
    EXPERIENCE_LEVELS,
    WORKPLACE_TYPES,
    labelOf,
    formatSalary,
    formatExperience,
    daysLeft,
} from "./careerConstants";

/**
 * The public vacancy list.
 *
 * Filtering runs on the server, not in the browser: the list is paginated, so
 * narrowing it client-side would only ever filter the page you happen to be
 * on. Every control below writes into one `filters` object which goes straight
 * out as query params.
 */

const SORTS = [
    { value: "newest", label: "Newest first" },
    { value: "deadline", label: "Closing soon" },
    { value: "title", label: "A–Z" },
];

const EMPTY = {
    search: "",
    division: "all",
    employmentType: "all",
    experienceLevel: "all",
    workplaceType: "all",
    department: "all",
    location: "",
    sort: "newest",
};

function Select({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">
                {label}
            </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full cursor-pointer rounded-md border border-ink/15 bg-white px-3 py-2.5 text-[13px] text-ink outline-none transition-colors focus:border-brand"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

function JobCard({ job }: { job: any }) {
    const left = daysLeft(job.deadline);
    const salary = formatSalary(job);
    const experience = formatExperience(job);

    return (
        <Link
            href={`/career/${job.slug}`}
            className="group relative flex flex-col rounded-lg border border-ink/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] sm:p-6"
        >
            <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-brand">
                    {labelOf(DIVISIONS, job.division)}
                </span>
                {job.isUrgent && (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-red-600 ring-1 ring-red-200">
                        Urgent
                    </span>
                )}
                {job.isFeatured && (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700 ring-1 ring-amber-200">
                        Featured
                    </span>
                )}
            </div>

            <h3 className="display mt-3 text-[1.05rem] font-bold leading-snug text-ink transition-colors group-hover:text-brand sm:text-[1.15rem]">
                {job.title}
            </h3>

            {job.department ? (
                <p className="mt-1 text-[12.5px] text-ink/50">{job.department}</p>
            ) : null}

            {job.summary ? (
                <p className="body-copy mt-3 line-clamp-2 text-[13px] leading-[1.65] text-ink/60">
                    {job.summary}
                </p>
            ) : null}

            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-ink/55">
                {job.location ? (
                    <li className="flex items-center gap-1.5">
                        <FiMapPin className="shrink-0 text-[13px] text-ink/35" />
                        {job.location}
                    </li>
                ) : null}
                <li className="flex items-center gap-1.5">
                    <FiBriefcase className="shrink-0 text-[13px] text-ink/35" />
                    {labelOf(EMPLOYMENT_TYPES, job.employmentType)}
                </li>
                {experience ? (
                    <li className="flex items-center gap-1.5">
                        <FiClock className="shrink-0 text-[13px] text-ink/35" />
                        {experience}
                    </li>
                ) : null}
                {job.vacancies ? (
                    <li className="flex items-center gap-1.5">
                        <FiUsers className="shrink-0 text-[13px] text-ink/35" />
                        {job.vacancies} {job.vacancies > 1 ? "openings" : "opening"}
                    </li>
                ) : null}
            </ul>

            <div className="mt-5 flex items-end justify-between gap-3 border-t border-ink/8 pt-4">
                <div className="min-w-0">
                    {salary ? (
                        <p className="text-[13px] font-semibold text-ink">{salary}</p>
                    ) : (
                        <p className="text-[13px] text-ink/40">Salary not disclosed</p>
                    )}
                    {left !== null && (
                        <p
                            className={`mt-0.5 text-[11.5px] ${
                                left < 0
                                    ? "text-red-500"
                                    : left <= 7
                                      ? "text-amber-600"
                                      : "text-ink/45"
                            }`}
                        >
                            {left < 0
                                ? "Deadline passed"
                                : left === 0
                                  ? "Closes today"
                                  : `${left} day${left > 1 ? "s" : ""} left`}
                        </p>
                    )}
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-brand">
                    View
                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
            </div>
        </Link>
    );
}

export default function CareerList() {
    const [filters, setFilters] = useState(EMPTY);
    const [page, setPage] = useState(1);

    const set = (patch: Partial<typeof EMPTY>) => {
        setFilters((f) => ({ ...f, ...patch }));
        setPage(1);
    };

    const params = useMemo(() => ({ ...filters, page, limit: 12 }), [filters, page]);
    const { data, isLoading, isError } = useGetPublicJobsQuery(params);
    const { data: optionsRes } = useGetJobFilterOptionsQuery(undefined);

    const jobs: any[] = data?.data || [];
    const meta = data?.meta;
    const options = optionsRes?.data || { departments: [], locations: [] };

    const hasFilters =
        JSON.stringify({ ...filters, sort: EMPTY.sort }) !== JSON.stringify(EMPTY);

    return (
        <section className="bg-white py-12 lg:py-16">
            <div className="shell">
                {/* ── Filter bar ─────────────────────────────────────────── */}
                <div className="rounded-lg border border-ink/10 bg-cream/40 p-4 sm:p-5">
                    <div className="relative">
                        <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-ink/35" />
                        <input
                            type="search"
                            value={filters.search}
                            onChange={(e) => set({ search: e.target.value })}
                            placeholder="Search by title, department, skill or location…"
                            className="body-copy w-full rounded-md border border-ink/15 bg-white py-3 pl-11 pr-4 text-[14px] text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-brand"
                        />
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Select
                            label="Division"
                            value={filters.division}
                            onChange={(v) => set({ division: v })}
                            options={[{ value: "all", label: "All divisions" }, ...DIVISIONS]}
                        />
                        <Select
                            label="Job type"
                            value={filters.employmentType}
                            onChange={(v) => set({ employmentType: v })}
                            options={[{ value: "all", label: "All types" }, ...EMPLOYMENT_TYPES]}
                        />
                        <Select
                            label="Experience"
                            value={filters.experienceLevel}
                            onChange={(v) => set({ experienceLevel: v })}
                            options={[{ value: "all", label: "Any experience" }, ...EXPERIENCE_LEVELS]}
                        />
                        <Select
                            label="Workplace"
                            value={filters.workplaceType}
                            onChange={(v) => set({ workplaceType: v })}
                            options={[{ value: "all", label: "Any workplace" }, ...WORKPLACE_TYPES]}
                        />
                        {options.departments?.length > 0 && (
                            <Select
                                label="Department"
                                value={filters.department}
                                onChange={(v) => set({ department: v })}
                                options={[
                                    { value: "all", label: "All departments" },
                                    ...options.departments.map((d: string) => ({ value: d, label: d })),
                                ]}
                            />
                        )}
                        {options.locations?.length > 0 && (
                            <Select
                                label="Location"
                                value={filters.location}
                                onChange={(v) => set({ location: v })}
                                options={[
                                    { value: "", label: "All locations" },
                                    ...options.locations.map((l: string) => ({ value: l, label: l })),
                                ]}
                            />
                        )}
                        <Select
                            label="Sort by"
                            value={filters.sort}
                            onChange={(v) => set({ sort: v })}
                            options={SORTS}
                        />
                    </div>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={() => {
                                setFilters(EMPTY);
                                setPage(1);
                            }}
                            className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-brand hover:underline"
                        >
                            <FiX /> Clear filters
                        </button>
                    )}
                </div>

                {/* ── Results ────────────────────────────────────────────── */}
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-[13px] text-ink/55">
                        {isLoading
                            ? "Loading positions…"
                            : `${meta?.total ?? jobs.length} position${(meta?.total ?? jobs.length) === 1 ? "" : "s"} open`}
                    </p>
                    <Link
                        href="/career/track"
                        className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink/55 hover:text-brand"
                    >
                        Track application
                    </Link>
                </div>

                {isError ? (
                    <p className="mt-10 rounded-lg border border-red-200 bg-red-50 p-6 text-center text-[14px] text-red-700">
                        Could not load positions right now. Please refresh and try again.
                    </p>
                ) : isLoading ? (
                    <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-64 animate-pulse rounded-lg border border-ink/10 bg-cream/50"
                            />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="mt-8 rounded-lg border border-ink/10 bg-cream/30 p-10 text-center">
                        <h3 className="display text-[1.15rem] font-bold uppercase text-ink">
                            No positions match your search
                        </h3>
                        <p className="body-copy mx-auto mt-2 max-w-md text-[14px] leading-[1.7] text-ink/55">
                            {hasFilters
                                ? "Try clearing a filter or two — new roles are posted regularly."
                                : "There are no openings listed right now. Please check back soon."}
                        </p>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={() => {
                                    setFilters(EMPTY);
                                    setPage(1);
                                }}
                                className="mt-5 inline-flex h-11 items-center rounded-md bg-brand px-6 text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-dark"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {jobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>

                        {meta && meta.totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="h-10 rounded-md border border-ink/15 px-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>
                                <span className="px-3 text-[13px] text-ink/60">
                                    {page} / {meta.totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={page >= meta.totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="h-10 rounded-md border border-ink/15 px-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
